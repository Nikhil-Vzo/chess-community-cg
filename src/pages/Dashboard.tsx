import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/sections/Footer'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  MapPin,
  Trophy,
  Clock,
  ArrowRight,
  ChevronRight,
  Loader2,
} from 'lucide-react'

interface Registration {
  id: string
  event_id: string
  payment_id: string
  payment_status: string
  created_at: string
  event?: {
    title: string
    date: string
    location: string
    entry_fee: number
    thumbnail_url: string
    status: string
  }
}

export default function Dashboard() {
  const { user, isLoaded } = useAuth()
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Wait for auth to fully resolve before deciding
    if (!isLoaded) return

    // If auth resolved and no user, stop loading
    if (!user) {
      setLoading(false)
      return
    }

    const fetch = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          id,
          event_id,
          payment_id,
          payment_status,
          created_at,
          events (
            title,
            date,
            location,
            entry_fee,
            thumbnail_url,
            status
          )
        `)
        .or(`user_id.eq.${user.id},guest_email.eq.${user.email}`)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setRegistrations(data.map((r: any) => ({
          ...r,
          event: r.events,
        })))
      }
      setLoading(false)
    }
    fetch()
  }, [user, isLoaded])

  const tabs = [
    { label: 'Overview', value: 'overview', icon: LayoutDashboard },
    { label: 'My Registrations', value: 'registrations', icon: ClipboardList },
  ]

  const upcomingCount = registrations.filter(r => r.event?.status === 'upcoming').length
  const pastCount = registrations.filter(r => r.event?.status === 'past').length

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <main className="pt-24 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-neon text-sm font-body uppercase tracking-[0.3em] mb-4">
              Player Dashboard
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white uppercase mb-4">
              Welcome, {user?.name?.split(' ')[0] || 'Player'}
            </h1>
            <p className="text-white/40 font-body">
              Manage your registrations, track events, and view your chess journey.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-10">
            {tabs.map((tab) => (
              <Link
                key={tab.value}
                to={`/dashboard${tab.value === 'registrations' ? '?tab=registrations' : ''}`}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-body font-medium uppercase tracking-wider rounded-full transition-all duration-300 ${
                  (activeTab === tab.value) || (activeTab === 'overview' && tab.value === 'overview')
                    ? 'bg-neon text-dark'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Link>
            ))}
          </div>

          {(loading || !isLoaded) ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-neon animate-spin" />
            </div>
          ) : !user ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <LayoutDashboard className="w-8 h-8 text-white/30" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white uppercase mb-4">Account Centre Locked</h2>
              <p className="text-white/40 font-body max-w-md mb-8">
                Please log in or sign up to view your dashboard, manage your registrations, and download your receipts.
              </p>
              <Link
                to="/login"
                className="px-8 py-4 bg-neon text-dark font-body font-bold text-sm uppercase tracking-wider rounded-full hover:shadow-neon-lg transition-all duration-300 hover:scale-[0.98]"
              >
                Log In / Sign Up
              </Link>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {(activeTab === 'overview' || activeTab === '') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {[
                      { label: 'Total Registrations', value: registrations.length, icon: ClipboardList, color: '#c8ff2e' },
                      { label: 'Upcoming Events', value: upcomingCount, icon: Calendar, color: '#22c55e' },
                      { label: 'Completed Events', value: pastCount, icon: Trophy, color: '#3b82f6' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-card-dark border border-white/10 rounded-lg p-6"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-white/5 rounded">
                            <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                          </div>
                          <span className="text-white/40 font-body text-sm">{stat.label}</span>
                        </div>
                        <p className="font-display text-4xl font-bold text-white">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Registrations */}
                  <div className="bg-card-dark border border-white/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display text-xl font-bold text-white uppercase">
                        Recent Registrations
                      </h2>
                      <Link
                        to="/dashboard?tab=registrations"
                        className="flex items-center gap-1 text-neon text-sm font-body hover:underline"
                      >
                        View All
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {registrations.length > 0 ? (
                      <div className="space-y-4">
                        {registrations.slice(0, 3).map((reg) => (
                          <div
                            key={reg.id}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              {reg.event?.thumbnail_url && (
                                <div className="w-12 h-12 rounded overflow-hidden shrink-0">
                                  <img src={reg.event.thumbnail_url} alt={reg.event.title} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-display text-sm font-bold text-white uppercase">
                                  {reg.event?.title || 'Event'}
                                </h3>
                                <div className="flex items-center gap-3 text-white/40 text-xs font-body mt-1">
                                  {reg.event?.date && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {new Date(reg.event.date).toLocaleDateString()}
                                    </span>
                                  )}
                                  {reg.event?.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {reg.event.location.split(',')[0]}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-body uppercase tracking-wider rounded-full">
                              {reg.payment_status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-white/40 font-body">No registrations yet.</p>
                        <Link
                          to="/events"
                          className="inline-flex items-center gap-2 mt-4 text-neon text-sm font-body hover:underline"
                        >
                          Browse Events
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Registrations Tab */}
              {activeTab === 'registrations' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-card-dark border border-white/10 rounded-lg p-6">
                    <h2 className="font-display text-xl font-bold text-white uppercase mb-6">
                      My Registrations
                    </h2>

                    {registrations.length > 0 ? (
                      <div className="space-y-4">
                        {registrations.map((reg) => (
                          <div
                            key={reg.id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white/5 rounded-lg gap-4"
                          >
                            <div className="flex items-center gap-4">
                              {reg.event?.thumbnail_url && (
                                <div className="w-16 h-16 rounded overflow-hidden shrink-0">
                                  <img src={reg.event.thumbnail_url} alt={reg.event.title} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-display text-lg font-bold text-white uppercase">
                                  {reg.event?.title || 'Event'}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 text-white/40 text-xs font-body mt-2">
                                  {reg.event?.date && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {new Date(reg.event.date).toLocaleDateString()}
                                    </span>
                                  )}
                                  {reg.event?.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {reg.event.location}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Registered {new Date(reg.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-white/30 text-xs font-body mt-1 font-mono">
                                  Payment ID: {reg.payment_id}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="px-4 py-2 bg-green-500/20 text-green-400 text-sm font-body uppercase tracking-wider rounded-full">
                                {reg.payment_status}
                              </span>
                              {reg.event?.entry_fee && (
                                <span className="font-display font-bold text-neon">
                                  Rs. {reg.event.entry_fee.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-white/40 font-body">No registrations yet.</p>
                        <Link
                          to="/events"
                          className="inline-flex items-center gap-2 mt-4 text-neon text-sm font-body hover:underline"
                        >
                          Browse Events
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
