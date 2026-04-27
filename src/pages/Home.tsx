import { Hero } from '@/sections/Hero'
import { Marquee } from '@/components/Marquee'
import { EventsPreview } from '@/sections/EventsPreview'
import { VideosPreview } from '@/sections/VideosPreview'
import { StorePreview } from '@/sections/StorePreview'
import { About } from '@/sections/About'
import { Footer } from '@/sections/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <VideosPreview />
      <EventsPreview />
      <StorePreview />
      <About />
      <Footer />
    </main>
  )
}

