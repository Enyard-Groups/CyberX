import React, { useState } from 'react'

const lectures = [
  { id:'L001', live:true, title:'Web App Pentesting 101', instructor:'Zara Okafor', tag:'Web Security', viewers:284, started:'12 min ago', duration:'2h 30m', tags:['Beginner','Web','OWASP'], desc:'Full-stack web application penetration testing from recon to report. Covers OWASP Top 10, Burp Suite workflows, and real-world targets.' },
  { id:'L002', live:true, title:'Active Directory Attacks', instructor:'Marcus Osei', tag:'Active Directory', viewers:156, started:'1h 8min ago', duration:'3h 00m', tags:['Advanced','Windows','AD'], desc:'Kerberoasting, BloodHound enumeration, DCSync, Pass-the-Hash, and lateral movement through a full corporate AD environment.' },
  { id:'L003', live:false, title:'Binary Exploitation Deep Dive', instructor:'Elena Vasquez', tag:'Binary', viewers:0, started:'', duration:'4h 15m', tags:['Advanced','Linux','PWN'], desc:'x64 stack and heap exploitation, ROP chains, format string bugs, and bypass techniques for modern mitigations (ASLR, PIE, canaries).' },
  { id:'L004', live:false, title:'OSCP Prep — Buffer Overflows', instructor:'Katsuki Mori', tag:'OSCP Prep', viewers:0, started:'', duration:'2h 45m', tags:['Intermediate','Windows','OSCP'], desc:'Systematic approach to classic Windows buffer overflows. From crash to working exploit — exactly as seen on the OSCP exam.' },
  { id:'L005', live:false, title:'Malware Analysis Fundamentals', instructor:'Priya Nair', tag:'Malware', viewers:0, started:'', duration:'3h 30m', tags:['Intermediate','Forensics'], desc:'Static and dynamic malware analysis techniques. PE structure, API monitoring with Procmon, network IOCs, and sandbox evasion.' },
  { id:'L006', live:false, title:'Cryptography for Hackers', instructor:'Alex Reyes', tag:'Crypto', viewers:0, started:'', duration:'2h 00m', tags:['Intermediate','CTF'], desc:'Practical crypto attacks: padding oracles, CBC bit-flipping, RSA weak key exploitation, hash length extension, and JWT attacks.' },
  { id:'L007', live:false, title:'Cloud Security — AWS Attacks', instructor:'Zara Okafor', tag:'Cloud', viewers:0, started:'', duration:'3h 15m', tags:['Advanced','Cloud','AWS'], desc:'S3 misconfigurations, SSRF to metadata, IAM privilege escalation, Lambda exploitation, and CloudTrail evasion techniques.' },
  { id:'L008', live:false, title:'Reverse Engineering 101', instructor:'Marcus Osei', tag:'Reverse', viewers:0, started:'', duration:'2h 50m', tags:['Intermediate','RE','CTF'], desc:'x86/x64 assembly fundamentals, Ghidra and IDA workflow, anti-debug bypass, packer analysis, and crackme walkthroughs.' },
]

export default function Lectures() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? lectures : filter === 'live' ? lectures.filter(l => l.live) : lectures.filter(l => !l.live)

  return (
    <>
      <div className="ticker-bar">
        <div className="ticker-bar__left"><span>LIVE LECTURES</span><span style={{color:'var(--border-2)'}}>·</span><span>SEASON IV</span><span style={{color:'var(--border-2)'}}>·</span><span>EXPERT-LED</span></div>
        <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
          <span style={{display:'flex',alignItems:'center',gap:'6px',fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-3)'}}><span className="dot-live"></span> 8 LIVE NOW · 440 WATCHING</span>
        </div>
      </div>

      <section style={{background:'var(--bg-0)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'56px 0 48px'}}>
        <div className="container">
          <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)',letterSpacing:'2px',marginBottom:'16px',textTransform:'uppercase'}}>— EXPERT-LED SESSIONS</div>
          <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(40px,5vw,72px)',lineHeight:'1.05',color:'var(--text-1)',fontWeight:800,marginBottom:'16px'}}>
            Learn from<br/><span style={{color:'var(--neon-blue)'}}>practitioners.</span>
          </h1>
          <p style={{fontSize:'16px',color:'var(--text-2)',maxWidth:'520px',lineHeight:'1.7',marginBottom:'28px'}}>94 expert-led sessions across every offensive and defensive domain. Live, recorded, and indexed — all linked to hands-on labs and Codex entries.</p>
          <div style={{display:'flex',gap:'10px'}}>
            <button className="btn btn-primary btn-lg" style={{background:'var(--neon-blue)',borderColor:'var(--neon-blue)'}}>▶ Watch Live</button>
            <button className="btn btn-outline btn-lg">Browse All 94 →</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'rgba(255,255,255,0.06)',borderRadius:'var(--r-md)',overflow:'hidden',maxWidth:'600px',marginTop:'32px'}}>
            {[['94','Total Lectures',''],['8','Live Now','var(--neon-green)'],['440','Watching Now',''],['24h','New Content','']].map(([v,l,c]) => (
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
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'28px'}}>
            {[['all','All Lectures'],['live','Live Now'],['recorded','Recorded']].map(([f,label]) => (
              <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter===f?'btn-primary':'btn-outline'}`} style={{fontFamily:'var(--font-mono)',fontSize:'11px',letterSpacing:'1px'}}>
                {f === 'live' && <span className="dot-live" style={{width:'6px',height:'6px',marginRight:'5px'}}></span>}
                {label}
              </button>
            ))}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'16px'}}>
            {filtered.map(l => (
              <div key={l.id} style={{background:'var(--bg-2)',border:`1px solid ${l.live?'rgba(0,255,136,0.2)':'rgba(255,255,255,0.06)'}`,borderRadius:'var(--r-lg)',padding:'24px',display:'grid',gridTemplateColumns:'1fr auto',gap:'24px',alignItems:'start',cursor:'pointer',transition:'all 0.2s'}}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
                    {l.live && <span className="badge badge-green"><span className="dot-live" style={{width:'5px',height:'5px'}}></span> LIVE</span>}
                    <span className="badge badge-gray">{l.tag}</span>
                    <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)'}}>{l.id}</span>
                  </div>
                  <div style={{fontSize:'20px',fontWeight:600,color:'var(--text-1)',marginBottom:'6px'}}>{l.title}</div>
                  <div style={{fontSize:'13px',color:'var(--text-3)',marginBottom:'10px',fontFamily:'var(--font-mono)'}}>by {l.instructor} · {l.duration}</div>
                  <div style={{fontSize:'14px',color:'var(--text-2)',lineHeight:'1.65',marginBottom:'14px'}}>{l.desc}</div>
                  <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                    {l.tags.map(t => <span key={t} className="badge badge-gray">{t}</span>)}
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'10px',alignItems:'flex-end',minWidth:'140px'}}>
                  {l.live
                    ? <><span style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--text-3)'}}>⌛ Started {l.started}</span><span style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--neon-green)'}}>👁 {l.viewers} watching</span><button className="btn btn-primary btn-sm" style={{marginTop:'8px'}}>▶ Watch Live</button></>
                    : <><button className="btn btn-outline btn-sm">▶ Watch Recording</button><button className="btn btn-outline btn-sm" style={{fontSize:'11px'}}>+ Add to Queue</button></>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
