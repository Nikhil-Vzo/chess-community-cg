import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { supabaseService } from '@/lib/supabaseService'
import type { ChessEvent } from '@/types'
import { Calendar, MapPin, ArrowRight, Loader2, Star, Download } from 'lucide-react'

function EventCard({ event }: { event: ChessEvent }) {
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link
        to={`/events/${event.id}`}
        className="block glass rounded-3xl overflow-hidden border border-white/10 hover:border-neon/30 transition-all duration-500 hover:-translate-y-2"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.thumbnail_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-full backdrop-blur-md border ${
              event.type === 'camp'
                ? 'bg-neon/20 text-neon border-neon/30'
                : 'bg-white/20 text-white border-white/20'
            }`}>
              {event.type}
            </span>
            <span className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-full backdrop-blur-md border ${
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
        <div className="p-6">
          <div className="flex items-center gap-4 text-white/30 text-[10px] font-bold uppercase tracking-widest mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-neon" />
              {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-neon" />
              {event.location?.split(',')[0] || 'TBA'}
            </span>
          </div>

          <h3 className="font-display text-xl font-black text-white uppercase mb-4 group-hover:text-neon transition-colors leading-tight">
            {event.title}
          </h3>

          {/* Download Brochure for Summer Fiesta */}
          {(event.id === 'summer-fiesta' || event.title.includes('Summer Fiesta')) && (
            <div className="mb-6">
              <a 
                href="/brochure.jpeg"
                download="Summer_Fiesta_Brochure.jpeg"
                className="inline-flex items-center gap-2 px-4 py-2 border border-neon/30 bg-neon/10 text-neon font-body font-bold text-[10px] uppercase tracking-widest rounded-lg hover:bg-neon hover:text-dark transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="w-3 h-3" />
                Download Brochure
              </a>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-white font-display font-black text-lg flex items-baseline gap-1">
              ₹{event.entryFee?.toLocaleString() || '0'}
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">+ Service Tax</span>
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-white/30 group-hover:text-neon transition-colors uppercase tracking-widest">
              Details
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function EventsPreview() {
  const [camps, setCamps] = useState<ChessEvent[]>([])
  const [tournaments, setTournaments] = useState<ChessEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const all = await supabaseService.getEvents()
        setCamps(all.filter(e => e.type === 'camp' && e.status !== 'past').slice(0, 3))
        setTournaments(all.filter(e => e.type === 'tournament' && e.status !== 'past').slice(0, 3))
      } catch (err) {
        console.error('Error loading events preview:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <section className="bg-dark py-32 px-6 flex justify-center">
        <Loader2 className="w-10 h-10 text-neon animate-spin" />
      </section>
    )
  }

  return (
    <section className="bg-dark py-32 md:py-40 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Upcoming Live Programs Section */}
        {camps.length > 0 && (
          <div className="mb-32">
            <motion.div
              className="flex items-center gap-3 mb-4 justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="h-px w-8 bg-neon" />
              <p className="text-neon text-[10px] font-bold uppercase tracking-[0.4em]">Join Our Camps</p>
              <div className="h-px w-8 bg-neon" />
            </motion.div>

            <motion.h2
              className="font-display text-5xl md:text-7xl font-black text-white uppercase text-center mb-16 leading-none"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Upcoming Programs
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {camps.map((camp) => (
                <EventCard key={camp.id} event={camp} />
              ))}
            </div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link
                to="/events?tab=camps"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-neon text-neon font-body font-bold text-xs uppercase tracking-widest rounded-full hover:bg-neon hover:text-dark transition-all duration-300"
              >
                View All Programs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        )}

        {/* Live Tournaments Section (Always show because of Summer Fiesta) */}
        <div>
            <motion.div
              className="flex items-center gap-3 mb-4 justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="h-px w-8 bg-white/20" />
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.4em]">Compete & Win</p>
              <div className="h-px w-8 bg-white/20" />
            </motion.div>

            <motion.h2
              className="font-display text-5xl md:text-7xl font-black text-white uppercase text-center mb-16 leading-none"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Live Tournaments
            </motion.h2>

            {/* Featured Summer Fiesta Pin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
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
                    <h3 className="font-display text-3xl md:text-5xl font-black uppercase text-white mb-4 group-hover:text-neon transition-colors">
                      Summer Fiesta Grand Chess Open
                    </h3>
                    <p className="font-body text-white/50 max-w-xl mb-8">
                      9th May 2026 @ Ambuja City Centre Mall. Total Cash Prize ₹1,00,000+! Registrations open now.
                    </p>
                    <div className="flex items-center gap-4">
                      <a 
                        href="/brochure.jpeg"
                        download="Summer_Fiesta_Brochure.jpeg"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-white text-white font-body font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="w-4 h-4" />
                        Download Brochure
                      </a>
                      <span className="inline-flex items-center gap-2 px-6 py-3 bg-neon text-dark font-body font-black text-xs uppercase tracking-widest rounded-xl">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tournaments.map((tournament) => (
                <EventCard key={tournament.id} event={tournament} />
              ))}
            </div>

            {tournaments.length === 0 && (
              <div className="text-center py-10">
                <p className="text-white/20 font-body text-sm uppercase tracking-widest">More tournaments coming soon...</p>
              </div>
            )}

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link
                to="/events?tab=tournaments"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/30 text-white/50 font-body font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white hover:text-dark transition-all duration-300"
              >
                View All Tournaments
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
      </div>
    </section>
  )
}
