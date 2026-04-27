import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export function Philosophy() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })

  const words = [
    'Chess', 'is', 'not', 'a', 'game', 'of', 'perfection.',
    'It', 'is', 'a', 'test', 'of', 'endurance,',
    'calculation,', 'and', 'the', 'will', 'to', 'strike',
    'when', 'the', 'moment', 'is', 'exact.'
  ]

  return (
    <section className="bg-dark py-32 md:py-40 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.p
          className="text-neon text-sm font-body uppercase tracking-[0.3em] mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Our Philosophy
        </motion.p>

        <h2 className="font-display text-4xl md:text-6xl font-bold text-white uppercase leading-tight">
          {words.map((word, index) => (
            <motion.span
              key={index}
              className={`inline-block mr-[0.3em] ${
                ['perfection.', 'endurance,', 'calculation,', 'exact.'].includes(word)
                  ? 'text-neon'
                  : ''
              }`}
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={isInView ? {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: {
                  duration: 0.5,
                  delay: index * 0.04,
                  ease: 'easeOut',
                }
              } : {}}
            >
              {word}
            </motion.span>
          ))}
        </h2>
      </div>
    </section>
  )
}
