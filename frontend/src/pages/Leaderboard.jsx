import React, { useState } from 'react'

const players = [
  { rank:1, handle:'ghost_shell', country:'🇺🇸', points:9840, solves:147, badge:'Elite', col:'var(--neon-green)', change:'↑', prev:1 },
  { rank:2, handle:'r00t_runner', country:'🇬🇧', points:9210, solves:138, badge:'Elite', col:'var(--neon-green)', change:'↑', prev:3 },
  { rank:3, handle:'xor_elena', country:'🇪🇸', points:8750, solves:124, badge:'Expert', col:'var(--neon-blue)', change:'↓', prev:2 },
  { rank:4, handle:'nullbyte_kat', country:'🇯🇵', points:8120, solves:119, badge:'Expert', col:'var(--neon-blue)', change:'↑', prev:5 },
  { rank:5, handle:'hex_phantom', country:'🇩🇪', points:7890, solves:112, badge:'Expert', col:'var(--neon-blue)', change:'↓', prev:4 },
  { rank:6, handle:'pwnzero', country:'🇫🇷', points:7420, solves:106, badge:'Expert', col:'var(--neon-blue)', change:'=', prev:6 },
  { rank:7, handle:'ciphertek', country:'🇮🇳', points:6980, solves:98, badge:'Advanced', col:'var(--neon-purple)', change:'↑', prev:9 },
  { rank:8, handle:'byte_witch', country:'🇧🇷', points:6540, solves:92, badge:'Advanced', col:'var(--neon-purple)', change:'↑', prev:11 },
  { rank:9, handle:'redhook', country:'🇨🇦', points:6120, solves:87, badge:'Advanced', col:'var(--neon-purple)', change:'↓', prev:7 },
  { rank:10, handle:'syscall42', country:'🇰🇷', points:5890, solves:82, badge:'Advanced', col:'var(--neon-purple)', change:'↓', prev:8 },
  { rank:11, handle:'vuln_sensei', country:'🇦🇺', points:5640, solves:79, badge:'Advanced', col:'var(--neon-purple)', change:'↑', prev:14 },
  { rank:12, handle:'d3bugmode', country:'🇵🇱', points:5120, solves:73, badge:'Advanced', col:'var(--neon-purple)', change:'↓', prev:10 },
  { rank:142, handle:'you', country:'🌍', points:3840, solves:47, badge:'Intermediate', col:'var(--neon-orange)', change:'↑', prev:156, highlight:true },
]

const medals = ['🥇','🥈','🥉']

export default function Leaderboard() {
  const [filter, setFilter] = useState('global')

  return (
    <>
      <div className="ticker-bar">
        <div className="ticker-bar__left"><span>LEADERBOARD</span><span style={{color:'var(--border-2)'}}>·</span><span>SEASON IV</span><span style={{color:'var(--border-2)'}}>·</span><span>LIVE RANKINGS</span></div>
        <div><span style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-3)'}}>4,820 COMPETITORS · 12 DAYS LEFT</span></div>
      </div>

      <section style={{background:'var(--bg-0)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'56px 0 48px'}}>
        <div className="container">
          <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)',letterSpacing:'2px',marginBottom:'16px',textTransform:'uppercase'}}>— SEASON IV STANDINGS</div>
          <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(40px,5vw,72px)',lineHeight:'1.05',color:'var(--text-1)',fontWeight:800,marginBottom:'16px'}}>
            Who dominates<br/><span style={{color:'var(--neon-orange)'}}>the arena?</span>
          </h1>
          <p style={{fontSize:'16px',color:'var(--text-2)',maxWidth:'500px',lineHeight:'1.7',marginBottom:'28px'}}>
            4,820 competitors. 380 challenges. 12 days left in Season IV. Climb the ranks, earn XP, and claim your badge.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'rgba(255,255,255,0.06)',borderRadius:'var(--r-md)',overflow:'hidden',maxWidth:'600px'}}>
            {[['#142','Your Rank','var(--neon-green)'],['3,840','Your Points',''],['47','Challenges Solved',''],['S4','Current Season','']].map(([v,l,c]) => (
              <div key={l} style={{background:'var(--bg-2)',padding:'16px 18px'}}>
                <div style={{fontFamily:'var(--font-display)',fontSize:'28px',color:c||'var(--text-1)',marginBottom:'4px'}}>{v}</div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-3)',letterSpacing:'1.5px',textTransform:'uppercase'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'40px 0 80px'}}>
        <div className="container">
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'28px',flexWrap:'wrap'}}>
            {['global','web','binary','forensics','crypto','reverse'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`btn btn-sm ${filter===f?'btn-primary':'btn-outline'}`}
                style={{fontFamily:'var(--font-mono)',fontSize:'11px',letterSpacing:'1px',textTransform:'uppercase'}}>
                {f}
              </button>
            ))}
          </div>

          {/* Top 3 Podium */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',marginBottom:'32px'}}>
            {players.slice(0,3).map((p,i) => (
              <div key={p.handle} style={{background:'var(--bg-2)',border:`1px solid ${i===0?'rgba(255,215,0,0.25)':i===1?'rgba(192,192,192,0.2)':'rgba(205,127,50,0.2)'}`,borderRadius:'var(--r-xl)',padding:'28px',textAlign:'center',position:'relative',order:i===1?-1:'unset'}}>
                <div style={{fontSize:'32px',marginBottom:'12px'}}>{medals[i]}</div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:'16px',color:p.col,marginBottom:'4px'}}>{p.handle}</div>
                <div style={{fontSize:'12px',color:'var(--text-3)',marginBottom:'16px'}}>{p.country} · {p.badge}</div>
                <div style={{fontFamily:'var(--font-display)',fontSize:'32px',color:'var(--text-1)',marginBottom:'4px'}}>{p.points.toLocaleString()}</div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)'}}>points · {p.solves} solves</div>
              </div>
            ))}
          </div>

          {/* Full Table */}
          <div style={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'var(--r-lg)',overflow:'hidden'}}>
            <div style={{display:'grid',gridTemplateColumns:'60px 1fr 120px 100px 80px 80px',padding:'12px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)',fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)',letterSpacing:'1.5px',textTransform:'uppercase'}}>
              <span>#</span><span>Operator</span><span>Points</span><span>Solves</span><span>Badge</span><span>Δ</span>
            </div>
            {players.map(p => (
              <div key={p.rank} style={{display:'grid',gridTemplateColumns:'60px 1fr 120px 100px 80px 80px',padding:'14px 20px',borderBottom:'1px solid rgba(255,255,255,0.04)',alignItems:'center',background:p.highlight?'rgba(0,255,136,0.04)':'transparent',border:p.highlight?'1px solid rgba(0,255,136,0.15)':'none',transition:'background 0.15s'}}>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'14px',fontWeight:700,color:p.rank<=3?'var(--neon-orange)':'var(--text-3)'}}>{p.rank <= 3 ? medals[p.rank-1] : `#${p.rank}`}</span>
                <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <span style={{fontSize:'16px'}}>{p.country}</span>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:'14px',color:p.highlight?'var(--neon-green)':'var(--text-1)',fontWeight:p.highlight?600:400}}>{p.handle}{p.highlight?' (you)':''}</span>
                </div>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'14px',color:p.col}}>{p.points.toLocaleString()}</span>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'13px',color:'var(--text-2)'}}>{p.solves}</span>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:p.col,letterSpacing:'0.5px'}}>{p.badge}</span>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'13px',color:p.change==='↑'?'var(--neon-green)':p.change==='↓'?'var(--neon-red)':'var(--text-3)'}}>{p.change}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
