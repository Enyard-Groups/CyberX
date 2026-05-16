/**
 * CyberX – Admin Backend Server
 * Stack: Node.js + Express + PostgreSQL + JWT
 */

import express  from 'express'
import cors     from 'cors'
import dotenv   from 'dotenv'
import pkg      from 'pg'
import bcrypt   from 'bcrypt'
import jwt      from 'jsonwebtoken'

dotenv.config()

const { Pool } = pkg
const app = express()
app.use(express.json())
app.use(cors({ origin: process.env.ADMIN_FRONTEND_ORIGIN || 'http://localhost:5174' }))

// ── PostgreSQL Pool ──────────────────────────────────────────────────────────
const pool = new Pool({
  host:     process.env.PG_HOST     || 'localhost',
  port:     Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE || 'cyberx',
  user:     process.env.PG_USER     || 'postgres',
  password: process.env.PG_PASSWORD || '',
})

const SALT_ROUNDS = 10
const JWT_SECRET  = process.env.JWT_SECRET || 'cyberxadminsecret'

// ── Init DB ──────────────────────────────────────────────────────────────────
async function initDB() {
  // Create admins table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(100)        NOT NULL,
      email      VARCHAR(255) UNIQUE NOT NULL,
      password   VARCHAR(255)        NOT NULL,
      created_at TIMESTAMPTZ         DEFAULT NOW()
    );
  `)

  // Create lectures table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lectures (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(255)  NOT NULL,
      description TEXT,
      instructor  VARCHAR(100),
      duration    VARCHAR(50),
      level       VARCHAR(50)   DEFAULT 'Beginner',
      status      VARCHAR(50)   DEFAULT 'Draft',
      created_at  TIMESTAMPTZ   DEFAULT NOW()
    );
  `)

  // Create default admin if none exists
  const existing = await pool.query('SELECT id FROM admins LIMIT 1')
  if (existing.rows.length === 0) {
    const hashed = await bcrypt.hash('admin123', SALT_ROUNDS)
    await pool.query(
      'INSERT INTO admins (name, email, password) VALUES ($1, $2, $3)',
      ['Super Admin', 'admin@cyberx.com', hashed]
    )
    console.log('[DB] Default admin created: admin@cyberx.com / admin123')
  }

  // CTF Challenges table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ctf_challenges (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(255)  NOT NULL,
      description TEXT,
      category    VARCHAR(100)  DEFAULT 'General',
      difficulty  VARCHAR(50)   DEFAULT 'Easy',
      points      INTEGER       DEFAULT 100,
      flag        VARCHAR(255),
      status      VARCHAR(50)   DEFAULT 'Active',
      created_at  TIMESTAMPTZ   DEFAULT NOW()
    );
  `)

  // Codex articles table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS codex_articles (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(255)  NOT NULL,
      content     TEXT,
      category    VARCHAR(100)  DEFAULT 'General',
      author      VARCHAR(100),
      status      VARCHAR(50)   DEFAULT 'Draft',
      created_at  TIMESTAMPTZ   DEFAULT NOW()
    );
  `)

  // Labs table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS labs (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(255)  NOT NULL,
      description TEXT,
      category    VARCHAR(100)  DEFAULT 'General',
      difficulty  VARCHAR(50)   DEFAULT 'Easy',
      duration    VARCHAR(50),
      status      VARCHAR(50)   DEFAULT 'Draft',
      created_at  TIMESTAMPTZ   DEFAULT NOW()
    );
  `)

  // Leaderboard table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
      points     INTEGER DEFAULT 0,
      solved     INTEGER DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `)

  console.log('[DB] Admin tables ready.')
}
initDB().catch(err => console.error('[DB] Init error:', err.message))

// ── JWT Middleware ────────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token)
    return res.status(401).json({ success: false, message: 'No token provided.' })
  try {
    req.admin = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' })
  }
}

