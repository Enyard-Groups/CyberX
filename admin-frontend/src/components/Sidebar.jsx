import { Link, useLocation, useNavigate } from 'react-router-dom'

const navLinks = [
  { name: 'Dashboard',   href: '/admin/dashboard',   icon: '⊞' },
  { name: 'Users',       href: '/admin/users',       icon: '⊕' },
  { name: 'Lectures',    href: '/admin/lectures',    icon: '▶' },
  { name: 'CTF Arena',   href: '/admin/ctf',         icon: '⚑' },
  { name: 'Codex',       href: '/admin/codex',       icon: '#' },
  { name: 'Labs',        href: '/admin/labs',        icon: '◫' },
  { name: 'Leaderboard', href: '/admin/leaderboard', icon: '◈' },
  { name: 'Admins',      href: '/admin/admins',      icon: '🛡' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate  = useNavigate()

  const admin = JSON.parse(sessionStorage.getItem('cyberx_admin') || '{}')

  const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'

  const handleLogout = () => {
    sessionStorage.removeItem('cyberx_admin_token')
    sessionStorage.removeItem('cyberx_admin')
    navigate('/admin/login')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-hex">
          <div className="sidebar__logo-hex-inner" />
          <span style={{ position:'relative', zIndex:1, fontFamily:'var(--font-mono)', fontSize:'12px', fontWeight:700, color:'#060910' }}>CX</span>
        </div>
        <div>
          <div className="sidebar__logo-text">CyberX</div>
          <div className="sidebar__logo-tag">Admin Panel</div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="sidebar__nav">
        {navLinks.map(({ name, href, icon }) => (
          <Link
            key={name}
            to={href}
            className={`sidebar__link${location.pathname === href ? ' active' : ''}`}
          >
            <span className="sidebar__link-icon">{icon}</span>
            <span>{name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar__footer">
        <div className="sidebar__admin-info">
          <div className="sidebar__avatar">{getInitials(admin.name)}</div>
          <div>
            <div className="sidebar__admin-name">{admin.name || 'Admin'}</div>
            <div className="sidebar__admin-role">Super Admin</div>
          </div>
        </div>
        <button className="sidebar__logout" onClick={handleLogout}>
          ⏻ Sign Out
        </button>
      </div>
    </aside>
  )
} 
