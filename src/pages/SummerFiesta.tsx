import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabaseService } from '@/lib/supabaseService'
import type { ChessEvent } from '@/types'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/sections/Footer'
import { Calendar, MapPin, Clock, Trophy, ArrowRight, Shield, Star, Users, Phone, Loader2, IndianRupee } from 'lucide-react'

const FIESTA_DATA = {
  event: {
    name: "Summer Fiesta Grand Chess Open",
    presented_by: "Ambuja Mall & Team Chess City Raipur",
    organized_by: "Team Chess City Raipur",
    association: "Hangout The Food Court",
    venue_partner: "Ambuja Mall, Raipur",
    venue: "Ambuja City Centre Mall, Raipur",
    date: "10 May 2026",
    time: {
      start: "09:00 AM",
      end: "06:00 PM",
      reporting_time: "08:30 AM"
    },
    time_control: "15+5",
    rounds: "7/8 Rounds"
  },
  registration: {
    last_date: "06 May 2026",
    whatsapp_group: "https://chat.whatsapp.com/L16X7Ak3F2b2DxTQ6HAkGA",
    payment: {
      upi_number: "8871549125",
      methods: ["PhonePe", "Paytm", "Google Pay"]
    },
    contact: {
      primary: { name: "Mr. Amogh Yadav", phone: "8871549125" },
      alternate_numbers: ["7747043221"]
    }
  },
  prize_pool: {
    total_cash: "100,000+",
    categories: {
      open: [
        { position: "1st", prize: 11000, extra: "Trophy" },
        { position: "2nd", prize: 7000, extra: "Trophy" },
        { position: "3rd", prize: 4000, extra: "Trophy" },
        { position: "4th", prize: 3000, extra: "Trophy" },
        { position: "5th", prize: 2000, extra: "Trophy" },
        { position: "6th-10th", prize: 1000, extra: "Trophy" },
      ],
      below_1700: [
        { position: "1st", prize: 11000, extra: "Trophy" },
        { position: "2nd", prize: 7000, extra: "Trophy" },
        { position: "3rd", prize: 4000, extra: "Trophy" },
        { position: "4th", prize: 3000, extra: "Trophy" },
        { position: "5th", prize: 2000, extra: "Trophy" },
        { position: "6th-10th", prize: 1000, extra: "Trophy" },
      ],
      unrated: [
        { position: "1st", prize: 9000, extra: "Trophy" },
        { position: "2nd", prize: 5000, extra: "Trophy" },
        { position: "3rd", prize: 3000, extra: "Trophy" },
        { position: "4th", prize: 1000, extra: "Trophy" },
        { position: "5th", prize: 1000, extra: "Trophy" },
        { position: "6th-10th", prize: 1000, extra: "Trophy" },
      ]
    },
    special_prizes: [
      "Best Raipur",
      "Best Female",
      "Youngest Player",
      "Best Player U-07",
      "Best Player U-09",
      "Best Player U-11",
      "Best Player U-13"
    ]
  },
  facilities: [
    "AC Venue",
    "Parking Facility",
    "Parents Sitting Facility",
    "Food Facility at Mall",
    "Movie Facility for Parents",
    "Shopping Facility"
  ],
  officials: [
    { role: "Event Organiser", name: "Mr. Amogh Yadav", phone: "8871549125" },
    { role: "Tournament Director", name: "Mr. Vinesh Dhultani", phone: "7869952072" },
    { role: "Tournament Director", name: "Adv. Ravi Rochlani", phone: "9343970024" },
    { role: "Chief Arbiter", name: "FA Shubham Soni" },
    { role: "Deputy Chief Arbiter", name: "SNA Alok Singh Kshatriya" },
    { role: "Arbiter", name: "SNA Rohit Rajak" }
  ],
  technical_support: [
    "SNA Vedansh Tiwari",
    "SNA Rakesh",
    "Miss Kiran Bisen",
    "Aditya Singh Rajput"
  ]
}

