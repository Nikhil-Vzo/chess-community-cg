import { supabase } from './supabase'
import type { ChessEvent, Playlist, Video } from '@/types'

const DEFAULT_TIMEOUT = 10000 // 10 seconds

async function withTimeout<T>(promise: PromiseLike<T>, timeoutMs: number = DEFAULT_TIMEOUT): Promise<T> {
  let timeoutId: any
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Request timed out')), timeoutMs)
  })

  try {
    // We wrap the promiseLike in a real Promise to ensure catch/finally availability
    const result = await Promise.race([Promise.resolve(promise), timeoutPromise])
    return result
  } finally {
    clearTimeout(timeoutId)
  }
}

export const supabaseService = {
  // EVENTS
  async getEvents() {
    try {
      const { data, error } = await withTimeout<any>(
        supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true })
      )
      if (error) throw error
      
      return ((data as any[]) || []).map(event => ({
        ...event,
        entryFee: Number(event.entry_fee)
      })) as ChessEvent[]
    } catch (err) {
      console.error('getEvents failed:', err)
      return [] // Return empty instead of hanging
    }
  },

  async getEventById(id: string) {
    try {
      const { data, error } = await withTimeout<any>(
        supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single()
      )
      if (error) throw error
      const row = data as any
      return {
        ...row,
        entryFee: Number(row.entry_fee)
      } as ChessEvent
    } catch (err) {
      console.error('getEventById failed:', err)
      throw err
    }
  },

  // PLAYLISTS & VIDEOS
  async getPlaylists() {
    try {
      const { data, error } = await withTimeout<any>(
        supabase
          .from('playlists')
          .select('*')
          .order('created_at', { ascending: false })
      )
      if (error) throw error
      return data as Playlist[]
    } catch (err) {
      console.error('getPlaylists failed:', err)
      return []
    }
  },

  async getVideosByPlaylist(playlistId: string) {
    try {
      const { data, error } = await withTimeout<any>(
        supabase
          .from('videos')
          .select('*')
          .eq('playlist_id', playlistId)
          .order('order_index', { ascending: true })
      )
      if (error) throw error
      return data as Video[]
    } catch (err) {
      console.error('getVideosByPlaylist failed:', err)
      return []
    }
  },

  async getAllVideos() {
    try {
      const { data, error } = await withTimeout<any>(
        supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false })
      )
      if (error) throw error
      return data as Video[]
    } catch (err) {
      console.error('getAllVideos failed:', err)
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
