import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router'
import { Swords, Trophy, Video, GraduationCap } from 'lucide-react'

const offerings = [
  {
    title: 'Summer Camps',
    description: 'Intensive training programs designed to rapidly improve your game.',
    icon: Swords,
    href: '/events?tab=camps',
  },
  {
    title: 'Rated Tournaments',
    description: 'Compete in FIDE-rated events and climb the rankings.',
    icon: Trophy,
    href: '/events?tab=tournaments',
  },
  {
    title: 'GM Training Videos',
    description: 'Learn from Grandmasters with in-depth game analysis.',
    icon: Video,
    href: '/videos',
  },
  {
    title: 'Elite Coaching',
    description: 'One-on-one sessions with professional chess coaches.',
    icon: GraduationCap,
    href: '/events?tab=camps',
  },
]

export function SystemShock() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [60, 0])
  const rotateZ = useTransform(scrollYProgress, [0, 0.5], [-30, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.7, 1])

  return (
    <section className="bg-dark py-32 md:py-40 px-6" ref={containerRef}>
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-neon text-sm font-body uppercase tracking-[0.3em] mb-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          What We Offer
        </motion.p>

        <motion.h2
          className="font-display text-5xl md:text-7xl font-bold text-white uppercase text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          System Shock
        </motion.h2>

        <div className="perspective-grid">
          <motion.div
            className="perspective-grid-inner"
            style={{
              rotateX,
              rotateZ,
              scale,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {offerings.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, z: -300 }}
                  whileInView={{ opacity: 1, z: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeInOut' }}
                >
                  <Link
                    to={item.href}
                    className="group block p-8 bg-card-dark border border-white/10 rounded hover:border-neon/30 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Hover line */}
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-white group-hover:w-full transition-all duration-500" />

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-neon/10 rounded">
                        <item.icon className="w-6 h-6 text-neon" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-white uppercase mb-2 group-hover:text-neon transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-white/50 font-body text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
