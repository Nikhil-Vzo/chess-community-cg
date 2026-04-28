import { motion } from 'framer-motion'

interface ShinyTextProps {
  text: string
  className?: string
  speed?: number
}

export function ShinyText({ text, className = '', speed = 3 }: ShinyTextProps) {
  return (
    <motion.span
      className={`inline-block text-transparent bg-clip-text ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundRepeat: 'no-repeat',
      }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        repeat: Infinity,
        duration: speed,
        ease: 'linear',
      }}
    >
      {text}
    </motion.span>
  )
}
