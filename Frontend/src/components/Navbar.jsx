import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styles/layout.css'

const navLinks = [
  { name: 'Lectures',    href: '/lectures',    icon: '▶' },
  { name: 'CTF Arena',   href: '/ctf',         icon: '⚑' },
  { name: 'Codex',       href: '/codex',       icon: '#' },
  { name: 'Labs',        href: '/labs',        icon: '◫' },
  { name: 'Leaderboard', href: '/leaderboard', icon: '◈' },
]

export default function Navbar({ activePage }) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden]     = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser]         = useState(null)
  const [dropdown, setDropdown] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  let lastY = 0

  // Load user from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('cyberx_user')
    if (stored) setUser(JSON.parse(stored))
  }, [location])

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY
      setScrolled(y > 50)
      setHidden(y > lastY + 10 && y > 200)
      lastY = y
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }, [location])

  const toggleMenu = () => {
    const next = !menuOpen
    setMenuOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  const isActive = (href) => location.pathname === href

  const handleLogout = () => {
    sessionStorage.removeItem('cyberx_user')
    setUser(null)
    setDropdown(false)
    navigate('/')
  }

  // Get initials from name
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'CX'
  }

  return (
    <>
      <header
        id="cxHeader"
        className={`cx-header${scrolled ? ' is-scrolled' : ''}${hidden ? ' is-hidden' : ''}`}
      >
        <div className="cx-header__inner">
          {/* Logo */}
          <Link to="/" className="cx-logo">
            <div className="cx-logo__hex">
              <span className="cx-logo__hex-inner">CX</span>
            </div>
            <div className="cx-logo__text">
              <span className="cx-logo__name">CyberX</span>
              <span className="cx-logo__tag">v4.2.1</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="cx-nav" role="navigation" aria-label="Main">
            {navLinks.map(({ name, href, icon }) => (
              <Link
                key={name}
                to={href}
                className={`nav-link${isActive(href) ? ' is-active' : ''}`}
              >
                <span className="nav-link__icon">{icon}</span>
                <span className="nav-link__label">{name}</span>
                <span className="nav-link__bar"></span>
                {isActive(href) && <span className="nav-link__pulse"></span>}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="cx-actions">
            <div className="cx-live-badge">
              <span className="dot-live"></span>
              <span>LIVE</span>
            </div>

            {user ? (
              // ── Logged In: show profile ──
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdown(d => !d)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(0,255,136,0.08)',
                    border: '1px solid rgba(0,255,136,0.25)',
                    borderRadius: '999px', padding: '6px 14px 6px 6px',
                    cursor: 'pointer', color: 'var(--text-1)',
                    fontFamily: 'var(--font-mono)', fontSize: '13px',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Avatar circle */}
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--neon-green), var(--neon-blue))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: '700', color: '#060910',
                  }}>
                    {getInitials(user.name)}
                  </div>
                  <span style={{ color: 'var(--text-1)' }}>{user.name}</span>
                  <span style={{ color: 'var(--text-3)', fontSize: '10px' }}>▾</span>
                </button>

                {/* Dropdown */}
                {dropdown && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: 'var(--bg-2)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', padding: '8px', minWidth: '200px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 999,
                  }}>
                    {/* User info */}
                    <div style={{
                      padding: '10px 12px 12px',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      marginBottom: '6px',
                    }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-0)', fontWeight: '600' }}>
                        {user.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>
                        {user.email}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--neon-green)', marginTop: '4px' }}>
                        Operator #{user.id}
                      </div>
                    </div>

                    {/* Dropdown links */}
                    {[
                      { label: '⊕  Profile',      href: '/profile' },
                      { label: '◈  Leaderboard',  href: '/leaderboard' },
                      { label: '◫  My Labs',       href: '/labs' },
                    ].map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setDropdown(false)}
                        style={{
                          display: 'block', padding: '9px 12px',
                          fontFamily: 'var(--font-mono)', fontSize: '12px',
                          color: 'var(--text-2)', borderRadius: '8px',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.target.style.background = 'rgba(0,255,136,0.06)'; e.target.style.color = 'var(--text-0)' }}
                        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-2)' }}
                      >
                        {item.label}
                      </Link>
                    ))}

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '9px 12px', marginTop: '4px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        fontFamily: 'var(--font-mono)', fontSize: '12px',
                        color: '#f87171', borderRadius: '8px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => e.target.style.background = 'rgba(248,113,113,0.08)'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >
                      ⏻  Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // ── Not Logged In: show Sign In / Sign Up ──
              <>
                <Link to="/enroll" className="cx-enroll-btn">Enroll</Link>
                <Link to="/signup" className="cx-enroll-btn">Sign Up</Link>
                <Link to="/signin" className="cx-signin-btn">
                  Sign In
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`cx-burger${menuOpen ? ' is-open' : ''}`}
            onClick={toggleMenu}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span></span><span></span><span></span>
          </button>
        </div>

        <div className="cx-header__scan"></div>
      </header>

      {/* Spacer */}
      <div className="cx-header__spacer"></div>

      {/* Mobile Menu */}
      <div className={`cx-mobile-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="cx-mobile-menu__inner">
          <div className="cx-mobile-menu__links">
            {navLinks.map(({ name, href, icon }) => (
              <Link
                key={name}
                to={href}
                className={`cx-mobile-link${isActive(href) ? ' is-active' : ''}`}
                onClick={() => { setMenuOpen(false); document.body.style.overflow = '' }}
              >
                <span className="cx-mobile-link__icon">{icon}</span>
                <span>{name}</span>
                {isActive(href) && <span className="cx-mobile-link__dot"></span>}
              </Link>
            ))}
          </div>

          <div className="cx-mobile-menu__footer">
            {user ? (
              // Mobile logged in view
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', marginBottom: '12px',
                  background: 'rgba(0,255,136,0.06)',
                  border: '1px solid rgba(0,255,136,0.15)',
                  borderRadius: '10px',
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--neon-green), var(--neon-blue))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: '700', color: '#060910',
                  }}>
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-0)', fontWeight: '600' }}>
                      {user.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)' }}>
                      {user.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}
                >
                  ⏻ Sign Out
                </button>
              </>
            ) : (
              // Mobile logged out view
              <>
                <Link to="/signup" className="btn btn-outline-green" style={{ width: '100%', justifyContent: 'center', marginBottom: '8px' }}>
                  Sign Up →
                </Link>
                <Link to="/signin" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Sign In →
                </Link>
              </>
            )}
            <div className="cx-mobile-menu__status">
              <span className="dot-live" style={{ width: '6px', height: '6px' }}></span>
              <span>Season IV · 38 online · 8 lectures live</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}