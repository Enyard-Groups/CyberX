import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ── Config ───────────────────────────────────────────────────────────────────
const API = 'http://localhost:4000/api'   // change to deployed URL in production

export default function SignIn() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ identifier: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSignIn() {
    setError('')
    if (!form.identifier.trim()) return setError('Please enter your name or email.')
    if (!form.password)          return setError('Please enter your password.')

    setLoading(true)
    try {
      const res  = await fetch(`${API}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: form.identifier.trim(), password: form.password }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)

      // ✅ Store user in sessionStorage for the session
      sessionStorage.setItem('cyberx_user', JSON.stringify(data.user))

      // Redirect to home (or a dashboard if you add one later)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSignIn()
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-0)',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 20px',position:'relative',overflow:'hidden'}}>
      {/* Background orbs */}
      <div style={{position:'absolute',width:'600px',height:'600px',top:'-200px',right:'-200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,212,255,0.07) 0%,transparent 70%)',pointerEvents:'none'}}></div>
      <div style={{position:'absolute',width:'600px',height:'600px',bottom:'-200px',left:'-200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,255,136,0.05) 0%,transparent 70%)',pointerEvents:'none'}}></div>

      <div style={{width:'100%',maxWidth:'440px',position:'relative',zIndex:1}}>
        {/* Logo */}
        <Link to="/" style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'36px',textDecoration:'none',justifyContent:'center'}}>
          <div style={{width:'40px',height:'40px',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,var(--neon-green),var(--neon-blue))',clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)'}}></div>
            <span style={{position:'relative',zIndex:1,fontFamily:'var(--font-mono)',fontSize:'13px',fontWeight:700,color:'#060910'}}>CX</span>
          </div>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontSize:'18px',fontWeight:700,color:'var(--text-0)',lineHeight:1}}>CyberX</div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'9px',color:'var(--text-3)',letterSpacing:'2px',textTransform:'uppercase'}}>v4.2.1</div>
          </div>
        </Link>

        {/* Card */}
        <div style={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'var(--r-xl)',padding:'40px',boxShadow:'0 40px 80px rgba(0,0,0,0.5)'}}>
          <h1 style={{fontFamily:'var(--font-display)',fontSize:'28px',fontWeight:700,color:'var(--text-0)',marginBottom:'6px',letterSpacing:'-0.01em'}}>Welcome back, operator.</h1>
          <p style={{fontSize:'14px',color:'var(--text-3)',fontFamily:'var(--font-mono)',marginBottom:'32px'}}>Sign in to your CyberX account.</p>

          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>

            {/* Identifier field */}
            <div>
              <label style={{display:'block',fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>Name / Email</label>
              <div style={{display:'flex',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--r-md)',overflow:'hidden',background:'rgba(255,255,255,0.02)'}}>
                <span style={{padding:'0 14px',fontFamily:'var(--font-mono)',fontSize:'13px',color:'var(--text-3)',borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',background:'rgba(255,255,255,0.02)'}}>⊕</span>
                <input
                  type="text"
                  placeholder="Enter your Name or Email"
                  value={form.identifier}
                  onChange={set('identifier')}
                  onKeyDown={handleKeyDown}
                  style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'13px 14px',fontFamily:'var(--font-mono)',fontSize:'13px',color:'var(--text-1)'}}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label style={{display:'block',fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>Password</label>
              <div style={{display:'flex',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--r-md)',overflow:'hidden',background:'rgba(255,255,255,0.02)'}}>
                <span style={{padding:'0 14px',fontFamily:'var(--font-mono)',fontSize:'13px',color:'var(--text-3)',borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',background:'rgba(255,255,255,0.02)'}}>🔑</span>
                <input
                  type="password"
                  placeholder="Enter your Password"
                  value={form.password}
                  onChange={set('password')}
                  onKeyDown={handleKeyDown}
                  style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'13px 14px',fontFamily:'var(--font-mono)',fontSize:'13px',color:'var(--text-1)'}}
                />
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontFamily:'var(--font-mono)',fontSize:'12px'}}>
              <label style={{display:'flex',alignItems:'center',gap:'8px',color:'var(--text-2)',cursor:'pointer'}}>
                <input type="checkbox" style={{accentColor:'var(--neon-green)'}} /> Remember device
              </label>
              <a href="#" style={{color:'var(--neon-green)',textDecoration:'none',fontSize:'11px'}}>Forgot password?</a>
            </div>

            {/* Error message */}
            {error && (
              <div style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'#f87171',padding:'8px 12px',background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:'var(--r-md)'}}>
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button
              className="btn btn-primary btn-lg"
              style={{width:'100%',justifyContent:'center',opacity:loading?0.7:1,cursor:loading?'not-allowed':'pointer'}}
              onClick={handleSignIn}
              disabled={loading}
            >
              {loading ? 'Signing In…' : 'Sign In → Access CyberX'}
            </button>
          </div>

          <div style={{textAlign:'center',marginTop:'24px',fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--text-3)'}}>
            No account? <Link to="/signup" style={{color:'var(--neon-green)',textDecoration:'none'}}>Create one free →</Link>
          </div>
        </div>

        <div style={{textAlign:'center',marginTop:'24px',fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-4)'}}>
          By signing in you agree to CyberX's Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  )
}
