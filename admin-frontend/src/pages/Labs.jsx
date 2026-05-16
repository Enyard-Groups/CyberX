import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar  from '../components/Topbar'

const API = import.meta.env.VITE_ADMIN_API_URL

const emptyForm = { title:'', description:'', category:'General', difficulty:'Easy', duration:'', status:'Draft' }

export default function Labs() {
  const [labs, setLabs]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem]   = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [saving, setSaving]       = useState(false)

  const token = sessionStorage.getItem('cyberx_admin_token')

  useEffect(() => { fetchLabs() }, [])

  async function fetchLabs() {
    try {
      const res  = await fetch(`${API}/labs`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setLabs(data.labs)
    } catch (err) {
      setError(err.message || 'Failed to fetch labs.')
    } finally { setLoading(false) }
  }

  function openAdd() {
    setEditItem(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(lab) {
    setEditItem(lab)
    setForm({
      title:       lab.title,
      description: lab.description || '',
      category:    lab.category    || 'General',
      difficulty:  lab.difficulty  || 'Easy',
      duration:    lab.duration    || '',
      status:      lab.status      || 'Draft',
    })
    setShowModal(true)
  }

  async function handleSave() {
    setError(''); setSaving(true)
    try {
      const url    = editItem ? `${API}/labs/${editItem.id}` : `${API}/labs`
      const method = editItem ? 'PUT' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setSuccess(editItem ? 'Lab updated!' : 'Lab added!')
      setTimeout(() => setSuccess(''), 3000)
      setShowModal(false)
      fetchLabs()
    } catch (err) {
      setError(err.message || 'Failed to save lab.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      const res  = await fetch(`${API}/labs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setSuccess('Lab deleted!')
      setLabs(labs.filter(l => l.id !== id))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Failed to delete lab.')
    }
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Topbar title="Labs Management" />
        <div className="admin-content">

          {error   && <div className="alert alert-error">⚠ {error}</div>}
          {success && <div className="alert alert-success">✓ {success}</div>}

          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <div className="admin-table-title">All Labs</div>
              <button className="btn btn-primary" onClick={openAdd}>+ Add Lab</button>
            </div>

            {loading ? (
              <p style={{ padding:'24px', fontFamily:'var(--font-mono)', color:'var(--text-3)' }}>Loading...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {labs.map(l => (
                    <tr key={l.id}>
                      <td style={{ color:'var(--text-4)' }}>#{l.id}</td>
                      <td style={{ color:'var(--text-0)', fontWeight:600 }}>{l.title}</td>
                      <td>{l.category}</td>
                      <td>
                        <span className={`badge ${l.difficulty==='Easy' ? 'badge-green' : l.difficulty==='Medium' ? 'badge-blue' : 'badge-gray'}`}>
                          {l.difficulty}
                        </span>
                      </td>
                      <td>{l.duration || '—'}</td>
                      <td>
                        <span className={`badge ${l.status==='Published' ? 'badge-green' : 'badge-gray'}`}>
                          {l.status}
                        </span>
                      </td>
                      <td style={{ display:'flex', gap:'8px' }}>
                        <button className="btn btn-ghost" onClick={() => openEdit(l)}>✏ Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(l.id, l.title)}>🗑 Delete</button>
                      </td>
                    </tr>
                  ))}
                  {labs.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign:'center', color:'var(--text-4)' }}>No labs yet. Add one!</td></tr>
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
            <div className="modal__title">{editItem ? 'Edit Lab' : 'Add New Lab'}</div>

            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" placeholder="Lab title" value={form.title} onChange={set('title')} />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" placeholder="Lab description" value={form.description} onChange={set('description')} rows={3} style={{ resize:'vertical' }} />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={set('category')}>
                <option>General</option>
                <option>Web Security</option>
                <option>Network Security</option>
                <option>Cryptography</option>
                <option>Malware Analysis</option>
                <option>Forensics</option>
                <option>Reverse Engineering</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select className="form-select" value={form.difficulty} onChange={set('difficulty')}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Duration</label>
              <input className="form-input" placeholder="e.g. 1h 30m" value={form.duration} onChange={set('duration')} />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={set('status')}>
                <option>Draft</option>
                <option>Published</option>
              </select>
            </div>

            {error && <div className="alert alert-error">⚠ {error}</div>}

            <div className="modal__actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editItem ? 'Update Lab' : 'Add Lab'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}