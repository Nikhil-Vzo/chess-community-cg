import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf-8')
const env = {}
envContent.split('\n').forEach(line => {
  if (line.includes('=')) {
    const [key, ...rest] = line.split('=')
    env[key.trim()] = rest.join('=').trim()
  }
})

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseServiceKey = env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const pgnText = `[Event "USA-01 Congress Grand Tournament"]
[Site "New York"]
[Date "1857.11.08"]
[Round "4.6"]
[White "Paulsen, Louis"]
[Black "Morphy, Paul"]
[Result "0-1"]
[ECO "C48"]
[Annotator "ChessBase"]
[PlyCount "56"]
[EventDate "1857.10.06"]
[EventType "k.o."]
[EventRounds "4"]
[EventCountry "USA"]
[SourceTitle "MainBase"]
[Source "ChessBase"]
[SourceDate "1999.07.01"]
[SourceVersion "2"]
[SourceVersionDate "1999.07.01"]
[SourceQuality "1"]

1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6 4. Bb5 Bc5 (4... Bb4) (4... Nd4) 5. O-O (5. Nxe5 Nxe5 (5... Nd4 {Marshall}) 6. d4 Bb4 7. dxe5 Nxe4 8. Qd4 Nxc3 (8... Bxc3+ 9. bxc3 Ng5 10. Ba3 Ne6 11. Qe4 Qg5 12. g3 $14) 9. bxc3 Be7 10. Bf4 $1 $14) 5... O-O 6. Nxe5 Re8 (6... Nxe5 7. d4) (6... Nxe5 7. d4 $14) 7. Nxc6 (7. Nf3 $1 Nxe4 8. d4 Nxc3 9. bxc3 Bf8 10. d5 Ne5 11. Nxe5 Rxe5 12. Bf4 $14) 7... dxc6 8. Bc4 {[#]} b5 (8... Nxe4 $2 9. Nxe4 Rxe4 10. Bxf7+ Kxf7 11. Qf3+) (8... Ng4 9. d4 (9. h3 Nxf2 10. Rxf2 Bxf2+ 11. Kxf2 Qd4+ $16) 9... Qd6 10. g3 Bxd4 11. Be2 h5 $17) 9. Be2 (9. Bb3 $2 Bg4 10. Qe1 b4) 9... Nxe4 10. Nxe4 (10. Bf3 Nxf2 11. Rxf2 Qd4 12. Ne4 (12. Qf1 Qxf2+ 13. Qxf2 Re1#) 12... Rxe4 13. Bxe4 Qxf2+ 14. Kh1 Bg4 15. Bf3 Re8 $19) 10... Rxe4 11. Bf3 (11. d3 Re6 12. Bf4) (11. c3 Qh4 12. g3 (12. d4 Bd6 13. g3 Qh3 14. f4 Bd7 15. Bf3 Re7 {ae8}) 12... Qh3 13. Bf3 Rh4 14. gxh4 Bd6) 11... Re6 12. c3 $2 (12. d3 $142 $14 b4 13. Be3 Bxe3 14. fxe3 Rxe3 15. Qd2) 12... Qd3 13. b4 (13. Re1 Rxe1+ 14. Qxe1 Bf5 15. Qe2 Rd8 16. Qxd3 Bxd3) 13... Bb6 14. a4 bxa4 15. Qxa4 Bd7 (15... Bb7 $142 16. Ra2 Rae8 17. Qd1 Ba6 $1) (15... a5 16. Bxc6 Ba6 17. b5 Rxc6 18. bxa6 Re6 19. c4 Rae8 20. Ba3) 16. Ra2 $2 (16. Qa6 Qf5 (16... Qg6) (16... Qxa6 17. Rxa6 Rae8 18. Bg4 R6e7 19. Bxd7 Rxd7 20. d4) 17. d4 Rae8 18. Be3 c5 19. bxc5 Bxc5 20. Qb7 (20. Qe2 Bb6 21. Bg4 Rxe3 22. Bxf5 Rxe2 23. Bxd7 $10) (20. Qa5 $2 Rg6 21. Kh1 Qxf3 22. gxf3 Bc6 $19) 20... Bd6 21. c4 $14) 16... Rae8 17. Qa6 {[#]} (17. Qd1 c5 {d7-b5}) {Johnson,C.F.: "Morphy deliberated half an hour" (Sergeant: Morphy Gleanings,p.13)} 17... Qxf3 $1 $19 (17... Qxa6 18. Rxa6 c5 $15) 18. gxf3 Rg6+ 19. Kh1 Bh3 20. Rd1 (20. Rg1 Rxg1+ (20... Bg2+ 21. Rxg2 Re1+ 22. Qf1 Rxf1+ 23. Rg1 Rfxg1#) 21. Kxg1 Re1+) (20. Qd3 f5 $1 {Protecting the g6 against the attacking d3.} (20... Bg2+ $2 21. Kg1 Bxf3+ 22. Qxg6 hxg6 23. d4 $14) 21. Qc4+ Kf8 (21... Kh8 22. Qf7) 22. Rd1 Bg2+ 23. Kg1 Bxf3+ 24. Kf1 Bg2+ 25. Kg1 Bd5+ 26. Kf1 Bxc4+ 27. d3 Bxa2 $19) 20... Bg2+ 21. Kg1 Bxf3+ 22. Kf1 Bg2+ (22... Rg2 $1 23. Qd3 Rxf2+ 24. Kg1 Rg2+ 25. Kh1 Rg1#) 23. Kg1 Bh3+ $19 {Winning} (23... Be4+ $1 {Checkmating} 24. Kf1 Bf5 $1 25. Qe2 Bh3+ 26. Ke1 Rg1#) 24. Kh1 Bxf2 25. Qf1 Bxf1 26. Rxf1 Re2 27. Ra1 Rh6 28. d4 (28. Kg2 Bb6+ 29. Kf3 Rexh2 $19) 28... Be3 $19 0-1

[Event "Opéra Hous: Morphy-Duke of Brunswick"]
[Site "Paris"]
[Date "1858.11.02"]
[Round "?"]
[White "Morphy, Paul"]
[Black "Duke ofBrunswick/Count Isouar, Karl"]
[Result "1-0"]
[ECO "C41"]
[Annotator "Tactical Analysis 2.10 (10s)"]
[PlyCount "33"]
[EventDate "1858.??.??"]
[EventType "tourn"]
[EventRounds "30"]
[EventCountry "FRA"]
[SourceTitle "EXT 2017"]
[Source "ChessBase"]
[SourceDate "2016.10.25"]
[SourceVersion "1"]
[SourceVersionDate "2016.10.25"]
[SourceQuality "1"]

{[%evp 13,32,148,157,121,118,120,214,212,661,660,652,654,667,663,850,820,1450,1432,29998,29999,29999]} 1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 {C41: Philidor Defence} c6 {[#]} 9. Bg5 $1 b5 {[#]} (9... Na6 $16) 10. Nxb5 $1 $18 {[%mdl 512] White is clearly better.} cxb5 $2 (10... Qb4+ 11. Nc3 Qxb3 12. axb3 a5) 11. Bxb5+ Nbd7 {next ...Qb4+ is good for Black.} 12. O-O-O Rd8 {[#]} 13. Rxd7 $1 {[%mdl 576] Clearance} Rxd7 14. Rd1 {[%mdl 64] Pin} Qe6 15. Bxd7+ Nxd7 {[#]} 16. Qb8+ $1 {[%mdl 576] Back Rank} Nxb8 17. Rd8# 1-0

[Event "Lodz"]
[Site "?"]
[Date "1907.??.??"]
[Round "?"]
[White "Rotlevi, G."]
[Black "Rubinstein, Akiba"]
[Result "0-1"]
[Annotator "Tactical Analysis 2.10 (10s)"]
[PlyCount "52"]
[EventDate "1907.??.??"]

{[%evp 17,51,14,7,8,25,-41,-41,-41,-41,-41,-41,-41,-41,-41,-34,-37,-42,-58,-64,-125,-114,-422,-418,-404,-401,-387,-308,-813,-801,-29992,-29993,-29995,-29996,-29996,-29997,-29999]} 1. d4 d5 2. Nf3 e6 3. e3 c5 4. c4 Nc6 5. Nc3 Nf6 6. dxc5 Bxc5 7. a3 a6 8. b4 Bd6 9. Bb2 O-O {LiveBook: 156 Games} 10. Qd2 {D40: Queen's Gambit Declined: Semi-Tarrasch with 5 e3} Qe7 11. Bd3 (11. cxd5 $11 exd5 12. Nxd5 Nxd5 13. Qxd5) 11... dxc4 $15 12. Bxc4 {Black is slightly better.} b5 13. Bd3 Rd8 14. Qe2 Bb7 15. O-O Ne5 $36 {[%mdl 2048] Black has some pressure.} 16. Nxe5 $1 Bxe5 17. f4 Bc7 18. e4 (18. Rac1 $15) 18... Rac8 {[%cal Ba8c8,Bc8c3,Bc3h3,Bh3h2][%mdl 32]} 19. e5 $2 {[%mdl 8192]} (19. Rad1 $17 {is a better chance.}) 19... Bb6+ $19 20. Kh1 {[#]} Ng4 $1 {[%mdl 512] Threatens to win with ...Qh4.} 21. Be4 {Black must now prevent Bxb7.} (21. Qxg4 Rxd3) 21... Qh4 {[%csl Gg4][%cal Rh4h2]} 22. g3 $2 {[#]} (22. h3 Rxc3 23. Bxc3 Bxe4 24. Qxg4 Qxg4 25. hxg4) 22... Rxc3 $1 {[%mdl 512]} 23. gxh4 {[#]} (23. Bxc3 Bxe4+) 23... Rd2 $3 {[%mdl 576] Overworked Piece, Deflection. Black mates.} 24. Qxd2 Bxe4+ 25. Qg2 Rh3 {[%csl Gg4][%cal Rh3h2][%mdl 64] Double Attack} 26. Qxe4 Rxh2# {Accuracy: White = 30%, Black = 89%.} 0-1

[Event "Thailand Open,Bangkok 2012"]
[Site "?"]
[Date "2012.04.19"]
[Round "9"]
[White "Xiu Deshun"]
[Black "Sriram Jha"]
[Result "0-1"]
[ECO "D17"]
[WhiteElo "2492"]
[BlackElo "2406"]
[PlyCount "50"]

1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 dxc4 5. a4 Bf5 6. Ne5 Nbd7 7. Nxc4 Qc7 8. g3 e5 9. dxe5 Nxe5 10. Bf4 Nfd7 11. Bg2 g5 12. Ne3 gxf4 13. Nxf5 O-O-O 14. Qc2 Kb8 15. O-O fxg3 16. hxg3 h5 17. Rfc1 Nf6 18. a5 h4 19. Nxh4 Rxh4 20. gxh4 Neg4 21. Qf5 $146 ({RR} 21. Rd1 Re8 22. Qf5 Bh6 23. Rd3 Qh2+ 24. Kf1 Rg8 25. e4 Nh5 26. Qxh5 Nxf2 27. Rd8+ Rxd8 28. Kxf2 Rg8 29. Qf3 Rg6 30. Rd1 Qxh4+ 31. Kg1 Bf4 32. Qf2 Qg4 33. Rd8+ Kc7 34. Rd3 f6 35. Nb5+ Kc8 {Babula,V (2594)-Ragger,M (2530)/Hamburg GER 2008/The Week in Chess 696/1-0 (37)}) 21... Qh2+ 22. Kf1 Bh6 {I had taken 3 minutes till this position and my opponent had taken one hour ten minutes.} 23. Ne4 {This was new for me and I started thinking.} (23. Rd1 Rg8 24. Qf3 Qh1+ 25. Bxh1 Nh2+ 26. Ke1 Rg1# {Before the game in my preparation I was fascinated by this idea showed by Houdini and this position was on my board.And guess what the same position came in the game.Happens very rarely.}) 23... Rg8 $6 {I was fascinated by the ...Qh1 and ...Nh2 mate idea and thats why I played this.I just didnt feel like thinking about other moves.Much stronger and decisive was...} (23... Rd5 $1 24. Qf3 Nxe4 25. Qxe4 Qxh4 $19) (23... Be3 $1 $19) 24. Ng5 Qxh4 25. Nh3 $4 (25. Rc3 Rxg5 26. Qf4+ Re5) 25... Qxh3 0-1

[Event "Casuals Morphy-Anderssen KingsGt"]
[Site "Paris"]
[Date "1858.12.29"]
[Round "2"]
[White "Morphy, Paul"]
[Black "Anderssen, Adolf"]
[Result "1-0"]
[ECO "C39"]
[Annotator "Tactical Analysis 2.10 (10s)"]
[PlyCount "45"]
[EventDate "1858.12.29"]
[EventType "game"]
[EventRounds "6"]
[EventCountry "FRA"]
[SourceTitle "MainBase"]
[Source "ChessBase"]
[SourceDate "1999.07.01"]
[SourceVersion "2"]
[SourceVersionDate "1999.07.01"]
[SourceQuality "1"]

{[%evp 14,45,-4,-4,-4,-12,-6,-91,-6,-6,-6,-6,-6,-5,0,-17,-12,0,-7,0,0,-5,0,0,105,82,257,101,456,446,436,414,430,409]} 1. e4 e5 2. f4 exf4 3. Nf3 g5 4. h4 g4 5. Ne5 Nf6 {[%cal Bg8f6,Bf6e4,Be4g3,Bg3h1][%mdl 32]} 6. Nxg4 Nxe4 7. d3 Ng3 8. Bxf4 {LiveBook: 3 Games} Nxh1 {C39: King's Gambit Accepted: 3 Nf3 g5 4 h4} 9. Qe2+ Qe7 {Hoping for ...f5.} 10. Nf6+ $1 Kd8 {[#]Black is better.} 11. Bxc7+ $1 {[%mdl 576] Decoy} Kxc7 12. Nd5+ {[%mdl 64] Double Attack} Kd8 13. Nxe7 Bxe7 14. Qg4 ({Of course not} 14. Qe5 Re8 $17) 14... d6 $1 15. Qf4 $1 Rg8 {White must now prevent ...Be6.} 16. Qxf7 Bxh4+ 17. Kd2 $132 {[%mdl 2048] White is not holding back} 18. Na3 {And now Qh5 would win.} Na6 (18... Bg5+ $11 19. Kc3 Bd7) 19. Qh5 Bf6 $2 {[#]} (19... Be7 $16 {was worth a try.}) 20. Qxh1 $2 (20. Re1 $1 $18 {[%cal Re1e8]} Rxe1 21. Kxe1) 20... Bxb2 $2 {[%mdl 8192]} (20... Bg5+ $16 {is more resistant.} 21. Kc3 Be6) 21. Qh4+ $18 Kd7 22. Rb1 Bxa3 23. Qa4+ {[%mdl 64] Double Attack Accuracy: White = 37%, Black = 34%.} 1-0`

async function run() {
  console.log("Updating Lecture 1 PGN...")
  const { data: videos, error: fetchErr } = await supabase.from('videos').select('id, title').ilike('title', '%Lecture 1%')
  if (fetchErr) {
    console.error("Error fetching video:", fetchErr)
    return
  }
  
  if (videos && videos.length > 0) {
    const video = videos[0]
    console.log("Found video:", video.title)
    
    const { error: updateErr } = await supabase.from('videos').update({ pgn: pgnText }).eq('id', video.id)
    if (updateErr) {
      console.error("Error updating video:", updateErr)
    } else {
      console.log("Successfully updated PGN for", video.title)
    }
  } else {
    console.log("Could not find Lecture 1")
  }
}

run()
