import React from 'react'

const labs = [
  { name:'WEB-001', title:'Damn Vulnerable Web App', desc:'Classic vulnerable web app. SQLi, XSS, CSRF, command injection — all intentionally misconfigured.', diff:'Beginner', os:'Linux', running:true, tagCls:'badge-green' },
  { name:'WEB-014', title:'JWT Authentication Bypass', desc:'A Node.js app using flawed JWT validation. Exploit algorithm confusion to forge admin tokens.', diff:'Intermediate', os:'Linux', running:false, tagCls:'badge-blue' },
  { name:'BIN-003', title:'Buffer Overflow — x64', desc:'Classic stack smashing on a 64-bit ELF. Craft a ROP chain to pop a shell.', diff:'Intermediate', os:'Linux', running:true, tagCls:'badge-orange' },
  { name:'AD-002', title:'Active Directory Lab', desc:'Full Windows AD environment. Practice Kerberoasting, BloodHound, DCSync, and lateral movement.', diff:'Advanced', os:'Windows', running:false, tagCls:'badge-orange' },
  { name:'FOR-005', title:'Forensics — Memory Image', desc:"Analyze a live memory dump from a compromised Ubuntu server. Find the attacker's persistence mechanism.", diff:'Intermediate', os:'Linux', running:false, tagCls:'badge-blue' },
  { name:'REV-007', title:'Reverse Engineering — Crackme', desc:'A packed binary with anti-debug techniques. Unpack, analyze, and recover the hidden serial key.', diff:'Advanced', os:'Linux', running:false, tagCls:'badge-red' },
  { name:'WEB-022', title:'SSRF to Cloud Metadata', desc:'A web app proxy with SSRF vulnerability. Reach the cloud metadata endpoint and extract IAM credentials.', diff:'Advanced', os:'Linux', running:false, tagCls:'badge-red' },
  { name:'NET-004', title:'Network PCAP Lab', desc:'Analyze captured traffic from a compromised network. Identify the C2 protocol and extract the payload.', diff:'Beginner', os:'Linux', running:false, tagCls:'badge-green' },
  { name:'MAL-002', title:'Malware Sandbox', desc:'Analyze a suspicious PE binary in an isolated Windows sandbox. Dynamic analysis with Procmon, Wireshark.', diff:'Advanced', os:'Windows', running:true, tagCls:'badge-red' },
]

const diffCol = { Beginner:'var(--neon-green)', Intermediate:'var(--neon-blue)', Advanced:'var(--neon-orange)' }

export default function Labs() {
  return (
    <>
      <div className="ticker-bar">
        <div className="ticker-bar__left"><span>LAB ENVIRONMENTS</span><span style={{color:'var(--border-2)'}}>·</span><span>BROWSER-BASED</span><span style={{color:'var(--border-2)'}}>·</span><span>SPINS UP IN &lt; 30s</span></div>
        <div><span style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-3)'}}>96 LABS ONLINE</span></div>
      </div>

      <section style={{background:'var(--bg-0)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'56px 0 48px'}}>
        <div className="container">
          <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)',letterSpacing:'2px',marginBottom:'16px',textTransform:'uppercase'}}>— HANDS-ON ENVIRONMENTS</div>
          <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(40px,5vw,72px)',lineHeight:'1.05',color:'var(--text-1)',marginBottom:'16px',fontWeight:800}}>
            Attack real systems.<br/><span style={{color:'var(--neon-orange)'}}>No setup required.</span>
          </h1>
          <p style={{fontSize:'16px',color:'var(--text-2)',lineHeight:'1.7',maxWidth:'520px',marginBottom:'28px'}}>Browser-based vulnerable machines that spin up in seconds. Every lab maps to Codex entries and lecture content — theory meets practice.</p>
          <div style={{display:'flex',gap:'10px'}}>
            <button className="btn btn-primary btn-lg" style={{background:'var(--neon-orange)',borderColor:'var(--neon-orange)'}}>Launch Lab →</button>
            <button className="btn btn-outline btn-lg">View All Environments</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'rgba(255,255,255,0.06)',borderRadius:'var(--r-md)',overflow:'hidden',maxWidth:'700px',marginTop:'32px'}}>
            {[['96','Live Labs','var(--neon-green)'],['<30s','Spin-up time',''],['40+','Domains',''],['100%','Browser-based','']].map(([v,l,c]) => (
              <div key={l} style={{background:'var(--bg-2)',padding:'18px 20px'}}>
                <div style={{fontFamily:'var(--font-display)',fontSize:'32px',color:c||'var(--text-1)'}}>{v}</div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-3)',letterSpacing:'1.5px',textTransform:'uppercase',marginTop:'4px'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'40px 0 80px'}}>
        <div className="container">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px'}}>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'28px',color:'var(--text-1)',fontWeight:700}}>Available Labs</h2>
            <span style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--text-3)'}}>Showing {labs.length} of 96</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px'}}>
            {labs.map(l => (
              <div key={l.name} style={{background:'var(--bg-2)',border:`1px solid ${l.running?'rgba(0,255,136,0.2)':'rgba(255,255,255,0.06)'}`,borderRadius:'var(--r-lg)',overflow:'hidden',cursor:'pointer',transition:'all 0.2s'}}>
                <div style={{padding:'18px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:'13px',fontWeight:600,color:'var(--text-1)'}}>{l.name}</span>
                  <span className={`badge ${l.tagCls}`}>{l.running ? <><span className="dot-live" style={{width:'5px',height:'5px'}}></span> RUNNING</> : 'READY'}</span>
                </div>
                <div style={{padding:'20px'}}>
                  <div style={{fontSize:'16px',fontWeight:500,color:'var(--text-1)',marginBottom:'8px'}}>{l.title}</div>
                  <div style={{fontSize:'13px',color:'var(--text-2)',lineHeight:'1.65',marginBottom:'16px'}}>{l.desc}</div>
                  <div style={{display:'flex',flexDirection:'column',gap:'6px',marginBottom:'16px'}}>
                    {[['DIFFICULTY',l.diff,diffCol[l.diff]||'var(--text-2)'],['OS',l.os,'var(--text-2)'],['SPIN-UP','< 30s','var(--text-2)']].map(([k,v,c]) => (
                      <div key={k} style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontFamily:'var(--font-mono)',fontSize:'11px'}}>
                        <span style={{color:'var(--text-3)'}}>{k}</span>
                        <span style={{color:c}}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{padding:'16px 20px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <button className={`btn ${l.running?'btn-outline':'btn-primary'} btn-sm`}>{l.running?'Reconnect →':'Launch →'}</button>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)'}}>Operator+</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
