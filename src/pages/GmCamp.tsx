import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Target,
  Users,
  MessageSquare,
  ChevronRight,
  Star,
  ShieldCheck,
  ArrowRight,
  Phone,
  Zap,
  Download,
  Crown,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

/* ─── Countdown Timer ────────────────────────────────────────────────────── */
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const calc = () => {
    const dist = new Date(targetDate).getTime() - Date.now();
    if (dist <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(dist / 86400000),
      hours: Math.floor((dist % 86400000) / 3600000),
      minutes: Math.floor((dist % 3600000) / 60000),
      seconds: Math.floor((dist % 60000) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div className="flex gap-2 sm:gap-4 font-display">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <div className="bg-neon/10 border border-neon/30 rounded-xl px-3 py-2 sm:px-5 sm:py-3 text-neon text-2xl sm:text-4xl font-black min-w-[52px] sm:min-w-[80px] text-center">
            {String(value).padStart(2, '0')}
          </div>
          <span className="text-[9px] sm:text-[11px] uppercase text-neon/50 mt-1.5 tracking-widest font-bold">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─── Camp Info ───────────────────────────────────────────────────────────── */
const CAMP_INFO = {
  whatsappLink: 'https://chat.whatsapp.com/Fukp03qgtHMA3TtbksbIHt',
  earlyBirdDeadline: '2026-05-12T23:59:59', // Based on "Early Bird Offer Till 12 May 2026"
  brochure: '/new-bro-camp.png',
  contacts: [
    { name: 'Mr. Vinesh Doultani', phone: '7869925072' },
    { name: 'Mr. Amogh', phone: '7747043221' },
    { name: 'Mr. Anand Roy', phone: '6268106780' },
  ],
  topics: [
    { title: 'How To Analyze', desc: 'Learn the structured thinking process of a Grandmaster during game analysis.', icon: <Search className="w-6 h-6" />, color: 'bg-blue-500' },
    { title: 'Grandmaster Vision', desc: 'Develop the tactical and positional awareness that separates the elite.', icon: <Target className="w-6 h-6" />, color: 'bg-purple-500' },
    { title: 'Strategic Approach', desc: 'Master the high-level decision making and planning techniques of a GM.', icon: <Zap className="w-6 h-6" />, color: 'bg-neon' },
    { title: 'Positional Mastery', desc: 'Deep dive into complex structures and positional nuances.', icon: <ShieldCheck className="w-6 h-6" />, color: 'bg-emerald-500' },
    { title: 'Endgame Precision', desc: 'Technical endgame skills required to convert small advantages.', icon: <Trophy className="w-6 h-6" />, color: 'bg-orange-500' },
    { title: 'Elite Psychology', desc: 'Manage pressure and maintain focus like a Grandmaster.', icon: <Users className="w-6 h-6" />, color: 'bg-red-500' },
  ],
};

/* ─── Bento Card ──────────────────────────────────────────────────────────── */
const BentoCard = ({ topic, i }: { topic: any; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.08 }}
    className={`relative group h-[260px] sm:h-[300px] overflow-hidden rounded-[28px] bg-white/5 border border-white/10 p-7 flex flex-col justify-between hover:border-neon/40 transition-all duration-500 ${i === 0 ? 'md:col-span-2' : ''} ${i === 4 ? 'md:col-span-2' : ''}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-neon/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 bg-white/5 border border-white/10 group-hover:bg-neon group-hover:text-dark transition-all duration-500 text-white">
        {topic.icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tighter mb-2 group-hover:text-neon transition-colors">
        {topic.title}
      </h3>
      <p className="text-white/40 font-body text-sm leading-relaxed">{topic.desc}</p>
    </div>
    <div className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neon/40 group-hover:text-neon transition-colors">
      <span>Deep Dive Session</span>
      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
    </div>
  </motion.div>
);

/* ─── Page ────────────────────────────────────────────────────────────────── */
const GmCamp = () => {
  return (
    <div className="min-h-screen bg-dark text-white selection:bg-neon selection:text-dark">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-28 pb-16 relative overflow-hidden min-h-screen flex items-center">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_0%,rgba(200,255,46,0.12),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_80%,rgba(59,130,246,0.06),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            {/* Left — Text */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 border border-neon/30 text-neon text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                <Crown className="w-4 h-4" />
                May 17th – June 17th • Live Online
              </div>

              <h1 className="font-display text-5xl sm:text-7xl lg:text-[90px] font-black leading-[0.9] mb-8 uppercase tracking-tighter">
                ANALYZE LIKE<br />A GRAND<br />
                <span className="text-neon">MASTER</span>
              </h1>

              <p className="text-base sm:text-lg text-white/55 font-body leading-relaxed max-w-lg mb-10">
                Join{' '}
                <span className="text-white font-bold italic underline decoration-neon/40 underline-offset-4">
                  GM ThejKumar Sir
                </span>{' '}
                for an intensive 10-class masterclass. Master the vision, approach, and analytical depth of India's 50th Grandmaster.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href={CAMP_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-neon text-dark rounded-2xl font-display text-base font-black uppercase tracking-tighter hover:bg-white hover:shadow-[0_0_50px_rgba(200,255,46,0.3)] transition-all duration-500 group"
                >
                  <MessageSquare className="w-5 h-5" />
                  Join WhatsApp to Pay & Register
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <button
                  onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-display text-base font-black uppercase tracking-tighter hover:bg-white/10 transition-all backdrop-blur-md"
                >
                  View Curriculum
                </button>
              </div>

              {/* Brochure download */}
              <a
                href={CAMP_INFO.brochure}
                download="GM-Camp-Brochure.jpeg"
                className="inline-flex items-center gap-2 mt-5 text-white/30 hover:text-neon text-xs font-bold uppercase tracking-widest transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Brochure
              </a>
            </motion.div>

            {/* Right — GM Photo Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              {/* Glow blobs */}
              <div className="absolute -top-16 -left-16 w-72 h-72 bg-neon/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

              {/* Card */}
              <div className="relative w-full max-w-sm lg:max-w-full overflow-hidden rounded-[40px] group">
                {/* Image */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/1/11/Sriram_Jha_19th_Bangkok_Chess_Club_Open.jpg"
                  alt="GM Sriram Jha"
                  className="w-full aspect-[4/5] object-cover object-top grayscale group-hover:grayscale-0 brightness-90 group-hover:brightness-100 scale-105 group-hover:scale-100 transition-all duration-1000"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Name tag */}
                <div className="absolute bottom-8 left-8 right-8 z-10">
                  <p className="text-neon font-display text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-none mb-1">
                    GM ThejKumar Sir
                  </p>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
                    Peak Elo 2501 · India's 50th GM
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Coach's Achievements ── */}
      <section className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter mb-8">
                Coach's <span className="text-neon">Achievements</span>
              </h2>
              <div className="space-y-4">
                {[
                  'First Grandmaster From Karnataka',
                  "India's 50th Grandmaster (2017)",
                  'Winner Of National U-25 Championship (2003)',
                  'Winner Of Indian National B Championship (2013)',
                  'Champion Of Liffre Open, France (2016)',
                  'Winner Of Guingamp Open (2017)',
                ].map((ach, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-6 h-6 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-neon group-hover:text-dark transition-all">
                      <Star className="w-3 h-3" />
                    </div>
                    <p className="text-white/60 font-body text-sm sm:text-base leading-relaxed group-hover:text-white transition-colors">
                      {ach}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10 text-white/40 italic font-body text-sm leading-relaxed">
                "Known For Strong Positional And Strategic Gameplay. Inspiring Journey Through Dedication, Self-learning & Perseverance."
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                "https://upload.wikimedia.org/wikipedia/commons/1/11/Sriram_Jha_19th_Bangkok_Chess_Club_Open.jpg",
                "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800",
              ].map((img, i) => (
                <div key={i} className={`rounded-3xl overflow-hidden border border-white/10 ${i === 1 ? 'mt-8' : 'mb-8'}`}>
                  <img src={img} alt="Achievement" className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <section className="py-10 bg-white/[0.02] border-y border-white/5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex gap-16 items-center mx-10">
              <span className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white/10 uppercase italic">10 Live Classes</span>
              <div className="w-3 h-3 rounded-full bg-neon/30 flex-shrink-0" />
              <span className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-neon uppercase italic tracking-tighter">Peak Elo 2501</span>
              <div className="w-3 h-3 rounded-full bg-neon/30 flex-shrink-0" />
              <span className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white/10 uppercase italic">Analyze Like A GM</span>
              <div className="w-3 h-3 rounded-full bg-neon/30 flex-shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Early Bird / Registration ── */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-neon/5 -skew-y-3 translate-y-24 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="bg-[#111] rounded-[32px] sm:rounded-[48px] p-6 sm:p-12 md:p-16 border border-neon/15 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Zap className="w-32 h-32 text-neon" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-neon text-dark font-black text-[10px] uppercase tracking-widest mb-6">
                  Phase 1 Registration
                </div>
                <h2 className="font-display text-4xl sm:text-6xl font-black text-white leading-none mb-8 uppercase tracking-tighter">
                  SECURE YOUR <br />
                  <span className="text-neon">ADVANTAGE</span>
                </h2>
                <div className="space-y-4 mb-10">
                  {[
                    '10 Intensive GM Live Sessions',
                    'How To Analyze Like A Grand Master',
                    'Vision & Approach Of A GM',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-neon/20 flex items-center justify-center flex-shrink-0">
                        <Star className="w-2.5 h-2.5 text-neon fill-neon" />
                      </div>
                      <span className="text-white/60 font-body text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4 w-full">
                  <a
                    href={CAMP_INFO.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-neon text-dark font-display text-xl font-black uppercase tracking-tighter rounded-[28px] hover:shadow-[0_0_60px_rgba(200,255,46,0.3)] transition-all group"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Join Group to Register
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <p className="text-[12px] font-bold text-neon uppercase tracking-[0.25em] text-center bg-neon/5 py-3 rounded-xl border border-neon/20">
                    Registration &amp; payment link will be shared in the WhatsApp group
                  </p>
                </div>
              </div>

              {/* Right — Countdown */}
              <div className="flex flex-col items-center justify-center p-6 sm:p-10 rounded-[28px] bg-white/5 border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6 text-center">
                  Early Bird Offer Ends In
                </p>
                <CountdownTimer targetDate={CAMP_INFO.earlyBirdDeadline} />
                <div className="mt-10 pt-8 border-t border-white/10 w-full text-center">
                  <p className="text-white font-display text-5xl sm:text-6xl font-black leading-none mb-2 tracking-tighter italic">
                    ₹1,000 <span className="text-neon">OFF</span>
                  </p>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">
                    Valid Until 12th May Only
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Curriculum ── */}
      <section id="curriculum" className="py-24 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl sm:text-6xl md:text-8xl font-black leading-none mb-4 uppercase tracking-tighter">
                THE <span className="text-neon">STRATEGY</span> <br />ENGINE
              </h2>
              <p className="text-white/40 text-base sm:text-lg font-body leading-relaxed">
                We don't just teach moves. We teach you how to think like a Grandmaster.
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-neon font-display text-6xl sm:text-8xl font-black leading-none italic opacity-10">06</div>
              <div className="text-white/30 text-xs font-black uppercase tracking-widest mt-1">Core Modules</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {CAMP_INFO.topics.map((topic, i) => (
              <BentoCard key={i} topic={topic} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA ── */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[36px] p-[1px] bg-gradient-to-r from-neon/50 via-white/5 to-neon/50"
          >
            <div className="bg-dark rounded-[35px] p-6 sm:p-10 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(200,255,46,0.08),transparent_60%)] pointer-events-none" />

              <div className="relative z-10 flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/30 text-neon text-[10px] font-black uppercase tracking-widest mb-5">
                  <ShieldCheck className="w-3 h-3" />
                  Mandatory For All Participants
                </div>
                <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                  JOIN THE <span className="text-neon">OFFICIAL</span> <br />COMMUNITY GROUP
                </h2>
                <p className="text-white/40 font-body max-w-xl leading-relaxed text-sm">
                  Session links, daily updates, and recorded lectures will be shared exclusively in this group. You must be a member to attend.
                </p>
              </div>

              <div className="relative z-10 w-full lg:w-auto">
                <a
                  href={CAMP_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full lg:w-auto inline-flex items-center justify-center gap-4 px-10 py-6 bg-neon text-dark rounded-[28px] font-display text-2xl font-black uppercase tracking-tighter hover:bg-white hover:shadow-[0_0_60px_rgba(200,255,46,0.3)] transition-all duration-500 group"
                >
                  <MessageSquare className="w-7 h-7 group-hover:scale-110 transition-transform" />
                  JOIN GROUP
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer / Contacts ── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter mb-4">
                Need Assistance?
              </h2>
              <p className="text-white/40 max-w-md font-body leading-relaxed mb-6 text-sm">
                For queries on curriculum, payment, or eligibility, get in touch with our camp coordinators.
              </p>
              <div className="flex gap-3">
                <a
                  href={CAMP_INFO.whatsappLink}
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-neon hover:text-dark transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/chesscityraipur"
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-neon hover:text-dark transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {CAMP_INFO.contacts.map((c, i) => (
              <div key={i} className="group">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">{c.name}</p>
                <a
                  href={`tel:${c.phone}`}
                  className="flex items-center gap-3 text-2xl font-display font-black text-white group-hover:text-neon transition-colors tracking-tighter"
                >
                  <Phone className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:animate-pulse" />
                  {c.phone}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/20 text-xs font-black uppercase tracking-widest">
              © 2024 Indian Chess Community. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              <a href="#" className="hover:text-neon transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-neon transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GmCamp;
