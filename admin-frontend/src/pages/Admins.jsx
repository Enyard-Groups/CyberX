import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar  from '../components/Topbar'

const API = import.meta.env.VITE_ADMIN_API_URL

const emptyForm = { name: '', email: '', password: '', confirm: '' }

export default function Admins() {
  const [admins, setAdmins]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [saving, setSaving]       = useState(false)

  const token = sessionStorage.getItem('cyberx_admin_token')

  useEffect(() => { fetchAdmins() }, [])

  async function fetchAdmins() {
    try {
      const res  = await fetch(`${API}/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setAdmins(data.admins)
    } catch (err) {
      setError(err.message || 'Failed to fetch admins.')
    } finally { setLoading(false) }
  }

  async function handleSave() {
    setError(''); setSaving(true)
    if (!form.name || !form.email || !form.password)
      return setError('All fields are required.')
    if (form.password.length < 8)
    return setError('Password must be at least 8 characters.')
    if (form.password !== form.confirm)
    return setError('Passwords do not match.')
    try {
      const res  = await fetch(`${API}/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setSuccess('Admin created successfully!')
      setTimeout(() => setSuccess(''), 3000)
      setShowModal(false)
      setForm(emptyForm)
      fetchAdmins()
    } catch (err) {
      setError(err.message || 'Failed to create admin.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete admin "${name}"?`)) return
    try {
      const res  = await fetch(`${API}/admins/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setSuccess(`Admin "${name}" deleted.`)
      setAdmins(admins.filter(a => a.id !== id))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Failed to delete admin.')
    }
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Topbar title="Admins Management" />
        <div className="admin-content">

          {error   && <div className="alert alert-error">⚠ {error}</div>}
          {success && <div className="alert alert-success">✓ {success}</div>}

          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <div className="admin-table-title">All Admins</div>
              <button className="btn btn-primary" onClick={() => { setShowModal(true); setForm(emptyForm); setError('') }}>
                + Add Admin
              </button>
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
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin.id}>
                      <td style={{ color:'var(--text-4)' }}>#{admin.id}</td>
                      <td style={{ color:'var(--text-0)', fontWeight:600 }}>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td style={{ color:'var(--text-4)' }}>{new Date(admin.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(admin.id, admin.name)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {admins.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--text-4)' }}>No admins found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__title">Add New Admin</div>

            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" placeholder="Admin name" value={form.name} onChange={set('name')} />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="admin@example.com" value={form.email} onChange={set('email')} />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min 8 characters" value={form.password} onChange={set('password')} />
            </div>

            <div className="form-group">
               <label className="form-label">Confirm Password</label>
               <input className="form-input" type="password" placeholder="Re-enter password" value={form.confirm} onChange={set('confirm')} />
            </div>

            {error && <div className="alert alert-error">⚠ {error}</div>}

            <div className="modal__actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Creating…' : 'Create Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}