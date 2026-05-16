import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar  from '../components/Topbar'

const API = import.meta.env.VITE_ADMIN_API_URL

const emptyForm = { title:'', content:'', category:'General', author:'', status:'Draft' }

export default function Codex() {
  const [articles, setArticles]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem]   = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [saving, setSaving]       = useState(false)

  const token = sessionStorage.getItem('cyberx_admin_token')

  useEffect(() => { fetchArticles() }, [])

  async function fetchArticles() {
    try {
      const res  = await fetch(`${API}/codex`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setArticles(data.articles)
    } catch (err) {
      setError(err.message || 'Failed to fetch articles.')
    } finally { setLoading(false) }
  }

  function openAdd() {
    setEditItem(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(article) {
    setEditItem(article)
    setForm({
      title:    article.title,
      content:  article.content  || '',
      category: article.category || 'General',
      author:   article.author   || '',
      status:   article.status   || 'Draft',
    })
    setShowModal(true)
  }

  async function handleSave() {
    setError(''); setSaving(true)
    try {
      const url    = editItem ? `${API}/codex/${editItem.id}` : `${API}/codex`
      const method = editItem ? 'PUT' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setSuccess(editItem ? 'Article updated!' : 'Article added!')
      setTimeout(() => setSuccess(''), 3000)
      setShowModal(false)
      fetchArticles()
    } catch (err) {
      setError(err.message || 'Failed to save article.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      const res  = await fetch(`${API}/codex/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setSuccess('Article deleted!')
      setArticles(articles.filter(a => a.id !== id))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Failed to delete article.')
    }
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Topbar title="Codex Management" />
        <div className="admin-content">

          {error   && <div className="alert alert-error">⚠ {error}</div>}
          {success && <div className="alert alert-success">✓ {success}</div>}

          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <div className="admin-table-title">All Codex Articles</div>
              <button className="btn btn-primary" onClick={openAdd}>+ Add Article</button>
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
                    <th>Author</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(a => (
                    <tr key={a.id}>
                      <td style={{ color:'var(--text-4)' }}>#{a.id}</td>
                      <td style={{ color:'var(--text-0)', fontWeight:600 }}>{a.title}</td>
                      <td>{a.category}</td>
                      <td>{a.author || '—'}</td>
                      <td>
                        <span className={`badge ${a.status==='Published' ? 'badge-green' : 'badge-gray'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td style={{ display:'flex', gap:'8px' }}>
                        <button className="btn btn-ghost" onClick={() => openEdit(a)}>✏ Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(a.id, a.title)}>🗑 Delete</button>
                      </td>
                    </tr>
                  ))}
                  {articles.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--text-4)' }}>No articles yet. Add one!</td></tr>
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
            <div className="modal__title">{editItem ? 'Edit Article' : 'Add New Article'}</div>

            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" placeholder="Article title" value={form.title} onChange={set('title')} />
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea className="form-input" placeholder="Article content" value={form.content} onChange={set('content')} rows={4} style={{ resize:'vertical' }} />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={set('category')}>
                <option>General</option>
                <option>Web Security</option>
                <option>Network Security</option>
                <option>Cryptography</option>
                <option>Malware Analysis</option>
                <option>OSINT</option>
                <option>Forensics</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Author</label>
              <input className="form-input" placeholder="Author name" value={form.author} onChange={set('author')} />
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
                {saving ? 'Saving…' : editItem ? 'Update Article' : 'Add Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
