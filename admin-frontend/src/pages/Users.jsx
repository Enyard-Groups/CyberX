import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar  from '../components/Topbar'

const API = import.meta.env.VITE_ADMIN_API_URL

export default function Users() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const token = sessionStorage.getItem('cyberx_admin_token')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    try {
      const res  = await fetch(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setUsers(data.users)
    } catch (err) {
      setError(err.message || 'Failed to fetch users.')
    } finally { setLoading(false) }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return
    try {
      const res  = await fetch(`${API}/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setSuccess(`User "${name}" deleted successfully.`)
      setUsers(users.filter(u => u.id !== id))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Failed to delete user.')
    }
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Topbar title="Users Management" />
        <div className="admin-content">

          {error   && <div className="alert alert-error">⚠ {error}</div>}
          {success && <div className="alert alert-success">✓ {success}</div>}

          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <div className="admin-table-title">All Users</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color:'var(--text-3)' }}>
                Total: {users.length}
              </div>
            </div>

            {loading ? (
              <p style={{ padding:'24px', fontFamily:'var(--font-mono)', color:'var(--text-3)' }}>Loading...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td style={{ color:'var(--text-4)' }}>#{user.id}</td>
                      <td style={{ color:'var(--text-0)', fontWeight:600 }}>{user.name}</td>
                      <td>{user.email}</td>
                      <td style={{ color:'var(--text-4)' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(user.id, user.name)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--text-4)' }}>No users found</td></tr>
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
