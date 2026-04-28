import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { supabaseService } from '@/lib/supabaseService'
import type { Video } from '@/types'
import { Play, ArrowRight, Clock, Loader2 } from 'lucide-react'

export function VideosPreview() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await supabaseService.getAllVideos()
        setVideos(data.slice(0, 3))
      } catch (err) {
        console.error('Error loading videos preview:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <section className="bg-dark py-32 px-6 flex justify-center">
        <Loader2 className="w-10 h-10 text-neon animate-spin" />
      </section>
    )
  }

  return (
    <section className="bg-dark py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex items-center gap-3 mb-4 justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="h-px w-8 bg-neon" />
          <p className="text-neon text-[10px] font-bold uppercase tracking-[0.4em]">Strategic Breakdowns</p>
          <div className="h-px w-8 bg-neon" />
        </motion.div>

        <motion.h2
          className="font-display text-5xl md:text-7xl font-black text-white uppercase text-center mb-4 leading-none"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          The Vault
        </motion.h2>

        <motion.p
          className="text-white/40 font-body text-center mb-16 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Exclusive training content with integrated PGN analysis. Learn openings, master the middlegame, and perfect your endgame technique.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/videos/${video.id}`}>
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-4 border border-white/5 group-hover:border-neon/30 transition-all">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                  />

                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-neon flex items-center justify-center shadow-neon">
                      <Play className="w-6 h-6 text-dark ml-1" />
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-dark/80 backdrop-blur-sm rounded-full text-[10px] font-bold text-white/80 flex items-center gap-1.5 border border-white/10">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </div>

                  {video.pgn && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-neon/20 backdrop-blur-sm rounded-full text-[8px] font-black text-neon uppercase tracking-widest border border-neon/30">
                      PGN
                    </div>
                  )}
                </div>

                <h3 className="font-display text-lg font-bold text-white uppercase mb-1 group-hover:text-neon transition-colors line-clamp-2 leading-tight">
                  {video.title}
                </h3>
              </Link>
            </motion.div>
          ))}

          {/* See All / View Playlist Card */}
          <motion.div
            className="group cursor-pointer h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/videos" className="block h-full">
              <div className="relative h-full min-h-[250px] rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:bg-neon/10 hover:border-neon/30 transition-all duration-500 flex flex-col items-center justify-center gap-4 group-hover:-translate-y-1">
                <div className="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-neon/20">
                  <Play className="w-8 h-8 text-neon ml-1" />
                </div>
                <h3 className="font-display text-xl font-black text-white uppercase group-hover:text-neon transition-colors">
                  View All
                </h3>
                <p className="text-white/30 font-body text-xs px-6 text-center uppercase tracking-widest">
                  Full training archive
                </p>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            to="/videos"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-neon text-dark font-body font-black text-xs uppercase tracking-widest rounded-full hover:shadow-neon-lg transition-all duration-300 active:scale-95"
          >
            Access Full Archive
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
