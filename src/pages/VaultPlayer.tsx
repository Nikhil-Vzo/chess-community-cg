import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Video as VideoIcon, Clock, Loader2, FileText, PlayCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Video } from '@/types'
import { PgnViewer } from '@/components/PgnViewer'
import { useEffect, useState } from 'react'

export default function VaultPlayer() {
  const { id } = useParams<{ id: string }>()
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePart, setActivePart] = useState<1 | 2>(1)

  useEffect(() => {
    window.scrollTo(0, 0)
    async function fetchVideo() {
      if (!id) return
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('id', id)
          .single()
        
        if (data && !error) {
          setVideo(data)
        }
      } catch (error) {
        console.error('Error fetching video:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-neon animate-spin" />
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-dark pt-32 px-6 flex flex-col items-center justify-center">
        <h2 className="text-white font-display text-4xl mb-4 uppercase">Video Not Found</h2>
        <Link to="/videos" className="text-neon hover:underline font-body uppercase tracking-widest text-xs">Return to Vault</Link>
      </div>
    )
  }

  // Use a fallback PGN if not provided
  const fallbackPgn = "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2 c5 11. d4 Qc7";
  const pgnToUse = video.pgn || fallbackPgn;

  const currentVideoUrl = activePart === 1 ? video.video_url : video.video_url_2;

  // Convert any Google Drive link to a proper embed URL
  function getDriveEmbedUrl(url: string | undefined | null): string | null {
    if (!url) return null;

    // Check if it's actually a URL (not just a filename like "Lecture 1.mp4")
    if (!url.startsWith('http')) return null;

    // Already an embed/preview link
    if (url.includes('/preview') || url.includes('/embed')) return url;

    // Standard share link: https://drive.google.com/file/d/FILE_ID/view?...
    const driveMatch = url.match(/\/file\/d\/([-\w]+)/);
    if (driveMatch) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }

    // Open link: https://drive.google.com/open?id=FILE_ID
    const openMatch = url.match(/[?&]id=([-\w]+)/);
    if (openMatch) {
      return `https://drive.google.com/file/d/${openMatch[1]}/preview`;
    }

    // YouTube embed
    if (url.includes('youtube.com') || url.includes('youtu.be')) return url;

    // Direct MP4 or other URLs — return as-is
    return url;
  }

  const embedUrl = getDriveEmbedUrl(currentVideoUrl);
  const isMp4 = currentVideoUrl?.endsWith('.mp4') && currentVideoUrl.startsWith('http');

  return (
    <div className="min-h-screen bg-dark pt-24 pb-12 px-6 flex flex-col">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col h-full flex-grow">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <Link 
              to="/videos" 
              className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-neon hover:text-dark rounded-2xl text-white transition-all group shrink-0"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-neon/10 text-neon border border-neon/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Now Playing
                </span>
                <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  {video.duration || 'N/A'}
                </div>
              </div>
              <h1 className="font-display text-2xl md:text-4xl font-black text-white uppercase leading-tight">{video.title}</h1>
            </div>
          </div>

          {video.video_url_2 && (
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 shrink-0 hidden md:flex">
              <button
                onClick={() => setActivePart(1)}
                className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  activePart === 1
                    ? 'bg-neon text-dark shadow-neon'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <PlayCircle className="w-4 h-4" /> Part 1
              </button>
              <button
                onClick={() => setActivePart(2)}
                className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  activePart === 2
                    ? 'bg-neon text-dark shadow-neon'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <PlayCircle className="w-4 h-4" /> Part 2
              </button>
            </div>
          )}
        </div>

        {/* Mobile Parts Toggle */}
        {video.video_url_2 && (
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 mb-6 md:hidden">
            <button
              onClick={() => setActivePart(1)}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                activePart === 1
                  ? 'bg-neon text-dark shadow-neon'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Part 1
            </button>
            <button
              onClick={() => setActivePart(2)}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                activePart === 2
                  ? 'bg-neon text-dark shadow-neon'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Part 2
            </button>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow h-[calc(100vh-200px)] min-h-[600px]">
          
          {/* Left Column: Video Player */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full">
            <div className="bg-black rounded-[32px] overflow-hidden border border-white/10 relative w-full flex-grow shadow-2xl glass">
              {embedUrl ? (
                isMp4 ? (
                  <video 
                    src={embedUrl}
                    controls
                    controlsList="nodownload"
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                  />
                ) : (
                  // Google Drive blocks iframes — open in Drive instead
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/80 p-8">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center mx-auto mb-4 hover:bg-neon/20 transition-colors">
                        <VideoIcon className="w-10 h-10 text-neon" />
                      </div>
                      <h3 className="font-display text-2xl font-black text-white uppercase mb-2">
                        {video.title}
                      </h3>
                      <p className="text-white/40 font-body text-sm mb-6">
                        Google Drive videos cannot be embedded in-page.<br />Click below to watch the lecture.
                      </p>
                      <a
                        href={currentVideoUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-neon text-dark font-display font-black text-sm uppercase tracking-widest rounded-2xl hover:shadow-neon-lg transition-all active:scale-95"
                      >
                        <PlayCircle className="w-5 h-5" />
                        Watch on Google Drive
                      </a>
                      {video.video_url_2 && (
                        <a
                          href={video.video_url_2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-3 px-8 py-4 bg-white/10 text-white font-display font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-white/20 transition-all active:scale-95 ml-3"
                        >
                          <PlayCircle className="w-5 h-5" />
                          Part 2
                        </a>
                      )}
                    </div>
                  </div>
                )
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 gap-4 p-8 text-center">
                  <VideoIcon className="w-16 h-16 opacity-20 text-neon" />
                  <p className="font-display font-bold text-lg uppercase tracking-widest text-white">Video Not Yet Available</p>
                  <p className="font-body text-sm text-white/50 max-w-md">
                    The video link for this lecture hasn't been added yet. Please update <span className="text-neon font-bold">{currentVideoUrl}</span> in Supabase with a valid Google Drive share link.
                  </p>
                  <div className="mt-2 px-4 py-2 bg-neon/10 rounded-xl border border-neon/20 text-left">
                    <p className="text-[10px] text-neon font-bold uppercase tracking-widest mb-1">How to add a video link:</p>
                    <p className="text-[11px] text-white/50">In Google Drive → right-click video → Share → Copy link → paste in Supabase videos table → video_url column</p>
                  </div>
                </div>
              )}
            </div>
            
            <motion.div 
              className="mt-6 glass border border-white/10 rounded-3xl p-8 flex flex-col sm:flex-row gap-6 justify-between items-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-6 bg-neon" />
                  <p className="text-neon text-[10px] font-bold uppercase tracking-[0.3em]">Lecture Overview</p>
                </div>
                <p className="text-white/70 font-body leading-relaxed text-sm">
                  {video.description}
                </p>
              </div>

              {video.pgn_file && (
                <div className="bg-dark/50 border border-white/5 rounded-2xl p-4 shrink-0 w-full sm:w-auto">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Attached Material</p>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-full bg-neon/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-neon" />
                    </div>
                    <span className="font-body text-sm truncate max-w-[200px]">{video.pgn_file}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: PGN Viewer */}
          <div className="lg:col-span-5 xl:col-span-4 h-full min-h-[600px] glass border border-white/10 rounded-[32px] overflow-hidden flex flex-col relative">
            {!video.pgn ? (
              <div className="absolute inset-0 z-10 bg-dark/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center border-l border-white/5">
                <FileText className="w-12 h-12 text-white/20 mb-4" />
                <h3 className="font-display text-xl font-bold text-white uppercase mb-2">No PGN Available</h3>
                <p className="text-white/40 font-body text-sm">
                  The PGN notation for this lecture has not been uploaded yet. When available, the interactive board will appear here.
                </p>
                {video.pgn_file && (
                  <div className="mt-6 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1">Expected File</span>
                    <span className="text-neon font-body text-sm">{video.pgn_file}</span>
                  </div>
                )}
              </div>
            ) : null}
            <PgnViewer pgn={pgnToUse} />
          </div>

        </div>
      </div>
    </div>
  )
}