export default function SummerFiesta() {
  const navigate = useNavigate()
  const [dbEvent, setDbEvent] = useState<ChessEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'open' | 'below_1700' | 'unrated'>('open')

  useEffect(() => {
    async function loadEvent() {
      try {
        const allEvents = await supabaseService.getEvents()
        const fiesta = allEvents.find(e => e.title === FIESTA_DATA.event.name)
        if (fiesta) {
          setDbEvent(fiesta)
        }
      } catch (err) {
        console.error('Error fetching fiesta event:', err)
      } finally {
        setLoading(false)
      }
    }
    loadEvent()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-neon animate-spin" />
      </div>
    )
  }

  const entryFee = dbEvent?.entryFee || 900
  const eventDate = dbEvent?.date
    ? new Date(dbEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : FIESTA_DATA.event.date
  const eventVenue = dbEvent?.location || FIESTA_DATA.event.venue
  const eventStatus = dbEvent?.status || 'upcoming'

  // DB metadata overrides — all prize/official data comes from DB if available
  const meta: any = dbEvent ? (dbEvent as any).metadata : undefined
  const prizePool = meta?.prize_pool || FIESTA_DATA.prize_pool
  const facilities = meta?.facilities || FIESTA_DATA.facilities
  const officials = meta?.officials || FIESTA_DATA.officials
  const timeControl = meta?.time_control || FIESTA_DATA.event.time_control
  const reportingTime = meta?.reporting_time || FIESTA_DATA.event.time.reporting_time
  const startTime = meta?.start_time || FIESTA_DATA.event.time.start
  const rounds = meta?.rounds || FIESTA_DATA.event.rounds
  const whatsappGroup = meta?.whatsapp_group || FIESTA_DATA.registration.whatsapp_group
  const totalCash = prizePool?.total_cash || FIESTA_DATA.prize_pool.total_cash
  const prizeCategories = prizePool?.categories || FIESTA_DATA.prize_pool.categories
  const specialPrizes = prizePool?.special_prizes || FIESTA_DATA.prize_pool.special_prizes

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-neon selection:text-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,255,46,0.15),transparent_70%)]" />
          <img
            src="/chess-fiesta.jpeg"
            alt="Summer Fiesta Brochure Background"
            className="w-full h-full object-cover opacity-10 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon/30 bg-neon/10 backdrop-blur-md mb-8">
                <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                <span className="text-neon text-[10px] font-bold uppercase tracking-widest">Featured Tournament</span>
              </div>

              <h1 className="font-display text-5xl md:text-7xl font-black uppercase leading-[1.1] mb-6">
                <span className="block text-white/50 text-2xl md:text-3xl mb-2">{FIESTA_DATA.event.presented_by}</span>
                Summer Fiesta<br />
                <span className="text-neon">Grand Chess Open</span>
              </h1>

              <div className="flex flex-wrap gap-6 mb-10 text-sm font-body">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-neon" />
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">Date</p>
                    <p className="font-bold">{eventDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-neon" />
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">Venue</p>
                    <p className="font-bold">{eventVenue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <IndianRupee className="w-4 h-4 text-neon" />
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">Entry Fee</p>
                    <p className="font-bold text-neon">₹{entryFee}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate(`/register/${dbEvent ? dbEvent.id : 'summer-fiesta'}`)}
                  className={`px-8 py-4 font-body font-black text-sm uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-3 group ${eventStatus === 'past'
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-neon text-dark hover:bg-white'
                    }`}
                  disabled={eventStatus === 'past'}
                >
                  {eventStatus === 'past' ? 'Registrations Closed' : 'Register Now'}
                  {eventStatus !== 'past' && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
                <a
                  href={whatsappGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border border-white/20 hover:border-white text-white font-body font-bold text-sm uppercase tracking-widest rounded-xl backdrop-blur-md transition-all duration-300 flex items-center gap-3"
                >
                  Join WhatsApp Group
                </a>
              </div>
            </motion.div>

            {/* Brochure Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative perspective-grid"
            >
              <div className="absolute inset-0 bg-neon/20 blur-3xl rounded-[40px] -z-10 animate-pulse-glow" />
              <img
                src="https://img.freepik.com/free-photo/digital-art-style-abstract-chess-pieces_23-2151476080.jpg?semt=ais_hybrid&w=740&q=80"
                alt="Brochure"
                className="w-full h-auto rounded-[32px] border-2 border-white/10 shadow-2xl shadow-neon/10 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Prize Structure Section */}
      <section className="py-24 bg-dark relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-6xl font-black uppercase mb-4">
              Prize <span className="text-neon">Structure</span>
            </h2>
            <div className="inline-flex items-center gap-4 px-8 py-4 glass rounded-2xl border-neon/30">
              <Trophy className="w-8 h-8 text-neon" />
              <div>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest text-left">Total Cash Prize & Trophies</p>
                <p className="font-display text-4xl font-black text-white">₹{totalCash}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tabs for Mobile/Desktop */}
            <div className="lg:col-span-3 flex justify-center gap-2 mb-8">
              {(['open', 'below_1700', 'unrated'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-bold uppercase tracking-widest text-xs rounded-xl transition-all duration-300 ${activeTab === tab ? 'bg-neon text-dark' : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="lg:col-span-3 glass rounded-[32px] p-8 md:p-12 overflow-hidden border border-white/10 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4"
                >
                  {(prizeCategories[activeTab] || []).map((prize: { position: string; prize: number; extra: string }, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="w-12 font-display text-2xl font-black text-white/30">{prize.position}</span>
                        <Trophy className={`w-5 h-5 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-neon'}`} />
                      </div>
                      <div className="text-right">
                        <span className="block font-display text-2xl font-black text-white">₹{prize.prize.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">+ {prize.extra}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Special Prizes */}
              <div className="mt-12 pt-12 border-t border-white/10">
                <h3 className="font-display text-2xl font-black uppercase text-center mb-8 text-white/50">Special Categories</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {specialPrizes.map((prize: string, i: number) => (
                    <span key={i} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 font-bold text-xs uppercase tracking-widest text-neon">
                      {prize}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Schedule */}
            <div className="glass rounded-[32px] p-8 border border-white/10 hover:border-neon/30 transition-colors">
              <Clock className="w-8 h-8 text-neon mb-6" />
              <h3 className="font-display text-xl font-black uppercase mb-6 text-white/80">Schedule</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-sm font-bold text-white/50">Reporting</span>
                  <span className="text-sm font-black">{reportingTime}</span>
                </li>
                <li className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-sm font-bold text-white/50">Start Time</span>
                  <span className="text-sm font-black">{startTime}</span>
                </li>
                <li className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-sm font-bold text-white/50">Rounds</span>
                  <span className="text-sm font-black">{rounds}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white/50">Time Control</span>
                  <span className="text-sm font-black text-neon">{timeControl}</span>
                </li>
              </ul>
            </div>

            {/* Facilities */}
            <div className="glass rounded-[32px] p-8 border border-white/10 hover:border-neon/30 transition-colors">
              <Star className="w-8 h-8 text-neon mb-6" />
              <h3 className="font-display text-xl font-black uppercase mb-6 text-white/80">Facilities</h3>
              <ul className="space-y-3">
                {facilities.map((fac: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/70">
                    <Shield className="w-4 h-4 text-neon/50" />
                    {fac}
                  </li>
                ))}
              </ul>
            </div>

            {/* Officials */}
            <div className="glass rounded-[32px] p-8 border border-white/10 hover:border-neon/30 transition-colors md:col-span-2 lg:col-span-2">
              <Users className="w-8 h-8 text-neon mb-6" />
              <h3 className="font-display text-xl font-black uppercase mb-6 text-white/80">Officials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {officials.map((official: { role: string; name: string; phone?: string }, i: number) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-neon uppercase tracking-widest mb-1">{official.role}</p>
                    <p className="font-bold text-white mb-1">{official.name}</p>
                    {official.phone && (
                      <p className="text-xs text-white/50 font-bold flex items-center gap-2">
                        <Phone className="w-3 h-3" /> {official.phone}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
