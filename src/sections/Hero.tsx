import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, PlayCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { ChessboardHero } from '@/components/ChessboardHero'

const heroStats = [
  { label: 'Players', value: '2.5k+' },
  { label: 'Wins', value: '40+' },
  { label: 'Years', value: '10+' },
]

export function Hero() {
  return (
    <section className="relative h-[100svh] max-h-[100svh] overflow-hidden bg-dark">
      <div className="absolute inset-0 z-0">
        <ChessboardHero />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_top_left,rgba(200,255,46,0.14),transparent_24%),linear-gradient(90deg,rgba(16,13,11,0.95)_0%,rgba(16,13,11,0.76)_48%,rgba(16,13,11,0.44)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-position:center] [background-size:56px_56px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-36 bg-gradient-to-t from-[#100d0b] to-transparent" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-6 pt-20">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="max-w-3xl">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-neon/20 bg-neon/10 px-4 py-2 backdrop-blur-sm"
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
            >
              <ShieldCheck className="h-4 w-4 text-neon" />
              <span className="text-[10px] font-body font-bold uppercase tracking-[0.28em] text-neon">
                Chhattisgarh Chess Platform
              </span>
            </motion.div>

            <motion.h1
              className="mt-6 font-display text-[13vw] font-black uppercase leading-[0.84] tracking-[-0.05em] text-white sm:text-[4.7rem] md:text-[5.7rem] xl:text-[6.4rem]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
            >
              Train For
              <br />
              <span className="text-neon">The Board</span>
            </motion.h1>

            <motion.p
              className="mt-5 max-w-xl font-body text-sm leading-relaxed text-white/62 md:text-base"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
            >
              Camps, tournaments, and PGN-backed study in one sharper training space.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
            >
              <Link
                to="/events?tab=camps"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-neon px-7 py-3.5 font-body text-xs font-bold uppercase tracking-[0.24em] text-dark transition-all hover:shadow-neon-lg active:scale-[0.98]"
              >
                Explore Camps
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/videos"
                className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/14 bg-white/5 px-7 py-3.5 font-body text-xs font-bold uppercase tracking-[0.24em] text-white transition-all hover:border-neon/35 hover:bg-white/10"
              >
                <PlayCircle className="h-4 w-4 text-neon" />
                Study Vault
              </Link>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.38 }}
            >
              {heroStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[20px] border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-md"
                >
                  <p className="font-display text-2xl font-black uppercase text-white">{item.value}</p>
                  <p className="mt-1 text-[10px] font-body font-bold uppercase tracking-[0.26em] text-white/40">
                    {item.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.aside
            className="hidden rounded-[28px] border border-white/10 bg-black/20 p-5 backdrop-blur-xl lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.34em] text-neon/75">
                  Focus
                </p>
                <h2 className="mt-2 font-display text-2xl font-black uppercase leading-none text-white">
                  Better training.
                  <br />
                  Less clutter.
                </h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neon/20 bg-neon/10">
                <Sparkles className="h-5 w-5 text-neon" />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.32em] text-white/35">Compete</p>
                <p className="mt-2 font-body text-sm leading-relaxed text-white/65">
                  Register faster and move straight into real event play.
                </p>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.32em] text-white/35">Review</p>
                <p className="mt-2 font-body text-sm leading-relaxed text-white/65">
                  Watch the lecture, then step through the exact PGN on the board.
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
