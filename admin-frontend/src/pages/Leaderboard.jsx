import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar  from '../components/Topbar'

const API = import.meta.env.VITE_ADMIN_API_URL

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')

  const token = sessionStorage.getItem('cyberx_admin_token')

  useEffect(() => { fetchLeaderboard() }, [])

  async function fetchLeaderboard() {
    try {
      const res  = await fetch(`${API}/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setLeaderboard(data.leaderboard)
    } catch (err) {
      setError(err.message || 'Failed to fetch leaderboard.')
    } finally { setLoading(false) }
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Topbar title="Leaderboard" />
        <div className="admin-content">

          {error && <div className="alert alert-error">⚠ {error}</div>}

          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <div className="admin-table-title">Top Players</div>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color:'var(--text-3)' }}>
                Auto-updated when users solve CTF challenges
              </span>
            </div>

            {loading ? (
              <p style={{ padding:'24px', fontFamily:'var(--font-mono)', color:'var(--text-3)' }}>Loading...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Points</th>
                    <th>Solved</th>
                    <th>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player, index) => (
                    <tr key={player.id}>
                      <td>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'var(--text-3)'
                        }}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </span>
                      </td>
                      <td style={{ color:'var(--text-0)', fontWeight:600 }}>{player.name}</td>
                      <td>{player.email}</td>
                      <td style={{ color:'var(--neon-green)', fontWeight:700 }}>{player.points} pts</td>
                      <td style={{ color:'var(--neon-blue)' }}>{player.solved} challenges</td>
                      <td style={{ color:'var(--text-4)' }}>{new Date(player.updated_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign:'center', color:'var(--text-4)', padding:'40px' }}>
                        No players yet. Leaderboard updates when users solve CTF challenges!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}