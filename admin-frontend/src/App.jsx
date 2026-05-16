import { Routes, Route, Navigate } from 'react-router-dom'
import Login     from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users     from './pages/Users'
import Lectures  from './pages/Lectures'
import Admins from './pages/Admins'
import CTF         from './pages/CTF'
import Codex       from './pages/Codex'
import Labs        from './pages/Labs'
import Leaderboard from './pages/Leaderboard'

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('cyberx_admin_token')
  return token ? children : <Navigate to="/admin/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/users"     element={<ProtectedRoute><Users /></ProtectedRoute>} />
      <Route path="/admin/lectures"  element={<ProtectedRoute><Lectures /></ProtectedRoute>} />
      <Route path="/admin/admins" element={<ProtectedRoute><Admins /></ProtectedRoute>} />
      <Route path="/admin/ctf"         element={<ProtectedRoute><CTF /></ProtectedRoute>} />
      <Route path="/admin/codex"       element={<ProtectedRoute><Codex /></ProtectedRoute>} />
      <Route path="/admin/labs"        element={<ProtectedRoute><Labs /></ProtectedRoute>} />
      <Route path="/admin/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="*"                element={<Navigate to="/admin/login" />} />
    </Routes>
  )
} 