// ── POST /api/admin/login ────────────────────────────────────────────────────
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password are required.' })

  try {
    const result = await pool.query('SELECT * FROM admins WHERE LOWER(email) = LOWER($1)', [email])
    if (result.rows.length === 0)
      return res.status(401).json({ success: false, message: 'No admin found with that email.' })

    const admin = result.rows[0]
    const match = await bcrypt.compare(password, admin.password)
    if (!match)
      return res.status(401).json({ success: false, message: 'Incorrect password.' })

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    console.log(`[Admin] ${admin.email} logged in.`)
    return res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email }
    })
  } catch (err) {
    console.error('[Admin Login] Error:', err.message)
    return res.status(500).json({ success: false, message: 'Login failed.' })
  }
})

// ── GET /api/admin/dashboard ─────────────────────────────────────────────────
// ── GET /api/admin/dashboard ─────────────────────────────────────────────────
app.get('/api/admin/dashboard', authMiddleware, async (req, res) => {
  try {
    const users        = await pool.query('SELECT COUNT(*) FROM users')
    const lectures     = await pool.query('SELECT COUNT(*) FROM lectures')
    const newUsers     = await pool.query("SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days'")
    const ctf          = await pool.query('SELECT COUNT(*) FROM ctf_challenges')
    const labs         = await pool.query('SELECT COUNT(*) FROM labs')
    const codex        = await pool.query('SELECT COUNT(*) FROM codex_articles')
    const leaderboard  = await pool.query('SELECT COUNT(*) FROM leaderboard')
    const recentUsers  = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5')

    return res.json({
      success: true,
      stats: {
        totalUsers:       Number(users.rows[0].count),
        totalLectures:    Number(lectures.rows[0].count),
        newUsersThisWeek: Number(newUsers.rows[0].count),
        ctfChallenges:    Number(ctf.rows[0].count),
        labs:             Number(labs.rows[0].count),
        codexArticles:    Number(codex.rows[0].count),
        leaderboard:      Number(leaderboard.rows[0].count),
      },
      recentUsers: recentUsers.rows
    })
  } catch (err) {
    console.error('[Dashboard] Error:', err.message)
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard data.' })
  }
})
// ── GET /api/admin/users ─────────────────────────────────────────────────────
app.get('/api/admin/users', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC')
    return res.json({ success: true, users: result.rows })
  } catch (err) {
    console.error('[Users] Error:', err.message)
    return res.status(500).json({ success: false, message: 'Failed to fetch users.' })
  }
})

// ── DELETE /api/admin/users/:id ──────────────────────────────────────────────
app.delete('/api/admin/users/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id])
    console.log(`[Admin] User ${req.params.id} deleted.`)
    return res.json({ success: true, message: 'User deleted successfully.' })
  } catch (err) {
    console.error('[Delete User] Error:', err.message)
    return res.status(500).json({ success: false, message: 'Failed to delete user.' })
  }
})

// ── GET /api/admin/lectures ──────────────────────────────────────────────────
app.get('/api/admin/lectures', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lectures ORDER BY created_at DESC')
    return res.json({ success: true, lectures: result.rows })
  } catch (err) {
    console.error('[Lectures] Error:', err.message)
    return res.status(500).json({ success: false, message: 'Failed to fetch lectures.' })
  }
})

// ── POST /api/admin/lectures ─────────────────────────────────────────────────
app.post('/api/admin/lectures', authMiddleware, async (req, res) => {
  const { title, description, instructor, duration, level, status } = req.body
  if (!title)
    return res.status(400).json({ success: false, message: 'Title is required.' })

  try {
    const result = await pool.query(
      'INSERT INTO lectures (title, description, instructor, duration, level, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, instructor, duration, level || 'Beginner', status || 'Draft']
    )
    console.log(`[Admin] Lecture created: ${title}`)
    return res.status(201).json({ success: true, lecture: result.rows[0] })
  } catch (err) {
    console.error('[Add Lecture] Error:', err.message)
    return res.status(500).json({ success: false, message: 'Failed to add lecture.' })
  }
})

