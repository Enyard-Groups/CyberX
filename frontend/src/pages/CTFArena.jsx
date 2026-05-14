import React, { useState } from 'react'

const challenges = [
  { cat:'WEB', pts:100, title:'Injection Gauntlet', desc:'Classic SQLi meets modern WAF bypass. Find the flag hidden in the admin panel.', solves:284, diff:'easy', solved:true, col:'var(--neon-green)' },
  { cat:'BINARY', pts:250, title:'Stack Overflow 101', desc:'Classic stack-based buffer overflow. No canary, no PIE. ret2win time.', solves:156, diff:'medium', solved:false, col:'#fbbf24' },
  { cat:'FORENSICS', pts:150, title:'Memory Dump', desc:'A volatile memory image from a compromised server. Find what the attacker ran.', solves:203, diff:'easy', solved:true, col:'var(--neon-green)' },
  { cat:'CRYPTO', pts:300, title:'RSA Weak Keys', desc:'Two primes share a factor. Factor the modulus and decrypt the ciphertext.', solves:89, diff:'hard', solved:false, col:'var(--neon-orange)' },
  { cat:'WEB', pts:400, title:'SSRF to RCE', desc:'A metadata endpoint behind a proxy. Chain SSRF to internal service exploitation.', solves:42, diff:'hard', solved:false, col:'var(--neon-orange)' },
  { cat:'REVERSE', pts:350, title:'Obfuscated Packer', desc:'A heavily packed binary with anti-debug tricks. Unpack and find the serial.', solves:61, diff:'hard', solved:false, col:'var(--neon-orange)' },
  { cat:'WEB', pts:500, title:'Prototype Pollution RCE', desc:'A Node.js app vulnerable to prototype pollution leading to code execution.', solves:18, diff:'expert', solved:false, col:'var(--neon-red)' },
  { cat:'FORENSICS', pts:200, title:'Network PCAP Analysis', desc:'Analyze a suspicious PCAP. Identify C2 communication and extract the payload.', solves:134, diff:'medium', solved:false, col:'#fbbf24' },
  { cat:'CRYPTO', pts:450, title:'Custom Cipher Break', desc:'A proprietary stream cipher with a flawed PRNG. Recover the key.', solves:29, diff:'expert', solved:false, col:'var(--neon-red)' },
]

