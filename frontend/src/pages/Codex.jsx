import React, { useState } from 'react'

const cats = [
  { label:'Web Security', count:86, active:true },
  { label:'Binary Exploitation', count:54 },
  { label:'Forensics & DFIR', count:38 },
  { label:'Reverse Engineering', count:47 },
  { label:'Active Directory', count:29 },
  { label:'Cryptography', count:41 },
  { label:'Network Security', count:63 },
  { label:'Malware Analysis', count:22 },
  { label:'OSCP Prep Paths', count:15 },
  { label:'Social Engineering', count:11 },
]

const sections = [
  { title:'WEB SECURITY — SQL INJECTION', entries:[
    { num:'[01]', title:'SQLi Fundamentals', desc:'Error-based, union-based, and blind injection techniques from first principles.', tags:['Beginner','Web'] },
    { num:'[02]', title:'Blind SQLi & OAST', desc:'Time-based and out-of-band techniques for extracting data without visible output.', tags:['Intermediate','Web'] },
    { num:'[03]', title:'SQLMap & Automation', desc:'Using SQLMap effectively, tamper scripts, WAF bypass, and custom injection strings.', tags:['Advanced','Web'] },
    { num:'[CTF]', title:'Injection Gauntlet', desc:'Season IV CTF — multi-stage SQLi challenge with modern defenses.', tags:['CTF','Season IV'] },
  ]},
  { title:'WEB SECURITY — AUTHENTICATION BYPASS', entries:[
    { num:'[01]', title:'JWT Attacks', desc:'Algorithm confusion, none algorithm, and key confusion attacks against JSON Web Tokens.', tags:['Intermediate','Web'] },
    { num:'[02]', title:'OAuth 2.0 Abuse', desc:'Open redirect chains, CSRF on authorization flow, and token leakage techniques.', tags:['Advanced','Web'] },
  ]},
]

export default function Codex() {
  const [activeCat, setActiveCat] = useState(0)

  return (
    <>
      <div className="ticker-bar">
        <div className="ticker-bar__left"><span>ENCYCLOPAEDIA CYBERNETICA</span><span style={{color:'var(--border-2)'}}>·</span><span>VOLUME XII</span></div>
        <div style={{display:'flex',gap:'16px'}}><span style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-3)'}}>CTF SEASON IV · OSCP · FORENSICS</span></div>
      </div>

      <section style={{background:'var(--bg-0)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'56px 0 48px'}}>
        <div className="container">
          <div style={{marginBottom:'16px',fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)',letterSpacing:'2px',textTransform:'uppercase'}}>— THE DEFINITIVE REFERENCE</div>
          <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(44px,6vw,76px)',lineHeight:'1.05',color:'var(--text-1)',marginBottom:'20px',fontWeight:800}}>
            Master the Art of<br/><span style={{color:'var(--neon-blue)'}}>Cybersecurity —</span><br/>From First Principles.
          </h1>
          <p style={{fontSize:'16px',color:'var(--text-2)',maxWidth:'540px',lineHeight:'1.7',marginBottom:'32px'}}>
            Live lectures, capture-the-flag arenas, and a complete <strong>indexed compendium</strong> of offensive & defensive security disciplines.
          </p>
          <div style={{display:'flex',maxWidth:'620px',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'var(--r-md)',overflow:'hidden',background:'rgba(255,255,255,0.02)'}}>
            <div style={{padding:'0 16px',fontFamily:'var(--font-mono)',fontSize:'13px',color:'var(--text-3)',borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center'}}>~/nexus $</div>
            <input type="text" placeholder="search the codex…" style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'13px 16px',fontFamily:'var(--font-mono)',fontSize:'14px',color:'var(--text-1)'}} />
            <button style={{padding:'0 24px',background:'var(--neon-blue)',color:'#fff',fontFamily:'var(--font-mono)',fontSize:'12px',fontWeight:600,letterSpacing:'1px',border:'none',cursor:'pointer'}}>QUERY</button>
          </div>
        </div>
      </section>

      <div style={{display:'flex',maxWidth:'var(--max-w)',margin:'0 auto'}}>
        <div style={{width:'240px',borderRight:'1px solid rgba(255,255,255,0.06)',padding:'28px 0',position:'sticky',top:'var(--nav-h)',height:'calc(100vh - var(--nav-h))',overflowY:'auto',flexShrink:0}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-3)',letterSpacing:'2px',textTransform:'uppercase',padding:'0 24px',marginBottom:'12px'}}>Categories</div>
          {cats.map((c, i) => (
            <div key={c.label} onClick={() => setActiveCat(i)}
              style={{padding:'9px 24px',fontSize:'13.5px',color:activeCat===i?'var(--text-1)':'var(--text-2)',cursor:'pointer',borderLeft:`2px solid ${activeCat===i?'var(--neon-blue)':'transparent'}`,background:activeCat===i?'rgba(96,165,250,0.04)':'transparent',display:'flex',alignItems:'center',justifyContent:'space-between',transition:'all 0.15s'}}>
              <span>{c.label}</span>
              <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)'}}>{c.count}</span>
            </div>
          ))}
        </div>
        <div style={{flex:1,padding:'36px 48px'}}>
          {sections.map(s => (
            <div key={s.title} style={{marginBottom:'40px'}}>
              <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-3)',letterSpacing:'2.5px',textTransform:'uppercase',marginBottom:'20px',paddingBottom:'12px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>{s.title}</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'14px'}}>
                {s.entries.map(e => (
                  <div key={e.title} style={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'var(--r-lg)',padding:'20px',cursor:'pointer',transition:'all 0.15s'}}>
                    <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)',marginBottom:'8px'}}>{e.num}</div>
                    <div style={{fontSize:'15px',color:'var(--text-1)',fontWeight:500,marginBottom:'6px'}}>{e.title}</div>
                    <div style={{fontSize:'12px',color:'var(--text-2)',lineHeight:'1.6',marginBottom:'12px'}}>{e.desc}</div>
                    <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                      {e.tags.map(t => <span key={t} className="badge badge-gray">{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
