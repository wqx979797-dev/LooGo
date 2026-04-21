import { Outlet } from 'react-router-dom'
import TabBar from './TabBar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-light pb-20 text-dark">
      <main className="max-w-lg mx-auto">
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}
