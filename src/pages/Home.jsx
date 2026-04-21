import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Clock, Heart, MessageCircle, Bookmark, PawPrint, TrendingUp, Users, Award, Plus, Flame, Play } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { routes, currentUser, checkins } from '../data/mockData'

const walkerIcon = (emoji, label) => L.divIcon({
  className: 'pixel-walker-marker',
  html: `<span class="pixel-walker-core">${emoji}<b>${label}</b></span>`,
  iconSize: [62, 38],
  iconAnchor: [31, 19],
  popupAnchor: [0, -18]
})

const nearbyWalkers = [
  {
    id: 'w1',
    name: 'Momo 和布丁',
    pet: '比熊',
    distance: '320m',
    route: '朝阳公园南门慢走线',
    position: [40.0129, 116.4574],
    emoji: '🐶'
  },
  {
    id: 'w2',
    name: 'Seven 训练局',
    pet: '柴犬',
    distance: '680m',
    route: '湖边放电路线',
    position: [40.0142, 116.4592],
    emoji: '🦊'
  },
  {
    id: 'w3',
    name: 'Luna 夜遛',
    pet: '边牧',
    distance: '910m',
    route: '草坪环线',
    position: [40.0114, 116.4558],
    emoji: '🐾'
  }
]

export default function Home() {
  const [likedRoutes, setLikedRoutes] = useState({})
  const [savedRoutes, setSavedRoutes] = useState({})
  const [joinedWalkerId, setJoinedWalkerId] = useState(null)
  const [homeLocationMessage, setHomeLocationMessage] = useState('打开位置后，可加入附近正在遛宠的人。')
  const [newVersionReady, setNewVersionReady] = useState(false)
  const navigate = useNavigate()

  const toggleLike = (routeId) => {
    setLikedRoutes(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }))
  }

  const toggleSave = (routeId) => {
    setSavedRoutes(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }))
  }

  const startWalking = () => {
    navigate('/checkin')
  }

  const joinWalker = (walker) => {
    const completeJoin = (message) => {
      setJoinedWalkerId(walker.id)
      setHomeLocationMessage(message)
    }

    if (!navigator.geolocation) {
      completeJoin(`已加入 ${walker.name}，当前浏览器不支持定位，暂用社区位置。`)
      alert(`已加入 ${walker.name}，但当前浏览器不支持定位。`)
      return
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        completeJoin(`已加入 ${walker.name}，你的实时位置已开放给本次同行。`)
        alert(`已加入 ${walker.name}，你的实时位置已开放给本次同行。`)
      },
      () => {
        completeJoin(`已加入 ${walker.name}，但你没有开放定位，仅以匿名状态加入。`)
        alert(`已加入 ${walker.name}，你可以稍后在浏览器权限里开放定位。`)
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    )
  }

  const totalDistance = checkins.reduce((sum, c) => sum + c.distance, 0)
  const totalDuration = checkins.reduce((sum, c) => sum + c.duration, 0)
  const currentStreak = 5

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-2xl font-bold text-cocoa">LooGo 遛遛</h1>
          <p className="text-sm text-gray-500">宠物友好的遛宠路线社区</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setNewVersionReady(true)
              window.dispatchEvent(new Event('loogo:enable-new'))
            }}
            className={`px-3 py-2 rounded-2xl text-xs font-bold border transition-all ${
              newVersionReady
                ? 'bg-mint text-secondary border-secondary/30'
                : 'bg-white/80 text-primary border-orange-100 shadow-sm active:scale-95'
            }`}
          >
            {newVersionReady ? '新版已开启' : '切换新版'}
          </button>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blush to-mint p-0.5 shadow-sm">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full bg-white" />
          </div>
        </div>
      </header>

      <section className="bg-white/90 rounded-[28px] overflow-hidden shadow-sm border border-orange-100 soft-card">
        <div className="p-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-primary">附近正在遛宠</p>
            <h2 className="text-lg font-bold text-cocoa mt-1">看看谁在附近，可以一起遛</h2>
            <p className="text-xs text-gray-500 mt-1">{homeLocationMessage}</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-mint text-secondary text-xs font-semibold">
            Live
          </span>
        </div>

        <div className="h-56 relative">
          <MapContainer
            center={[40.0123, 116.4567]}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
            attributionControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle
              center={[40.0123, 116.4567]}
              radius={650}
              pathOptions={{ color: '#F59F85', fillColor: '#FFE8DF', fillOpacity: 0.22, weight: 2 }}
            />
            {nearbyWalkers.map((walker) => (
              <Marker key={walker.id} position={walker.position} icon={walkerIcon(walker.emoji, walker.pet)}>
                <Popup>
                  <div className="space-y-1">
                    <strong>{walker.name}</strong>
                    <p>{walker.route}</p>
                    <p>{walker.distance}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="p-4 space-y-3">
          {nearbyWalkers.map((walker) => (
            <div key={walker.id} className="flex items-center gap-3 rounded-2xl bg-cream p-3">
              <div className="w-11 h-11 pixel-button bg-blush flex items-center justify-center text-xl">
                {walker.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-cocoa truncate">{walker.name}</p>
                <p className="text-xs text-gray-500 truncate">{walker.distance} · {walker.route}</p>
              </div>
              <button
                onClick={() => joinWalker(walker)}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${
                  joinedWalkerId === walker.id
                    ? 'bg-mint text-secondary'
                    : 'bg-primary text-white active:scale-95'
                }`}
              >
                {joinedWalkerId === walker.id ? '已加入' : 'Join'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 打卡功能 - 最前面最中心 */}
      <div className="bg-gradient-to-br from-blush via-white to-mint rounded-[28px] p-6 text-cocoa relative overflow-hidden shadow-sm border border-white soft-card">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-secondary/10 rounded-full -ml-8 -mb-8" />
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Flame size={24} className="text-primary animate-pulse" />
            开始遛宠
          </h2>
          <p className="text-sm text-gray-500 mb-4">记录你的遛宠路线，分享精彩瞬间</p>
          <button
            onClick={startWalking}
            className="w-full py-4 bg-primary text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            <Play size={20} />
            立即开始
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: PawPrint, label: '遛宠', value: `${currentUser.stats.totalWalks}次`, color: 'bg-blush text-primary' },
          { icon: TrendingUp, label: '距离', value: `${currentUser.stats.totalDistance}km`, color: 'bg-mint text-secondary' },
          { icon: Award, label: '连续', value: `${currentUser.stats.checkinDays}天`, color: 'bg-cream text-honey' }
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.color} rounded-2xl p-3 text-center shadow-sm`}>
            <stat.icon size={20} className="mx-auto mb-1" />
            <p className="text-lg font-bold">{stat.value}</p>
            <p className="text-xs opacity-70">{stat.label}</p>
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">热门路线</h2>
          <Link to="/discover" className="text-sm text-primary">查看更多</Link>
        </div>
        <div className="space-y-4">
          {routes.slice(0, 3).map((route) => (
            <Link to={`/route/${route.id}`} key={route.id} className="block bg-white/90 rounded-[26px] shadow-sm overflow-hidden border border-orange-100 soft-card">
              <div className="relative h-40">
                <img src={route.coverImage} alt={route.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={(e) => { e.preventDefault(); toggleSave(route.id) }}
                    className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
                  >
                    <Bookmark size={16} className={savedRoutes[route.id] ? 'fill-primary text-primary' : 'text-gray-600'} />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 flex gap-2">
                  {route.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-white/90 rounded-full text-xs font-medium text-gray-700">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold mb-2 line-clamp-1">{route.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {route.distance}km</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {route.duration}分钟</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    route.difficulty === '简单' ? 'bg-green-100 text-green-600' :
                    route.difficulty === '中等' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-500'
                  }`}>{route.difficulty}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <img src={route.creator.avatar} alt={route.creator.name} className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-gray-600">{route.creator.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400">
                    <button onClick={(e) => { e.preventDefault(); toggleLike(route.id) }} className="flex items-center gap-1">
                      <Heart size={16} className={likedRoutes[route.id] ? 'fill-red-500 text-red-500' : ''} />
                      <span className="text-xs">{route.likes + (likedRoutes[route.id] ? 1 : 0)}</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={16} />
                      <span className="text-xs">{route.comments}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">遛宠成就</h2>
          <Link to="/profile" className="text-sm text-primary">全部成就</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[
            { icon: '🎯', name: '初次打卡', desc: '完成第一次遛宠' },
            { icon: '🔥', name: '连续7天', desc: '连续遛宠7天' },
            { icon: '🛣️', name: '千里之行', desc: '累计100公里' },
            { icon: '💬', name: '社交达人', desc: '评论超过50次' }
          ].map((ach, idx) => (
            <div key={idx} className="flex-shrink-0 w-28 bg-white rounded-xl p-3 text-center shadow-sm">
              <span className="text-2xl">{ach.icon}</span>
              <p className="text-sm font-medium mt-1">{ach.name}</p>
              <p className="text-xs text-gray-500">{ach.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
