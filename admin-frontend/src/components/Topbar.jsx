export default function Topbar({ title }) {
  return (
    <div className="topbar">
      <div className="topbar__title">{title}</div>
      <div className="topbar__badge">
        <span className="dot-live"></span>
        <span>Admin Panel Live</span>
      </div>
    </div>
  )
} 
