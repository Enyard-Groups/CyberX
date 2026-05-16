import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/chatbot.css'

// Page-specific messages
const PAGE_MESSAGES = {
  '/':            '👋 Welcome to CyberX! Need help getting started?',
  '/home':        '👋 Welcome to CyberX! Need help getting started?',
  '/lectures':    '📚 You are in Lectures! Start learning from our expert instructors.',
  '/ctf':         '⚑ You are in CTF Arena! Try solving challenges to earn points.',
  '/codex':       '# You are in Codex! Browse our hacking knowledge base.',
  '/labs':        '◫ You are in Labs! Practice your skills in a safe environment.',
  '/leaderboard': '◈ You are in Leaderboard! See how you rank against others.',
  '/pricing':     '💎 You are in Pricing! Find the plan that suits you best.',
  '/enroll':      '🎓 You are in Enroll! Join CyberX and start your journey.',
  '/signin':      '🔐 Signing in? I can help if you face any issues!',
  '/signup':      '🚀 Creating an account? I am here if you need help!',
}

export default function ChatWidget() {
  const location = useLocation()
  const [popup, setPopup]   = useState(null)
  const [visible, setVisible] = useState(false)

  // Show popup on page change
  useEffect(() => {
    const msg = PAGE_MESSAGES[location.pathname] || '💬 Need help? Ask me anything!'

    // Small delay so it feels natural
    const timer = setTimeout(() => {
      setPopup(msg)
      setVisible(true)

      // Auto hide after 5 seconds
      const hideTimer = setTimeout(() => {
        setVisible(false)
      }, 4000)

      return () => clearTimeout(hideTimer)
    }, 900)

    return () => clearTimeout(timer)
  }, [location.pathname])

  useEffect(() => {
    window.ECHO_CHAT_URL = 'http://127.0.0.1:5000/chat'

    const script = document.createElement('script')
    script.src = '/chatbot.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <>
      {/* Popup message */}
      {popup && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            background: '#1f2937',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '12px',
            padding: '10px 14px',
            maxWidth: '260px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: '#e5e7eb',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            zIndex: 99998,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            pointerEvents: visible ? 'auto' : 'none',
          }}
        >
          <span style={{ flex: 1, lineHeight: '1.5' }}>{popup}</span>
          <button
            onClick={() => setVisible(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '0',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Chatbot Widget */}
      <div id="echo-chatbot-widget">
        {/* FAB Button */}
        <button className="echo-fab" id="echoFab" title="Chat with Echo">
          <svg className="echo-fab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span className="echo-fab-pulse"></span>
        </button>

        {/* Chat Window — starts closed */}
        <div className="echo-window" id="echoWindow">
          <div className="echo-header">
            <div className="echo-header-left">
              <div className="echo-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                </svg>
              </div>
              <div>
                <div className="echo-name">Echo</div>
                <div className="echo-status">
                  <span className="echo-dot"></span>Online
                </div>
              </div>
            </div>
            <button className="echo-close-btn" id="echoClose" title="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div className="echo-messages" id="echoMessages">
            <div className="echo-msg echo-bot">
              <div className="echo-msg-bubble">
                Hi! I'm <strong>Echo</strong>, your AI assistant. How can I help you today?
              </div>
            </div>
          </div>

          <form className="echo-input-area" id="echoForm">
            <input
              type="text"
              className="echo-input"
              id="echoInput"
              placeholder="Type a message..."
              maxLength={500}
              autoComplete="off"
              required
            />
            <button type="submit" className="echo-send-btn" title="Send">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  )
}