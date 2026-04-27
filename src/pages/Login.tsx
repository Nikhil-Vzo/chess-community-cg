import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [method, setMethod] = useState<'password' | 'magic'>('password')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    if (method === 'password') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Welcome back!')
        navigate('/')
      }
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Check your email for the login link!')
      }
    }
    setLoading(false)
  }

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address first.')
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account`,
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password reset link sent to your mail!')
    }
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-6 pt-32 pb-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-neon/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-neon/5 to-transparent pointer-events-none" />
      
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
          <h1 className="font-display text-4xl font-bold text-white uppercase mb-2">Welcome Back</h1>
          <p className="text-white/40 font-body">
            {method === 'magic' ? 'Login via a secure link sent to your mail.' : 'Sign in to continue your grandmaster journey.'}
          </p>
        </div>

        <div className="glass p-8 rounded-[20px] border border-white/10 shadow-2xl">
          {/* Method Toggle */}
          <div className="flex bg-white/5 p-1 rounded-xl mb-8">
            <button 
              onClick={() => setMethod('magic')}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${method === 'magic' ? 'bg-neon text-dark shadow-neon' : 'text-white/40'}`}
            >
              Magic Link
            </button>
            <button 
              onClick={() => setMethod('password')}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${method === 'password' ? 'bg-neon text-dark shadow-neon' : 'text-white/40'}`}
            >
              Password
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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

            {method === 'password' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-body font-bold text-white/60 uppercase tracking-widest">Password</label>
                  <button 
                    type="button" 
                    onClick={handleResetPassword}
                    className="text-[10px] text-neon uppercase tracking-wider hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
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
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-neon text-dark font-body font-bold uppercase tracking-widest rounded-xl hover:shadow-neon-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : method === 'magic' ? 'Send Link' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-white/40 font-body text-sm">
          Don't have an account? {' '}
          <Link to="/signup" className="text-neon hover:underline font-bold">Register Now</Link>
        </p>
      </motion.div>
    </div>
  )
}
