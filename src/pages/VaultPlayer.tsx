import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  FileText,
  Loader2,
  PlayCircle,
  Video as VideoIcon,
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { PgnViewer } from '@/components/PgnViewer'
import { supabase } from '@/lib/supabase'
import type { Video } from '@/types'

type VideoSource =
  | { kind: 'external'; src: string }
  | { kind: 'html5'; src: string }
  | { kind: 'iframe'; src: string }
  | { kind: 'missing' }

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes('youtu.be')) {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    }

    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    }
  } catch {
    return null
  }

  return null
}

function getDrivePreviewUrl(url: string) {
  if (url.includes('/preview') || url.includes('/embed')) {
    return url
  }

  const fileMatch = url.match(/\/file\/d\/([-\w]+)/)
  if (fileMatch) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`
  }

  const openMatch = url.match(/[?&]id=([-\w]+)/)
  if (openMatch) {
    return `https://drive.google.com/file/d/${openMatch[1]}/preview`
  }

  return null
}

function getVideoSource(url?: null | string): VideoSource {
  if (!url) {
    return { kind: 'missing' }
  }

  const trimmedUrl = url.trim()
  if (!trimmedUrl.startsWith('http')) {
    return { kind: 'missing' }
  }

  const youTubeEmbedUrl = getYouTubeEmbedUrl(trimmedUrl)
  if (youTubeEmbedUrl) {
    return { kind: 'iframe', src: youTubeEmbedUrl }
  }

  const drivePreviewUrl = getDrivePreviewUrl(trimmedUrl)
  if (drivePreviewUrl) {
    return { kind: 'iframe', src: drivePreviewUrl }
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(trimmedUrl)) {
    return { kind: 'html5', src: trimmedUrl }
  }

  if (trimmedUrl.includes('/embed')) {
    return { kind: 'iframe', src: trimmedUrl }
  }

  return { kind: 'external', src: trimmedUrl }
}

