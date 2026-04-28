import { supabase } from './supabase'
import type { ChessEvent, Playlist, Video } from '@/types'

const TIMEOUT_MS = 12000  // 12 seconds per attempt
const MAX_RETRIES = 2     // retry up to 2 times after initial failure

/**
 * Executes a query factory with timeout + automatic retry.
 * 
 * Key insight: we take a FACTORY FUNCTION (not a promise) so each retry
 * creates a fresh Supabase query. This is critical because when a browser
 * tab goes idle, the underlying HTTP connection becomes stale. Retrying
 * with the same stale promise would fail again — we need a fresh connection.
 */
async function fetchWithRetry<T>(
  queryFn: () => PromiseLike<T>,
  label: string,
  retries: number = MAX_RETRIES
): Promise<T> {
  let lastError: any

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create a FRESH query/promise on each attempt
      const promise = queryFn()

      // Race against a timeout
      const result = await Promise.race([
        Promise.resolve(promise),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`${label} timed out (attempt ${attempt + 1})`)), TIMEOUT_MS)
        ),
      ])

      return result
    } catch (err) {
      lastError = err
      console.warn(`${label}: attempt ${attempt + 1} failed:`, err instanceof Error ? err.message : err)

      if (attempt < retries) {
        // Brief pause before retry to let the connection reset
        await new Promise(r => setTimeout(r, 500))
      }
    }
  }

  throw lastError
}

export const supabaseService = {
  // EVENTS
  async getEvents() {
    try {
      const { data, error } = await fetchWithRetry(
        () => supabase.from('events').select('*').order('date', { ascending: true }),
        'getEvents'
      )
      if (error) throw error
      
      return ((data as any[]) || []).map(event => ({
        ...event,
        entryFee: Number(event.entry_fee)
      })) as ChessEvent[]
    } catch (err) {
      console.error('getEvents failed after retries:', err)
      return []
    }
  },

  async getEventById(id: string) {
    try {
      const { data, error } = await fetchWithRetry(
        () => supabase.from('events').select('*').eq('id', id).single(),
        'getEventById'
      )
      if (error) throw error
      const row = data as any
      return {
        ...row,
        entryFee: Number(row.entry_fee)
      } as ChessEvent
    } catch (err) {
      console.error('getEventById failed after retries:', err)
      throw err
    }
  },

  // PLAYLISTS & VIDEOS
  async getPlaylists() {
    try {
      const { data, error } = await fetchWithRetry(
        () => supabase.from('playlists').select('*').order('created_at', { ascending: false }),
        'getPlaylists'
      )
      if (error) throw error
      return data as Playlist[]
    } catch (err) {
      console.error('getPlaylists failed after retries:', err)
      return []
    }
  },

  async getVideosByPlaylist(playlistId: string) {
    try {
      const { data, error } = await fetchWithRetry(
        () => supabase.from('videos').select('*').eq('playlist_id', playlistId).order('order_index', { ascending: true }),
        'getVideosByPlaylist'
      )
      if (error) throw error
      return data as Video[]
    } catch (err) {
      console.error('getVideosByPlaylist failed after retries:', err)
      return []
    }
  },

  async getAllVideos() {
    try {
      const { data, error } = await fetchWithRetry(
        () => supabase.from('videos').select('*').order('order_index', { ascending: true }),
        'getAllVideos'
      )
      if (error) throw error
      return data as Video[]
    } catch (err) {
      console.error('getAllVideos failed after retries:', err)
      return []
    }
  },

  // REGISTRATIONS
  async createRegistration(
    userId: string | undefined, 
    eventId: string, 
    paymentId: string, 
    guestData: { 
      email: string; 
      name: string; 
      phone: string; 
      dob?: string; 
      gender?: string; 
      state?: string; 
      district?: string;
      fide_id?: string;
    }
  ) {
    const { error } = await supabase
      .from('registrations')
      .insert([
        {
          user_id: userId || null,
          event_id: eventId,
          payment_status: 'completed',
          payment_id: paymentId,
          guest_email: guestData.email,
          guest_name: guestData.name,
          guest_phone: guestData.phone,
          guest_dob: guestData.dob,
          guest_gender: guestData.gender,
          guest_state: guestData.state,
          guest_district: guestData.district,
          guest_fide_id: guestData.fide_id,
        }
      ] as any)
    
    if (error) throw error
    return true
  },

  // RAZORPAY
  async createRazorpayOrder(amount: number, receipt: string) {
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: { action: 'create-order', amount, receipt }
    })
    if (error) throw error
    return data
  },

  async verifyRazorpayPayment(paymentData: any) {
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: { action: 'verify-payment', ...paymentData }
    })
    if (error) throw error
    return data
  }
}

