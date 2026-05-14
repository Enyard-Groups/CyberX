/**
 * CyberX – OTP + Auth Server
 * Stack: Node.js + Express + Nodemailer + PostgreSQL (pg)
 *
 * Endpoints:
 *   POST /api/send-otp          – generates & emails a 6-digit OTP
 *   POST /api/verify-otp        – checks the OTP the user typed
 *   POST /api/register          – saves verified user to PostgreSQL
 *   POST /api/signin            – authenticate existing user
 *   POST /api/forgot-password   – sends password reset OTP
 *   POST /api/verify-reset-otp  – verifies reset OTP
 *   POST /api/reset-password    – updates password in PostgreSQL
 */

import express    from 'express'
import nodemailer from 'nodemailer'
import cors       from 'cors'
import dotenv     from 'dotenv'
import crypto     from 'crypto'
import pkg        from 'pg'
import bcrypt     from 'bcrypt'

dotenv.config()

const { Pool } = pkg
const app = express()
app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }))

// ── PostgreSQL Pool ──────────────────────────────────────────────────────────
const pool = new Pool({
  host:     process.env.PG_HOST     || 'localhost',
  port:     Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE || 'cyberx',
  user:     process.env.PG_USER     || 'postgres',
  password: process.env.PG_PASSWORD || '',
})

// Auto-create users table if it doesn't exist
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(100)        NOT NULL,
      email       VARCHAR(255) UNIQUE NOT NULL,
      password    VARCHAR(255)        NOT NULL,
      created_at  TIMESTAMPTZ         DEFAULT NOW()
    );
  `)
  console.log('[DB] Users table ready.')
}
initDB().catch(err => console.error('[DB] Init error:', err.message))

// ── In-memory OTP store ──────────────────────────────────────────────────────
const otpStore    = new Map()
const OTP_TTL     = 5 * 60 * 1000   // 5 minutes
const OTP_LEN     = 6
const SALT_ROUNDS = 10

function generateOTP() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(OTP_LEN, '0')
}

// ── Nodemailer transporter ───────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// ── POST /api/send-otp ───────────────────────────────────────────────────────
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ success: false, message: 'Invalid email address.' })

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
  if (existing.rows.length > 0)
    return res.status(409).json({ success: false, message: 'This email is already registered. Please sign in.' })

  const otp = generateOTP()
  otpStore.set(email.toLowerCase(), { otp, expiresAt: Date.now() + OTP_TTL })

  const mailOptions = {
    from: `"CyberX Security" <${process.env.SMTP_USER}>`,
    to:   email,
    subject: '🔐 CyberX – Your Verification Code',
    html: `
      <div style="font-family:'Courier New',monospace;background:#060910;color:#e2e8f0;padding:40px;border-radius:12px;max-width:480px;margin:auto">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
          <div style="background:linear-gradient(135deg,#00ff88,#00aaff);
                      clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
                      width:36px;height:36px;display:flex;align-items:center;justify-content:center">
            <span style="font-weight:700;font-size:12px;color:#060910">CX</span>
          </div>
          <span style="font-size:20px;font-weight:700;color:#fff">CyberX</span>
        </div>
        <p style="font-size:14px;color:#94a3b8;margin-bottom:8px">EMAIL VERIFICATION</p>
        <h2 style="font-size:22px;font-weight:700;color:#fff;margin:0 0 20px">Your one-time password</h2>
        <div style="background:#0d1117;border:1px solid rgba(0,255,136,0.25);border-radius:10px;
                    padding:24px;text-align:center;letter-spacing:14px;font-size:34px;
                    font-weight:700;color:#00ff88;margin-bottom:24px">
          ${otp}
        </div>
        <p style="font-size:13px;color:#94a3b8;line-height:1.7">
          This code expires in <strong style="color:#fff">5 minutes</strong>.<br>
          If you didn't request this, ignore this email — your account is safe.
        </p>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:28px 0">
        <p style="font-size:11px;color:#475569;text-align:center">CyberX · Hacker Training Platform · No-reply</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`[OTP] Sent to ${email}`)
    return res.json({ success: true, message: 'OTP sent successfully.' })
  } catch (err) {
    console.error('[OTP] Mail error:', err.message)
    return res.status(500).json({ success: false, message: 'Failed to send OTP. Check SMTP config.' })
  }
})

// ── POST /api/verify-otp ─────────────────────────────────────────────────────
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp)
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' })

  const record = otpStore.get(email.toLowerCase())
  if (!record)
    return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' })

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase())
    return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' })
  }

  if (record.otp !== otp.trim())
    return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' })

  otpStore.set(email.toLowerCase(), { ...record, verified: true })
  return res.json({ success: true, message: 'Email verified successfully.' })
})

// ── POST /api/register ───────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' })

  const record = otpStore.get(email.toLowerCase())
  if (!record || !record.verified)
    return res.status(403).json({ success: false, message: 'Email not verified. Please complete OTP verification first.' })

  try {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS)
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name.trim(), email.toLowerCase(), hashed]
    )
    otpStore.delete(email.toLowerCase())
    const user = result.rows[0]
    console.log(`[Register] New user: ${user.email} (id=${user.id})`)
    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.created_at }
    })
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ success: false, message: 'This email is already registered.' })
    console.error('[Register] Error:', err.message)
    return res.status(500).json({ success: false, message: 'Registration failed. Please try again.' })
  }
})

