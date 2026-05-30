import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, PlayCircle } from 'lucide-react'
import { Hero3D } from '@/components/Hero3D'

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-dark flex flex-col justify-center">
      {/* Cinematic Lighting & Grid */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_right_center,rgba(200,255,46,0.08),transparent_50%),radial-gradient(circle_at_left_bottom,rgba(200,255,46,0.04),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-position:center] [background-size:64px_64px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-[#100d0b] to-transparent" />

      <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl items-center gap-12 px-6 pt-28 lg:grid-cols-[1.2fr_0.8fr] lg:pt-0">
        {/* Left Content */}
        <div className="flex flex-col items-start text-left justify-center">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon/30 bg-neon/10 backdrop-blur-md mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" aria-hidden="true" />
            <span className="text-neon text-[9px] font-bold uppercase tracking-widest">Chhattisgarh Chess Union</span>
          </motion.div>

          <motion.h1
            className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-black uppercase leading-[0.95] tracking-[-0.03em] text-white"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Play. Study.
            <br />
            <span className="bg-gradient-to-b from-neon to-neon/40 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(200,255,46,0.2)]">
              Master the Board
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl font-body text-base leading-relaxed text-white/60"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Play in open state tournaments, study the grandmaster archives, and track your official FIDE rating improvements.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-col w-full gap-4 sm:flex-row sm:items-center sm:w-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/events?type=tournament"
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-neon px-8 py-3.5 font-body text-xs font-black uppercase tracking-[0.2em] text-dark transition-all hover:shadow-[0_0_30px_rgba(200,255,46,0.4)] active:scale-95"
            >
              Explore Tournaments
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>

            <Link
              href="/videos"
              className="group inline-flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 font-body text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
            >
              <PlayCircle className="h-4 w-4 text-neon" aria-hidden="true" />
              Study Vault
            </Link>
          </motion.div>
        </div>

        {/* Right Asset - WebGL + 2D Coordinates */}
        <motion.div
          className="relative flex items-center justify-center aspect-square w-full max-w-[450px] mx-auto border border-white/5 rounded-3xl bg-black/20 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Flat 2D Board Coordinate Details */}
          <div className="absolute inset-0 p-4 pointer-events-none flex flex-col justify-between font-mono text-[9px] text-white/25" aria-hidden="true">
            <div className="flex justify-between w-full px-4">
              <span>a</span><span>b</span><span>c</span><span>d</span><span>e</span><span>f</span><span>g</span><span>h</span>
            </div>
            <div className="flex justify-between w-full px-4">
              <span>a</span><span>b</span><span>c</span><span>d</span><span>e</span><span>f</span><span>g</span><span>h</span>
            </div>
          </div>
          <div className="absolute inset-y-8 left-4 bottom-8 pointer-events-none flex flex-col justify-between font-mono text-[9px] text-white/25" aria-hidden="true">
            <span>8</span><span>7</span><span>6</span><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span>
          </div>
          <div className="absolute inset-y-8 right-4 bottom-8 pointer-events-none flex flex-col justify-between font-mono text-[9px] text-white/25" aria-hidden="true">
            <span>8</span><span>7</span><span>6</span><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span>
          </div>
          
          <Hero3D />
        </motion.div>
      </div>
    </section>
  )
}
