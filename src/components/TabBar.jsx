import { NavLink } from 'react-router-dom'

const tabs = [
  { path: '/', icon: '⌂', label: '首页' },
  { path: '/discover', icon: '◉', label: '发现' },
  { path: '/checkin', icon: '▣', label: '打卡' },
  { path: '/services', icon: '▤', label: '服务' },
  { path: '/profile', icon: '♙', label: '我的' }
]

export default function TabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-orange-100 z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-18 px-2 py-2">
        {tabs.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all ${
                isActive ? 'text-primary bg-blush shadow-sm scale-105' : 'text-gray-400'
              }`
            }
          >
            <span className="pixel-tab-icon">{icon}</span>
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
