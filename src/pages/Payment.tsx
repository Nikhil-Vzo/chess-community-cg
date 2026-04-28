import { useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { ArrowLeft, CreditCard, Calendar, MapPin, User, Mail, Star } from 'lucide-react'
import { supabaseService } from '@/lib/supabaseService'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export default function Payment() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const { formData, event } = location.state || {}
  const { user } = useAuth()

  const [processing, setProcessing] = useState(false)

  if (!event || !formData) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4" style={{ color: '#1c1917' }}>Invalid Access</h1>
          <Link to="/events" className="text-neon hover:underline font-body">Back to Events</Link>
        </div>
      </div>
    )
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        console.log("Razorpay script already loaded.")
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        console.log("Razorpay script loaded successfully.")
        resolve(true)
      }
      script.onerror = () => {
        console.error("Failed to load Razorpay script.")
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    console.log("handlePayment started")
    setProcessing(true)
    
    try {
      // 1. Load Razorpay script
      console.log("Loading script...")
      const isLoaded = await loadRazorpayScript()
      console.log("Script loaded:", isLoaded)
      
      if (!isLoaded) {
        toast.error('Failed to load Razorpay SDK. Are you online?')
        setProcessing(false)
        return
      }

      // 2. Create Order on the server
      console.log("Creating order on server with fee:", event.entryFee)
      
      // Razorpay receipt length must be <= 40 chars.
      const safeId = id || 'unknown'
      const receiptId = `rcpt_${Date.now()}_${safeId.substring(0, 8)}`
      
      const order = await supabaseService.createRazorpayOrder(event.entryFee, receiptId)
      console.log("Server responded with order:", order)

      // Fix #4: Detect backend errors reliably (edge fn returns 200 always for CORS)
      if (order?._server_error || order?.error) {
        const errMsg = order._server_error || order.error?.description || 'Unknown backend error'
        console.error("Backend Error:", errMsg)
        toast.error(`Payment setup failed: ${errMsg}`)
        setProcessing(false)
        return
      }

      if (!order || !order.id) {
        console.error("No valid order ID returned")
        toast.error('Failed to create payment order. Please try again.')
        setProcessing(false)
        return
      }

      // 3. Initialize Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
        amount: order.amount,
        currency: order.currency,
        // Fix #2: Use correct brand name
        name: 'Indian Chess Community',
        description: `Registration for ${event.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          // 4. Verify Payment on the server
          try {
            const verification = await supabaseService.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            if (verification && verification.verified) {
              // 5. Save registration to DB
              // Fix #3: Payment already captured — handle DB failure gracefully with recovery info
              try {
                await supabaseService.createRegistration(
                  user?.id, 
                  event.id, 
                  response.razorpay_payment_id,
                  { 
                    email: formData.email, 
                    name: formData.name, 
                    phone: formData.phone, 
                    dob: formData.dob,
                    gender: formData.gender,
                    state: formData.state,
                    district: formData.district,
                    fide_id: formData.fide_id,
                  }
                )
                
                navigate(`/receipt/${id}`, {
                  state: {
                    formData,
                    event,
                    paymentId: response.razorpay_payment_id,
                    status: 'completed',
                  },
                })
              } catch (dbErr: any) {
                // Payment was captured but DB save failed — must not lose this
                console.error('DB registration save failed after successful payment:', dbErr)
                const errorCode = dbErr && typeof dbErr === 'object' && 'code' in dbErr ? dbErr.code : null
                
                if (errorCode === '23505') {
                  // Already registered — navigate to receipt anyway
                  toast.info('You are already registered for this event.')
                  navigate(`/receipt/${id}`, {
                    state: { formData, event, paymentId: response.razorpay_payment_id, status: 'completed' },
                  })
                } else if (errorCode === '23503') {
                  toast.error(
                    `Payment successful (ID: ${response.razorpay_payment_id}), but this event is not yet in our system. Please contact us with this Payment ID so we can register you manually.`,
                    { duration: 20000 }
                  )
                  setProcessing(false)
                } else {
                  // Generic DB failure — give user their payment ID for recovery
                  toast.error(
                    `Payment received (ID: ${response.razorpay_payment_id}), but we failed to save your registration. Please WhatsApp us this Payment ID and we'll confirm you manually.`,
                    { duration: 20000 }
                  )
                  setProcessing(false)
                }
              }
            } else {
              toast.error('Payment signature verification failed. If money was deducted, please contact us immediately.')
              setProcessing(false)
            }
          } catch (err: any) {
            console.error('Verification call failed:', err)
            toast.error('Could not verify your payment. Please save your payment details and contact support.')
            setProcessing(false)
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#d4ff33',
        },
        modal: {
          // Fix #1: Reset processing state when user closes/dismisses the modal
          ondismiss: function () {
            console.log('Razorpay modal dismissed by user')
            setProcessing(false)
          }
        }
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.on('payment.failed', function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`)
        setProcessing(false)
      })
      paymentObject.open()

    } catch (err: unknown) {
      console.error('Payment initialization failed:', err)
      toast.error('Something went wrong initializing the payment. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f1ee' }}>
      <Navbar />

      <main className="pt-24 pb-32 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Link
              to={`/register/${id}`}
              className="inline-flex items-center gap-2 hover:text-neon transition-colors font-body text-sm"
              style={{ color: '#1c1917' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Registration
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1
              className="font-display text-4xl md:text-5xl font-bold uppercase mb-4"
              style={{ color: '#1c1917' }}
            >
              Payment
            </h1>
            <p className="font-body" style={{ color: '#1c1917', opacity: 0.6 }}>
              Complete your registration by making the payment.
            </p>
          </motion.div>

          {/* Event Summary */}
          <motion.div
            className="rounded-lg p-6 mb-8 border"
            style={{ backgroundColor: '#fff', borderColor: 'rgba(28, 25, 23, 0.1)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-display text-xl font-bold uppercase mb-4" style={{ color: '#1c1917' }}>
              Event Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-body text-sm" style={{ color: '#1c1917', opacity: 0.6 }}>Event</span>
                <span className="font-body font-medium text-sm" style={{ color: '#1c1917' }}>{event.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-sm flex items-center gap-2" style={{ color: '#1c1917', opacity: 0.6 }}>
                  <Calendar className="w-3 h-3" /> Date
                </span>
                <span className="font-body text-sm" style={{ color: '#1c1917' }}>
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-sm flex items-center gap-2" style={{ color: '#1c1917', opacity: 0.6 }}>
                  <MapPin className="w-3 h-3" /> Location
                </span>
                <span className="font-body text-sm" style={{ color: '#1c1917' }}>{event.location}</span>
              </div>
              <div className="border-t my-3" style={{ borderColor: 'rgba(28, 25, 23, 0.1)' }} />
              <div className="flex justify-between items-center">
                <span className="font-display font-bold text-lg" style={{ color: '#1c1917' }}>Total Amount</span>
                <span className="font-display font-bold text-2xl text-neon">Rs. {event.entryFee} (incl. Convenience Fee)</span>
              </div>
            </div>
          </motion.div>

          {/* Player Details */}
          <motion.div
            className="rounded-lg p-6 mb-8 border"
            style={{ backgroundColor: '#fff', borderColor: 'rgba(28, 25, 23, 0.1)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-xl font-bold uppercase mb-4" style={{ color: '#1c1917' }}>
              Player Details
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4" style={{ color: '#5c3a21' }} />
                <span className="font-body text-sm" style={{ color: '#1c1917' }}>{formData.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" style={{ color: '#5c3a21' }} />
                <span className="font-body text-sm" style={{ color: '#1c1917' }}>{formData.email}</span>
              </div>
              {formData.fide_id && (
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4" style={{ color: '#5c3a21' }} />
                  <span className="font-body text-sm" style={{ color: '#1c1917' }}>FIDE ID: {formData.fide_id}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" style={{ color: '#5c3a21' }} />
                <span className="font-body text-sm" style={{ color: '#1c1917' }}>DOB: {formData.dob}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4" style={{ color: '#5c3a21' }} />
                <span className="font-body text-sm" style={{ color: '#1c1917' }}>Gender: {formData.gender}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" style={{ color: '#5c3a21' }} />
                <span className="font-body text-sm" style={{ color: '#1c1917' }}>{formData.district}, {formData.state}</span>
              </div>
            </div>
          </motion.div>

          {/* Payment Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full py-4 bg-neon text-dark font-body font-bold text-sm uppercase tracking-wider rounded-full hover:shadow-neon-lg transition-all duration-300 hover:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay Rs. {event.entryFee} (incl. Convenience Fee)
                </>
              )}
            </button>
            <p className="text-center mt-4 text-xs font-body" style={{ color: '#1c1917', opacity: 0.4 }}>
              Secure payment powered by Razorpay. Your payment information is encrypted.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
