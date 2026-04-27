import { marqueeItems } from '@/data/mockData'
import { Sword, Trophy, Video, Star } from 'lucide-react'

export function Marquee() {
  // Duplicate items for infinite scroll
  const items = [...marqueeItems, ...marqueeItems, ...marqueeItems]

  const getIcon = (item: string) => {
    if (item.toLowerCase().includes('camp')) return <Sword className="w-4 h-4" />
    if (item.toLowerCase().includes('tournament')) return <Trophy className="w-4 h-4" />
    if (item.toLowerCase().includes('video')) return <Video className="w-4 h-4" />
    return <Star className="w-4 h-4" />
  }

  return (
    <div className="relative w-full py-6 bg-dark border-y border-white/5 overflow-hidden group">
      {/* Decorative gradient edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee whitespace-nowrap hover:[animation-play-state:paused] transition-all -skew-x-3 transform-gpu">

        {items.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center gap-6 mx-12 group/item"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neon/10 rounded-full text-neon group-hover/item:bg-neon group-hover/item:text-dark transition-colors duration-300">
                {getIcon(item)}
              </div>
              <span className="text-white/80 font-display text-lg font-bold uppercase tracking-[0.1em] group-hover/item:text-neon transition-colors duration-300">
                {item}
              </span>
            </div>
            
            {/* Unique Separator */}
            <div className="flex gap-1 items-center opacity-20">
              <div className="w-1 h-1 rounded-full bg-neon" />
              <div className="w-10 h-[1px] bg-gradient-to-r from-neon to-transparent" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
