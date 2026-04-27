import { useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ReactLenis } from 'lenis/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { Preloader } from '@/components/Preloader'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import Videos from './pages/Videos'
import VaultPlayer from './pages/VaultPlayer'
import Register from './pages/Register'
import Payment from './pages/Payment'
import Receipt from './pages/Receipt'
import Dashboard from './pages/Dashboard'
import Account from './pages/Account'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import SummerFiesta from './pages/SummerFiesta'
import Store from './pages/Store'
import About from './pages/About'

function AppContent() {
  const { user, profile, isLoaded, isProfileLoaded } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showPreloader, setShowPreloader] = useState(true)
  const isBooting = !isLoaded || (!!user && !isProfileLoaded)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowPreloader(false)
    }, isBooting ? 1100 : 180)

    return () => window.clearTimeout(timer)
  }, [isBooting])

  useEffect(() => {
    if (isLoaded && isProfileLoaded && user && !profile) {
      if (location.pathname !== '/account' && location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/account')
      }
    }
  }, [isLoaded, isProfileLoaded, user, profile, location.pathname, navigate])

  return (
    <>
      <AnimatePresence>{showPreloader ? <Preloader /> : null}</AnimatePresence>
      <div
        className="min-h-screen bg-dark transition-opacity duration-300"
        style={{ opacity: showPreloader ? 0 : 1 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/summer-fiesta" element={<SummerFiesta />} />
          <Route path="/store" element={<Store />} />
          <Route path="/videos/:id" element={<VaultPlayer />} />
          <Route path="/vault/:id" element={<VaultPlayer />} />
          <Route path="/register/:id" element={<Register />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/receipt/:id" element={<Receipt />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  )
}

export default function App() {
  return (
    <ReactLenis root>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ReactLenis>
  )
}
