import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/home.css'

const faqs = [
  { q: 'Do I need a technical background to get started?', a: "Not at all. CyberX starts from absolute first principles. Whether you're a developer, student, or curious beginner — every topic is explained before depth is introduced.", tags: ['Beginner Friendly','No Prerequisites'] },
  { q: 'What is a CTF (Capture The Flag)?', a: 'CTFs are competitive hacking events where you solve security challenges to find hidden "flags". Season IV is live with 380+ challenges across web, binary, crypto, and forensics.', tags: ['CTF','Competition'] },
  { q: 'Are live lectures recorded?', a: 'Yes — all sessions are recorded and available to Operator+ members within 24 hours, fully indexed and linked to Codex entries.', tags: ['Operator','Red Team'] },
  { q: 'How are the lab environments different?', a: 'Every lab is a real browser-based VM — not a simulation. You attack actual vulnerable systems. No download, no setup, spins up in under 30 seconds.', tags: ['Labs'] },
  { q: 'Is CyberX free to use?', a: 'Yes. Explorer tier is permanently free — no credit card required. Includes full Codex access and 20 CTF challenges.', tags: ['Free Tier'] },
  { q: 'How is this different from other platforms?', a: 'We combine structured Codex reference, live lectures, real labs, and CTF competitions in one place. Every topic links to hands-on practice — no passive video watching.', tags: [] },
]

const testimonials = [
  { init:'MO', name:'Marcus Osei', role:'Bug Bounty Hunter · Accra', handle:'@ghostshell_dev', tag:'Bug Bounty', stars:'★★★★★', body:"Reported my first critical CVE three months after joining. The web exploitation Codex is absurdly thorough — SSRF, CORS misconfig, prototype pollution — all indexed with real-world context.", tags:['SSRF','Prototype Pollution','Season III'], bounty:'$4,200', bountyLabel:'First Bounty', bg:'#1a1408', col:'#ff6b00' },
  { init:'PN', name:'Priya Nair', role:'Security Engineer · London', handle:'@r00t_runner', tag:'OSCP', stars:'★★★★★', body:"Passed OSCP on my first attempt. The lab environments here are the closest thing to the OSCP exam experience I've found. Methodology-first, no hand-holding.", tags:['OSCP Prep','Labs','Certification'], bounty:'', bountyLabel:'', bg:'#081420', col:'#00d4ff' },
  { init:'EV', name:'Elena Vasquez', role:'CS Student · Madrid', handle:'@xor_elena', tag:'Beginner', stars:'★★★★★', body:"Started with zero experience. Within 3 months I could read and write actual exploit code. The Codex is unlike anything else — it's a proper reference, not a tutorial.", tags:['0→CTF','Beginner Path'], bounty:'', bountyLabel:'', bg:'#0a1420', col:'#00ff88' },
  { init:'KM', name:'Katsuki Mori', role:'Pentester · Tokyo', handle:'@nullbyte_kat', tag:'#7 Season III', stars:'★★★★★', body:"Season IV CTF challenges are legitimately hard. I've competed on HackTheBox and TryHackMe — CyberX challenges are closer to real engagements than anything else.", tags:['CTF','Season IV'], bounty:'', bountyLabel:'', bg:'#140820', col:'#b44dff' },
]

