import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  ClipboardList,
  Settings,
  LogOut,
  ChevronDown,
  Calendar,
  Trophy,
  Video,
} from 'lucide-react'

export function Navbar() {
  const { user, isSignedIn, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [location])

  const navLinks = [
    { label: 'Camps', href: '/events?tab=camps', icon: Calendar },
    { label: 'Tournaments', href: '/events?tab=tournaments', icon: Trophy },
    { label: 'Videos', href: '/videos', icon: Video },
  ]

  const isHome = location.pathname === '/'

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHome
            ? 'glass border-b border-white/5 py-2'
            : 'bg-transparent py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-neon/20 rounded-lg blur-md group-hover:bg-neon/40 transition-all duration-500" />
              <div className="relative w-8 h-8 bg-dark border border-white/10 rounded flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                <span className="font-display font-black text-neon text-xl">C</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg md:text-xl font-black text-white tracking-tighter leading-none">
                CHESS COMMUNITY
              </span>
              <span className="font-display text-[10px] font-bold text-neon tracking-[0.3em] uppercase leading-none mt-1 opacity-80">
                CHHATTISGARH
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2 relative bg-white/5 rounded-full px-2 py-1 border border-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="relative px-5 py-2 text-[11px] font-body font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest z-10 flex items-center gap-2"
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <link.icon className="w-3.5 h-3.5 opacity-50" />
                {link.label}
                {hoveredLink === link.label && (
                  <motion.div
                    layoutId="nav-hover"
                    className="absolute inset-0 bg-white/5 rounded-full -z-10"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-6">
            {isSignedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-1 pr-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-neon/50 group-hover:border-neon transition-colors">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-neon/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-neon" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-body font-bold text-white/80">{user.name}</span>
                  <ChevronDown className={`w-3 h-3 text-white/40 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-3 w-64 glass rounded-2xl overflow-hidden shadow-2xl z-50 border border-white/10"
                      >
                        <div className="p-4 bg-white/5 border-b border-white/5">
                          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Signed in as</p>
                          <p className="text-sm text-white font-bold truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-xs text-white/60 hover:text-neon hover:bg-white/5 rounded-xl transition-all group"
                          >
                            <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Dashboard
                          </Link>
                          <Link
                            to="/dashboard?tab=registrations"
                            className="flex items-center gap-3 px-4 py-3 text-xs text-white/60 hover:text-neon hover:bg-white/5 rounded-xl transition-all group"
                          >
                            <ClipboardList className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            My Registrations
                          </Link>
                          <Link
                            to="/account"
                            className="flex items-center gap-3 px-4 py-3 text-xs text-white/60 hover:text-neon hover:bg-white/5 rounded-xl transition-all group"
                          >
                            <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Account Center
                          </Link>
                          <div className="h-px bg-white/5 my-2 mx-4" />
                          <button
                            onClick={logout}
                            className="flex items-center gap-3 px-4 py-3 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group w-full"
                          >
                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  to="/login"
                  className="text-[11px] font-body font-bold text-white/50 hover:text-white transition-colors uppercase tracking-[0.2em]"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-neon text-dark font-body font-black text-[11px] uppercase tracking-widest rounded-full hover:shadow-neon-lg hover:scale-105 transition-all active:scale-95"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-dark/95 backdrop-blur-xl pt-24 px-6 md:hidden flex flex-col"
          >
            <div className="space-y-4 mb-12">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-2">Navigation</p>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-2xl font-display font-black text-white hover:bg-neon hover:text-dark transition-all group"
                >
                  <link.icon className="w-6 h-6 text-neon group-hover:text-dark" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto pb-12 space-y-4">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] ml-2">Account</p>
              {isSignedIn ? (
                <div className="grid grid-cols-1 gap-3">
                  <Link to="/dashboard" className="p-4 rounded-2xl bg-white/5 border border-white/5 text-white font-bold flex items-center gap-3">
                    <LayoutDashboard className="w-5 h-5 text-neon" />
                    Dashboard
                  </Link>
                  <button onClick={logout} className="p-4 rounded-2xl bg-red-400/10 border border-red-400/20 text-red-400 font-bold flex items-center gap-3">
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    className="flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 text-white font-bold text-sm uppercase tracking-widest"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center p-4 rounded-2xl bg-neon text-dark font-black text-sm uppercase tracking-widest shadow-neon"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
