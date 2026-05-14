import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ── Config ──────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL

// ── Tiny helpers ────────────────────────────────────────────────────────────
const mono = { fontFamily: 'var(--font-mono)' }

function Field({ label, type, placeholder, pre, hint, value, onChange, disabled }) {
  return (
    <div>
      <label style={{ display:'block', ...mono, fontSize:'11px', color:'var(--text-3)', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'8px' }}>{label}</label>
      <div style={{ display:'flex', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'var(--r-md)', overflow:'hidden', background:'rgba(255,255,255,0.02)', opacity: disabled ? 0.5 : 1 }}>
        <span style={{ padding:'0 14px', ...mono, fontSize:'13px', color:'var(--text-3)', borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', background:'rgba(255,255,255,0.02)' }}>{pre}</span>
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled}
          autoComplete="off"
          style={{ flex:1, background:'transparent', border:'none', outline:'none', padding:'13px 14px', ...mono, fontSize:'13px', color:'var(--text-1)' }} />
      </div>
      {hint && <div style={{ ...mono, fontSize:'11px', color:'var(--text-4)', marginTop:'6px' }}>{hint}</div>}
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function SignUp() {

  const [step, setStep]           = useState('form')
  const navigate                  = useNavigate()
  const [form, setForm]           = useState({ handle:'', email:'', password:'', confirm:'' })
  const [otpDigits, setOtpDigits] = useState(['','','','','',''])
  const [error, setError]         = useState('')
  const [info, setInfo]           = useState('')
  const [loading, setLoading]     = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [createdUser, setCreatedUser] = useState(null)

  const inputRefs = useRef([])
  const timerRef  = useRef(null)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    if (countdown <= 0) return
    timerRef.current = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [countdown])

  async function handleSendOTP() {
    setError(''); setInfo('')
    if (!form.handle.trim())            return setError('Please enter your name.')
    if (!form.email.trim())             return setError('Please enter your email.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.')
    if (form.password.length < 8)       return setError('Password must be at least 8 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')

    setLoading(true)
    try {
      const res  = await fetch(`${API}/send-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setStep('otp'); setInfo(`A 6-digit code was sent to ${form.email}`); setCountdown(60)
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err) {
      setError(err.message || 'Could not send OTP. Try again.')
    } finally { setLoading(false) }
  }

  async function handleVerifyOTP() {
    setError(''); setInfo('')
    const otp = otpDigits.join('')
    if (otp.length < 6) return setError('Enter all 6 digits of the code.')

    setLoading(true)
    try {
      const verifyRes  = await fetch(`${API}/verify-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp }),
      })
      const verifyData = await verifyRes.json()
      if (!verifyData.success) throw new Error(verifyData.message)

      const regRes  = await fetch(`${API}/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.handle, email: form.email, password: form.password }),
      })
      const regData = await regRes.json()
      if (!regData.success) throw new Error(regData.message)

      // ✅ Save user to sessionStorage so profile shows immediately
      sessionStorage.setItem('cyberx_user', JSON.stringify(regData.user))

      setCreatedUser(regData.user)
      setStep('done')
    } catch (err) {
      setError(err.message || 'Verification failed. Try again.')
    } finally { setLoading(false) }
  }

  async function handleResend() {
    if (countdown > 0) return
    setError(''); setInfo(''); setLoading(true)
    setOtpDigits(['','','','','',''])
    try {
      const res  = await fetch(`${API}/send-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setInfo('A new code was sent.'); setCountdown(60)
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err) {
      setError(err.message || 'Could not resend OTP.')
    } finally { setLoading(false) }
  }

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
    if (e.key === 'Enter') step === 'form' ? handleSendOTP() : handleVerifyOTP()
  }
  function handlePaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6)
    if (!text) return; e.preventDefault()
    const next = text.split('').concat(Array(6).fill('')).slice(0,6)
    setOtpDigits(next)
    inputRefs.current[Math.min(text.length,5)]?.focus()
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-0)',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 20px',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',width:'600px',height:'600px',top:'-200px',left:'-200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,255,136,0.07) 0%,transparent 70%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',width:'600px',height:'600px',bottom:'-200px',right:'-200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(180,77,255,0.05) 0%,transparent 70%)',pointerEvents:'none'}}/>

      <div style={{width:'100%',maxWidth:'480px',position:'relative',zIndex:1}}>
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

          {step !== 'done' && (
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'28px'}}>
              {['form','otp'].map((s,idx) => (
                <React.Fragment key={s}>
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <div style={{
                      width:'24px',height:'24px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                      background: step===s ? 'var(--neon-green)' : (step==='otp'&&s==='form') ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.06)',
                      ...mono,fontSize:'11px',fontWeight:700,
                      color: step===s ? '#060910' : 'var(--text-3)',transition:'all 0.3s',
                    }}>
                      {step==='otp'&&s==='form' ? '✓' : idx+1}
                    </div>
                    <span style={{...mono,fontSize:'11px',color:step===s?'var(--text-1)':'var(--text-4)',letterSpacing:'1px',textTransform:'uppercase'}}>
                      {s==='form' ? 'Details' : 'Verify Email'}
                    </span>
                  </div>
                  {idx < 1 && <div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.07)'}}/>}
                </React.Fragment>
              ))}
            </div>
          )}

          {step==='form' && (
            <>
              <div style={{display:'flex',alignItems:'center',gap:'8px',background:'rgba(0,255,136,0.06)',border:'1px solid rgba(0,255,136,0.15)',borderRadius:'var(--r-md)',padding:'10px 14px',marginBottom:'24px'}}>
                <span style={{color:'var(--neon-green)',fontSize:'16px'}}>🛡</span>
                <div>
                  <div style={{...mono,fontSize:'12px',fontWeight:600,color:'var(--neon-green)',letterSpacing:'0.5px'}}>EXPLORER TIER — FREE FOREVER</div>
                  <div style={{...mono,fontSize:'11px',color:'var(--text-3)',marginTop:'2px'}}>Full Codex · 20 CTF challenges · No credit card</div>
                </div>
              </div>

              <h1 style={{fontFamily:'var(--font-display)',fontSize:'26px',fontWeight:700,color:'var(--text-0)',marginBottom:'6px',letterSpacing:'-0.01em'}}>Create your operator account.</h1>
              <p style={{fontSize:'14px',color:'var(--text-3)',...mono,marginBottom:'28px'}}>Join 12,400+ security professionals on CyberX.</p>

              <div style={{display:'flex',flexDirection:'column',gap:'18px'}}>
                <Field label="Name"             type="text"     placeholder="Enter your name"          pre="⊕" hint="This will be your public identity on the platform." value={form.handle}   onChange={set('handle')}   />
                <Field label="Email Address"    type="email"    placeholder="Enter your email address" pre="@" hint="" value={form.email}    onChange={set('email')}    />
                <Field label="Password"         type="password" placeholder="Create a strong password" pre="🔑" hint="Minimum 8 characters." value={form.password} onChange={set('password')} />
                <Field label="Confirm Password" type="password" placeholder="Re-enter your password"   pre="🔑" hint="" value={form.confirm}  onChange={set('confirm')}  />

                {form.confirm && form.password !== form.confirm && (
                  <div style={{...mono,fontSize:'12px',color:'#f87171',padding:'8px 12px',background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:'var(--r-md)'}}>⚠ Passwords do not match</div>
                )}
                {error && (
                  <div style={{...mono,fontSize:'12px',color:'#f87171',padding:'8px 12px',background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:'var(--r-md)'}}>⚠ {error}</div>
                )}

                <div style={{...mono,fontSize:'12px',color:'var(--text-3)',lineHeight:'1.7'}}>
                  By creating an account, you agree to CyberX's <a href="#" style={{color:'var(--neon-green)'}}>Terms of Service</a> and <a href="#" style={{color:'var(--neon-green)'}}>Privacy Policy</a>.
                </div>

                <button className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center',opacity:loading?0.7:1,cursor:loading?'not-allowed':'pointer'}} onClick={handleSendOTP} disabled={loading}>
                  {loading ? 'Sending Code…' : 'Continue — Verify Email →'}
                </button>
              </div>

              <div style={{textAlign:'center',marginTop:'20px',...mono,fontSize:'12px',color:'var(--text-3)'}}>
                Already have an account? <Link to="/signin" style={{color:'var(--neon-green)',textDecoration:'none'}}>Sign in →</Link>
              </div>
            </>
          )}

          {step==='otp' && (
            <>
              <h1 style={{fontFamily:'var(--font-display)',fontSize:'24px',fontWeight:700,color:'var(--text-0)',marginBottom:'8px'}}>Check your inbox.</h1>
              <p style={{...mono,fontSize:'13px',color:'var(--text-3)',marginBottom:'28px',lineHeight:'1.7'}}>
                We sent a 6-digit verification code to<br/>
                <span style={{color:'var(--neon-green)'}}>{form.email}</span>
              </p>

              <div style={{display:'flex',gap:'10px',justifyContent:'center',marginBottom:'24px'}}>
                {otpDigits.map((d,i) => (
                  <input key={i} ref={el => inputRefs.current[i]=el}
                    type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={e=>handleDigit(i,e.target.value)}
                    onKeyDown={e=>handleDigitKey(i,e)} onPaste={handlePaste}
                    style={{
                      width:'48px',height:'60px',textAlign:'center',...mono,fontSize:'24px',fontWeight:700,
                      color: d?'var(--neon-green)':'var(--text-1)',
                      background: d?'rgba(0,255,136,0.06)':'rgba(255,255,255,0.02)',
                      border:`1px solid ${d?'rgba(0,255,136,0.4)':'rgba(255,255,255,0.1)'}`,
                      borderRadius:'var(--r-md)',outline:'none',transition:'all 0.2s',caretColor:'var(--neon-green)',
                    }}
                  />
                ))}
              </div>

              {info && <div style={{...mono,fontSize:'12px',color:'#34d399',padding:'8px 12px',background:'rgba(52,211,153,0.06)',border:'1px solid rgba(52,211,153,0.2)',borderRadius:'var(--r-md)',marginBottom:'16px',textAlign:'center'}}>✓ {info}</div>}
              {error && <div style={{...mono,fontSize:'12px',color:'#f87171',padding:'8px 12px',background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:'var(--r-md)',marginBottom:'16px'}}>⚠ {error}</div>}

              <button className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center',opacity:loading?0.7:1,cursor:loading?'not-allowed':'pointer',marginBottom:'16px'}} onClick={handleVerifyOTP} disabled={loading}>
                {loading ? 'Verifying & Creating Account…' : 'Verify & Create Account →'}
              </button>

              <div style={{display:'flex',justifyContent:'space-between',...mono,fontSize:'12px'}}>
                <button onClick={handleResend} disabled={countdown>0||loading}
                  style={{background:'none',border:'none',cursor:countdown>0?'default':'pointer',color:countdown>0?'var(--text-4)':'var(--neon-green)',...mono,fontSize:'12px',padding:0}}>
                  {countdown>0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </button>
                <button onClick={()=>{setStep('form');setError('');setInfo('');setOtpDigits(['','','','','',''])}}
                  style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-3)',...mono,fontSize:'12px',padding:0}}>
                  ← Change Email
                </button>
              </div>
            </>
          )}

          {step==='done' && (
            <div style={{textAlign:'center',padding:'16px 0'}}>
              <div style={{fontSize:'56px',marginBottom:'16px'}}>🎉</div>
              <h1 style={{fontFamily:'var(--font-display)',fontSize:'26px',fontWeight:700,color:'var(--text-0)',marginBottom:'8px'}}>Account Created!</h1>
              <p style={{...mono,fontSize:'13px',color:'var(--text-3)',lineHeight:'1.8',marginBottom:'8px'}}>
                Your email <span style={{color:'var(--neon-green)'}}>{form.email}</span> is verified.<br/>
                Welcome to CyberX, <span style={{color:'var(--text-1)'}}>{form.handle}</span>.
              </p>
              {createdUser && (
                <p style={{...mono,fontSize:'11px',color:'var(--text-4)',marginBottom:'24px'}}>
                  Operator ID: <span style={{color:'var(--text-2)'}}>#{createdUser.id}</span>
                </p>
              )}
              {/* ✅ Go directly to home, already logged in */}
              <button className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center'}} onClick={()=>navigate('/')}>
                Go to Home →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}