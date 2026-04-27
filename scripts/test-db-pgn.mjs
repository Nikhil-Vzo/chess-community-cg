import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import { Chess } from 'chess.js'

const envContent = fs.readFileSync('.env.local', 'utf-8')
const env = {}
envContent.split('\n').forEach(line => {
  if (line.includes('=')) {
    const [key, ...rest] = line.split('=')
    env[key.trim()] = rest.join('=').trim()
  }
})

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

async function run() {
  const { data } = await supabase.from('videos').select('title, pgn').ilike('title', '%Thought Process of a GM & Importance of Chess Classics%')
  if (data && data.length > 0 && data[0].pgn) {
    const pgn = data[0].pgn
    const chess = new Chess()
    try {
      chess.loadPgn(pgn)
      console.log("Success! Total moves:", chess.history().length)
    } catch (e) {
      console.log("Error loading PGN:", e.message)
    }
  } else {
    console.log("No PGN found")
  }
}
run()