// ── PUT /api/admin/lectures/:id ──────────────────────────────────────────────
app.put('/api/admin/lectures/:id', authMiddleware, async (req, res) => {
  const { title, description, instructor, duration, level, status } = req.body
  try {
    const result = await pool.query(
      'UPDATE lectures SET title=$1, description=$2, instructor=$3, duration=$4, level=$5, status=$6 WHERE id=$7 RETURNING *',
      [title, description, instructor, duration, level, status, req.params.id]
    )
    return res.json({ success: true, lecture: result.rows[0] })
  } catch (err) {
    console.error('[Update Lecture] Error:', err.message)
    return res.status(500).json({ success: false, message: 'Failed to update lecture.' })
  }
})

// ── DELETE /api/admin/lectures/:id ───────────────────────────────────────────
app.delete('/api/admin/lectures/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM lectures WHERE id = $1', [req.params.id])
    console.log(`[Admin] Lecture ${req.params.id} deleted.`)
    return res.json({ success: true, message: 'Lecture deleted successfully.' })
  } catch (err) {
    console.error('[Delete Lecture] Error:', err.message)
    return res.status(500).json({ success: false, message: 'Failed to delete lecture.' })
  }
})

// ── GET /api/admin/admins ─────────────────────────────────────────────────────
app.get('/api/admin/admins', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM admins ORDER BY created_at DESC')
    return res.json({ success: true, admins: result.rows })
  } catch (err) {
    console.error('[Admins] Error:', err.message)
    return res.status(500).json({ success: false, message: 'Failed to fetch admins.' })
  }
})

// ── POST /api/admin/admins ────────────────────────────────────────────────────
app.post('/api/admin/admins', authMiddleware, async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'All fields are required.' })
  if (password.length < 8)
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' })
  try {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS)
    const result = await pool.query(
      'INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name.trim(), email.toLowerCase(), hashed]
    )
    console.log(`[Admin] New admin created: ${email}`)
    return res.status(201).json({ success: true, admin: result.rows[0] })
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ success: false, message: 'This email is already registered.' })
    console.error('[Add Admin] Error:', err.message)
    return res.status(500).json({ success: false, message: 'Failed to create admin.' })
  }
})

// ── DELETE /api/admin/admins/:id ──────────────────────────────────────────────
app.delete('/api/admin/admins/:id', authMiddleware, async (req, res) => {
  try {
    const check = await pool.query('SELECT COUNT(*) FROM admins')
    if (Number(check.rows[0].count) <= 1)
      return res.status(400).json({ success: false, message: 'Cannot delete the last admin!' })
    await pool.query('DELETE FROM admins WHERE id = $1', [req.params.id])
    console.log(`[Admin] Admin ${req.params.id} deleted.`)
    return res.json({ success: true, message: 'Admin deleted successfully.' })
  } catch (err) {
    console.error('[Delete Admin] Error:', err.message)
    return res.status(500).json({ success: false, message: 'Failed to delete admin.' })
  }
})
// ── CTF Challenges ────────────────────────────────────────────────────────────
app.get('/api/admin/ctf', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ctf_challenges ORDER BY created_at DESC')
    return res.json({ success: true, challenges: result.rows })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch challenges.' })
  }
})

