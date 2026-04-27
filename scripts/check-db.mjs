import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

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
  const { data } = await supabase.from('videos').select('title, pgn')
  console.log("DB Content:")
  data.forEach(d => {
    console.log(`Title: ${d.title}`)
    console.log(`PGN starts with: ${d.pgn ? d.pgn.substring(0, 100) : 'null'}`)
    console.log("---")
  })
}
run()
