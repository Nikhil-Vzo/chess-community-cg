import { motion } from 'framer-motion'

export function Preloader() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#100d0b]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,255,46,0.12),transparent_28%),linear-gradient(180deg,#15110f_0%,#100d0b_100%)]" />

      <div className="relative flex h-full items-center justify-center px-6">
        <div className="w-full max-w-xs text-center">
          <p className="text-[10px] font-body font-bold uppercase tracking-[0.42em] text-neon/75">
            Chess Camp
          </p>
          <h2 className="mt-4 font-display text-4xl font-black uppercase tracking-tight text-white">
            Loading
          </h2>
          <div className="mx-auto mt-6 h-px w-28 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full w-1/2 bg-neon"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
