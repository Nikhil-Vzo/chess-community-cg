import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/sections/Footer'
import { supabase } from '@/lib/supabase'
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Hash, 
  Save, 
  CheckCircle, 
  Loader2,
  AlertCircle,
  Building2,
  Users,
  Trophy
} from 'lucide-react'
import { toast } from 'sonner'

export default function Account() {
  const { user, profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    has_fide_id: true,
    fide_id: '',
    phone: '',
    gender: 'Male',
    address: '',
    name: '',
    dob: '',
    city_state: ''
  })

  useEffect(() => {
    if (profile) {
      setIsEditing(false)
      setFormData({
        has_fide_id: profile.has_fide_id ?? true,
        fide_id: profile.fide_id || '',
        phone: profile.phone || '',
        gender: profile.gender || 'Male',
        address: profile.address || '',
        name: profile.name || user?.name || '',
        dob: profile.dob || '',
        city_state: profile.city_state || ''
      })
    } else {
      setIsEditing(true)
    }
  }, [profile, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    
    // Clean up empty strings to null for specific fields like dob which are strictly typed in Postgres
    const payload = {
      id: user.id,
      ...formData,
      dob: formData.dob || null,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(payload as any)

    if (error) {
      toast.error(error.message)
    } else {
      setSaved(true)
      toast.success('Player profile updated!')
      await refreshProfile()
      setIsEditing(false)
      setTimeout(() => setSaved(false), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <main className="pt-32 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-neon" />
              <p className="text-neon text-[10px] font-bold uppercase tracking-[0.4em]">Player Portal</p>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black text-white uppercase mb-6 leading-none">
              Player Profile
            </h1>
            <p className="text-white/40 font-body max-w-2xl leading-relaxed">
              Complete your profile once to unlock instant tournament registrations. This information is required for official FIDE and local tournament submissions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form or View */}
            <motion.div 
              className="lg:col-span-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {!isEditing ? (
                <div className="glass p-8 rounded-3xl border border-white/10 relative">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="absolute top-8 right-8 text-neon/70 hover:text-neon text-[10px] font-bold uppercase tracking-widest transition-colors"
                  >
                    Edit Profile
                  </button>

                  <h2 className="font-display text-xl font-bold text-white uppercase mb-8 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-neon" />
                    Profile Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-4">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Full Name</p>
                      <p className="text-white font-body">{profile?.name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Classification</p>
                      <p className="text-neon font-body font-bold">{profile?.has_fide_id ? 'FIDE Rated' : 'Unrated'}</p>
                    </div>
                    {profile?.has_fide_id && (
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">FIDE ID</p>
                        <p className="text-white font-mono">{profile.fide_id || '-'}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Phone Number</p>
                      <p className="text-white font-body">{profile?.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Gender</p>
                      <p className="text-white font-body">{profile?.gender || '-'}</p>
                    </div>
                    {profile?.dob && (
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Date of Birth</p>
                        <p className="text-white font-body">{new Date(profile.dob).toLocaleDateString()}</p>
                      </div>
                    )}
                    {profile?.address && (
                      <div className="sm:col-span-2">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Address</p>
                        <p className="text-white font-body">{profile.address}</p>
                      </div>
                    )}
                    {profile?.city_state && (
                      <div className="sm:col-span-2">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">City / State</p>
                        <p className="text-white font-body">{profile.city_state}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* ID Type Selection */}
                  <div className="glass p-8 rounded-3xl border border-white/10 relative">
                    {profile && (
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="absolute top-8 right-8 text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <h2 className="font-display text-xl font-bold text-white uppercase mb-8 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-neon" />
                      Classification
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, has_fide_id: true })}
                        className={`p-6 rounded-2xl border transition-all text-left group ${formData.has_fide_id ? 'bg-neon border-neon' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${formData.has_fide_id ? 'bg-dark' : 'bg-white/5'}`}>
                          <Trophy className={`w-5 h-5 ${formData.has_fide_id ? 'text-neon' : 'text-white/40'}`} />
                        </div>
                        <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${formData.has_fide_id ? 'text-dark' : 'text-white'}`}>I have FIDE ID</p>
                        <p className={`text-[10px] ${formData.has_fide_id ? 'text-dark/60' : 'text-white/30'}`}>Official world chess rating</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, has_fide_id: false })}
                        className={`p-6 rounded-2xl border transition-all text-left group ${!formData.has_fide_id ? 'bg-neon border-neon' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${!formData.has_fide_id ? 'bg-dark' : 'bg-white/5'}`}>
                          <Users className={`w-5 h-5 ${!formData.has_fide_id ? 'text-neon' : 'text-white/40'}`} />
                        </div>
                        <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${!formData.has_fide_id ? 'text-dark' : 'text-white'}`}>No FIDE ID</p>
                        <p className={`text-[10px] ${!formData.has_fide_id ? 'text-dark/60' : 'text-white/30'}`}>Beginner or unrated player</p>
                      </button>
                    </div>
                  </div>

                {/* Info Form */}
                <div className="glass p-8 rounded-3xl border border-white/10">
                  <h3 className="font-display text-xl font-bold text-white uppercase mb-8">Personal Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Common Field: Gender */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white font-body text-sm focus:border-neon outline-none transition-all appearance-none"
                      >
                        <option value="Male" className="bg-dark text-white">Male</option>
                        <option value="Female" className="bg-dark text-white">Female</option>
                        <option value="Other" className="bg-dark text-white">Other</option>
                      </select>
                    </div>

                    {/* Common Field: Phone */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-body text-sm focus:border-neon outline-none transition-all"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    {formData.has_fide_id ? (
                      <>
                        {/* FIDE Specific: ID */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">FIDE ID</label>
                          <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                              type="text"
                              value={formData.fide_id}
                              onChange={(e) => setFormData({ ...formData, fide_id: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-body text-sm focus:border-neon outline-none transition-all font-mono"
                              placeholder="e.g. 25012345"
                            />
                          </div>
                        </div>

                        {/* FIDE Specific: Address */}
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Full Address</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-4 w-4 h-4 text-white/20" />
                            <textarea
                              rows={3}
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-body text-sm focus:border-neon outline-none transition-all resize-none"
                              placeholder="House no, Street, Area..."
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Non-FIDE: Name */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-body text-sm focus:border-neon outline-none transition-all"
                              placeholder="As per records"
                            />
                          </div>
                        </div>

                        {/* Non-FIDE: DOB */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Date of Birth</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                              type="date"
                              value={formData.dob}
                              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-body text-sm focus:border-neon outline-none transition-all [color-scheme:dark]"
                            />
                          </div>
                        </div>

                        {/* Non-FIDE: City/State */}
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">City / State</label>
                          <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                              type="text"
                              value={formData.city_state}
                              onChange={(e) => setFormData({ ...formData, city_state: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-body text-sm focus:border-neon outline-none transition-all"
                              placeholder="e.g. Raipur, Chhattisgarh"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-10 py-5 bg-neon text-dark font-display font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:shadow-neon-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : saved ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {loading ? 'Saving Profile...' : saved ? 'Profile Updated' : 'Save Player Profile'}
                  </button>
                </div>
              </form>
              )}
            </motion.div>

            {/* Right Column: Profile Overview */}
            <motion.div 
              className="lg:col-span-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="sticky top-32 space-y-8">
                {/* User Card */}
                <div className="glass p-8 rounded-3xl border border-white/10 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-neon/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 p-1 mx-auto mb-6 relative group">
                      <div className="absolute inset-0 bg-neon/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      {user?.avatar ? (
                        <img src={user.avatar} className="w-full h-full rounded-full object-cover relative z-10" alt="" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-neon/10 flex items-center justify-center relative z-10">
                          <User className="w-10 h-10 text-neon" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-bold text-white uppercase truncate px-4">
                      {formData.name || user?.name || 'Incomplete Profile'}
                    </h3>
                    <p className="text-white/40 font-body text-xs mb-8">{user?.email}</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Status</p>
                        <p className={`text-[10px] font-bold uppercase ${profile ? 'text-green-400' : 'text-red-400'}`}>
                          {profile ? 'Verified' : 'Pending'}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Type</p>
                        <p className="text-[10px] font-bold uppercase text-neon">
                          {formData.has_fide_id ? 'Pro' : 'Aspirant'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Help Card */}
                <div className="bg-neon p-8 rounded-3xl text-dark">
                  <h4 className="font-display font-black uppercase text-xl mb-4 leading-none">Why create a profile?</h4>
                  <ul className="space-y-3">
                    {[
                      'One-click registration',
                      'Avoid Aadhaar requirement (FIDE)',
                      'Historical stats tracking',
                      'Verified tournament records'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 bg-dark rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
