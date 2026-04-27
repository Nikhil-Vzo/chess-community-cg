import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { Preloader } from '@/components/Preloader'
import { Navbar } from '@/components/Navbar'
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

import { ReactLenis } from 'lenis/react'

function AppContent() {
  const [loading, setLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const { user, profile, isLoaded, isProfileLoaded } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Show content after a short delay
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 100)

    // Force clear loading state after 3 seconds as a safety measure
    const forceLoadTimer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => {
      clearTimeout(contentTimer)
      clearTimeout(forceLoadTimer)
    }
  }, [])

  // Onboarding Redirection Logic — only fires once profile fetch is complete
  useEffect(() => {
    if (isLoaded && isProfileLoaded && user && !profile) {
      if (location.pathname !== '/account' && location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/account')
      }
    }
  }, [isLoaded, isProfileLoaded, user, profile, location.pathname, navigate])

  const handlePreloaderComplete = () => {
    setLoading(false)
  }

  return (
    <>
      {showContent && loading && <Preloader onComplete={handlePreloaderComplete} />}
      <div 
        className="min-h-screen bg-dark transition-opacity duration-700"
        style={{ opacity: loading ? 0 : 1 }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/summer-fiesta" element={<SummerFiesta />} />
          <Route path="/videos/:id" element={<VaultPlayer />} />
          <Route path="/vault/:id" element={<VaultPlayer />} />
          <Route path="/register/:id" element={<Register />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/receipt/:id" element={<Receipt />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<Account />} />
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

