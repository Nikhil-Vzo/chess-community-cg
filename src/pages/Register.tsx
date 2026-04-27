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
  Zap,
  Calendar,
  MapPin
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
    fide_id: '',
    phone: '',
    dob: '',
    gender: '',
    state: '',
    district: '',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

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
      name: profile.name || user?.name || '',
      email: user?.email || '',
      fide_id: profile.fide_id || '',
      phone: profile.phone || '',
      dob: profile.dob || '',
      gender: profile.gender || '',
      state: profile.city_state ? profile.city_state.split(',')[1]?.trim() || '' : '',
      district: profile.city_state ? profile.city_state.split(',')[0]?.trim() || '' : '',
    })
    setErrors({})
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
    
    const newErrors: Record<string, string> = {}
    
    if (!formData.name) newErrors.name = 'Full name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.dob) newErrors.dob = 'Date of Birth is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.state) newErrors.state = 'State is required'
    if (!formData.district) newErrors.district = 'District is required'
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else {
      const digitCount = formData.phone.replace(/[^0-9]/g, '').length
      if (digitCount < 10) {
        newErrors.phone = 'Must be at least 10 digits'
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the highlighted errors before proceeding.')
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
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.name ? 'text-red-400' : 'text-white/20'}`} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) setErrors({...errors, name: ''})
                    }}
                    className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white font-body text-sm outline-none transition-all ${
                      errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-neon'
                    }`}
                    placeholder="Enter full name"
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs ml-1 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.email ? 'text-red-400' : 'text-white/20'}`} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) setErrors({...errors, email: ''})
                    }}
                    className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white font-body text-sm outline-none transition-all ${
                      errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-neon'
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs ml-1 mt-1">{errors.email}</p>}
              </div>

              {/* FIDE ID */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">FIDE ID (Optional)</label>
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

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                <div className="relative">
                  <Hash className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.phone ? 'text-red-400' : 'text-white/20'}`} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value })
                      if (errors.phone) setErrors({...errors, phone: ''})
                    }}
                    className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white font-body text-sm outline-none transition-all ${
                      errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-neon'
                    }`}
                    placeholder="98765 43210"
                  />
                </div>
                {errors.phone && <p className="text-red-400 text-xs ml-1 mt-1">{errors.phone}</p>}
              </div>

              {/* DOB and Gender Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Date of Birth</label>
                  <div className="relative">
                    <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.dob ? 'text-red-400' : 'text-white/20'}`} />
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => {
                        setFormData({ ...formData, dob: e.target.value })
                        if (errors.dob) setErrors({...errors, dob: ''})
                      }}
                      className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white font-body text-sm outline-none transition-all ${
                        errors.dob ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-neon'
                      }`}
                    />
                  </div>
                  {errors.dob && <p className="text-red-400 text-xs ml-1 mt-1">{errors.dob}</p>}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Gender</label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.gender ? 'text-red-400' : 'text-white/20'}`} />
                    <select
                      value={formData.gender}
                      onChange={(e) => {
                        setFormData({ ...formData, gender: e.target.value })
                        if (errors.gender) setErrors({...errors, gender: ''})
                      }}
                      className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white font-body text-sm outline-none transition-all appearance-none ${
                        errors.gender ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-neon'
                      }`}
                    >
                      <option value="" disabled className="bg-dark">Select Gender</option>
                      <option value="Male" className="bg-dark">Male</option>
                      <option value="Female" className="bg-dark">Female</option>
                      <option value="Other" className="bg-dark">Other</option>
                    </select>
                  </div>
                  {errors.gender && <p className="text-red-400 text-xs ml-1 mt-1">{errors.gender}</p>}
                </div>
              </div>

              {/* State and District Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* State */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">State</label>
                  <div className="relative">
                    <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.state ? 'text-red-400' : 'text-white/20'}`} />
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => {
                        setFormData({ ...formData, state: e.target.value })
                        if (errors.state) setErrors({...errors, state: ''})
                      }}
                      className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white font-body text-sm outline-none transition-all ${
                        errors.state ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-neon'
                      }`}
                      placeholder="e.g. Chhattisgarh"
                    />
                  </div>
                  {errors.state && <p className="text-red-400 text-xs ml-1 mt-1">{errors.state}</p>}
                </div>

                {/* District */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">District</label>
                  <div className="relative">
                    <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.district ? 'text-red-400' : 'text-white/20'}`} />
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => {
                        setFormData({ ...formData, district: e.target.value })
                        if (errors.district) setErrors({...errors, district: ''})
                      }}
                      className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white font-body text-sm outline-none transition-all ${
                        errors.district ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-neon'
                      }`}
                      placeholder="e.g. Raipur"
                    />
                  </div>
                  {errors.district && <p className="text-red-400 text-xs ml-1 mt-1">{errors.district}</p>}
                </div>
              </div>
            </div>

            {/* Fee Notice */}
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-neon shrink-0 mt-0.5" />
              <div>
                <p className="text-white/60 text-xs font-body leading-relaxed">
                  By proceeding, you agree to the tournament regulations and the entry fee of <span className="text-white font-bold">Rs. 900 + Service Tax</span>. Registration is final once payment is confirmed.
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
