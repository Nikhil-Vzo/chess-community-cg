import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { CheckCircle, Calendar, MapPin, User, Mail, CreditCard, Download } from 'lucide-react'

export default function Receipt() {
  const location = useLocation()
  const { formData, event, paymentId, status } = location.state || {}

  if (!event || !formData || !paymentId) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4" style={{ color: '#1c1917' }}>Invalid Access</h1>
          <Link to="/events" className="text-neon hover:underline font-body">Back to Events</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f1ee' }}>
      <Navbar />

      <main className="pt-24 pb-32 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex p-4 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1
              className="font-display text-4xl md:text-5xl font-bold uppercase mb-4"
              style={{ color: '#1c1917' }}
            >
              Payment Completed!
            </h1>
            <p className="font-body text-lg" style={{ color: '#1c1917', opacity: 0.8 }}>
              Your registration for <strong>{event.title}</strong> is confirmed.
            </p>
            <div className="mt-4 p-4 bg-[#e8f5e9] border border-[#a5d6a7] rounded-xl inline-block text-left">
              <p className="font-body text-sm font-bold text-green-800 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 shrink-0" />
                Go to your Account Centre (Dashboard) to see your receipt and rest assured!
              </p>
            </div>
          </motion.div>

          {/* Receipt Card */}
          <motion.div
            className="rounded-lg overflow-hidden border-2 mb-8"
            style={{
              backgroundColor: '#fff',
              borderColor: '#c8ff2e',
              boxShadow: '0 0 40px rgba(200, 255, 46, 0.15)',
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Receipt Header */}
            <div className="p-6 border-b" style={{ backgroundColor: '#c8ff2e', borderColor: '#c8ff2e' }}>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-dark uppercase">
                  Registration Receipt
                </h2>
                <span className="px-3 py-1 bg-dark text-neon text-xs font-body font-bold uppercase tracking-wider rounded-full">
                  {status}
                </span>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="p-6 space-y-6">
              {/* Payment ID */}
              <div className="flex items-center justify-between p-4 bg-[#f4f1ee] rounded">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5" style={{ color: '#5c3a21' }} />
                  <span className="font-body text-sm font-medium" style={{ color: '#1c1917' }}>Payment ID</span>
                </div>
                <span className="font-body text-sm font-mono" style={{ color: '#1c1917' }}>{paymentId}</span>
              </div>

              {/* Player Info */}
              <div>
                <h3 className="font-display text-lg font-bold uppercase mb-3" style={{ color: '#1c1917' }}>
                  Player Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4" style={{ color: '#5c3a21' }} />
                    <span className="font-body text-sm" style={{ color: '#1c1917' }}>{formData.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4" style={{ color: '#5c3a21' }} />
                    <span className="font-body text-sm" style={{ color: '#1c1917' }}>{formData.email}</span>
                  </div>
                </div>
              </div>

              {/* Event Info */}
              <div className="border-t pt-4" style={{ borderColor: 'rgba(28, 25, 23, 0.1)' }}>
                <h3 className="font-display text-lg font-bold uppercase mb-3" style={{ color: '#1c1917' }}>
                  Event Details
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm" style={{ color: '#1c1917', opacity: 0.6 }}>Event</span>
                    <span className="font-body font-medium text-sm" style={{ color: '#1c1917' }}>{event.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm flex items-center gap-2" style={{ color: '#1c1917', opacity: 0.6 }}>
                      <Calendar className="w-3 h-3" /> Date
                    </span>
                    <span className="font-body text-sm" style={{ color: '#1c1917' }}>
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm flex items-center gap-2" style={{ color: '#1c1917', opacity: 0.6 }}>
                      <MapPin className="w-3 h-3" /> Location
                    </span>
                    <span className="font-body text-sm" style={{ color: '#1c1917' }}>{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="border-t pt-4" style={{ borderColor: 'rgba(28, 25, 23, 0.1)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-lg" style={{ color: '#1c1917' }}>Amount Paid</span>
                  <span className="font-display font-bold text-2xl text-neon">Rs. {event.entryFee.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 font-body font-bold text-sm uppercase tracking-wider rounded-full transition-all duration-300 hover:scale-[0.98]"
              style={{ borderColor: '#1c1917', color: '#1c1917' }}
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
            <Link
              to="/dashboard?tab=registrations"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-neon text-dark font-body font-bold text-sm uppercase tracking-wider rounded-full hover:shadow-neon-lg transition-all duration-300 hover:scale-[0.98]"
            >
              <User className="w-4 h-4" />
              Go to Account Centre
            </Link>
          </motion.div>

          {/* Guest Signup Prompt */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="inline-block p-4 rounded-xl border-2 border-neon/30 bg-white/50 backdrop-blur-sm max-w-lg">
              <h4 className="font-display font-bold uppercase text-dark mb-1">Checked out as a guest?</h4>
              <p className="font-body text-xs text-dark/70">
                Sign up using <strong>{formData.email}</strong> (the email you just used) and this receipt will automatically link to your new Account Centre!
              </p>
              <Link to="/signup" className="mt-3 inline-block font-body text-xs font-bold text-dark border-b border-dark hover:text-neon hover:border-neon transition-colors">
                Create Account Now
              </Link>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  )
}
