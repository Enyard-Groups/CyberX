import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const plans = [
  { name:'Explorer', price:'Free', col:'var(--neon-blue)', features:['Full Codex access','20 CTF challenges','Community Discord'] },
  { name:'Operator', price:'$29/mo', col:'var(--neon-green)', features:['All 380+ CTF challenges','96 browser labs','Live & recorded lectures','XP & certificates'], recommended:true },
  { name:'Red Team', price:'$79/mo', col:'var(--neon-purple)', features:['Private team labs','Custom CTF sets','API access','Monthly 1:1 session'] },
]

export default function Enroll() {
  const [selected, setSelected] = useState(1)

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-0)',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 20px',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',width:'700px',height:'700px',top:'-200px',right:'-200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,255,136,0.06) 0%,transparent 70%)',pointerEvents:'none'}}></div>

      <div style={{width:'100%',maxWidth:'720px',position:'relative',zIndex:1}}>
        <Link to="/" style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'36px',textDecoration:'none',justifyContent:'center'}}>
          <div style={{width:'40px',height:'40px',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,var(--neon-green),var(--neon-blue))',clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)'}}></div>
            <span style={{position:'relative',zIndex:1,fontFamily:'var(--font-mono)',fontSize:'13px',fontWeight:700,color:'#060910'}}>CX</span>
          </div>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontSize:'18px',fontWeight:700,color:'var(--text-0)',lineHeight:1}}>CyberX</div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'9px',color:'var(--text-3)',letterSpacing:'2px'}}>ENROLL</div>
          </div>
        </Link>

        <div style={{background:'var(--bg-2)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'var(--r-xl)',padding:'40px',boxShadow:'0 40px 80px rgba(0,0,0,0.5)'}}>
          <h1 style={{fontFamily:'var(--font-display)',fontSize:'28px',fontWeight:700,color:'var(--text-0)',marginBottom:'6px'}}>Choose your tier.</h1>
          <p style={{fontFamily:'var(--font-mono)',fontSize:'13px',color:'var(--text-3)',marginBottom:'32px'}}>All plans start with a 7-day free trial on paid tiers. Cancel anytime.</p>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px',marginBottom:'32px'}}>
            {plans.map((p,i) => (
              <div key={p.name} onClick={() => setSelected(i)}
                style={{background:selected===i?`rgba(${p.col==='var(--neon-green)'?'0,255,136':p.col==='var(--neon-blue)'?'0,212,255':'180,77,255'},0.06)`:'rgba(255,255,255,0.02)',border:`1px solid ${selected===i?p.col.replace('var(--neon-green)','rgba(0,255,136,0.4)').replace('var(--neon-blue)','rgba(0,212,255,0.3)').replace('var(--neon-purple)','rgba(180,77,255,0.3)'):'rgba(255,255,255,0.07)'}`,borderRadius:'var(--r-lg)',padding:'20px',cursor:'pointer',transition:'all 0.2s',position:'relative'}}>
                {p.recommended && <div style={{position:'absolute',top:'-10px',left:'50%',transform:'translateX(-50%)',background:'var(--neon-green)',color:'#000',fontFamily:'var(--font-mono)',fontSize:'9px',fontWeight:700,padding:'3px 12px',borderRadius:'var(--r-full)',whiteSpace:'nowrap',letterSpacing:'1px'}}>RECOMMENDED</div>}
                <div style={{fontFamily:'var(--font-mono)',fontSize:'12px',fontWeight:600,color:'var(--text-2)',letterSpacing:'1px',marginBottom:'6px'}}>{p.name.toUpperCase()}</div>
                <div style={{fontFamily:'var(--font-display)',fontSize:'24px',fontWeight:700,color:p.col,marginBottom:'14px'}}>{p.price}</div>
                {p.features.map(f => (
                  <div key={f} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'12px',color:'var(--text-2)',marginBottom:'6px'}}>
                    <span style={{color:p.col}}>✓</span>{f}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'var(--r-lg)',padding:'24px',marginBottom:'24px'}}>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)',letterSpacing:'2px',marginBottom:'16px',textTransform:'uppercase'}}>Your Details</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
              {[['Name','Enter your name'],['Email','Enter your email address'],['Password','Create a strong password'],['Confirm','Re-enter your password']].map(([l,ph],i) => (
                <div key={l}>
                  <label style={{display:'block',fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-3)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'6px'}}>{l}</label>
                  <input type={l==='Password'||l==='Confirm'?'password':'text'} placeholder={ph}
                    style={{width:'100%',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--r-md)',padding:'10px 14px',fontFamily:'var(--font-mono)',fontSize:'13px',color:'var(--text-1)',outline:'none',boxSizing:'border-box'}} />
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center',marginBottom:'14px'}}>
            Enroll — {plans[selected].name} ({plans[selected].price}) →
          </button>
          <div style={{textAlign:'center',fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--text-3)'}}>
            Have an account? <Link to="/signin" style={{color:'var(--neon-green)',textDecoration:'none'}}>Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
