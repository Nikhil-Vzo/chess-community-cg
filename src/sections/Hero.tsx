import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChessboardHero } from '@/components/ChessboardHero'
import { ArrowRight, ShieldCheck, ClipboardList } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen bg-dark overflow-hidden flex items-center">
      {/* 3D Chessboard Background - Centered but with content offset */}
      <div className="absolute inset-0 z-0">
        <ChessboardHero />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 px-6 w-full max-w-7xl mx-auto pt-20">
        <div className="max-w-4xl">
          {/* Authority Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-neon/10 border border-neon/20 rounded-full mb-8 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ShieldCheck className="w-4 h-4 text-neon" />
            <span className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-neon">
              Official Tournament Training Platform
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-display text-[12vw] md:text-[8.5vw] font-bold text-white uppercase leading-[0.8] tracking-tighter mb-8">
              JOIN THE <br />
              <span className="text-neon">ARENA.</span>
            </h1>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl font-body text-white/60 max-w-2xl mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the thrill of high-stakes chess. Register for elite 
            training camps and participate in officially sanctioned tournaments 
            to climb the national rankings.
          </motion.p>


          <motion.div
            className="flex flex-col sm:flex-row items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="/events?tab=tournaments"
              className="group relative flex items-center gap-3 px-10 py-5 bg-neon text-dark font-body font-bold text-sm uppercase tracking-wider rounded-none overflow-hidden transition-all hover:shadow-neon-lg active:scale-95"
            >
              <span className="relative z-10">Enter Tournament</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            
            <Link
              to="/events?tab=camps"
              className="group flex items-center gap-4 text-white font-body font-bold text-sm uppercase tracking-wider hover:text-neon transition-colors"
            >
              <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-neon group-hover:bg-neon/5 transition-all">
                <ClipboardList className="w-6 h-6" />
              </div>
              Explore Camps
            </Link>
          </motion.div>


          {/* Trust Indicators */}
          <motion.div 
            className="mt-24 pt-10 border-t border-white/5 flex flex-wrap gap-x-16 gap-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div>
              <p className="text-white font-display text-4xl font-bold uppercase tabular-nums">2.5k+</p>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-body mt-1">Players Trained</p>
            </div>
            <div>
              <p className="text-white font-display text-4xl font-bold uppercase tabular-nums">40+</p>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-body mt-1">Tournament Wins</p>
            </div>
            <div>
              <p className="text-white font-display text-4xl font-bold uppercase tabular-nums">10+</p>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-body mt-1">Years Experience</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ambient decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-neon/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-dark to-transparent z-10" />
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-body">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-neon to-transparent" />
      </motion.div>
    </section>
  )
}
