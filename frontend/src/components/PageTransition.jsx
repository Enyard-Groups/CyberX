import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageTransition() {
  const [visible, setVisible] = useState(true)
  const canvasRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 400)
    return () => clearTimeout(t)
  }, [location])

  useEffect(() => {
    if (!visible) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const chars = 'ABCDEF0123456789アイウエオ<>{}[]#$@!'
    const cols = Math.floor(canvas.width / 18)
    const drops = Array(cols).fill(0)
    let running = true
    const frame = () => {
      if (!running) return
      ctx.fillStyle = 'rgba(6,9,16,0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#00ff88'
      ctx.font = '13px JetBrains Mono, monospace'
      drops.forEach((y, i) => {
        const c = chars[Math.floor(Math.random() * chars.length)]
        ctx.globalAlpha = Math.random() * 0.8 + 0.2
        ctx.fillText(c, i * 18, y * 18)
        if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0
        else drops[i]++
      })
      ctx.globalAlpha = 1
      requestAnimationFrame(frame)
    }
    frame()
    return () => { running = false }
  }, [visible])

  if (!visible) return null

  return (
    <div className="cx-page-transition" style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'all' : 'none' }}>
      <div className="cx-page-transition__content">
        <div className="cx-page-transition__hex"><span>CX</span></div>
        <div className="cx-page-transition__label">CyberX</div>
        <div className="cx-page-transition__bar">
          <div className="cx-page-transition__bar-fill"></div>
        </div>
        <div className="cx-page-transition__hint">Loading…</div>
      </div>
      <canvas ref={canvasRef} className="cx-page-transition__matrix"></canvas>
    </div>
  )
}
