import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Checkin from './pages/Checkin'
import Services from './pages/Services'
import Profile from './pages/Profile'
import RouteDetail from './pages/RouteDetail'
import ServiceDetail from './pages/ServiceDetail'

function App() {
  return (
    <BrowserRouter>
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
