import React from 'react'
import { Link } from 'react-router-dom'

const plans = [
  {
    name:'Explorer', price:'Free', period:'forever', desc:'Get started with full Codex access and 20 CTF challenges. No credit card required.',
    features:['Full Codex reference (4,000+ entries)','20 CTF challenges','Community Discord access','Basic leaderboard','Read-only lab viewer'],
    missing:['Live lectures','Lab environments','Season CTF competition','XP & certificates','Operator badge'],
    cta:'Start Free', href:'/signup', primary:false, col:'var(--neon-blue)', tag:''
  },
  {
    name:'Operator', price:'$29', period:'/ month', desc:'The complete CyberX experience. Full labs, all CTF challenges, live lectures, and XP tracking.',
    features:['Everything in Explorer','All 380+ CTF challenges','96 browser-based labs','Live & recorded lectures','XP tracking & certificates','Season competition access','Operator badge & rank'],
    missing:[],
    cta:'Start 7-Day Trial', href:'/signup', primary:true, col:'var(--neon-green)', tag:'MOST POPULAR'
  },
  {
    name:'Red Team', price:'$79', period:'/ month', desc:'For professionals. Private team labs, custom challenge sets, API access, and priority support.',
    features:['Everything in Operator','Private team lab environments','Custom CTF challenge sets','API access (rate: 10k/day)','Team leaderboard','Priority Discord support','Monthly 1:1 with instructor'],
    missing:[],
    cta:'Contact Us', href:'/enroll', primary:false, col:'var(--neon-purple)', tag:''
  }
]

const faq = [
  ['Is the free tier really free?','Yes. Explorer is permanently free — no credit card, no trial. Full Codex access and 20 CTF challenges, forever.'],
  ['Can I cancel anytime?','Yes. Monthly plans can be cancelled at any time from your account settings. No penalties, no questions asked.'],
  ['What payment methods do you accept?','Visa, Mastercard, Amex, PayPal, and crypto (BTC, ETH, USDC) via Coinbase Commerce.'],
  ['Do you offer student discounts?','Yes — 50% off Operator for verified students. Email us with your .edu address or student ID.'],
  ['Is there a team plan?','The Red Team plan supports up to 10 members. For larger teams, contact us for enterprise pricing.'],
]

export default function Pricing() {
  return (
    <>
      <div className="ticker-bar">
        <div className="ticker-bar__left"><span>PRICING</span><span style={{color:'var(--border-2)'}}>·</span><span>SIMPLE & TRANSPARENT</span></div>
        <div><span style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-3)'}}>FREE TIER FOREVER · NO CREDIT CARD</span></div>
      </div>

      <section style={{background:'var(--bg-0)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'64px 0 56px',textAlign:'center'}}>
        <div className="container">
          <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)',letterSpacing:'2px',marginBottom:'16px',textTransform:'uppercase',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}><span style={{width:'24px',height:'1px',background:'var(--text-3)',display:'inline-block'}}></span>PRICING<span style={{width:'24px',height:'1px',background:'var(--text-3)',display:'inline-block'}}></span></div>
          <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(40px,5vw,72px)',lineHeight:'1.05',color:'var(--text-1)',fontWeight:800,marginBottom:'16px'}}>
            Simple pricing.<br/><span style={{color:'var(--neon-green)'}}>Serious training.</span>
          </h1>
          <p style={{fontSize:'16px',color:'var(--text-2)',maxWidth:'480px',margin:'0 auto 40px',lineHeight:'1.7'}}>One platform, three tiers. Start free, upgrade when you're ready for the full arsenal.</p>
          <div style={{display:'inline-flex',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--r-full)',padding:'4px',marginBottom:'0',background:'rgba(255,255,255,0.02)'}}>
            {['Monthly','Annual (Save 20%)'].map((o,i) => (
              <button key={o} style={{fontFamily:'var(--font-mono)',fontSize:'12px',padding:'7px 20px',borderRadius:'var(--r-full)',border:'none',background:i===0?'rgba(255,255,255,0.06)':'transparent',color:i===0?'var(--text-1)':'var(--text-3)',cursor:'pointer',transition:'all 0.2s'}}>{o}</button>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'48px 0 80px'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'24px',marginBottom:'64px'}}>
            {plans.map(p => (
              <div key={p.name} style={{background:'var(--bg-2)',border:`1px solid ${p.primary?p.col.replace('var(--neon-green)','rgba(0,255,136,0.3)'):'rgba(255,255,255,0.06)'}`,borderRadius:'var(--r-xl)',padding:'32px',position:'relative',display:'flex',flexDirection:'column',boxShadow:p.primary?'0 0 60px rgba(0,255,136,0.06)':'none'}}>
                {p.tag && <div style={{position:'absolute',top:'-12px',left:'50%',transform:'translateX(-50%)',background:p.col,color:'#000',fontFamily:'var(--font-mono)',fontSize:'10px',fontWeight:700,padding:'4px 16px',borderRadius:'var(--r-full)',letterSpacing:'1.5px',whiteSpace:'nowrap'}}>{p.tag}</div>}
                <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-3)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'12px'}}>{p.name}</div>
                <div style={{display:'flex',alignItems:'baseline',gap:'6px',marginBottom:'8px'}}>
                  <span style={{fontFamily:'var(--font-display)',fontSize:'52px',fontWeight:800,color:p.col,letterSpacing:'-0.03em',lineHeight:1}}>{p.price}</span>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:'13px',color:'var(--text-3)'}}>{p.period}</span>
                </div>
                <p style={{fontSize:'14px',color:'var(--text-2)',lineHeight:'1.65',marginBottom:'24px',flex:0}}>{p.desc}</p>
                <Link to={p.href} className={`btn ${p.primary?'btn-primary':'btn-outline'} btn-lg`} style={{width:'100%',justifyContent:'center',marginBottom:'24px',background:p.primary?p.col:'transparent',borderColor:p.col,color:p.primary?'#000':p.col}}>
                  {p.cta} →
                </Link>
                <div style={{display:'flex',flexDirection:'column',gap:'10px',flex:1}}>
                  {p.features.map(f => (
                    <div key={f} style={{display:'flex',alignItems:'flex-start',gap:'10px',fontSize:'13.5px',color:'var(--text-2)'}}>
                      <span style={{color:p.col,flexShrink:0,marginTop:'2px'}}>✓</span>{f}
                    </div>
                  ))}
                  {p.missing.map(f => (
                    <div key={f} style={{display:'flex',alignItems:'flex-start',gap:'10px',fontSize:'13.5px',color:'var(--text-4)',textDecoration:'line-through'}}>
                      <span style={{color:'var(--text-4)',flexShrink:0,marginTop:'2px'}}>✗</span>{f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div style={{maxWidth:'680px',margin:'0 auto'}}>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'32px',color:'var(--text-1)',fontWeight:700,marginBottom:'32px',textAlign:'center'}}>Pricing FAQ</h2>
            {faq.map(([q,a]) => (
              <div key={q} style={{borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'20px 0'}}>
                <div style={{fontSize:'15px',fontWeight:500,color:'var(--text-1)',marginBottom:'8px'}}>{q}</div>
                <div style={{fontSize:'14px',color:'var(--text-2)',lineHeight:'1.7'}}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
