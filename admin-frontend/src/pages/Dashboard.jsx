import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar  from '../components/Topbar'

const API = import.meta.env.VITE_ADMIN_API_URL

export default function Dashboard() {
  const [stats, setStats]         = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  const token = sessionStorage.getItem('cyberx_admin_token')

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res  = await fetch(`${API}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message)
        setStats({
         totalUsers:       data.stats.totalUsers,
         totalLectures:    data.stats.totalLectures,
         newUsersThisWeek: data.stats.newUsersThisWeek,
         ctfChallenges:    data.stats.ctfChallenges,
         labs:             data.stats.labs,
         codexArticles:    data.stats.codexArticles,
         leaderboard:      data.stats.leaderboard,
        })
        setRecentUsers(data.recentUsers)
      } catch (err) {
        setError(err.message || 'Failed to load dashboard.')
      } finally { setLoading(false) }
    }
    fetchDashboard()
  }, [])

  const statCards = stats ? [
    { label: 'Total Users',       value: stats.totalUsers,       color: 'var(--neon-green)',  sub: 'Registered operators',     icon: '⊕' },
    { label: 'Total Lectures',    value: stats.totalLectures,    color: 'var(--neon-blue)',   sub: 'Published & drafts',        icon: '▶' },
    { label: 'New This Week',     value: stats.newUsersThisWeek, color: 'var(--neon-purple)', sub: 'New users in 7 days',       icon: '◈' },
    { label: 'CTF Challenges',    value: stats.ctfChallenges,    color: 'var(--neon-green)',  sub: 'Sample — DB coming soon',   icon: '⚑' },
    { label: 'Labs',              value: stats.labs,             color: 'var(--neon-blue)',   sub: 'Sample — DB coming soon',   icon: '◫' },
    { label: 'Codex Articles',    value: stats.codexArticles,    color: 'var(--neon-purple)', sub: 'Sample — DB coming soon',   icon: '#' },
    { label: 'Enrollments',       value: stats.enrollments,      color: 'var(--neon-green)',  sub: 'Sample — DB coming soon',   icon: '🎓' },
    { label: 'Active Users',      value: stats.activeUsers,      color: 'var(--neon-blue)',   sub: 'Sample — DB coming soon',   icon: '🟢' },
  ] : []

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Topbar title="Dashboard" />
        <div className="admin-content">

          {loading && <p style={{ fontFamily:'var(--font-mono)', color:'var(--text-3)' }}>Loading...</p>}
          {error   && <div className="alert alert-error">⚠ {error}</div>}

          {stats && (
            <>
              {/* Stat Cards */}
              <div className="stat-grid">
                {statCards.map(card => (
                  <div className="stat-card" key={card.label}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                      <div className="stat-card__label">{card.label}</div>
                      <span style={{ fontSize:'20px' }}>{card.icon}</span>
                    </div>
                    <div className="stat-card__value" style={{ color: card.color }}>{card.value}</div>
                    <div className="stat-card__sub" style={{ marginTop:'6px' }}>{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* Recent Users Table */}
              <div className="admin-table-wrap">
                <div className="admin-table-header">
                  <div className="admin-table-title">Recent Users</div>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color:'var(--text-3)' }}>
                    Last 5 registered
                  </span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map(user => (
                      <tr key={user.id}>
                        <td style={{ color:'var(--text-4)' }}>#{user.id}</td>
                        <td style={{ color:'var(--text-0)', fontWeight:600 }}>{user.name}</td>
                        <td>{user.email}</td>
                        <td style={{ color:'var(--text-4)' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {recentUsers.length === 0 && (
                      <tr><td colSpan={4} style={{ textAlign:'center', color:'var(--text-4)' }}>No users yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}