export default function CTFArena() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? challenges : challenges.filter(c => c.cat.toLowerCase().includes(filter) || c.diff === filter)

  return (
    <>
      <div className="ticker-bar">
        <div className="ticker-bar__left"><span>CTF ARENA</span><span style={{color:'var(--border-2)'}}>·</span><span>SEASON IV</span><span style={{color:'var(--border-2)'}}>·</span><span>LIVE COMPETITION</span></div>
        <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
          <span style={{display:'flex',alignItems:'center',gap:'6px',fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)'}}><span className="dot-live"></span> 38 ONLINE</span>
          <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)'}}>12 DAYS LEFT IN SEASON</span>
        </div>
      </div>

      <section style={{background:'var(--bg-0)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'56px 0 40px'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'48px',alignItems:'start'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:'48px',alignItems:'start'}}>
              <div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'20px',display:'flex',alignItems:'center',gap:'10px'}}>
                  <span style={{width:'24px',height:'1px',background:'var(--text-3)',display:'block'}}></span>CAPTURE THE FLAG
                </div>
                <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(40px,5vw,68px)',lineHeight:'1.05',color:'var(--text-1)',marginBottom:'16px',fontWeight:800}}>
                  Compete.<br/>Capture.<br/><span style={{color:'var(--neon-green)'}}>Dominate.</span>
                </h1>
                <p style={{fontSize:'15px',color:'var(--text-2)',lineHeight:'1.7',marginBottom:'28px'}}>380+ challenges across web exploitation, binary, forensics, crypto, and reverse engineering. Season IV is live — compete globally and climb the ranks.</p>
                <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                  <button className="btn btn-primary btn-lg">⚑ Enter Arena</button>
                  <button className="btn btn-outline btn-lg">View Scoreboard</button>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'rgba(255,255,255,0.06)',borderRadius:'var(--r-md)',overflow:'hidden',marginTop:'24px'}}>
                  {[['380+','Challenges'],['38','Online Now'],['12','Days Left']].map(([v,l]) => (
                    <div key={l} style={{background:'var(--bg-2)',padding:'16px 18px'}}>
                      <div style={{fontFamily:'var(--font-display)',fontSize:'28px',color:l==='Online Now'?'var(--neon-green)':'var(--text-1)',marginBottom:'4px'}}>{v}</div>
                      <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-3)',letterSpacing:'1.5px',textTransform:'uppercase'}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'var(--r-lg)',overflow:'hidden'}}>
                <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--text-2)',letterSpacing:'1px'}}>SEASON IV — CURRENT</span>
                  <span className="badge badge-green"><span className="dot-live" style={{width:'5px',height:'5px'}}></span> LIVE</span>
                </div>
                <div style={{padding:'20px'}}>
                  <div style={{marginBottom:'16px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)',marginBottom:'8px'}}><span>Season Progress</span><span style={{color:'var(--neon-green)'}}>73%</span></div>
                    <div style={{height:'5px',background:'rgba(255,255,255,0.06)',borderRadius:'3px',overflow:'hidden'}}><div style={{width:'73%',height:'100%',background:'var(--neon-green)',borderRadius:'3px'}}></div></div>
                  </div>
                  {[['Your Rank','#142 / 4,820','var(--neon-green)'],['Points','3,840 pts',''],['Solved','47 / 380',''],['Top Category','Web · 18 solves','var(--neon-blue)'],['Season Ends','May 11, 2025','']].map(([k,v,c]) => (
                    <div key={k} style={{display:'flex',justifyContent:'space-between',fontFamily:'var(--font-mono)',fontSize:'12px',padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                      <span style={{color:'var(--text-3)'}}>{k}</span>
                      <span style={{color:c||'var(--text-1)'}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{padding:'40px 0 80px'}}>
        <div className="container">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px'}}>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'28px',color:'var(--text-1)',fontWeight:700}}>Challenges</h2>
            <span style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--text-3)'}}>Showing {filtered.length} of 380+</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'24px 0',flexWrap:'wrap',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
            {['all','web','binary','forensics','crypto','reverse','easy','medium','hard','expert'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{fontFamily:'var(--font-mono)',fontSize:'11px',padding:'5px 13px',borderRadius:'4px',border:'1px solid',cursor:'pointer',transition:'all 0.15s',
                  background: filter===f?'rgba(255,255,255,0.06)':'transparent',
                  color: filter===f?'var(--text-1)':f==='easy'?'var(--neon-green)':f==='medium'?'#fbbf24':f==='hard'?'var(--neon-orange)':f==='expert'?'var(--neon-red)':'var(--text-3)',
                  borderColor: filter===f?'rgba(255,255,255,0.2)':f==='easy'?'rgba(74,222,128,0.3)':f==='medium'?'rgba(251,191,36,0.3)':f==='hard'?'rgba(249,115,22,0.3)':f==='expert'?'rgba(248,113,113,0.3)':'rgba(255,255,255,0.06)'
                }}>
                {f === 'all' ? `All ${challenges.length}` : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',padding:'28px 0'}}>
            {filtered.map(c => (
              <div key={c.title} style={{background:'var(--bg-2)',border:`1px solid ${c.solved?'rgba(0,255,136,0.2)':'rgba(255,255,255,0.06)'}`,borderRadius:'var(--r-lg)',padding:'22px',display:'flex',flexDirection:'column',gap:'12px',cursor:'pointer',transition:'all 0.2s'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-3)',letterSpacing:'1.5px'}}>{c.cat}</span>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:'13px',fontWeight:600,color:c.col}}>{c.pts} pts</span>
                </div>
                <div style={{fontSize:'15px',color:'var(--text-1)',fontWeight:500}}>{c.title}</div>
                <div style={{fontSize:'12px',color:'var(--text-2)',lineHeight:'1.6',flex:1}}>{c.desc}</div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:'10px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)'}}>◈ {c.solves} solves</span>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:'10px',letterSpacing:'1px',color:c.solved?'var(--neon-green)':'var(--text-3)'}}>{c.solved?'✓ SOLVED':'UNSOLVED'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
