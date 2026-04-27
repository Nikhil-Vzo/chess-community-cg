import { supabase } from './supabase'
import type { ChessEvent, Playlist, Video } from '@/types'

export const supabaseService = {
  // EVENTS
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    if (error) throw error
    
    // Map database fields to frontend types if needed
    return ((data as any[]) || []).map(event => ({
      ...event,
      entryFee: Number(event.entry_fee)
    })) as ChessEvent[]
  },

  async getEventById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    const row = data as any
    return {
      ...row,
      entryFee: Number(row.entry_fee)
    } as ChessEvent
  },

  // PLAYLISTS & VIDEOS
  async getPlaylists() {
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Playlist[]
  },

  async getVideosByPlaylist(playlistId: string) {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('order_index', { ascending: true })
    if (error) throw error
    return data as Video[]
  },

  async getAllVideos() {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Video[]
  },

  // REGISTRATIONS
  async createRegistration(
    userId: string | undefined, 
    eventId: string, 
    paymentId: string, 
    guestData: { email: string; name: string; phone: string; age?: string | number }
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
