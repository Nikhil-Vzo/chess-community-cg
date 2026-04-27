import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { events } from '@/data/mockData'
import { useAuth } from '@/contexts/AuthContext'
import { supabaseService } from '@/lib/supabaseService'
import type { ChessEvent } from '@/types'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/sections/Footer'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Hash, 
  Trophy, 
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'

export default function Register() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  const [dbEvent, setDbEvent] = useState<ChessEvent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!id) return
      try {
        const data = await supabaseService.getEventById(id)
        setDbEvent(data)
      } catch {
        // Fall back to mockData
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // Use DB event first, then fall back to mockData
  const mockEvent = events.find((e) => e.id === id)
  const event = (dbEvent || mockEvent) as ChessEvent | undefined

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    fide_id: '',
  })

  const [useProfile, setUseProfile] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }))
    }
  }, [user])

  const handleUseProfile = () => {
    if (!profile) {
      toast.error('No player profile found. Create one in Account settings!')
      return
    }

    setUseProfile(true)
    setFormData({
      name: profile.has_fide_id ? (user?.name || '') : (profile.name || user?.name || ''),
      email: user?.email || '',
      phone: profile.phone || '',
      age: profile.dob ? String(new Date().getFullYear() - new Date(profile.dob).getFullYear()) : '',
      fide_id: profile.fide_id || '',
    })
    toast.success('Profile data applied!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-white mb-4 uppercase">Event Not Found</h1>
          <Link to="/events" className="text-neon hover:underline font-body uppercase tracking-widest text-xs">Back to Events</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.age) {
      toast.error('Please fill in all required fields.')
      return
    }

    const ageNum = parseInt(formData.age, 10)
    if (isNaN(ageNum) || ageNum < 4 || ageNum > 100) {
      toast.error('Please enter a valid age between 4 and 100.')
      return
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, '').slice(-10))) {
      toast.error('Please enter a valid 10-digit phone number.')
      return
    }

    navigate(`/payment/${event.id}`, { state: { formData, event } })
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <main className="pt-32 pb-32 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <Link
              to={`/events/${event.id}`}
              className="inline-flex items-center gap-2 text-white/40 hover:text-neon transition-all font-body text-xs uppercase tracking-widest group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Event
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-neon" />
              <p className="text-neon text-[10px] font-bold uppercase tracking-[0.4em]">Official Registration</p>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black text-white uppercase mb-4 leading-none">
              Register Now
            </h1>
            <p className="text-white/40 font-body">
              Registering for <span className="text-white font-bold">{event.title}</span>
            </p>
          </motion.div>

          {/* Quick Fill Banner */}
          {profile && !useProfile && (
            <motion.div 
              className="bg-neon/10 border border-neon/30 rounded-2xl p-6 mb-10 flex items-center justify-between gap-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-neon rounded-full flex items-center justify-center shadow-neon">
                  <Zap className="w-5 h-5 text-dark" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Save time with your Profile</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">Auto-fill all your tournament details</p>
                </div>
              </div>
              <button 
                onClick={handleUseProfile}
                className="px-6 py-2.5 bg-neon text-dark font-display font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-transform active:scale-95"
              >
                Apply Profile
              </button>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass p-8 rounded-3xl border border-white/10 space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-body text-sm focus:border-neon outline-none transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-body text-sm focus:border-neon outline-none transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Phone and Age Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-body text-sm focus:border-neon outline-none transition-all"
                      placeholder="98765 43210"
                      required
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Player Age</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="number"
                      min="4"
                      max="100"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-body text-sm focus:border-neon outline-none transition-all"
                      placeholder="Enter age (e.g., 12)"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* FIDE ID */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">FIDE ID (Optional)</label>
                  {!profile?.has_fide_id && (
                    <span className="text-[8px] font-black text-neon uppercase tracking-widest bg-neon/10 px-2 py-0.5 rounded">Not on Profile</span>
                  )}
                </div>
                <div className="relative">
                  <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="text"
                    value={formData.fide_id}
                    onChange={(e) => setFormData({ ...formData, fide_id: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-body text-sm focus:border-neon outline-none transition-all"
                    placeholder="Official FIDE ID if any"
                  />
                </div>
              </div>
            </div>

            {/* Fee Notice */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-neon shrink-0 mt-0.5" />
              <div>
                <p className="text-white/60 text-xs font-body leading-relaxed">
                  By proceeding, you agree to the tournament regulations and the entry fee of <span className="text-white font-bold">Rs. {event.entryFee.toLocaleString()}</span>. Registration is final once payment is confirmed.
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-5 bg-neon text-dark font-display font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:shadow-neon-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-8 shadow-xl"
            >
              <CheckCircle className="w-5 h-5" />
              Complete Registration
            </button>
          </motion.form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
