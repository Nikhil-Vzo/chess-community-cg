import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Navbar } from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

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
        },
      },
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
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-dark px-6 pb-12 pt-32">
        <Navbar />
        <div className="pointer-events-none absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-neon/5 to-transparent" />

        <motion.div
          className="z-10 w-full max-w-md text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-neon/30 bg-neon/10">
            <CheckCircle2 className="h-10 w-10 text-neon" />
          </div>

          <h1 className="mb-4 font-display text-4xl font-bold uppercase text-white">Check Your Email</h1>
          <p className="mb-8 font-body leading-relaxed text-white/60">
            We've sent a verification link to <span className="font-bold text-white">{email}</span>.
            <br />
            <span className="font-bold text-neon">Please verify your email address before logging in.</span>
          </p>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-8 py-4 font-body font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20 active:scale-[0.98]"
          >
            Go to Login
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-dark px-6 pb-12 pt-32">
      <Navbar />
      <div className="pointer-events-none absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-neon/5 to-transparent" />

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
          <h1 className="mb-2 font-display text-4xl font-bold uppercase text-white">Create Account</h1>
          <p className="font-body text-white/40">Join the elite community of Chhattisgarh chess players.</p>
        </div>

        <div className="glass rounded-[20px] border border-white/10 p-8 shadow-2xl">
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-body font-bold uppercase tracking-widest text-white/60">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 font-body text-white outline-none transition-all focus:border-neon/50"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

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

            <div className="space-y-2">
              <label className="text-xs font-body font-bold uppercase tracking-widest text-white/60">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 font-body text-white outline-none transition-all focus:border-neon/50"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neon py-4 font-body font-bold uppercase tracking-widest text-dark transition-all hover:shadow-neon-lg active:scale-[0.98]"
            >
              {loading ? 'Creating Account...' : 'Register'}
              {!loading ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center font-body text-sm text-white/40">
          Already have an account? <Link to="/login" className="font-bold text-neon hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  )
}
