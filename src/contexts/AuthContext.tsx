import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { type User } from '@supabase/supabase-js'

interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
}

interface PlayerProfile {
  id: string
  has_fide_id: boolean
  fide_id?: string
  phone?: string
  gender?: string
  address?: string
  name?: string
  dob?: string
  city_state?: string
}

interface AuthContextType {
  user: AuthUser | null
  profile: PlayerProfile | null
  isLoaded: boolean
  isProfileLoaded: boolean
  isSignedIn: boolean
  login: () => void
  logout: () => Promise<void>
  openSignUp: () => void
  openUserProfile: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoaded: false,
  isProfileLoaded: false,
  isSignedIn: false,
  login: () => {},
  logout: async () => {},
  openSignUp: () => {},
  openUserProfile: () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isProfileLoaded, setIsProfileLoaded] = useState(false)

  const fetchProfile = useCallback(async (userId: string) => {
    setIsProfileLoaded(false)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data && !error) {
      setProfile(data)
    } else {
      setProfile(null)
    }
    setIsProfileLoaded(true)
  }, [])

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        mapSupabaseUser(session.user)
        await fetchProfile(session.user.id)
      } else {
        setIsProfileLoaded(true)
      }
      setIsLoaded(true)
    })

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        mapSupabaseUser(session.user)
        await fetchProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
        setIsProfileLoaded(true)
      }
      setIsLoaded(true)
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const mapSupabaseUser = (supabaseUser: User) => {
    setUser({
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      avatar: supabaseUser.user_metadata?.avatar_url,
    })
  }

  const login = useCallback(() => {
    window.location.href = '/login'
  }, [])

  const openSignUp = useCallback(() => {
    window.location.href = '/signup'
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }, [])

  const openUserProfile = useCallback(() => {
    window.location.href = '/account'
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id)
  }, [user, fetchProfile])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoaded,
        isProfileLoaded,
        isSignedIn: !!user,
        login,
        logout,
        openSignUp,
        openUserProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