// ── POST /api/signin ─────────────────────────────────────────────────────────
app.post('/api/signin', async (req, res) => {
  const { identifier, password } = req.body

  if (!identifier || !password)
    return res.status(400).json({ success: false, message: 'Identifier and password are required.' })

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(name) = LOWER($1)',
      [identifier.trim()]
    )
    if (result.rows.length === 0)
      return res.status(401).json({ success: false, message: 'No account found with that email or name.' })

    const user = result.rows[0]
    const match = await bcrypt.compare(password, user.password)
    if (!match)
      return res.status(401).json({ success: false, message: 'Incorrect password.' })

    console.log(`[SignIn] ${user.email} signed in.`)
    return res.json({
      success: true,
      message: 'Signed in successfully.',
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.created_at }
    })
  } catch (err) {
    console.error('[SignIn] Error:', err.message)
    return res.status(500).json({ success: false, message: 'Sign-in failed. Please try again.' })
  }
})

// ── POST /api/forgot-password ─────────────────────────────────────────────────
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ success: false, message: 'Invalid email address.' })

  const existing = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email.toLowerCase()])
  if (existing.rows.length === 0)
    return res.status(404).json({ success: false, message: 'No account found with that email.' })

  const otp = generateOTP()
  otpStore.set(`reset_${email.toLowerCase()}`, { otp, expiresAt: Date.now() + OTP_TTL })

  const mailOptions = {
    from: `"CyberX Security" <${process.env.SMTP_USER}>`,
    to:   email,
    subject: '🔐 CyberX – Password Reset Code',
    html: `
      <div style="font-family:'Courier New',monospace;background:#060910;color:#e2e8f0;padding:40px;border-radius:12px;max-width:480px;margin:auto">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
          <div style="background:linear-gradient(135deg,#00ff88,#00aaff);
                      clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
                      width:36px;height:36px;display:flex;align-items:center;justify-content:center">
            <span style="font-weight:700;font-size:12px;color:#060910">CX</span>
          </div>
          <span style="font-size:20px;font-weight:700;color:#fff">CyberX</span>
        </div>
        <p style="font-size:14px;color:#94a3b8;margin-bottom:8px">PASSWORD RESET</p>
        <h2 style="font-size:22px;font-weight:700;color:#fff;margin:0 0 20px">Your reset code</h2>
        <div style="background:#0d1117;border:1px solid rgba(0,255,136,0.25);border-radius:10px;
                    padding:24px;text-align:center;letter-spacing:14px;font-size:34px;
                    font-weight:700;color:#00ff88;margin-bottom:24px">
          ${otp}
        </div>
        <p style="font-size:13px;color:#94a3b8;line-height:1.7">
          This code expires in <strong style="color:#fff">5 minutes</strong>.<br>
          If you didn't request this, ignore this email — your account is safe.
        </p>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:28px 0">
        <p style="font-size:11px;color:#475569;text-align:center">CyberX · Hacker Training Platform · No-reply</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`[Reset] OTP sent to ${email}`)
    return res.json({ success: true, message: 'Reset code sent to your email.' })
  } catch (err) {
    console.error('[Reset] Mail error:', err.message)
    return res.status(500).json({ success: false, message: 'Failed to send reset code.' })
  }
})

// ── POST /api/verify-reset-otp ───────────────────────────────────────────────
app.post('/api/verify-reset-otp', (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp)
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' })

  const record = otpStore.get(`reset_${email.toLowerCase()}`)
  if (!record)
    return res.status(400).json({ success: false, message: 'No reset code found. Please request a new one.' })

  if (Date.now() > record.expiresAt) {
    otpStore.delete(`reset_${email.toLowerCase()}`)
    return res.status(400).json({ success: false, message: 'Code has expired. Please request a new one.' })
  }

  if (record.otp !== otp.trim())
    return res.status(400).json({ success: false, message: 'Incorrect code. Please try again.' })

  otpStore.set(`reset_${email.toLowerCase()}`, { ...record, verified: true })
  return res.json({ success: true, message: 'Code verified.' })
})

// ── POST /api/reset-password ─────────────────────────────────────────────────
app.post('/api/reset-password', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and new password are required.' })

  if (password.length < 8)
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' })

  const record = otpStore.get(`reset_${email.toLowerCase()}`)
  if (!record || !record.verified)
    return res.status(403).json({ success: false, message: 'Email not verified. Please complete OTP verification first.' })

  try {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS)
    await pool.query('UPDATE users SET password = $1 WHERE LOWER(email) = LOWER($2)', [hashed, email.toLowerCase()])
    otpStore.delete(`reset_${email.toLowerCase()}`)
    console.log(`[Reset] Password updated for ${email}`)
    return res.json({ success: true, message: 'Password reset successfully.' })
  } catch (err) {
    console.error('[Reset] Error:', err.message)
    return res.status(500).json({ success: false, message: 'Password reset failed. Please try again.' })
  }
})

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`[CyberX OTP Server] Running at http://localhost:${PORT}`)
})
