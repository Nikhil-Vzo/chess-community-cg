import { useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { ChevronLeft, ChevronRight, SkipBack, SkipForward, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PgnViewerProps {
  pgn: string
}

interface ParsedMove {
  afterFen: string
  beforeFen: string
  color: 'b' | 'w'
  moveNumber: number
  san: string
}

interface ParsedGame {
  error: null | string
  headers: Record<string, string>
  moves: ParsedMove[]
  positions: string[]
}

const START_FEN = new Chess().fen()

function parsePgn(pgn: string): ParsedGame {
  const game = new Chess()
  const trimmedPgn = pgn.trim()

  if (!trimmedPgn) {
    return {
      error: null,
      headers: game.getHeaders(),
      moves: [],
      positions: [game.fen()],
    }
  }

  try {
    game.loadPgn(trimmedPgn)
    const verboseMoves = game.history({ verbose: true })
    const positions = verboseMoves.length > 0
      ? [verboseMoves[0].before, ...verboseMoves.map((move) => move.after)]
      : [game.fen()]

    return {
      error: null,
      headers: game.getHeaders(),
      moves: verboseMoves.map((move, index) => ({
        afterFen: move.after,
        beforeFen: move.before,
        color: move.color,
        moveNumber: Math.floor(index / 2) + 1,
        san: move.san,
      })),
      positions,
    }
  } catch {
    return {
      error: 'This PGN could not be parsed. Check the notation formatting or upload a clean PGN text block.',
      headers: game.getHeaders(),
      moves: [],
      positions: [START_FEN],
    }
  }
}

export function PgnViewer({ pgn }: PgnViewerProps) {
  const parsedGame = useMemo(() => parsePgn(pgn), [pgn])
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0)
  const [orientation, setOrientation] = useState<'black' | 'white'>('white')
  const moveRefs = useRef<Array<HTMLButtonElement | null>>([])

  const totalMoves = parsedGame.moves.length
  const currentFen = parsedGame.positions[currentMoveIndex] ?? START_FEN
  const currentMove = currentMoveIndex > 0 ? parsedGame.moves[currentMoveIndex - 1] : null
  const currentPlayers = [parsedGame.headers.White, parsedGame.headers.Black]
    .filter((player) => player && player !== '?')
    .join(' vs ')

  const movePairs = useMemo(() => {
    const pairs: Array<{
      black?: ParsedMove
      blackIndex: number
      turn: number
      white?: ParsedMove
      whiteIndex: number
    }> = []

    for (let index = 0; index < parsedGame.moves.length; index += 2) {
      pairs.push({
        black: parsedGame.moves[index + 1],
        blackIndex: parsedGame.moves[index + 1] ? index + 2 : 0,
        turn: Math.floor(index / 2) + 1,
        white: parsedGame.moves[index],
        whiteIndex: index + 1,
      })
    }

    return pairs
  }, [parsedGame.moves])

  useEffect(() => {
    if (currentMoveIndex === 0) {
      return
    }

    moveRefs.current[currentMoveIndex - 1]?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    })
  }, [currentMoveIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTypingTarget = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA'

      if (isTypingTarget) {
        return
      }

      if (event.key === 'ArrowLeft') {
        setCurrentMoveIndex((previous) => Math.max(0, previous - 1))
      }

      if (event.key === 'ArrowRight') {
        setCurrentMoveIndex((previous) => Math.min(totalMoves, previous + 1))
      }

      if (event.key === 'Home') {
        setCurrentMoveIndex(0)
      }

      if (event.key === 'End') {
        setCurrentMoveIndex(totalMoves)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [totalMoves])

  const eventName = parsedGame.headers.Event && parsedGame.headers.Event !== '?' ? parsedGame.headers.Event : 'Interactive Replay'
  const resultLabel = parsedGame.headers.Result && parsedGame.headers.Result !== '?' ? parsedGame.headers.Result : 'Unfinished'

  return (
    <div className="flex h-full min-h-[560px] flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))] text-white">
      <div className="border-b border-white/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-neon/75">
              PGN Replay
            </p>
            <h3 className="mt-3 font-display text-2xl font-black uppercase tracking-tight text-white">
              {eventName}
            </h3>
            <p className="mt-2 max-w-xl text-sm font-body leading-relaxed text-white/50">
              {currentPlayers || 'Use the controls or arrow keys to step through the game move by move.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-body font-bold uppercase tracking-[0.25em] text-white/60">
              {currentMove ? `Move ${currentMoveIndex} / ${totalMoves}` : 'Start Position'}
            </div>
            <button
              type="button"
              onClick={() => setOrientation((previous) => previous === 'white' ? 'black' : 'white')}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-body font-bold uppercase tracking-[0.25em] text-white/70 transition-colors hover:border-neon/40 hover:text-white"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Flip Board
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-5">
        <div className="space-y-5">
          <div className="rounded-[30px] border border-white/10 bg-[#15110f] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
            <div className="mx-auto max-w-[460px] w-full">
              <Chessboard
                options={{
                  position: currentFen,
                  boardOrientation: orientation,
                  allowDragging: false,
                  animationDurationInMs: 160,
                  boardStyle: {
                    borderRadius: '22px',
                    overflow: 'hidden',
                  },
                  darkSquareStyle: { backgroundColor: '#647057' },
                  lightSquareStyle: { backgroundColor: '#e8dbc1' },
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setCurrentMoveIndex(0)}
              disabled={currentMoveIndex === 0}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 py-2.5 text-xs font-body font-bold text-white/75 transition-all hover:border-neon/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              <SkipBack className="h-4 w-4" />
              <span className="hidden sm:inline">Start</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentMoveIndex((previous) => Math.max(0, previous - 1))}
              disabled={currentMoveIndex === 0}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 py-2.5 text-xs font-body font-bold text-white/75 transition-all hover:border-neon/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentMoveIndex((previous) => Math.min(totalMoves, previous + 1))}
              disabled={currentMoveIndex === totalMoves}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-neon px-2 py-2.5 text-xs font-body font-bold text-dark transition-all hover:shadow-neon disabled:cursor-not-allowed disabled:opacity-35"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentMoveIndex(totalMoves)}
              disabled={currentMoveIndex === totalMoves}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 py-2.5 text-xs font-body font-bold text-white/75 transition-all hover:border-neon/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              <span className="hidden sm:inline">End</span>
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between">
              <p className="text-[9px] font-body font-bold uppercase tracking-[0.2em] text-white/35">Current Move</p>
              <p className="mt-2 font-display text-xl font-black uppercase text-white truncate">
                {currentMove?.san || 'Start'}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between">
              <p className="text-[9px] font-body font-bold uppercase tracking-[0.2em] text-white/35">Side To Move</p>
              <p className="mt-2 font-display text-xl font-black uppercase text-white truncate">
                {currentMoveIndex === totalMoves ? (totalMoves % 2 === 0 ? 'White' : 'Black') : currentMove?.color === 'w' ? 'Black' : 'White'}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between">
              <p className="text-[9px] font-body font-bold uppercase tracking-[0.2em] text-white/35">Result</p>
              <p className="mt-2 font-display text-xl font-black uppercase text-white truncate">
                {resultLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="flex min-h-[280px] flex-col rounded-[30px] border border-white/10 bg-black/20">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.35em] text-white/35">Move List</p>
                <p className="mt-2 font-body text-sm text-white/55">
                  Jump to any ply instantly.
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-body font-bold uppercase tracking-[0.3em] text-neon/80">
                {totalMoves} plies
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {parsedGame.error ? (
              <div className="rounded-[24px] border border-red-400/20 bg-red-400/5 p-5">
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.35em] text-red-300/80">Invalid PGN</p>
                <p className="mt-3 text-sm font-body leading-relaxed text-white/65">
                  {parsedGame.error}
                </p>
              </div>
            ) : totalMoves === 0 ? (
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.35em] text-white/35">No Moves</p>
                <p className="mt-3 text-sm font-body leading-relaxed text-white/60">
                  This PGN is attached, but it does not include any playable moves yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {movePairs.map((pair) => {
                  return (
                    <div key={pair.turn} className="grid grid-cols-[44px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 rounded-2xl border border-transparent bg-white/[0.03] p-2">
                      <span className="text-center text-sm font-body font-bold text-white/30">
                        {pair.turn}.
                      </span>
                      <button
                        type="button"
                        ref={(element) => {
                          if (pair.whiteIndex > 0) {
                            moveRefs.current[pair.whiteIndex - 1] = element
                          }
                        }}
                        onClick={() => setCurrentMoveIndex(pair.whiteIndex)}
                        className={cn(
                          'rounded-xl px-3 py-2 text-left text-sm font-body font-semibold transition-all',
                          currentMoveIndex === pair.whiteIndex
                            ? 'bg-neon text-dark shadow-neon'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white',
                        )}
                      >
                        {pair.white?.san}
                      </button>
                      <button
                        type="button"
                        ref={(element) => {
                          if (pair.blackIndex > 0) {
                            moveRefs.current[pair.blackIndex - 1] = element
                          }
                        }}
                        onClick={() => {
                          if (pair.blackIndex > 0) {
                            setCurrentMoveIndex(pair.blackIndex)
                          }
                        }}
                        className={cn(
                          'rounded-xl px-3 py-2 text-left text-sm font-body font-semibold transition-all',
                          pair.blackIndex === 0 ? 'cursor-default bg-transparent text-white/20' : '',
                          pair.blackIndex > 0 && currentMoveIndex === pair.blackIndex
                            ? 'bg-neon text-dark shadow-neon'
                            : pair.blackIndex > 0
                              ? 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                              : '',
                        )}
                        disabled={pair.blackIndex === 0}
                      >
                        {pair.black?.san || '...'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
