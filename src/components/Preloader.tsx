import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onComplete: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-dark flex flex-col items-center justify-center"
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        {/* Knight SVG Animation */}
        <div className="relative mb-8">
          <motion.svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.path
              d="M19 22H5V20H19V22ZM13 2V4H11V2H13ZM18 10C18 13.3 15.3 16 12 16C8.7 16 6 13.3 6 10C6 7.8 7.2 5.8 9 4.8V4C9 3.4 9.4 3 10 3H14C14.6 3 15 3.4 15 4V4.8C16.8 5.8 18 7.8 18 10ZM12 14C14.2 14 16 12.2 16 10C16 8.4 15.1 7 13.7 6.2L12.7 5.7L13 4H11L11.3 5.7L10.3 6.2C8.9 7 8 8.4 8 10C8 12.2 9.8 14 12 14Z"
              fill="#c8ff2e"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
          </motion.svg>
          <motion.div
            className="absolute -inset-4 rounded-full border border-neon/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Text */}
        <motion.p
          className="text-parchment/60 font-body text-sm uppercase tracking-[0.3em] mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Preparing your next move...
        </motion.p>

        {/* Progress bar */}
        <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-neon"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Percentage */}
        <motion.p
          className="text-neon/40 font-body text-xs mt-4 tabular-nums"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {progress}%
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
