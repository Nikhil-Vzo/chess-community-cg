import { motion } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/sections/Footer'
import { Instagram, Linkedin, Facebook, Mail, Award, Users, TrendingUp } from 'lucide-react'

export default function About() {
  const stats = [
    { label: 'Monthly Reach', value: '12M+', icon: TrendingUp },
    { label: 'Youth Impacted', value: '10k+', icon: Users },
    { label: 'Awards Won', value: '15+', icon: Award },
  ]

  return (
    <div className="min-h-screen bg-dark overflow-hidden">
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-neon" />
                <p className="text-neon text-[10px] font-bold uppercase tracking-[0.4em]">Indian Chess Community</p>
              </div>
              <h1 className="font-display text-5xl md:text-8xl font-black text-white uppercase mb-8 leading-[0.9]">
                Amogh <span className="text-neon">Yadav</span>
              </h1>

              <p className="text-white/40 font-body text-lg leading-relaxed mb-10 max-w-xl">
                If there’s one person who turns vision into action, it’s Amogh Yadav — the founder of Indian Chess Community. From organizing open-air chess tournaments to state-level championships, he has transformed the chess culture in Chhattisgarh.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.instagram.com/feat.amogh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-neon hover:text-dark border border-white/10 rounded-xl transition-all group"
                >
                  <Instagram className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Instagram</span>
                </a>
                <a
                  href="https://www.linkedin.com/posts/amogh-yadav-5709b3353_chesscityraipur-itmuniversity-chesscup2022-activity-7315817487688761344-r6Ih"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-neon hover:text-dark border border-white/10 rounded-xl transition-all group"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">LinkedIn</span>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-neon/20 blur-3xl rounded-full opacity-30 animate-pulse" />
              <div className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl shadow-neon/20">
                <img
                  src="/amogh-1.jpeg"
                  alt="Amogh Yadav"
                  className="w-full h-auto block"
                />
              </div>
              <div className="mt-6 glass p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
                <p className="text-neon text-[10px] font-bold uppercase tracking-widest mb-1">Indian Chess Community</p>
                <p className="text-white font-display text-xl font-black uppercase">Amogh Yadav</p>
              </div>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-10 rounded-[32px] border border-white/5 text-center group hover:border-neon/30 transition-all"
              >
                <div className="w-16 h-16 bg-neon/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-neon" />
                </div>
                <p className="text-4xl font-display font-black text-white mb-2">{stat.value}</p>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
            <div className="lg:col-span-7 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase mb-8 leading-tight">
                  Empowering <span className="text-neon">Young Minds</span> Across India
                </h2>
                <div className="space-y-6 text-white/60 font-body text-lg leading-relaxed">
                  <p>
                    I'm Amogh Yadav – a youth leader, content creator, and founder of Indian Chess Community. Over the past several years, I’ve dedicated myself to organizing impactful chess events, empowering young minds, and building platforms that spark real change across India.
                  </p>
                  <p>
                    From growing an Instagram presence to over 12 million views per month to taking local talent to national platforms, I’ve always believed that age should never limit ambition.
                  </p>
                  <p>
                    Along this journey, I’ve had the honor of meeting the Chief Minister, and receiving awards and recognition from the Sports Minister, MLAs, MPs, IAS and IPS officers, as well as esteemed organizations like CICASA, the CA Association, and CIRC.
                  </p>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <TrendingUp className="w-8 h-8 text-neon mb-4" />
                  <h4 className="text-white font-bold mb-2 uppercase tracking-tighter">Consistency</h4>
                  <p className="text-sm text-white/40">Building a community that reaches millions every single month.</p>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <Award className="w-8 h-8 text-neon mb-4" />
                  <h4 className="text-white font-bold mb-2 uppercase tracking-tighter">Recognition</h4>
                  <p className="text-sm text-white/40">Honored by state leaders and national professional bodies.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-neon/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-40 transition-opacity" />
                <div className="relative rounded-[40px] overflow-hidden border border-white/10 transform transition-transform group-hover:scale-[1.02] duration-700">
                  <img src="/amogh-2.jpeg" alt="Awards and Recognition" className="w-full h-auto" />
                </div>

                <div className="mt-8 glass p-8 rounded-[32px] border border-white/10">
                  <h3 className="text-white font-display font-black text-xl uppercase mb-4">Get In Touch</h3>
                  <a
                    href="mailto:featamogh@gmail.com"
                    className="flex items-center gap-4 text-white/60 hover:text-neon transition-colors mb-6 group"
                  >
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-neon/10 group-hover:text-neon transition-all">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Email Address</p>
                      <p className="text-sm font-bold">featamogh@gmail.com</p>
                    </div>
                  </a>
                  <a
                    href="https://www.facebook.com/share/p/1EM5MzvPei/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-white/60 hover:text-neon transition-colors group"
                  >
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-neon/10 group-hover:text-neon transition-all">
                      <Facebook className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Facebook</p>
                      <p className="text-sm font-bold">View Profile</p>
                    </div>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>




          {/* Founder - Mr. Vinesh Doultani Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mt-32 mb-16">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-neon/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-40 transition-opacity" />
                <div className="relative rounded-[40px] overflow-hidden border border-white/10 transform transition-transform group-hover:scale-[1.02] duration-700">
                  <img src="/abt-2.jpeg" alt="Mr. Vinesh Doultani" className="w-full h-auto" />
                </div>

                <div className="mt-8 glass p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
                  <p className="text-neon text-[10px] font-bold uppercase tracking-widest mb-1">Founder, Chess City Raipur</p>
                  <p className="text-white font-display text-xl font-black uppercase">Mr. Vinesh Doultani</p>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-8 bg-neon" />
                  <p className="text-neon text-[10px] font-bold uppercase tracking-[0.4em]">Visionary Leadership</p>
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase mb-8 leading-tight">
                  Mr. Vinesh <span className="text-neon">Doultani</span>
                </h2>

                <p className="text-xl text-white/80 font-body leading-relaxed mb-6 italic border-l-4 border-neon pl-6">
                  “Chess is not just a game; it is a platform to build confidence, character, and a sharper mind.”
                </p>

                <div className="space-y-6 text-white/60 font-body text-lg leading-relaxed">
                  <p>
                    Mr. Vinesh Doultani is one of the visionary founders of Chess City Raipur, dedicated to transforming the landscape of chess culture in Chhattisgarh and beyond. His journey in the world of chess promotion began in 2019, with a simple mission: to introduce chess to every corner of society and empower young minds through this intellectual sport.
                  </p>
                  <p>
                    Over the years, he has collaborated with numerous schools, universities, organizations, government bodies, and private institutions, successfully establishing chess as a powerful tool for learning, discipline, and strategic thinking.
                  </p>
                  <p>
                    Under his leadership, more than 2000+ students have been trained in chess through offline workshops, online sessions, camps, community classes, and structured programs. His efforts have not only created awareness but have helped build a strong and united chess ecosystem across the state.
                  </p>
                  <p>
                    He is also the driving force behind the formation of the Chhattisgarh Chess Community, a growing network of players, parents, trainers, and enthusiasts working together to uplift the sport at the grassroots level.
                  </p>
                  <p>
                    With the launch of Chess Times Foundation, Mr. Doultani aims to connect India, and eventually the world, through the universal language of chess. His vision is to create opportunities for every child, every student, and every aspiring player to learn, compete, and rise to greater heights.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>




          {/*new section */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mt-32 mb-16">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-neon/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-40 transition-opacity" />
                <div className="relative rounded-[40px] overflow-hidden border border-white/10 transform transition-transform group-hover:scale-[1.02] duration-700">
                  <img src="./public/images/adv.jpeg" alt="Adv. Ravi Rochlani" className="w-full h-auto" />
                </div>

                <div className="mt-8 glass p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
                  <p className="text-neon text-[10px] font-bold uppercase tracking-widest mb-1"></p>
                  <p className="text-white font-display text-xl font-black uppercase">Adv. Ravi Rochlani</p>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-8 bg-neon" />
                  <p className="text-neon text-[10px] font-bold uppercase tracking-[0.4em]">Chess Promoter, Organizer & Competitive Player</p>
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase mb-8 leading-tight">
                  Adv. Ravi <span className="text-neon">Rochlani</span>
                </h2>

                <p className="text-xl text-white/80 font-body leading-relaxed mb-6 italic border-l-4 border-neon pl-6">
                  “Chess is not just a game; it is a platform to build confidence, character, and a sharper mind.”
                </p>

                <div className="space-y-6 text-white/60 font-body text-lg leading-relaxed">
                  <p>
                    Driving force behind Chess City Raipur, organizing structured tournaments across Chhattisgarh.
                  </p>
                  <p>
                    Actively promotes chess at the grassroots level, focusing on accessibility and youth engagement.
                  </p>
                  <p>
                    Experienced competitive player with participation in FIDE-rated and national-level championships.
                  </p>
                  <p>
                    Visionary founder of the upcoming Chess Times Foundation to connect and grow the global chess community.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>









        </div>
      </main>

      <Footer />
    </div>
  )
}