export default function VaultPlayer() {
  const { id } = useParams<{ id: string }>()
  const [video, setVideo] = useState<null | Video>(null)
  const [loading, setLoading] = useState(true)
  const [activePart, setActivePart] = useState<1 | 2>(1)

  useEffect(() => {
    window.scrollTo(0, 0)

    async function fetchVideo() {
      if (!id) {
        setLoading(false)
        return
      }

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

  useEffect(() => {
    if (!video?.video_url_2 && activePart === 2) {
      setActivePart(1)
    }
  }, [activePart, video?.video_url_2])

  const availableParts = useMemo(() => {
    if (!video) {
      return []
    }

    return [
      { id: 1 as const, label: 'Part 1', url: video.video_url },
      ...(video.video_url_2 ? [{ id: 2 as const, label: 'Part 2', url: video.video_url_2 }] : []),
    ]
  }, [video])

  const currentVideoUrl = activePart === 1 ? video?.video_url : video?.video_url_2
  const videoSource = useMemo(() => getVideoSource(currentVideoUrl), [currentVideoUrl])
  const pgnText = video?.pgn?.trim() ?? ''
  const hasPgn = pgnText.length > 0

  if (loading) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-6 pt-24">
          <Loader2 className="h-12 w-12 animate-spin text-neon" />
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
          <h2 className="font-display text-4xl font-black uppercase text-white">Video Not Found</h2>
          <Link to="/videos" className="mt-4 font-body text-xs font-bold uppercase tracking-[0.3em] text-neon hover:underline">
            Return to Vault
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <main className="relative overflow-hidden px-6 pb-14 pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,255,46,0.10),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_24%)]" />

        <div className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Link
                  to="/videos"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition-all hover:border-neon/40 hover:bg-neon hover:text-dark"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <span className="rounded-full border border-neon/30 bg-neon/10 px-4 py-2 text-[10px] font-body font-bold uppercase tracking-[0.35em] text-neon">
                  Vault Session
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-body font-bold uppercase tracking-[0.35em] text-white/50">
                  <Clock className="h-3.5 w-3.5" />
                  {video.duration || 'Duration pending'}
                </span>
                {hasPgn ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-body font-bold uppercase tracking-[0.35em] text-white/70">
                    PGN Ready
                  </span>
                ) : null}
              </div>

              <h1 className="font-display text-4xl font-black uppercase leading-none text-white md:text-6xl">
                {video.title}
              </h1>
              <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-white/55 md:text-lg">
                {video.description || 'Replay the lecture, review the lines, and move between the video and board without losing context.'}
              </p>
            </div>

            {availableParts.length > 1 ? (
              <div className="flex flex-wrap items-center gap-2 rounded-[24px] border border-white/10 bg-black/25 p-2">
                {availableParts.map((part) => (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => setActivePart(part.id)}
                    className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-[11px] font-body font-bold uppercase tracking-[0.3em] transition-all ${
                      activePart === part.id
                        ? 'bg-neon text-dark shadow-neon'
                        : 'text-white/45 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <PlayCircle className="h-4 w-4" />
                    {part.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.95fr)]">
            <div className="space-y-6">
              <motion.section
                className="overflow-hidden rounded-[34px] border border-white/10 bg-black/35 shadow-[0_26px_70px_rgba(0,0,0,0.32)]"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="border-b border-white/10 px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-body font-bold uppercase tracking-[0.35em] text-white/35">
                        Video Player
                      </p>
                      <p className="mt-2 font-body text-sm text-white/50">
                        {availableParts.find((part) => part.id === activePart)?.label || 'Main lecture'}
                      </p>
                    </div>
                    {videoSource.kind === 'external' ? (
                      <a
                        href={videoSource.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-body font-bold uppercase tracking-[0.3em] text-white/70 transition-all hover:border-neon/40 hover:text-white"
                      >
                        Open Source
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="relative aspect-video bg-black">
                  {videoSource.kind === 'html5' ? (
                    <video
                      src={videoSource.src}
                      controls
                      controlsList="nodownload"
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  ) : null}

                  {videoSource.kind === 'iframe' ? (
                    <iframe
                      src={videoSource.src}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={video.title}
                    />
                  ) : null}

                  {videoSource.kind === 'external' ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-neon/30 bg-neon/10">
                        <VideoIcon className="h-10 w-10 text-neon" />
                      </div>
                      <div>
                        <h2 className="font-display text-3xl font-black uppercase text-white">{video.title}</h2>
                        <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-white/50">
                          This source is best opened in a dedicated tab. Use the link below to watch the lecture at full quality.
                        </p>
                      </div>
                      <a
                        href={videoSource.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 rounded-2xl bg-neon px-7 py-4 font-body font-bold uppercase tracking-[0.25em] text-dark transition-all hover:shadow-neon"
                      >
                        Watch Lecture
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ) : null}

                  {videoSource.kind === 'missing' ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                        <VideoIcon className="h-10 w-10 text-white/35" />
                      </div>
                      <div>
                        <h2 className="font-display text-3xl font-black uppercase text-white">Video Not Yet Available</h2>
                        <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-white/50">
                          Add a public Google Drive, YouTube, or direct MP4 link in the `video_url` field to activate this lecture.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </motion.section>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <motion.section
                  className="glass rounded-[30px] border border-white/10 p-6"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <p className="text-[10px] font-body font-bold uppercase tracking-[0.35em] text-neon/75">
                    Lecture Overview
                  </p>
                  <p className="mt-4 font-body leading-relaxed text-white/65">
                    {video.description || 'Add a session overview so students understand the theme, key lines, and practical takeaways before diving into the analysis board.'}
                  </p>
                </motion.section>

                <motion.section
                  className="glass rounded-[30px] border border-white/10 p-6"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-[10px] font-body font-bold uppercase tracking-[0.35em] text-neon/75">
                    Study Materials
                  </p>

                  {video.pgn_file ? (
                    <div className="mt-4 rounded-[22px] border border-white/10 bg-dark/50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neon/25 bg-neon/10">
                          <FileText className="h-4 w-4 text-neon" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-body font-bold uppercase tracking-[0.2em] text-white/35">Attached PGN</p>
                          <p className="truncate font-body text-sm text-white">{video.pgn_file}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 font-body text-sm leading-relaxed text-white/50">
                      No separate study attachment has been linked for this lecture yet.
                    </p>
                  )}
                </motion.section>
              </div>
            </div>

            <motion.aside
              className="overflow-hidden rounded-[34px] border border-white/10 bg-black/25"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              {hasPgn ? (
                <PgnViewer key={pgnText} pgn={pgnText} />
              ) : (
                <div className="flex h-full min-h-[560px] flex-col items-center justify-center px-8 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <FileText className="h-9 w-9 text-white/30" />
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-black uppercase text-white">PGN Not Added Yet</h2>
                  <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-white/50">
                    Upload the game notation in the `pgn` field and the interactive analysis board will appear here instantly.
                  </p>
                  {video.pgn_file ? (
                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                      <p className="text-[10px] font-body font-bold uppercase tracking-[0.35em] text-white/35">Expected File</p>
                      <p className="mt-2 font-body text-sm text-neon">{video.pgn_file}</p>
                    </div>
                  ) : null}
                </div>
              )}
            </motion.aside>
          </div>
        </div>
      </main>
    </div>
  )
}
