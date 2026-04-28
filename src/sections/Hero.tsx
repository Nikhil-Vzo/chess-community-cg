import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, PlayCircle } from 'lucide-react'
import { Hero3D } from '@/components/Hero3D'

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-dark flex flex-col justify-center">
      {/* Cinematic Lighting & Grid */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_right_center,rgba(212,175,55,0.15),transparent_50%),radial-gradient(circle_at_left_bottom,rgba(200,255,46,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-position:center] [background-size:64px_64px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-[#100d0b] to-transparent" />

      <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl items-center gap-12 px-6 pt-24 lg:grid-cols-2 lg:pt-0">

        {/* Left Content */}
        <div className="flex flex-col items-start text-left justify-center">

          {/* Main Title */}
          <motion.h1
            className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-black uppercase leading-[0.85] tracking-[-0.04em] text-white drop-shadow-2xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Master
            <br />
            <span className="bg-gradient-to-b from-neon to-neon/40 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(200,255,46,0.3)]">
              The Board
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-8 max-w-xl font-body text-base leading-relaxed text-white/60 md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join the elite community of players. Participate in premier tournaments, study from grandmaster-curated vaults, and elevate your strategic dominance with our award-winning curriculum.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-12 flex flex-col w-full gap-4 sm:flex-row sm:items-center sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link
              to="/events?type=tournament"
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-[#D4AF37] px-9 py-4 font-body text-xs font-black uppercase tracking-[0.25em] text-dark transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-3">
                Explore Tournaments
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              to="/videos"
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-9 py-4 font-body text-xs font-bold uppercase tracking-[0.25em] text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
            >
              <PlayCircle className="h-4 w-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              Study Vault
            </Link>
          </motion.div>
        </div>

        {/* Right Asset - Highly Optimized Three.js Canvas */}
        <motion.div
          className="absolute inset-0 z-[-1] flex items-center justify-center h-full w-full opacity-25 pointer-events-none lg:static lg:z-0 lg:opacity-100 lg:pointer-events-auto lg:min-h-0 lg:translate-x-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          {/* Animated Glow behind the 3D asset */}
          <motion.div
            className="absolute w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] rounded-full bg-[#D4AF37]/15 blur-[80px] lg:blur-[100px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <Hero3D />
        </motion.div>

      </div>
    </section>
  )
}
