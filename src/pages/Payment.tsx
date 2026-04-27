import { useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { ArrowLeft, CreditCard, Calendar, MapPin, User, Mail, Hash, Star } from 'lucide-react'
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

  const handlePayment = async () => {
    setProcessing(true)
    
    // Simulate Razorpay payment gateway delay
    setTimeout(async () => {
      const paymentId = `pay_${Math.random().toString(36).substring(2, 15)}`
      
      try {
        // Attempt to save to database for BOTH logged in and guest users
        await supabaseService.createRegistration(
          user?.id, 
          event.id, 
          paymentId,
          { email: formData.email, name: formData.name, phone: formData.phone, age: formData.age }
        )
        
        navigate(`/receipt/${id}`, {
          state: {
            formData,
            event,
            paymentId,
            status: 'completed',
          },
        })
      } catch (err: unknown) {
        console.error('Registration failed:', err)
        // Check if it's a foreign key error meaning the event doesn't exist in the DB
        const errorCode = err && typeof err === 'object' && 'code' in err ? err.code : null
        
        if (errorCode === '23503') {
          toast.error(`Database Error: The event "${event.title}" is a mock event and doesn't exist in the live database yet.`)
        } else if (errorCode === '23505') {
          toast.error('You have already registered for this event!')
        } else {
          toast.error('Failed to save registration to database.')
        }
        setProcessing(false)
      }
    }, 2000)
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
                <span className="font-display font-bold text-2xl text-neon">Rs. {event.entryFee.toLocaleString()}</span>
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
              <div className="flex items-center gap-3">
                <Hash className="w-4 h-4" style={{ color: '#5c3a21' }} />
                <span className="font-body text-sm" style={{ color: '#1c1917' }}>Age: {formData.age}</span>
              </div>
              {formData.rating && (
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4" style={{ color: '#5c3a21' }} />
                  <span className="font-body text-sm" style={{ color: '#1c1917' }}>Rating: {formData.rating}</span>
                </div>
              )}
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
                  Pay Rs. {event.entryFee.toLocaleString()} via Razorpay
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