export default function Home() {
  const canvasRef = useRef(null)
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeChip, setActiveChip] = useState('⊕ All')
  const [openFaq, setOpenFaq] = useState(null)
  const [tCur, setTCur] = useState(0)
  const [termLines, setTermLines] = useState([])

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5, o: Math.random() * 0.4 + 0.1
    }))
    let running = true
    const frame = () => {
      if (!running) return
      ctx.clearRect(0, 0, c.width, c.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > c.width) p.vx *= -1
        if (p.y < 0 || p.y > c.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,255,136,${p.o})`; ctx.fill()
      })
      pts.forEach((p, i) => {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = p.x - pts[j].x, dy = p.y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(0,255,136,${0.06 * (1 - d / 120)})`; ctx.stroke()
          }
        }
      })
      requestAnimationFrame(frame)
    }
    frame()
    return () => { running = false; window.removeEventListener('resize', resize) }
  }, [])

  useEffect(() => {
    const tData = [
      { t:'cmd', s:'nexus search "sql injection"' },
      { t:'res', s:'// Codex — 14 entries found' },
      { t:'link', s:'  [01] SQLi Fundamentals · Beginner' },
      { t:'link', s:'  [02] Blind SQLi & OAST · Intermediate' },
      { t:'link', s:'  [03] SQLMap & Automation · Advanced' },
      { t:'link', s:'  [CTF] Injection Gauntlet · Season IV' },
      { t:'blank', s:'' },
      { t:'cmd', s:'nexus lecture --live' },
      { t:'live', s:'  ● Web App Pentesting 101' },
      { t:'res', s:'  Started 12 min ago · 284 watching' },
    ]
    let ti = 0, ci = 0
    const type = () => {
      if (ti >= tData.length) return
      const line = tData[ti]
      if (line.t === 'blank') { setTermLines(l => [...l, { t:'blank', s:'' }]); ti++; setTimeout(type, 200); return }
      if (ci === 0) setTermLines(l => [...l, { t: line.t, s: '' }])
      if (ci < line.s.length) {
        ci++
        setTermLines(l => l.map((x, i) => i === ti ? { ...x, s: line.s.slice(0, ci) } : x))
        setTimeout(type, line.t === 'cmd' ? 40 : 15)
      } else { ci = 0; ti++; setTimeout(type, line.t === 'cmd' ? 280 : 40) }
    }
    const timeout = setTimeout(type, 1200)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setTCur(c => (c + 1) % testimonials.length), 5000)
    return () => clearInterval(interval)
  }, [])

  const chips = ['⊕ All', '# Codex', '▶ Lectures', '⚑ CTF', '◫ Labs']
  const t = testimonials[tCur]

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <canvas className="hero__bg-canvas" ref={canvasRef}></canvas>
        <div className="hero__orb-1"></div>
        <div className="hero__orb-2"></div>
        <div className="hero__grid"></div>
        <div className="container">
          <div className="hero__inner">
            <div>
              <div className="hero__eyebrow anim-on-load delay-1">
                <span className="dot-live"></span>
                Season IV Live · 38 operators online
              </div>
              <h1 className="hero__title anim-on-load delay-2">
                Master the<br />
                <span className="line-accent">Art of Hacking.</span><br />
                <span className="line-dim">From First Principles.</span>
              </h1>
              <p className="hero__desc anim-on-load delay-3">
                Live lectures, capture-the-flag arenas, and a complete <strong>indexed compendium</strong> of offensive & defensive security — curated for curious minds of every background.
              </p>
              <div className="hero__chips anim-on-load delay-3">
                {chips.map(c => (
                  <button key={c} className={`hero__chip${activeChip === c ? ' active' : ''}`} onClick={() => setActiveChip(c)}>{c}</button>
                ))}
              </div>
              <div className="hero__search anim-on-load delay-4">
                <div className="hero__search-prefix">~/nexus $</div>
                <input
                  type="text" placeholder="search the codex…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && search.trim()) navigate(`/codex?q=${encodeURIComponent(search.trim())}`) }}
                />
                <button onClick={() => { if (search.trim()) navigate(`/codex?q=${encodeURIComponent(search.trim())}`) }}>QUERY</button>
              </div>
              <div className="hero__ctas anim-on-load delay-4">
                <Link to="/lectures" className="btn btn-primary btn-lg">→ Start Learning</Link>
                <Link to="/lectures" className="btn btn-outline-green btn-lg">○ View Live Lectures</Link>
              </div>
              <div className="hero__footnote anim-on-load delay-5">
                <span>Free to explore</span>
                <span>No credit card</span>
                <span>20 free CTFs</span>
              </div>
            </div>

            {/* Terminal */}
            <div className="hero__terminal">
              <div className="terminal-panel">
                <div className="terminal-panel__bar">
                  <div className="terminal-panel__dots">
                    <span className="terminal-panel__dot" style={{ background:'#ff3b30' }}></span>
                    <span className="terminal-panel__dot" style={{ background:'#ffcc00' }}></span>
                    <span className="terminal-panel__dot" style={{ background:'#28c840' }}></span>
                  </div>
                  <div className="terminal-panel__title">nexus@cyberx:~</div>
                </div>
                <div className="terminal-panel__body">
                  <div className="t-comment"># CyberX v4.2.1 — Operator Terminal</div>
                  <div className="t-comment"># Type to search the codex</div>
                  <br />
                  {termLines.map((l, i) => {
                    if (l.t === 'blank') return <br key={i} />
                    const cls = l.t === 'cmd' ? 't-prompt' : l.t === 'link' ? 't-link' : l.t === 'live' ? 't-live' : 't-result'
                    return <div key={i} className={cls}>{l.s}</div>
                  })}
                  <div><span className="t-prompt">&gt; </span><span className="t-cursor"></span></div>
                </div>
              </div>
              <div className="hero__float-badge" onClick={() => navigate('/ctf')}>
                <span>🔒</span>
                <div>
                  <div style={{ color:'var(--text-1)', fontWeight:500 }}>CTF Arena</div>
                  <div style={{ fontSize:'10px', color:'var(--text-3)' }}>38 online now</div>
                </div>
                <div className="dot-live"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stats__grid" style={{ maxWidth:'var(--max-w)', margin:'0 auto', padding:'0 20px' }}>
          {[
            { icon:'👥', val:'12,400+', label:'Enrolled Students', sub:'+340 this week', g:'var(--neon-green),var(--neon-blue)' },
            { icon:'⚑', val:'380+', label:'CTF Challenges', sub:'Season IV live', g:'var(--neon-blue),var(--neon-purple)' },
            { icon:'🎓', val:'94', label:'Expert Lectures', sub:'8 live right now', g:'var(--neon-purple),var(--neon-orange)' },
            { icon:'🛡', val:'40+', label:'Security Domains', sub:'OSCP to DFIR', g:'var(--neon-orange),var(--neon-green)' },
          ].map(s => (
            <div key={s.label} className="stats__item">
              <div className="stats__glow"></div>
              <div className="stats__icon">{s.icon}</div>
              <div className="stats__val" style={{ background:`linear-gradient(90deg,${s.g})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{s.val}</div>
              <div className="stats__label">{s.label}</div>
              <div className="stats__sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="container">
          <div className="section-header center">
            <div className="eyebrow">Why CyberX</div>
            <h2>Everything in one<br />operator console.</h2>
            <p>Learn, practice, compete — all on one platform built by practitioners.</p>
          </div>
          <div className="features__grid">
            {[
              { icon:'◈', title:'Structured Learning Paths', desc:'Curated paths for OSCP, PNPT, CEH. Clear milestones, XP tracking, certificates on completion.', link:'Explore paths →', href:'/lectures', c:'rgba(0,255,136,0.2)', cg:'rgba(0,255,136,0.05)', ic:'rgba(0,255,136,0.1)', col:'var(--neon-green)' },
              { icon:'⚡', title:'Live CTF Arena', desc:'Season-based CTF events with real-time scoring. 380+ challenges from beginner to expert.', link:'Enter arena →', href:'/ctf', c:'rgba(0,212,255,0.2)', cg:'rgba(0,212,255,0.05)', ic:'rgba(0,212,255,0.1)', col:'var(--neon-blue)' },
              { icon:'◫', title:'Browser-Based Labs', desc:'Vulnerable machines spin up in seconds. No VM, no setup — just launch and attack.', link:'Launch lab →', href:'/labs', c:'rgba(180,77,255,0.2)', cg:'rgba(180,77,255,0.05)', ic:'rgba(180,77,255,0.1)', col:'var(--neon-purple)' },
              { icon:'📡', title:'Live Lectures', desc:'Expert-led sessions on current techniques — web hacking, binary exploitation, AD attacks.', link:'Watch live →', href:'/lectures', c:'rgba(0,255,136,0.2)', cg:'rgba(0,255,136,0.05)', ic:'rgba(0,255,136,0.08)', col:'var(--neon-green)' },
              { icon:'#', title:'The Codex', desc:'A complete indexed reference of offensive & defensive techniques. 4,000+ entries.', link:'Open codex →', href:'/codex', c:'rgba(0,212,255,0.2)', cg:'rgba(0,212,255,0.05)', ic:'rgba(0,212,255,0.08)', col:'var(--neon-blue)' },
              { icon:'✦', title:'Certificates & XP', desc:'Earn verifiable certificates and XP for every module. Flex your skills to employers.', link:'View plans →', href:'/pricing', c:'rgba(255,107,0,0.2)', cg:'rgba(255,107,0,0.05)', ic:'rgba(255,107,0,0.08)', col:'var(--neon-orange)' },
            ].map(f => (
              <div key={f.title} className="feature-card" style={{ '--c':f.c, '--cg':f.cg }}>
                <div className="feature-card__icon" style={{ background:f.ic, color:f.col }}>{f.icon}</div>
                <div className="feature-card__title">{f.title}</div>
                <p className="feature-card__desc">{f.desc}</p>
                <Link to={f.href} className="feature-card__link" style={{ color:f.col }}>{f.link}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background:'var(--bg-0)', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">Common Questions</div>
            <h2>Everything you need<br />to know about <span style={{ background:'linear-gradient(90deg,var(--neon-green),var(--neon-blue))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>CyberX.</span></h2>
            <p>A live platform, growing compendium, community of practitioners.</p>
          </div>
          <div id="faqList">
            {faqs.map((f, i) => (
              <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="faq-q__num">0{i + 1}</span>
                  <span className="faq-q__text">{f.q}</span>
                  <span className="faq-q__icon">+</span>
                </div>
                {openFaq === i && (
                  <div className="faq-a open">
                    {f.a}
                    {f.tags.length > 0 && (
                      <div className="faq-tags">
                        {f.tags.map(tag => <span key={tag} className="badge badge-gray">{tag}</span>)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section-header center">
            <div className="eyebrow">Verified Members</div>
            <h2>Real people.<br /><span style={{ background:'linear-gradient(90deg,var(--neon-green),var(--neon-blue))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Real breakthroughs.</span></h2>
            <p>From absolute beginners to seasoned red teamers.</p>
          </div>
          <div style={{ maxWidth:'700px', margin:'0 auto' }}>
            <div className="tcard">
              <div style={{ display:'flex', alignItems:'flex-start', gap:'14px', marginBottom:'16px' }}>
                <div className="tcard__avatar" style={{ background:t.bg, color:t.col }}>{t.init}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, color:'var(--text-0)', fontSize:'15px' }}>{t.name}</div>
                  <div style={{ fontSize:'13px', color:'var(--text-2)' }}>{t.role}</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color:'var(--text-3)' }}>{t.handle}</div>
                </div>
                <div>
                  <span className="badge badge-gray">{t.tag}</span>
                  <div style={{ color:'var(--neon-orange)', fontSize:'13px', marginTop:'6px' }}>{t.stars}</div>
                </div>
              </div>
              <div className="tcard__body">{t.body}</div>
              <div className="tcard__tag-row">{t.tags.map(tg => <span key={tg} className="badge badge-gray">{tg}</span>)}</div>
              {t.bounty && (
                <div style={{ display:'flex', alignItems:'baseline', gap:'8px' }}>
                  <div className="tcard__bounty">{t.bounty}</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text-3)' }}>{t.bountyLabel}</div>
                </div>
              )}
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'20px', flexWrap:'wrap', gap:'12px' }}>
              <div className="t-nav-dots">
                {testimonials.map((_, i) => (
                  <div key={i} className={`t-nav-dot${i === tCur ? ' active' : ''}`} onClick={() => setTCur(i)}></div>
                ))}
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <button className="btn btn-outline btn-sm" onClick={() => setTCur((tCur - 1 + testimonials.length) % testimonials.length)}>← Prev</button>
                <button className="btn btn-outline btn-sm" onClick={() => setTCur((tCur + 1) % testimonials.length)}>Next →</button>
                <button className="btn btn-primary btn-sm">Join Community</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm">
        <div className="container">
          <div className="cta-section">
            <div className="orb orb-green" style={{ width:'300px', height:'300px', top:'-100px', left:'-50px', opacity:0.3 }}></div>
            <div className="orb orb-blue" style={{ width:'300px', height:'300px', bottom:'-100px', right:'-50px', opacity:0.3 }}></div>
            <div style={{ position:'relative', zIndex:1 }}>
              <h2>Join 12,400+ security<br />professionals.</h2>
              <p>Free tier forever. Upgrade when you're ready for the full arsenal.</p>
              <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
                <Link to="/pricing" className="btn btn-primary btn-xl">Enroll Now →</Link>
                <Link to="/ctf" className="btn btn-outline-green btn-xl">Try a Free CTF</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
