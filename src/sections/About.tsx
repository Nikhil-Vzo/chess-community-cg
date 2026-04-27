import { motion } from 'framer-motion'
import { Target, Eye, Award } from 'lucide-react'

export function About() {
  return (
    <section className="py-32 md:py-40 px-6" style={{ backgroundColor: '#f4f1ee' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <motion.p
              className="text-sm font-body uppercase tracking-[0.3em] mb-4"
              style={{ color: '#5c3a21' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              About Chess Community Chhattisgarh
            </motion.p>

            <motion.h2
              className="font-display text-5xl md:text-6xl font-bold uppercase mb-8"
              style={{ color: '#1c1917' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Forged in<br />Competition
            </motion.h2>

            <motion.p
              className="font-body text-base leading-relaxed mb-6"
              style={{ color: '#1c1917', opacity: 0.7 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Chess Community Chhattisgarh was founded with a singular mission: to transform passionate chess players into tournament-ready competitors. Over the past decade, we have trained over 2,500 students, produced 40+ tournament champions, and built a community that lives and breathes chess.
            </motion.p>

            <motion.p
              className="font-body text-base leading-relaxed mb-8"
              style={{ color: '#1c1917', opacity: 0.7 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our approach combines rigorous tactical training, deep strategic understanding, and psychological preparation. Whether you are a beginner taking your first steps or a seasoned player aiming for the Grandmaster title, Chess Community Chhattisgarh provides the tools, coaching, and competitive opportunities to elevate your game.
            </motion.p>

            {/* Stats row */}
            <div className="flex gap-8">
              {[
                { icon: Target, label: 'Mission-Focused' },
                { icon: Eye, label: 'Vision-Driven' },
                { icon: Award, label: 'Results-Proven' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" style={{ color: '#5c3a21' }} />
                  <span className="text-xs font-body font-medium uppercase tracking-wider" style={{ color: '#1c1917' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image Grid */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden aspect-[3/4]">
                <img
                  src="/images/camp-poster-1.jpg"
                  alt="Chess camp"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden aspect-square">
                <img
                  src="/images/video-thumb-2.jpg"
                  alt="Chess game"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-lg overflow-hidden aspect-square">
                <img
                  src="/images/camp-gm.jpg"
                  alt="GM coaching"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden aspect-[3/4]">
                <img
                  src="/images/tournament-2.jpg"
                  alt="Tournament hall"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
