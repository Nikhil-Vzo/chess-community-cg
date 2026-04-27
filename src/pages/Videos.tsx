import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabaseService } from '@/lib/supabaseService'
import type { Video, Playlist } from '@/types'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/sections/Footer'
import { Play, Clock, Loader2, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Videos() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const fetchedPlaylists = await supabaseService.getPlaylists()
        setPlaylists(fetchedPlaylists)
        
        if (fetchedPlaylists.length > 0) {
          const firstPlaylistId = fetchedPlaylists[0].id
          setSelectedPlaylistId(firstPlaylistId)
          const fetchedVideos = await supabaseService.getVideosByPlaylist(firstPlaylistId)
          setVideos(fetchedVideos)
          if (fetchedVideos.length > 0) {
            setSelectedVideo(fetchedVideos[0])
          }
        }
      } catch (error) {
        console.error('Error loading videos:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handlePlaylistChange = async (playlistId: string) => {
    setLoading(true)
    setSelectedPlaylistId(playlistId)
    try {
      const fetchedVideos = await supabaseService.getVideosByPlaylist(playlistId)
      setVideos(fetchedVideos)
      if (fetchedVideos.length > 0) {
        setSelectedVideo(fetchedVideos[0])
      } else {
        setSelectedVideo(null)
      }
    } catch (error) {
      console.error('Error switching playlist:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && playlists.length === 0) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-neon animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <main className="pt-32 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-neon" />
              <p className="text-neon text-[10px] font-bold uppercase tracking-[0.4em]">Training Vault</p>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black text-white uppercase mb-4 leading-none">
              Master the Game
            </h1>
            <p className="text-white/40 font-body max-w-xl leading-relaxed">
              Explore our curated playlists and deep-dive sessions. Each video comes with integrated PGNs for interactive learning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar: Playlists */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-6 ml-2">Training Modules</p>
                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => handlePlaylistChange(playlist.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                        selectedPlaylistId === playlist.id
                          ? 'bg-neon border-neon text-dark'
                          : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider text-left">{playlist.title}</span>
                      <ChevronRight className={`w-4 h-4 ${selectedPlaylistId === playlist.id ? 'text-dark' : 'text-white/20'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {selectedPlaylistId && (
                <div className="glass p-6 rounded-3xl border border-white/10">
                  <h3 className="text-xs font-bold text-white uppercase mb-2">About Module</h3>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    {playlists.find(p => p.id === selectedPlaylistId)?.description}
                  </p>
                </div>
              )}
            </div>

            {/* Main Content: Video Player & List */}
            <div className="lg:col-span-3 space-y-8">
              {selectedVideo ? (
                <motion.div
                  key={selectedVideo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Premium Player UI */}
                  <div className="relative aspect-video rounded-3xl overflow-hidden glass border border-white/10 group shadow-2xl">
                    <img
                      src={selectedVideo.thumbnail_url}
                      alt={selectedVideo.title}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Link 
                        to={`/videos/${selectedVideo.id}`}
                        className="w-24 h-24 rounded-full bg-neon flex items-center justify-center hover:scale-110 transition-all shadow-neon-lg group/play"
                      >
                        <Play className="w-10 h-10 text-dark fill-dark ml-1 group-hover/play:scale-110 transition-transform" />
                      </Link>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-dark/90 to-transparent">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="px-3 py-1 bg-neon/20 backdrop-blur-md text-neon text-[10px] font-black uppercase tracking-widest rounded-full border border-neon/30">
                          {selectedVideo.duration}
                        </span>
                        {selectedVideo.pgn && (
                          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-glow" />
                            PGN Included
                          </span>
                        )}
                      </div>
                      <h2 className="text-3xl font-display font-black text-white uppercase leading-none">{selectedVideo.title}</h2>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="aspect-video rounded-3xl glass border border-dashed border-white/10 flex flex-col items-center justify-center text-white/20">
                  <Play className="w-16 h-16 mb-4 opacity-10" />
                  <p className="font-display font-bold uppercase tracking-widest text-sm">Select a video to play</p>
                </div>
              )}

              {/* Video List in selected Playlist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`flex items-center gap-4 p-3 rounded-2xl transition-all border ${
                      selectedVideo?.id === video.id
                        ? 'bg-white/10 border-neon/50'
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="relative w-32 h-20 rounded-xl overflow-hidden shrink-0">
                      <img src={video.thumbnail_url} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-dark/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-neon" />
                      </div>
                    </div>
                    <div className="text-left min-w-0">
                      <h4 className="text-sm font-bold text-white uppercase truncate mb-1">{video.title}</h4>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-white/30 uppercase">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {video.duration}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
