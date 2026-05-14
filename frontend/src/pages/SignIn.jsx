import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL
const mono = { fontFamily: 'var(--font-mono)' }

export default function SignIn() {
  const navigate = useNavigate()

  // mode: 'signin' | 'forgot' | 'otp' | 'reset' | 'done'
  const [mode, setMode]         = useState('signin')
  const [form, setForm]         = useState({ identifier: '', password: '' })
  const [email, setEmail]       = useState('')
  const [otpDigits, setOtpDigits] = useState(['','','','','',''])
  const [newPass, setNewPass]   = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [error, setError]       = useState('')
  const [info, setInfo]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [countdown, setCountdown] = useState(0)
  const inputRefs = useRef([])
  const timerRef  = useRef(null)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    if (countdown <= 0) return
    timerRef.current = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [countdown])

  // ── Sign In ──────────────────────────────────────────────────────────────
  async function handleSignIn() {
    setError('')
    if (!form.identifier.trim()) return setError('Please enter your name or email.')
    if (!form.password)          return setError('Please enter your password.')
    setLoading(true)
    try {
      const res  = await fetch(`${API}/signin`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: form.identifier.trim(), password: form.password }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      sessionStorage.setItem('cyberx_user', JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      setError(err.message || 'Sign-in failed. Please try again.')
    } finally { setLoading(false) }
  }

  // ── Send Reset OTP ───────────────────────────────────────────────────────
  async function handleForgotSend() {
    setError(''); setInfo('')
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError('Enter a valid email address.')
    setLoading(true)
    try {
      const res  = await fetch(`${API}/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setMode('otp'); setInfo(`Reset code sent to ${email}`); setCountdown(60)
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err) {
      setError(err.message || 'Could not send reset code.')
    } finally { setLoading(false) }
  }

  // ── Verify Reset OTP ─────────────────────────────────────────────────────
  async function handleVerifyOTP() {
    setError(''); setInfo('')
    const otp = otpDigits.join('')
    if (otp.length < 6) return setError('Enter all 6 digits.')
    setLoading(true)
    try {
      const res  = await fetch(`${API}/verify-reset-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setMode('reset')
    } catch (err) {
      setError(err.message || 'Verification failed.')
    } finally { setLoading(false) }
  }

  // ── Reset Password ───────────────────────────────────────────────────────
  async function handleResetPassword() {
    setError(''); setInfo('')
    if (newPass.length < 8)       return setError('Password must be at least 8 characters.')
    if (newPass !== confirmPass)   return setError('Passwords do not match.')
    setLoading(true)
    try {
      const res  = await fetch(`${API}/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: newPass }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setMode('done')
    } catch (err) {
      setError(err.message || 'Password reset failed.')
    } finally { setLoading(false) }
  }

  // ── Resend OTP ───────────────────────────────────────────────────────────
  async function handleResend() {
    if (countdown > 0) return
    setError(''); setInfo(''); setLoading(true)
    setOtpDigits(['','','','','',''])
    try {
      const res  = await fetch(`${API}/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setInfo('A new code was sent.'); setCountdown(60)
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err) {
      setError(err.message || 'Could not resend code.')
    } finally { setLoading(false) }
  }

  // ── OTP digit handlers ───────────────────────────────────────────────────
  function handleDigit(i, val) {
    const d = val.replace(/\D/g,'').slice(-1)
    const next = [...otpDigits]; next[i] = d; setOtpDigits(next)
    if (d && i < 5) inputRefs.current[i+1]?.focus()
  }
  function handleDigitKey(i, e) {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) {
      const next = [...otpDigits]; next[i-1] = ''; setOtpDigits(next)
      inputRefs.current[i-1]?.focus()
    }
    if (e.key === 'Enter') handleVerifyOTP()
  }
  function handlePaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6)
    if (!text) return; e.preventDefault()
    const next = text.split('').concat(Array(6).fill('')).slice(0,6)
    setOtpDigits(next)
    inputRefs.current[Math.min(text.length,5)]?.focus()
  }

  // ── Shell ────────────────────────────────────────────────────────────────
  return (
    <div style={{minHeight:'100vh',background:'var(--bg-0)',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 20px',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',width:'600px',height:'600px',top:'-200px',right:'-200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,212,255,0.07) 0%,transparent 70%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',width:'600px',height:'600px',bottom:'-200px',left:'-200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,255,136,0.05) 0%,transparent 70%)',pointerEvents:'none'}}/>

      <div style={{width:'100%',maxWidth:'440px',position:'relative',zIndex:1}}>
        {/* Logo */}
        <Link to="/" style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'36px',textDecoration:'none',justifyContent:'center'}}>
          <div style={{width:'40px',height:'40px',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,var(--neon-green),var(--neon-blue))',clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)'}}/>
            <span style={{position:'relative',zIndex:1,...mono,fontSize:'13px',fontWeight:700,color:'#060910'}}>CX</span>
          </div>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontSize:'18px',fontWeight:700,color:'var(--text-0)',lineHeight:1}}>CyberX</div>
            <div style={{...mono,fontSize:'9px',color:'var(--text-3)',letterSpacing:'2px',textTransform:'uppercase'}}>v4.2.1</div>
          </div>
        </Link>

        <div style={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'var(--r-xl)',padding:'40px',boxShadow:'0 40px 80px rgba(0,0,0,0.5)'}}>

          {/* ── SIGN IN ── */}
          {mode==='signin' && (
            <>
              <h1 style={{fontFamily:'var(--font-display)',fontSize:'28px',fontWeight:700,color:'var(--text-0)',marginBottom:'6px'}}>Welcome back, operator.</h1>
              <p style={{fontSize:'14px',color:'var(--text-3)',...mono,marginBottom:'32px'}}>Sign in to your CyberX account.</p>

              <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
                <div>
                  <label style={{display:'block',...mono,fontSize:'11px',color:'var(--text-3)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>Name / Email</label>
                  <div style={{display:'flex',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--r-md)',overflow:'hidden',background:'rgba(255,255,255,0.02)'}}>
                    <span style={{padding:'0 14px',...mono,fontSize:'13px',color:'var(--text-3)',borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',background:'rgba(255,255,255,0.02)'}}>⊕</span>
                    <input type="text" placeholder="Enter your Name or Email" value={form.identifier} onChange={set('identifier')} onKeyDown={e=>e.key==='Enter'&&handleSignIn()} autoComplete="off"
                      style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'13px 14px',...mono,fontSize:'13px',color:'var(--text-1)'}} />
                  </div>
                </div>

                <div>
                  <label style={{display:'block',...mono,fontSize:'11px',color:'var(--text-3)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>Password</label>
                  <div style={{display:'flex',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--r-md)',overflow:'hidden',background:'rgba(255,255,255,0.02)'}}>
                    <span style={{padding:'0 14px',...mono,fontSize:'13px',color:'var(--text-3)',borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',background:'rgba(255,255,255,0.02)'}}>🔑</span>
                    <input type="password" placeholder="Enter your Password" value={form.password} onChange={set('password')} onKeyDown={e=>e.key==='Enter'&&handleSignIn()} autoComplete="new-password"
                      style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'13px 14px',...mono,fontSize:'13px',color:'var(--text-1)'}} />
                  </div>
                </div>

                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',...mono,fontSize:'12px'}}>
                  <label style={{display:'flex',alignItems:'center',gap:'8px',color:'var(--text-2)',cursor:'pointer'}}>
                    <input type="checkbox" style={{accentColor:'var(--neon-green)'}} /> Remember device
                  </label>
                  <button onClick={()=>{setMode('forgot');setError('');setInfo('')}}
                    style={{background:'none',border:'none',cursor:'pointer',color:'var(--neon-green)',...mono,fontSize:'11px',padding:0}}>
                    Forgot password?
                  </button>
                </div>

                {error && <div style={{...mono,fontSize:'12px',color:'#f87171',padding:'8px 12px',background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:'var(--r-md)'}}>⚠ {error}</div>}

                <button className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center',opacity:loading?0.7:1,cursor:loading?'not-allowed':'pointer'}} onClick={handleSignIn} disabled={loading}>
                  {loading ? 'Signing In…' : 'Sign In → Access CyberX'}
                </button>
              </div>

              <div style={{textAlign:'center',marginTop:'24px',...mono,fontSize:'12px',color:'var(--text-3)'}}>
                No account? <Link to="/signup" style={{color:'var(--neon-green)',textDecoration:'none'}}>Create one free →</Link>
              </div>
            </>
          )}

          {/* ── FORGOT — enter email ── */}
          {mode==='forgot' && (
            <>
              <button onClick={()=>{setMode('signin');setError('');setInfo('')}}
                style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-3)',...mono,fontSize:'12px',padding:'0 0 20px',display:'flex',alignItems:'center',gap:'6px'}}>
                ← Back to Sign In
              </button>
              <h1 style={{fontFamily:'var(--font-display)',fontSize:'24px',fontWeight:700,color:'var(--text-0)',marginBottom:'8px'}}>Reset your password.</h1>
              <p style={{...mono,fontSize:'13px',color:'var(--text-3)',marginBottom:'28px',lineHeight:'1.7'}}>Enter your registered email and we'll send a reset code.</p>

              <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
                <div>
                  <label style={{display:'block',...mono,fontSize:'11px',color:'var(--text-3)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>Email Address</label>
                  <div style={{display:'flex',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--r-md)',overflow:'hidden',background:'rgba(255,255,255,0.02)'}}>
                    <span style={{padding:'0 14px',...mono,fontSize:'13px',color:'var(--text-3)',borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',background:'rgba(255,255,255,0.02)'}}>@</span>
                    <input type="email" placeholder="Enter your registered email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleForgotSend()} autoComplete="off"
                      style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'13px 14px',...mono,fontSize:'13px',color:'var(--text-1)'}} />
                  </div>
                </div>

                {error && <div style={{...mono,fontSize:'12px',color:'#f87171',padding:'8px 12px',background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:'var(--r-md)'}}>⚠ {error}</div>}

                <button className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center',opacity:loading?0.7:1,cursor:loading?'not-allowed':'pointer'}} onClick={handleForgotSend} disabled={loading}>
                  {loading ? 'Sending Code…' : 'Send Reset Code →'}
                </button>
              </div>
            </>
          )}

          {/* ── OTP VERIFY ── */}
          {mode==='otp' && (
            <>
              <button onClick={()=>{setMode('forgot');setError('');setInfo('')}}
                style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-3)',...mono,fontSize:'12px',padding:'0 0 20px',display:'flex',alignItems:'center',gap:'6px'}}>
                ← Back
              </button>
              <h1 style={{fontFamily:'var(--font-display)',fontSize:'24px',fontWeight:700,color:'var(--text-0)',marginBottom:'8px'}}>Check your inbox.</h1>
              <p style={{...mono,fontSize:'13px',color:'var(--text-3)',marginBottom:'28px',lineHeight:'1.7'}}>
                We sent a 6-digit reset code to<br/>
                <span style={{color:'var(--neon-green)'}}>{email}</span>
              </p>

              <div style={{display:'flex',gap:'10px',justifyContent:'center',marginBottom:'24px'}}>
                {otpDigits.map((d,i) => (
                  <input key={i} ref={el=>inputRefs.current[i]=el}
                    type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={e=>handleDigit(i,e.target.value)}
                    onKeyDown={e=>handleDigitKey(i,e)} onPaste={handlePaste}
                    style={{
                      width:'48px',height:'60px',textAlign:'center',...mono,fontSize:'24px',fontWeight:700,
                      color:d?'var(--neon-green)':'var(--text-1)',
                      background:d?'rgba(0,255,136,0.06)':'rgba(255,255,255,0.02)',
                      border:`1px solid ${d?'rgba(0,255,136,0.4)':'rgba(255,255,255,0.1)'}`,
                      borderRadius:'var(--r-md)',outline:'none',transition:'all 0.2s',caretColor:'var(--neon-green)',
                    }}
                  />
                ))}
              </div>

              {info && <div style={{...mono,fontSize:'12px',color:'#34d399',padding:'8px 12px',background:'rgba(52,211,153,0.06)',border:'1px solid rgba(52,211,153,0.2)',borderRadius:'var(--r-md)',marginBottom:'16px',textAlign:'center'}}>✓ {info}</div>}
              {error && <div style={{...mono,fontSize:'12px',color:'#f87171',padding:'8px 12px',background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:'var(--r-md)',marginBottom:'16px'}}>⚠ {error}</div>}

              <button className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center',opacity:loading?0.7:1,cursor:loading?'not-allowed':'pointer',marginBottom:'16px'}} onClick={handleVerifyOTP} disabled={loading}>
                {loading ? 'Verifying…' : 'Verify Code →'}
              </button>

              <div style={{display:'flex',justifyContent:'space-between',...mono,fontSize:'12px'}}>
                <button onClick={handleResend} disabled={countdown>0||loading}
                  style={{background:'none',border:'none',cursor:countdown>0?'default':'pointer',color:countdown>0?'var(--text-4)':'var(--neon-green)',...mono,fontSize:'12px',padding:0}}>
                  {countdown>0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </button>
              </div>
            </>
          )}

          {/* ── NEW PASSWORD ── */}
          {mode==='reset' && (
            <>
              <h1 style={{fontFamily:'var(--font-display)',fontSize:'24px',fontWeight:700,color:'var(--text-0)',marginBottom:'8px'}}>Set new password.</h1>
              <p style={{...mono,fontSize:'13px',color:'var(--text-3)',marginBottom:'28px'}}>Choose a strong password for your account.</p>

              <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
                <div>
                  <label style={{display:'block',...mono,fontSize:'11px',color:'var(--text-3)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>New Password</label>
                  <div style={{display:'flex',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--r-md)',overflow:'hidden',background:'rgba(255,255,255,0.02)'}}>
                    <span style={{padding:'0 14px',...mono,fontSize:'13px',color:'var(--text-3)',borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',background:'rgba(255,255,255,0.02)'}}>🔑</span>
                    <input type="password" placeholder="Create new password" value={newPass} onChange={e=>setNewPass(e.target.value)} autoComplete="new-password"
                      style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'13px 14px',...mono,fontSize:'13px',color:'var(--text-1)'}} />
                  </div>
                </div>

                <div>
                  <label style={{display:'block',...mono,fontSize:'11px',color:'var(--text-3)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>Confirm Password</label>
                  <div style={{display:'flex',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--r-md)',overflow:'hidden',background:'rgba(255,255,255,0.02)'}}>
                    <span style={{padding:'0 14px',...mono,fontSize:'13px',color:'var(--text-3)',borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',background:'rgba(255,255,255,0.02)'}}>🔑</span>
                    <input type="password" placeholder="Re-enter new password" value={confirmPass} onChange={e=>setConfirmPass(e.target.value)} autoComplete="new-password"
                      style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'13px 14px',...mono,fontSize:'13px',color:'var(--text-1)'}} />
                  </div>
                </div>

                {error && <div style={{...mono,fontSize:'12px',color:'#f87171',padding:'8px 12px',background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:'var(--r-md)'}}>⚠ {error}</div>}

                <button className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center',opacity:loading?0.7:1,cursor:loading?'not-allowed':'pointer'}} onClick={handleResetPassword} disabled={loading}>
                  {loading ? 'Resetting…' : 'Reset Password →'}
                </button>
              </div>
            </>
          )}

          {/* ── DONE ── */}
          {mode==='done' && (
            <div style={{textAlign:'center',padding:'16px 0'}}>
              <div style={{fontSize:'56px',marginBottom:'16px'}}>✅</div>
              <h1 style={{fontFamily:'var(--font-display)',fontSize:'26px',fontWeight:700,color:'var(--text-0)',marginBottom:'8px'}}>Password Reset!</h1>
              <p style={{...mono,fontSize:'13px',color:'var(--text-3)',lineHeight:'1.8',marginBottom:'24px'}}>
                Your password has been updated successfully.<br/>
                You can now sign in with your new password.
              </p>
              <button className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center'}} onClick={()=>{setMode('signin');setEmail('');setOtpDigits(['','','','','','']);setNewPass('');setConfirmPass('');setError('');setInfo('')}}>
                Back to Sign In →
              </button>
            </div>
          )}

        </div>

        <div style={{textAlign:'center',marginTop:'24px',...mono,fontSize:'11px',color:'var(--text-4)'}}>
          By signing in you agree to CyberX's Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  )
}