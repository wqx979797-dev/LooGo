import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Checkin from './pages/Checkin'
import Services from './pages/Services'
import Profile from './pages/Profile'
import RouteDetail from './pages/RouteDetail'
import ServiceDetail from './pages/ServiceDetail'
import NewExperience from './pages/NewExperience'

function App() {
  const basename = import.meta.env.PROD ? '/LooGo' : '/'
  const [newExperience, setNewExperience] = useState(() => localStorage.getItem('loogo-new-experience') === '1')

  useEffect(() => {
    const enable = () => {
      localStorage.setItem('loogo-new-experience', '1')
      setNewExperience(true)
    }
    const disable = () => {
      localStorage.removeItem('loogo-new-experience')
      setNewExperience(false)
    }
    window.addEventListener('loogo:enable-new', enable)
    window.addEventListener('loogo:disable-new', disable)
    return () => {
      window.removeEventListener('loogo:enable-new', enable)
      window.removeEventListener('loogo:disable-new', disable)
    }
  }, [])

  if (newExperience) {
    return <NewExperience onBack={() => window.dispatchEvent(new Event('loogo:disable-new'))} />
  }

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="discover" element={<Discover />} />
          <Route path="checkin" element={<Checkin />} />
          <Route path="services" element={<Services />} />
          <Route path="profile" element={<Profile />} />
          <Route path="route/:id" element={<RouteDetail />} />
          <Route path="service/:id" element={<ServiceDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
