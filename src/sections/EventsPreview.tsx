import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
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
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/events/${event.id}`}
        className="block glass rounded-3xl overflow-hidden border border-white/10 hover:border-neon/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
      >
        {/* Image - NO hover zoom animation */}
        <div className="relative h-48 overflow-hidden bg-black/20">
          <img
            src={event.thumbnail_url}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
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
          <div className="flex items-center gap-4 text-white/60 text-[10px] font-bold uppercase tracking-widest mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-neon" aria-hidden="true" />
              {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-neon" aria-hidden="true" />
              {event.location?.split(',')[0] || 'TBA'}
            </span>
          </div>

          <h3 className="font-display text-xl font-black text-white uppercase mb-4 group-hover:text-neon transition-colors leading-tight">
            {event.title}
          </h3>

          {/* Download Brochure for Summer Fiesta (if encountered in card list) */}
          {(event.id === 'summer-fiesta' || event.title.includes('Summer Fiesta')) && (
            <div className="mb-6">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const link = document.createElement('a');
                  link.href = '/brochure.jpeg';
                  link.download = 'Summer_Fiesta_Brochure.jpeg';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-neon/30 bg-neon/10 text-neon font-body font-bold text-[10px] uppercase tracking-widest rounded-lg hover:bg-neon hover:text-dark transition-all duration-300"
              >
                <Download className="w-3 h-3" aria-hidden="true" />
                Download Brochure
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-white font-display font-black text-lg flex items-baseline gap-1">
              ₹{event.entryFee?.toLocaleString() || '0'}
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">incl. Convenience Fee</span>
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-white/50 group-hover:text-neon transition-colors uppercase tracking-widest">
              Details
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function EventsPreview() {
  const [events, setEvents] = useState<ChessEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const all = await supabaseService.getEvents()
        // Filter out Summer Fiesta from the card grid since it's displayed as a featured banner above
        const filtered = all.filter(e => e.id !== 'summer-fiesta' && !e.title.includes('Summer Fiesta') && e.status !== 'past')
        setEvents(filtered.slice(0, 3))
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
    <section className="bg-dark py-24 md:py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            className="flex items-center gap-3 mb-4 justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="h-px w-8 bg-neon" aria-hidden="true" />
            <p className="text-neon text-[10px] font-bold uppercase tracking-[0.4em]">Compete & Learn</p>
            <div className="h-px w-8 bg-neon" aria-hidden="true" />
          </motion.div>

          <motion.h2
            className="font-display text-5xl md:text-7xl font-black text-white uppercase leading-none mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Events & Camps
          </motion.h2>

          <motion.p
            className="text-white/40 font-body max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Take part in official Chhattisgarh state tournaments, join grandmaster training bootcamps, and accelerate your path to chess mastery.
          </motion.p>
        </div>

        {/* Featured Summer Fiesta Pin */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Link 
            href="/summer-fiesta"
            className="group relative block overflow-hidden rounded-[32px] glass border border-neon/30 bg-neon/5 hover:border-neon/60 hover:bg-neon/[0.08] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,255,46,0.06),transparent_70%)]" aria-hidden="true" />
            <div className="absolute right-0 top-0 w-full md:w-1/2 h-full opacity-15 md:opacity-20 transition-all duration-500">
              <img src="/chess-fiesta.jpeg" alt="Summer Fiesta Banner" className="w-full h-full object-cover" />
            </div>
            
            <div className="relative p-8 md:p-12 z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon/30 bg-neon/10 backdrop-blur-md mb-6">
                  <Star className="w-3 h-3 text-neon fill-neon" aria-hidden="true" />
                  <span className="text-neon text-[10px] font-bold uppercase tracking-widest">Featured Event</span>
                </div>
                <h3 className="font-display text-3xl md:text-5xl font-black uppercase text-white mb-4 group-hover:text-neon transition-colors">
                  Summer Fiesta Grand Chess Open
                </h3>
                <p className="font-body text-white/60 max-w-xl mb-8 leading-relaxed">
                  9th May 2026 @ Ambuja City Centre Mall. Total Cash Prize ₹1,00,000+! Chhattisgarh's premier competitive arena is open for registrations.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const link = document.createElement('a');
                      link.href = '/brochure.jpeg';
                      link.download = 'Summer_Fiesta_Brochure.jpeg';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-neon hover:bg-neon/10 text-white hover:text-neon font-body font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    Download Brochure
                  </button>
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-neon text-dark font-body font-black text-xs uppercase tracking-[0.2em] rounded-xl group-hover:shadow-[0_0_20px_rgba(200,255,46,0.3)] transition-all">
                    Register Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Supporting Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12 border border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
            <p className="text-white/40 font-body text-xs uppercase tracking-widest">More state programs coming soon</p>
          </div>
        )}

        {/* Unified View All CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 text-white/60 font-body font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-dark hover:border-white transition-all duration-300 active:scale-95"
          >
            View All Events & Camps
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
