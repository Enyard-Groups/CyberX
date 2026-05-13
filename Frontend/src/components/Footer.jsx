import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize, { passive: true })
    const chars = 'ABCDEF0123456789アイウエオカキクケコ#$<>[]'
    const fs = 13
    let drops = Array(Math.floor(canvas.width / fs)).fill(1)
    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(9,13,24,0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fs}px JetBrains Mono, monospace`
      drops.forEach((y, i) => {
        ctx.globalAlpha = Math.random() * 0.4 + 0.05
        ctx.fillStyle = '#00ff88'
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fs, y * fs)
        if (y * fs > canvas.height && Math.random() > 0.975) drops[i] = 0
        else drops[i]++
      })
      ctx.globalAlpha = 1
    }, 50)
    return () => { clearInterval(interval); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <footer className="cx-footer">
      <canvas className="cx-footer__matrix" ref={canvasRef}></canvas>
      <div className="cx-footer__glow-1"></div>
      <div className="cx-footer__glow-2"></div>

      <div className="container cx-footer__content">
        {/* Brand */}
        <div className="cx-footer__brand">
          <div className="cx-footer__logo">
            <div className="cx-logo__hex" style={{ width:'40px', height:'40px', fontSize:'13px' }}>
              <span className="cx-logo__hex-inner">CX</span>
            </div>
            <div>
              <div className="cx-footer__logo-name">CyberX</div>
              <div className="cx-footer__logo-sub">ENCYCLOPAEDIA CYBERNETICA</div>
            </div>
          </div>
          <p className="cx-footer__desc">
            A live platform, a growing compendium, and a community of practitioners.
            From first principles to advanced exploit development — all indexed, all live.
          </p>
          <div className="cx-footer__subscribe">
            <input type="email" placeholder="operator@cyberx.sh" className="cx-footer__input" />
            <button className="btn btn-primary btn-sm">Subscribe</button>
          </div>
          <div className="cx-footer__socials">
            {['Discord','GitHub','Twitter','RSS'].map(s => (
              <button key={s} className="cx-footer__social" aria-label={s}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" opacity="0.4"/>
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Learn */}
        <div className="cx-footer__col">
          <h4 className="cx-footer__col-title">Learn</h4>
          <ul>
            <li><Link to="/codex">Codex Reference</Link></li>
            <li><Link to="/lectures">Live Lectures <span className="badge badge-green" style={{ fontSize:'9px', padding:'2px 6px' }}>8 LIVE</span></Link></li>
            <li><Link to="/ctf">CTF Arena <span className="badge badge-blue" style={{ fontSize:'9px', padding:'2px 6px' }}>S4</span></Link></li>
            <li><Link to="/labs">Lab Environments</Link></li>
            <li><Link to="/leaderboard">Leaderboard</Link></li>
            <li><a href="#">Certifications</a></li>
          </ul>
        </div>

        {/* Platform */}
        <div className="cx-footer__col">
          <h4 className="cx-footer__col-title">Platform</h4>
          <ul>
            <li><a href="#">About CyberX</a></li>
            <li><Link to="/pricing">Pricing <span className="badge badge-purple" style={{ fontSize:'9px', padding:'2px 6px' }}>NEW</span></Link></li>
            <li><a href="#">API Access</a></li>
            <li><a href="#">Instructor Portal</a></li>
            <li><a href="#">Changelog <span className="badge badge-gray" style={{ fontSize:'9px', padding:'2px 6px' }}>v4.2.1</span></a></li>
            <li><a href="#">Status</a></li>
          </ul>
        </div>

        {/* Community */}
        <div className="cx-footer__col">
          <h4 className="cx-footer__col-title">Community</h4>
          <ul>
            <li><a href="#">Discord Server <span className="badge badge-green" style={{ fontSize:'9px', padding:'2px 6px' }}>ONLINE</span></a></li>
            <li><a href="#">Write-ups</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Hall of Fame</a></li>
            <li><a href="#">Bug Bounty</a></li>
            <li><a href="#">Contribute</a></li>
          </ul>
        </div>
      </div>

      {/* Status bar */}
      <div className="cx-footer__statusbar">
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
          <div className="cx-footer__status-items">
            <div className="cx-footer__status-item">
              <span className="dot-live" style={{ width:'5px', height:'5px' }}></span>
              ALL SYSTEMS OPERATIONAL
            </div>
            <div className="cx-footer__status-item">CTF ARENA · 38 ONLINE</div>
            <div className="cx-footer__status-item">SEASON IV · 12 DAYS LEFT</div>
            <div className="cx-footer__status-item hidden-mobile">94 LECTURES INDEXED</div>
            <div className="cx-footer__status-item hidden-mobile">API · 12MS LATENCY</div>
          </div>
          <div className="cx-footer__copy">© 2025 CyberX. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
