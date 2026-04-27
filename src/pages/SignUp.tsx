import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })

    if (error) {
      toast.error(error.message)
    } else {
      setIsSuccess(true)
    }
    setLoading(false)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-6 pt-32 pb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-neon/5 to-transparent pointer-events-none" />
        
        <motion.div 
          className="w-full max-w-md z-10 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-neon/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-neon/30">
            <CheckCircle2 className="w-10 h-10 text-neon" />
          </div>
          
          <h1 className="font-display text-4xl font-bold text-white uppercase mb-4">Check Your Email</h1>
          <p className="text-white/60 font-body mb-8 leading-relaxed">
            We've sent a verification link to <span className="text-white font-bold">{email}</span>. <br/>
            <span className="text-neon font-bold">Please verify your email address before logging in.</span>
          </p>
          
          <Link 
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-body font-bold uppercase tracking-widest rounded-xl transition-all active:scale-[0.98]"
          >
            Go to Login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-6 pt-32 pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-neon/5 to-transparent pointer-events-none" />
      
      <motion.div 
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-8">
            <span className="font-display text-2xl font-bold text-white tracking-[0.2em] uppercase">
              CHESS COMMUNITY CG
            </span>
          </Link>
          <h1 className="font-display text-4xl font-bold text-white uppercase mb-2">Create Account</h1>
          <p className="text-white/40 font-body">Join the elite community of Chhattisgarh chess players.</p>
        </div>

        <div className="glass p-8 rounded-[20px] border border-white/10 shadow-2xl">
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-body font-bold text-white/60 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-body focus:border-neon/50 outline-none transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-body font-bold text-white/60 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-body focus:border-neon/50 outline-none transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-body font-bold text-white/60 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-body focus:border-neon/50 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-neon text-dark font-body font-bold uppercase tracking-widest rounded-xl hover:shadow-neon-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Creating Account...' : 'Register'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-white/40 font-body text-sm">
          Already have an account? {' '}
          <Link to="/login" className="text-neon hover:underline font-bold">Sign In</Link>
        </p>
      </motion.div>
    </div>
  )
}
