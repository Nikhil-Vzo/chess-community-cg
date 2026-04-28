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
    // We don't use the 'profile' state directly here to avoid dependency cycles.
    // Instead, we just fetch and update.
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (data && !error) {
        setProfile(data)
      } else if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err)
    } finally {
      setIsProfileLoaded(true)
    }
  }, [])

  useEffect(() => {
    // onAuthStateChange fires for INITIAL_SESSION, SIGNED_IN, SIGNED_OUT,
    // TOKEN_REFRESHED, etc. We only need to fetch the profile on the first
    // two — TOKEN_REFRESHED fires every ~60s and re-fetching the profile
    // each time is wasteful and causes stale-connection timeouts on idle tabs.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        // Token refreshed silently — user/profile haven't changed, skip DB call
        return
      }

      if (session?.user) {
        mapSupabaseUser(session.user)
        // Only fetch profile on initial load or fresh sign-in
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          await fetchProfile(session.user.id)
        }
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
