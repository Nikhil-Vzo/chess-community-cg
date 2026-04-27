import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  const eventName = 'Summer Fiesta Grand Chess Open'
  
  // Check if it exists
  const { data: existing, error: searchError } = await supabase
    .from('events')
    .select('id')
    .eq('title', eventName)
    .single()

  if (searchError && searchError.code !== 'PGRST116') {
    console.error('Error searching:', searchError)
    return
  }

  const eventData = {
    title: eventName,
    type: 'tournament',
    status: 'upcoming',
    description: 'Ambuja Mall & Team Chess City Raipur presents Summer Fiesta Grand Chess Open. 100000+ Prize Pool!',
    date: '2026-05-10',
    location: 'Ambuja City Centre Mall, Raipur',
    entry_fee: 900,
    thumbnail_url: '/chess-fiesta.jpeg',
    max_participants: 500
  }

  if (existing) {
    console.log('Event exists. Updating...')
    const { error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', existing.id)
      
    if (error) console.error('Update error:', error)
    else console.log('Successfully updated!')
  } else {
    console.log('Event not found. Inserting...')
    const { error } = await supabase
      .from('events')
      .insert([eventData])
      
    if (error) console.error('Insert error:', error)
    else console.log('Successfully inserted!')
  }
}

main()
