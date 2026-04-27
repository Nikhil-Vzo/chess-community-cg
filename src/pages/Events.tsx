import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabaseService } from '@/lib/supabaseService'
import type { ChessEvent } from '@/types'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/sections/Footer'
import { Calendar, MapPin, ArrowRight, Filter, Loader2, Info, Star } from 'lucide-react'

type TabType = 'upcoming' | 'ongoing' | 'past' | 'all'

export default function Events() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const typeParam = searchParams.get('type') // 'camp' or 'tournament'

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (tabParam === 'past') return 'past'
    if (tabParam === 'ongoing') return 'ongoing'
    return 'upcoming'
  })

  const [events, setEvents] = useState<ChessEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      setLoading(true)
      try {
        const data = await supabaseService.getEvents()
        setEvents(data)
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [])

  const filteredEvents = events.filter((event) => {
    // First filter by type if provided in URL (from Nav)
    if (typeParam && event.type !== typeParam) return false
    
    // Then filter by status tab
    if (activeTab === 'all') return true
    return event.status === activeTab
  })

  const tabs: { label: string; value: TabType }[] = [
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Past Events', value: 'past' },
    { label: 'All', value: 'all' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-neon animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <main className="pt-32 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-neon" />
              <p className="text-neon text-[10px] font-bold uppercase tracking-[0.4em]">
                {typeParam ? `${typeParam}s` : 'Events Hub'}
              </p>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black text-white uppercase mb-4 leading-none">
              {typeParam === 'camp' ? 'Chess Camps' : typeParam === 'tournament' ? 'Tournaments' : 'Camps & Events'}
            </h1>
            <p className="text-white/40 font-body max-w-xl leading-relaxed">
              Join the community. From high-intensity training camps to official FIDE rated tournaments in Chhattisgarh.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-12">
            <Filter className="w-4 h-4 text-white/20 mr-4" />
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-500 ${
                    activeTab === tab.value
                      ? 'bg-neon text-dark shadow-neon'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Summer Fiesta Banner (Always visible in all/upcoming) */}
          {(!activeTab || activeTab === 'all' || activeTab === 'upcoming') && (!typeParam || typeParam === 'tournament') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <Link 
                to="/summer-fiesta"
                className="group relative block overflow-hidden rounded-[40px] glass border border-neon/50 hover:border-neon transition-all duration-500"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,255,46,0.1),transparent_70%)]" />
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 blur-sm group-hover:scale-105 transition-transform duration-700">
                  <img src="/chess-fiesta.jpeg" alt="Summer Fiesta" className="w-full h-full object-cover" />
                </div>
                
                <div className="relative p-8 md:p-12 z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon/30 bg-neon/10 backdrop-blur-md mb-6">
                      <Star className="w-3 h-3 text-neon fill-neon" />
                      <span className="text-neon text-[10px] font-bold uppercase tracking-widest">Featured Event</span>
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl font-black uppercase text-white mb-4 group-hover:text-neon transition-colors">
                      Summer Fiesta Grand Chess Open
                    </h2>
                    <p className="font-body text-white/50 max-w-xl mb-8">
                      10th May 2026 @ Ambuja City Centre Mall. Total Cash Prize ₹1,00,000+! Registrations open now.
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-2 px-6 py-3 bg-neon text-dark font-body font-black text-xs uppercase tracking-widest rounded-xl">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Events Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (typeParam || 'all')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/events/${event.id}`}
                    className="group block glass rounded-[32px] overflow-hidden border border-white/10 hover:border-neon/50 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={event.thumbnail_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-full backdrop-blur-md border ${
                          event.type === 'camp'
                            ? 'bg-neon/20 text-neon border-neon/30'
                            : 'bg-white/20 text-white border-white/30'
                        }`}>
                          {event.type}
                        </span>
                        <span className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-full backdrop-blur-md border ${
                          event.status === 'upcoming'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : event.status === 'ongoing'
                            ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                            : 'bg-white/10 text-white/40 border-white/20'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex-grow flex flex-col">
                      <div className="flex items-center gap-6 text-white/30 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-neon" />
                          {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-neon" />
                          {event.location.split(',')[0]}
                        </span>
                      </div>

                      <h3 className="font-display text-2xl font-black text-white uppercase mb-4 leading-none group-hover:text-neon transition-colors">
                        {event.title}
                      </h3>

                      <p className="text-white/40 font-body text-sm mb-8 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mb-1">Entry Fee</p>
                          <span className="text-white font-display font-black text-xl">
                            ₹{event.entryFee.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-neon group-hover:text-dark transition-all duration-500">
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredEvents.length === 0 && (
            <div className="text-center py-32 glass rounded-[40px] border border-dashed border-white/10">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Info className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="font-display text-xl font-bold text-white uppercase mb-2">No matches found</h3>
              <p className="text-white/30 font-body text-sm">We couldn't find any {typeParam || 'events'} in the {activeTab} category.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
