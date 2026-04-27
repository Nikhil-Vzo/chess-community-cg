import fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, l) => {
  if (l.includes('=')) { const [k, ...v] = l.split('='); acc[k.trim()] = v.join('=').trim() }
  return acc
}, {})

// Simulate a browser CORS preflight to Supabase
const url = `${env.VITE_SUPABASE_URL}/rest/v1/events?select=id,title&limit=1`
const headers = {
  'apikey': env.VITE_SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
  'Origin': 'http://localhost:3000',
}

console.log('Testing URL:', url)
const res = await fetch(url, { headers })
console.log('HTTP Status:', res.status)
console.log('CORS allow-origin:', res.headers.get('access-control-allow-origin'))
const body = await res.text()
console.log('Body:', body.substring(0, 300))
