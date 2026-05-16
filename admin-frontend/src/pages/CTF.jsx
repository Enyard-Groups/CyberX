import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar  from '../components/Topbar'

const API = import.meta.env.VITE_ADMIN_API_URL

const emptyForm = { title:'', description:'', category:'General', difficulty:'Easy', points:100, flag:'', status:'Active' }

export default function CTF() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [editItem, setEditItem]     = useState(null)
  const [form, setForm]             = useState(emptyForm)
  const [saving, setSaving]         = useState(false)

  const token = sessionStorage.getItem('cyberx_admin_token')

  useEffect(() => { fetchChallenges() }, [])

  async function fetchChallenges() {
    try {
      const res  = await fetch(`${API}/ctf`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setChallenges(data.challenges)
    } catch (err) {
      setError(err.message || 'Failed to fetch challenges.')
    } finally { setLoading(false) }
  }

  function openAdd() {
    setEditItem(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(challenge) {
    setEditItem(challenge)
    setForm({
      title:       challenge.title,
      description: challenge.description || '',
      category:    challenge.category    || 'General',
      difficulty:  challenge.difficulty  || 'Easy',
      points:      challenge.points      || 100,
      flag:        challenge.flag        || '',
      status:      challenge.status      || 'Active',
    })
    setShowModal(true)
  }

  async function handleSave() {
    setError(''); setSaving(true)
    try {
      const url    = editItem ? `${API}/ctf/${editItem.id}` : `${API}/ctf`
      const method = editItem ? 'PUT' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setSuccess(editItem ? 'Challenge updated!' : 'Challenge added!')
      setTimeout(() => setSuccess(''), 3000)
      setShowModal(false)
      fetchChallenges()
    } catch (err) {
      setError(err.message || 'Failed to save challenge.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      const res  = await fetch(`${API}/ctf/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setSuccess('Challenge deleted!')
      setChallenges(challenges.filter(c => c.id !== id))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Failed to delete challenge.')
    }
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Topbar title="CTF Arena Management" />
        <div className="admin-content">

          {error   && <div className="alert alert-error">⚠ {error}</div>}
          {success && <div className="alert alert-success">✓ {success}</div>}

          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <div className="admin-table-title">All CTF Challenges</div>
              <button className="btn btn-primary" onClick={openAdd}>+ Add Challenge</button>
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
                    <th>Points</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {challenges.map(c => (
                    <tr key={c.id}>
                      <td style={{ color:'var(--text-4)' }}>#{c.id}</td>
                      <td style={{ color:'var(--text-0)', fontWeight:600 }}>{c.title}</td>
                      <td>{c.category}</td>
                      <td>
                        <span className={`badge ${c.difficulty==='Easy' ? 'badge-green' : c.difficulty==='Medium' ? 'badge-blue' : 'badge-gray'}`}>
                          {c.difficulty}
                        </span>
                      </td>
                      <td style={{ color:'var(--neon-green)' }}>{c.points} pts</td>
                      <td>
                        <span className={`badge ${c.status==='Active' ? 'badge-green' : 'badge-gray'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ display:'flex', gap:'8px' }}>
                        <button className="btn btn-ghost" onClick={() => openEdit(c)}>✏ Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(c.id, c.title)}>🗑 Delete</button>
                      </td>
                    </tr>
                  ))}
                  {challenges.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign:'center', color:'var(--text-4)' }}>No challenges yet. Add one!</td></tr>
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
            <div className="modal__title">{editItem ? 'Edit Challenge' : 'Add New Challenge'}</div>

            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" placeholder="Challenge title" value={form.title} onChange={set('title')} />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" placeholder="Challenge description" value={form.description} onChange={set('description')} rows={3} style={{ resize:'vertical' }} />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={set('category')}>
                <option>General</option>
                <option>Web</option>
                <option>Crypto</option>
                <option>Forensics</option>
                <option>Reverse Engineering</option>
                <option>Pwn</option>
                <option>OSINT</option>
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
              <label className="form-label">Points</label>
              <input className="form-input" type="number" placeholder="100" value={form.points} onChange={set('points')} />
            </div>

            <div className="form-group">
              <label className="form-label">Flag</label>
              <input className="form-input" placeholder="CTF{flag_here}" value={form.flag} onChange={set('flag')} />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={set('status')}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            {error && <div className="alert alert-error">⚠ {error}</div>}

            <div className="modal__actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editItem ? 'Update Challenge' : 'Add Challenge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}