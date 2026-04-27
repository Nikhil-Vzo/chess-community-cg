import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { Navbar } from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

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
        },
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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-dark px-6 pb-12 pt-32">
      <Navbar />
      <div className="pointer-events-none absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-neon/5 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-full w-1/3 bg-gradient-to-r from-neon/5 to-transparent" />

      <motion.div
        className="z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-10 text-center">
          <Link to="/" className="mb-8 inline-block">
            <span className="font-display text-2xl font-bold uppercase tracking-[0.2em] text-white">
              CHESS COMMUNITY CG
            </span>
          </Link>
          <h1 className="mb-2 font-display text-4xl font-bold uppercase text-white">Welcome Back</h1>
          <p className="font-body text-white/40">
            {method === 'magic' ? 'Login via a secure link sent to your mail.' : 'Sign in to continue your grandmaster journey.'}
          </p>
        </div>

        <div className="glass rounded-[20px] border border-white/10 p-8 shadow-2xl">
          <div className="mb-8 flex rounded-xl bg-white/5 p-1">
            <button
              onClick={() => setMethod('magic')}
              className={`flex-1 rounded-lg py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${method === 'magic' ? 'bg-neon text-dark shadow-neon' : 'text-white/40'}`}
            >
              Magic Link
            </button>
            <button
              onClick={() => setMethod('password')}
              className={`flex-1 rounded-lg py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${method === 'password' ? 'bg-neon text-dark shadow-neon' : 'text-white/40'}`}
            >
              Password
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-body font-bold uppercase tracking-widest text-white/60">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 font-body text-white outline-none transition-all focus:border-neon/50"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {method === 'password' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-body font-bold uppercase tracking-widest text-white/60">Password</label>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-[10px] uppercase tracking-wider text-neon hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 font-body text-white outline-none transition-all focus:border-neon/50"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neon py-4 font-body font-bold uppercase tracking-widest text-dark transition-all hover:shadow-neon-lg active:scale-[0.98]"
            >
              {loading ? 'Sending...' : method === 'magic' ? 'Send Link' : 'Sign In'}
              {!loading ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center font-body text-sm text-white/40">
          Don't have an account? <Link to="/signup" className="font-bold text-neon hover:underline">Register Now</Link>
        </p>
      </motion.div>
    </div>
  )
}