app.post('/api/admin/ctf', authMiddleware, async (req, res) => {
  const { title, description, category, difficulty, points, flag, status } = req.body
  if (!title) return res.status(400).json({ success: false, message: 'Title is required.' })
  try {
    const result = await pool.query(
      'INSERT INTO ctf_challenges (title, description, category, difficulty, points, flag, status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [title, description, category || 'General', difficulty || 'Easy', points || 100, flag, status || 'Active']
    )
    return res.status(201).json({ success: true, challenge: result.rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to add challenge.' })
  }
})

app.put('/api/admin/ctf/:id', authMiddleware, async (req, res) => {
  const { title, description, category, difficulty, points, flag, status } = req.body
  try {
    const result = await pool.query(
      'UPDATE ctf_challenges SET title=$1, description=$2, category=$3, difficulty=$4, points=$5, flag=$6, status=$7 WHERE id=$8 RETURNING *',
      [title, description, category, difficulty, points, flag, status, req.params.id]
    )
    return res.json({ success: true, challenge: result.rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update challenge.' })
  }
})

app.delete('/api/admin/ctf/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM ctf_challenges WHERE id = $1', [req.params.id])
    return res.json({ success: true, message: 'Challenge deleted.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete challenge.' })
  }
})

// ── Codex ─────────────────────────────────────────────────────────────────────
app.get('/api/admin/codex', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM codex_articles ORDER BY created_at DESC')
    return res.json({ success: true, articles: result.rows })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch articles.' })
  }
})

app.post('/api/admin/codex', authMiddleware, async (req, res) => {
  const { title, content, category, author, status } = req.body
  if (!title) return res.status(400).json({ success: false, message: 'Title is required.' })
  try {
    const result = await pool.query(
      'INSERT INTO codex_articles (title, content, category, author, status) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [title, content, category || 'General', author, status || 'Draft']
    )
    return res.status(201).json({ success: true, article: result.rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to add article.' })
  }
})

app.put('/api/admin/codex/:id', authMiddleware, async (req, res) => {
  const { title, content, category, author, status } = req.body
  try {
    const result = await pool.query(
      'UPDATE codex_articles SET title=$1, content=$2, category=$3, author=$4, status=$5 WHERE id=$6 RETURNING *',
      [title, content, category, author, status, req.params.id]
    )
    return res.json({ success: true, article: result.rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update article.' })
  }
})

app.delete('/api/admin/codex/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM codex_articles WHERE id = $1', [req.params.id])
    return res.json({ success: true, message: 'Article deleted.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete article.' })
  }
})

// ── Labs ──────────────────────────────────────────────────────────────────────
app.get('/api/admin/labs', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM labs ORDER BY created_at DESC')
    return res.json({ success: true, labs: result.rows })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch labs.' })
  }
})

app.post('/api/admin/labs', authMiddleware, async (req, res) => {
  const { title, description, category, difficulty, duration, status } = req.body
  if (!title) return res.status(400).json({ success: false, message: 'Title is required.' })
  try {
    const result = await pool.query(
      'INSERT INTO labs (title, description, category, difficulty, duration, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [title, description, category || 'General', difficulty || 'Easy', duration, status || 'Draft']
    )
    return res.status(201).json({ success: true, lab: result.rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to add lab.' })
  }
})

app.put('/api/admin/labs/:id', authMiddleware, async (req, res) => {
  const { title, description, category, difficulty, duration, status } = req.body
  try {
    const result = await pool.query(
      'UPDATE labs SET title=$1, description=$2, category=$3, difficulty=$4, duration=$5, status=$6 WHERE id=$7 RETURNING *',
      [title, description, category, difficulty, duration, status, req.params.id]
    )
    return res.json({ success: true, lab: result.rows[0] })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update lab.' })
  }
})

app.delete('/api/admin/labs/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM labs WHERE id = $1', [req.params.id])
    return res.json({ success: true, message: 'Lab deleted.' })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete lab.' })
  }
})

// ── Leaderboard ───────────────────────────────────────────────────────────────
app.get('/api/admin/leaderboard', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.id, u.name, u.email, l.points, l.solved, l.updated_at
      FROM leaderboard l
      JOIN users u ON l.user_id = u.id
      ORDER BY l.points DESC
    `)
    return res.json({ success: true, leaderboard: result.rows })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch leaderboard.' })
  }
})

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`[CyberX Admin Server] Running at http://localhost:${PORT}`)
})