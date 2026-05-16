import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_ADMIN_API_URL

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleLogin() {
    setError('')
    if (!form.email || !form.password) return setError('Email and password are required.')
    setLoading(true)
    try {
      const res  = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)

      sessionStorage.setItem('cyberx_admin_token', data.token)
      sessionStorage.setItem('cyberx_admin', JSON.stringify(data.admin))
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-0)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', width:'600px', height:'600px', top:'-200px', right:'-200px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,255,136,0.07) 0%,transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', width:'600px', height:'600px', bottom:'-200px', left:'-200px', borderRadius:'50%', background:'radial-gradient(circle,rgba(180,77,255,0.05) 0%,transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:'420px', position:'relative', zIndex:1 }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'36px', justifyContent:'center' }}>
          <div style={{ width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,var(--neon-green),var(--neon-blue))', clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}/>
            <span style={{ position:'relative', zIndex:1, fontFamily:'var(--font-mono)', fontSize:'13px', fontWeight:700, color:'#060910' }}>CX</span>
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'18px', fontWeight:700, color:'var(--text-0)', lineHeight:1 }}>CyberX</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--neon-green)', letterSpacing:'2px', textTransform:'uppercase' }}>Admin Panel</div>
          </div>
        </div>

        <div style={{ background:'var(--bg-2)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'var(--r-xl)', padding:'40px', boxShadow:'0 40px 80px rgba(0,0,0,0.5)' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'26px', fontWeight:700, color:'var(--text-0)', marginBottom:'6px' }}>Admin Login</h1>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'13px', color:'var(--text-3)', marginBottom:'28px' }}>Sign in to manage CyberX platform.</p>

          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="Enter your Email" value={form.email} onChange={set('email')} onKeyDown={e => e.key === 'Enter' && handleLogin()} autoComplete="off" />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Enter password" value={form.password} onChange={set('password')} onKeyDown={e => e.key === 'Enter' && handleLogin()} autoComplete="new-password" />
            </div>

            {error && <div className="alert alert-error">⚠ {error}</div>}

            <button
              className="btn btn-primary"
              style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:'13px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Signing In…' : 'Sign In → Admin Panel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 
