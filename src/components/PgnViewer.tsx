import { useState, useEffect, useMemo } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react'

interface PgnViewerProps {
  pgn: string
}

export function PgnViewer({ pgn }: PgnViewerProps) {
  const game = useMemo(() => new Chess(), [])
  const [history, setHistory] = useState<string[]>([])
  const [movesText, setMovesText] = useState<string[]>([])
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0)

  useEffect(() => {
    try {
      game.loadPgn(pgn)
      const moves = game.history({ verbose: true })
      setHistory(moves.map(m => m.before))
      setMovesText(moves.map(m => m.san))
      
      // Store the final fen as well
      const finalFens = [...moves.map(m => m.before)]
      if (moves.length > 0) {
        finalFens.push(moves[moves.length - 1].after)
      } else {
        finalFens.push(game.fen())
      }
      setHistory(finalFens)
      setCurrentMoveIndex(0)
    } catch (e) {
      console.error("Invalid PGN", e)
    }
  }, [pgn, game])

  const currentFen = history[currentMoveIndex] || new Chess().fen()
  const totalMoves = history.length > 0 ? history.length - 1 : 0

  const handleSkipBack = () => setCurrentMoveIndex(0)
  const handlePrev = () => setCurrentMoveIndex(prev => Math.max(0, prev - 1))
  const handleNext = () => setCurrentMoveIndex(prev => Math.min(totalMoves, prev + 1))
  const handleSkipForward = () => setCurrentMoveIndex(totalMoves)

  // Pair moves into white and black for display
  const movePairs = []
  for (let i = 0; i < movesText.length; i += 2) {
    movePairs.push({
      white: movesText[i],
      black: movesText[i + 1] || '',
      index: i / 2 + 1
    })
  }

  return (
    <div className="flex flex-col h-full bg-card-dark border border-white/10 rounded-lg overflow-hidden">
      <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-display font-bold text-white uppercase tracking-wider">Analysis Board</h3>
        <span className="text-neon text-sm font-body">Move {currentMoveIndex}/{totalMoves}</span>
      </div>
      
      <div className="p-6 flex-grow flex flex-col items-center justify-center min-h-[300px] w-full">
        <div className="w-full max-w-[400px] aspect-square rounded-md overflow-hidden shadow-2xl bg-[#2a3b2c]/20 relative">
          {(() => {
            const Board = Chessboard as any;
            return (
              <Board 
                key={currentFen}
            position={currentFen} 
            boardOrientation="white"
            arePiecesDraggable={false}
            animationDuration={200}
            customDarkSquareStyle={{ backgroundColor: '#4a6b52' }}
            customLightSquareStyle={{ backgroundColor: '#f0f0f0' }}
          />
            );
          })()}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-white/5 flex flex-col gap-4">
        {/* Moves display */}
        <div className="h-24 overflow-y-auto font-body text-sm bg-dark/50 rounded p-3 flex flex-col gap-1 custom-scrollbar">
          {movePairs.map((pair, idx) => {
            const whiteMoveIndex = idx * 2 + 1;
            const blackMoveIndex = idx * 2 + 2;
            return (
              <div key={idx} className="flex gap-4">
                <span className="text-white/40 w-6">{pair.index}.</span>
                <span 
                  className={`flex-1 cursor-pointer hover:text-neon transition-colors ${currentMoveIndex === whiteMoveIndex ? 'text-neon font-bold' : 'text-white/70'}`}
                  onClick={() => setCurrentMoveIndex(whiteMoveIndex)}
                >
                  {pair.white}
                </span>
                <span 
                  className={`flex-1 cursor-pointer hover:text-neon transition-colors ${currentMoveIndex === blackMoveIndex ? 'text-neon font-bold' : 'text-white/70'}`}
                  onClick={() => pair.black && setCurrentMoveIndex(blackMoveIndex)}
                >
                  {pair.black}
                </span>
              </div>
            )
          })}
        </div>

        {/* Buttons */}
        <div className="flex justify-center items-center gap-4">
          <button 
            onClick={handleSkipBack} 
            disabled={currentMoveIndex === 0}
            className="p-2 rounded hover:bg-white/10 disabled:opacity-30 transition-all text-white/70 hover:text-white"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button 
            onClick={handlePrev} 
            disabled={currentMoveIndex === 0}
            className="p-2 rounded hover:bg-white/10 disabled:opacity-30 transition-all text-white/70 hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={handleNext} 
            disabled={currentMoveIndex === totalMoves}
            className="p-2 rounded hover:bg-white/10 disabled:opacity-30 transition-all text-white/70 hover:text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <button 
            onClick={handleSkipForward} 
            disabled={currentMoveIndex === totalMoves}
            className="p-2 rounded hover:bg-white/10 disabled:opacity-30 transition-all text-white/70 hover:text-white"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
