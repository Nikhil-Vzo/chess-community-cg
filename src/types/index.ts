export interface UserProfile {
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

export interface Playlist {
  id: string
  title: string
  description: string
  thumbnail_url: string
  instructor?: string
  created_at: string
}

export interface Video {
  id: string
  playlist_id?: string
  title: string
  description: string
  thumbnail_url: string
  video_url: string
  video_url_2?: string
  pgn?: string
  pgn_file?: string
  duration: string
  order_index: number
}

export interface ChessEvent {
  id: string
  type: 'camp' | 'tournament'
  // Supabase field
  status?: 'upcoming' | 'ongoing' | 'past'
  // Legacy mockData field (same meaning as status)
  category?: 'upcoming' | 'ongoing' | 'past'
  title: string
  description: string
  date: string
  endDate?: string
  location: string
  entryFee: number
  // Supabase field
  thumbnail_url?: string
  // Legacy mockData field
  image?: string
  max_participants?: number
  // Legacy mockData fields for EventDetails page
  rules?: string[]
  prizes?: string[]
  schedule?: { time: string; activity: string }[]
}

export interface Registration {
  id: string
  user_id: string
  event_id: string
  payment_status: 'pending' | 'completed' | 'failed'
  payment_id?: string
  created_at: string
}
