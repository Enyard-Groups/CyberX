import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar  from '../components/Topbar'

const API = import.meta.env.VITE_ADMIN_API_URL

const emptyForm = { title:'', description:'', instructor:'', duration:'', level:'Beginner', status:'Draft' }

export default function Lectures() {
  const [lectures, setLectures] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem]   = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [saving, setSaving]       = useState(false)

  const token = sessionStorage.getItem('cyberx_admin_token')

  useEffect(() => { fetchLectures() }, [])

  async function fetchLectures() {
    try {
      const res  = await fetch(`${API}/lectures`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setLectures(data.lectures)
    } catch (err) {
      setError(err.message || 'Failed to fetch lectures.')
    } finally { setLoading(false) }
  }

  function openAdd() {
    setEditItem(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(lecture) {
    setEditItem(lecture)
    setForm({
      title:       lecture.title,
      description: lecture.description || '',
      instructor:  lecture.instructor  || '',
      duration:    lecture.duration    || '',
      level:       lecture.level       || 'Beginner',
      status:      lecture.status      || 'Draft',
    })
    setShowModal(true)
  }

  async function handleSave() {
    setError(''); setSaving(true)
    try {
      const url    = editItem ? `${API}/lectures/${editItem.id}` : `${API}/lectures`
      const method = editItem ? 'PUT' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)

      setSuccess(editItem ? 'Lecture updated!' : 'Lecture added!')
      setTimeout(() => setSuccess(''), 3000)
      setShowModal(false)
      fetchLectures()
    } catch (err) {
      setError(err.message || 'Failed to save lecture.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      const res  = await fetch(`${API}/lectures/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setSuccess('Lecture deleted!')
      setLectures(lectures.filter(l => l.id !== id))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Failed to delete lecture.')
    }
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Topbar title="Lectures Management" />
        <div className="admin-content">

          {error   && <div className="alert alert-error">⚠ {error}</div>}
          {success && <div className="alert alert-success">✓ {success}</div>}

          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <div className="admin-table-title">All Lectures</div>
              <button className="btn btn-primary" onClick={openAdd}>+ Add Lecture</button>
            </div>

            {loading ? (
              <p style={{ padding:'24px', fontFamily:'var(--font-mono)', color:'var(--text-3)' }}>Loading...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Instructor</th>
                    <th>Level</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lectures.map(lecture => (
                    <tr key={lecture.id}>
                      <td style={{ color:'var(--text-4)' }}>#{lecture.id}</td>
                      <td style={{ color:'var(--text-0)', fontWeight:600 }}>{lecture.title}</td>
                      <td>{lecture.instructor || '—'}</td>
                      <td>
                        <span className={`badge ${lecture.level === 'Beginner' ? 'badge-green' : lecture.level === 'Intermediate' ? 'badge-blue' : 'badge-gray'}`}>
                          {lecture.level}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${lecture.status === 'Published' ? 'badge-green' : 'badge-gray'}`}>
                          {lecture.status}
                        </span>
                      </td>
                      <td style={{ display:'flex', gap:'8px' }}>
                        <button className="btn btn-ghost" onClick={() => openEdit(lecture)}>✏ Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(lecture.id, lecture.title)}>🗑 Delete</button>
                      </td>
                    </tr>
                  ))}
                  {lectures.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--text-4)' }}>No lectures yet. Add one!</td></tr>
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
            <div className="modal__title">{editItem ? 'Edit Lecture' : 'Add New Lecture'}</div>

            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" placeholder="Lecture title" value={form.title} onChange={set('title')} />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" placeholder="Lecture description" value={form.description} onChange={set('description')} rows={3} style={{ resize:'vertical' }} />
            </div>

            <div className="form-group">
              <label className="form-label">Instructor</label>
              <input className="form-input" placeholder="Instructor name" value={form.instructor} onChange={set('instructor')} />
            </div>

            <div className="form-group">
              <label className="form-label">Duration</label>
              <input className="form-input" placeholder="e.g. 2h 30m" value={form.duration} onChange={set('duration')} />
            </div>

            <div className="form-group">
              <label className="form-label">Level</label>
              <select className="form-select" value={form.level} onChange={set('level')}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
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
                {saving ? 'Saving…' : editItem ? 'Update Lecture' : 'Add Lecture'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}