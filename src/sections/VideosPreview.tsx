import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
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
        setVideos(data || [])
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

  const featuredVideo = videos[0]
  const playlistVideos = videos.slice(1, 3)

  return (
    <section className="bg-dark py-24 md:py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex items-center gap-3 mb-4 justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="h-px w-8 bg-neon" aria-hidden="true" />
          <p className="text-neon text-[10px] font-bold uppercase tracking-[0.4em]">Strategic Breakdowns</p>
          <div className="h-px w-8 bg-neon" aria-hidden="true" />
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

        {featuredVideo ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Video (2/3 width) */}
            <div className="lg:col-span-2">
              <motion.div
                className="group relative flex flex-col justify-between h-full overflow-hidden rounded-3xl border border-white/5 bg-white/5 hover:border-neon/30 hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link href={`/videos/${featuredVideo.id}`} className="flex flex-col h-full justify-between">
                  <div className="relative aspect-video w-full overflow-hidden border-b border-white/5 bg-black/40">
                    <img
                      src={featuredVideo.thumbnail_url}
                      alt={featuredVideo.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-neon flex items-center justify-center shadow-neon transition-transform duration-300 group-hover:scale-105">
                        <Play className="w-7 h-7 text-dark ml-1" aria-hidden="true" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-dark/80 backdrop-blur-sm rounded-full text-[10px] font-bold text-white/80 flex items-center gap-1.5 border border-white/10">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {featuredVideo.duration}
                    </div>
                    {featuredVideo.pgn && (
                      <div className="absolute top-4 left-4 px-2.5 py-1 bg-neon/20 backdrop-blur-sm rounded-full text-[8px] font-black text-neon uppercase tracking-widest border border-neon/30">
                        PGN
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <p className="text-neon text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Featured Masterclass</p>
                    <h3 className="font-display text-2xl md:text-3xl font-black text-white uppercase group-hover:text-neon transition-colors leading-tight">
                      {featuredVideo.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Playlist Sidebar (1/3 width) */}
            <div className="flex flex-col gap-6">
              {playlistVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 hover:border-neon/30 hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/videos/${video.id}`} className="flex gap-4 items-center">
                    <div className="relative aspect-video w-32 shrink-0 rounded-xl overflow-hidden border border-white/5 bg-black/40">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-5 h-5 text-neon" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white/40 text-[9px] font-body flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" aria-hidden="true" /> {video.duration}
                        </span>
                        {video.pgn && (
                          <span className="text-neon bg-neon/10 border border-neon/20 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">PGN</span>
                        )}
                      </div>
                      <h4 className="font-display text-sm font-bold text-white uppercase group-hover:text-neon transition-colors line-clamp-2 leading-snug">
                        {video.title}
                      </h4>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {/* View Playlist Card */}
              <motion.div
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 hover:border-neon/30 hover:bg-white/10 transition-all duration-300 flex flex-col justify-center min-h-[100px] flex-grow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Link href="/videos" className="flex items-center justify-between w-full h-full">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-neon/10 flex items-center justify-center group-hover:bg-neon group-hover:text-dark transition-all duration-300">
                      <Play className="w-5 h-5 text-neon group-hover:text-dark ml-0.5" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-black text-white uppercase group-hover:text-neon transition-colors leading-none mb-1">
                        View All Lessons
                      </h4>
                      <p className="text-white/40 font-body text-[10px] uppercase tracking-wider">
                        Access full archives
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-neon group-hover:translate-x-1 transition-all" aria-hidden="true" />
                </Link>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="text-center text-white/40 py-12">No videos available.</div>
        )}

        {/* Access Full Archive CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-neon text-dark font-body font-black text-xs uppercase tracking-[0.2em] rounded-full hover:shadow-neon-lg transition-all duration-300 active:scale-95"
          >
            Access Full Archive
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
