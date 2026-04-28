import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { events } from '@/data/mockData'
import { supabaseService } from '@/lib/supabaseService'
import type { ChessEvent } from '@/types'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/sections/Footer'
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Trophy,
  FileText,
  CheckCircle,
  Loader2,
} from 'lucide-react'

export default function EventDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [dbEvent, setDbEvent] = useState<ChessEvent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!id) return
      try {
        const data = await supabaseService.getEventById(id)
        setDbEvent(data)
      } catch {
        // Fall back to mockData
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // Use DB event first, then fall back to mockData
  const mockEvent = events.find((e) => e.id === id)
  const event = (dbEvent || mockEvent) as ChessEvent | undefined

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-neon animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-white mb-4">Event Not Found</h1>
          <Link to="/events" className="text-neon font-body hover:underline">
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const handleRegister = () => {
    navigate(`/register/${event.id}`)
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <main className="pt-24 pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-white/50 hover:text-neon transition-colors font-body text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img
              src={event.image || event.thumbnail_url || '/chess-fiesta.jpeg'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
            <div className="absolute bottom-6 left-6 flex gap-2">
              <span className={`px-4 py-1.5 text-sm font-body font-bold uppercase tracking-wider rounded-full ${
                event.type === 'camp' ? 'bg-neon text-dark' : 'bg-white text-dark'
              }`}>
                {event.type}
              </span>
              <span className={`px-4 py-1.5 text-sm font-body font-bold uppercase tracking-wider rounded-full ${
                event.category === 'upcoming' ? 'bg-green-500 text-white' : 'bg-white/20 text-white'
              }`}>
                {event.category}
              </span>
            </div>
          </motion.div>

          {/* Title & CTA */}
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white uppercase mb-4">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/50 text-sm font-body">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white/40 text-xs font-body uppercase tracking-wider">Entry Fee</p>
                <p className="text-neon font-display text-3xl font-bold">
                  Rs. {event.entryFee} (incl. Convenience Fee)
                </p>
              </div>
              <button
                onClick={handleRegister}
                className="px-8 py-4 bg-neon text-dark font-body font-bold text-sm uppercase tracking-wider rounded-full hover:shadow-neon-lg transition-all duration-300 hover:scale-[0.98]"
              >
                Register Now
              </button>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            className="bg-card-dark border border-white/10 rounded-lg p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-2xl font-bold text-white uppercase mb-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-neon" />
              About This Event
            </h2>
            <p className="text-white/60 font-body leading-relaxed">
              {event.description}
            </p>
          </motion.div>

          {/* Rules & Schedule Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rules */}
            {event.rules && (
              <motion.div
                className="bg-card-dark border border-white/10 rounded-lg p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="font-display text-2xl font-bold text-white uppercase mb-6 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-neon" />
                  Rules & Guidelines
                </h2>
                <ul className="space-y-4">
                  {event.rules.map((rule: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-neon/10 text-neon text-xs font-body font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-white/60 font-body text-sm">{rule}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Prizes */}
            {event.prizes && (
              <motion.div
                className="bg-card-dark border border-white/10 rounded-lg p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="font-display text-2xl font-bold text-white uppercase mb-6 flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-neon" />
                  Prizes
                </h2>
                <ul className="space-y-4">
                  {event.prizes.map((prize: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-neon/10 text-neon text-xs font-body font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-white/60 font-body text-sm">{prize}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Schedule */}
            {event.schedule && (
              <motion.div
                className="bg-card-dark border border-white/10 rounded-lg p-8 md:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="font-display text-2xl font-bold text-white uppercase mb-6 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-neon" />
                  Daily Schedule
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.schedule.map((item: {time: string; activity: string}, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded"
                    >
                      <span className="text-neon font-body font-bold text-sm whitespace-nowrap">
                        {item.time}
                      </span>
                      <span className="text-white/60 font-body text-sm">
                        {item.activity}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
