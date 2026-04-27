import { motion } from 'framer-motion'
import { CountUp } from '@/components/CountUp'
import { Users, Trophy, Clock } from 'lucide-react'

const stats = [
  {
    value: 2500,
    suffix: '+',
    label: 'Players Trained',
    icon: Users,
  },
  {
    value: 40,
    suffix: '+',
    label: 'Tournament Wins',
    icon: Trophy,
  },
  {
    value: 10,
    suffix: '+',
    label: 'Years Experience',
    icon: Clock,
  },
]

export function Achievements() {
  return (
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: '#f4f1ee' }}>
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-sm font-body uppercase tracking-[0.3em] mb-4 text-center"
          style={{ color: '#5c3a21' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Our Track Record
        </motion.p>

        <motion.h2
          className="font-display text-4xl md:text-6xl font-bold uppercase text-center mb-16"
          style={{ color: '#1c1917' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          The Scoreboard
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="achievement-glow rounded-lg p-8 text-center relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon/5 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex p-4 bg-neon/10 rounded-full mb-6">
                  <stat.icon className="w-8 h-8 text-neon" />
                </div>

                <div className="font-display text-6xl md:text-7xl font-bold text-dark mb-2">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>

                <p className="font-body text-sm uppercase tracking-wider" style={{ color: '#5c3a21' }}>
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
