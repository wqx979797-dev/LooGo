import { useParams, Link } from 'react-router-dom'
import { MapPin, Clock, Heart, MessageCircle, Bookmark, Share2, ChevronLeft, Star, Users, Camera, Upload } from 'lucide-react'
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import { routes } from '../data/mockData'

export default function RouteDetail() {
  const { id } = useParams()
  const route = routes.find(r => r.id === id)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [followed, setFollowed] = useState(false)
  const [likedComments, setLikedComments] = useState({})

  useEffect(() => {
    setTimeout(() => setMapReady(true), 100)
  }, [])

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">路线不存在</p>
      </div>
    )
  }

  const center = route.pathCoordinates[0]

  const publishRoute = () => {
    setShowPublishModal(true)
  }

  const shareRoute = async () => {
    const shareText = `${route.title}：${route.description}`
    if (navigator.share) {
      await navigator.share({
        title: route.title,
        text: shareText,
        url: window.location.href
      })
      return
    }
    await navigator.clipboard?.writeText(window.location.href)
    alert('路线链接已复制，可以分享给好友啦！')
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="relative">
        <div className="h-64">
          <img src={route.coverImage} alt={route.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <Link to="/" className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
          <ChevronLeft size={20} />
        </Link>

        <button
          onClick={shareRoute}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center"
        >
          <Share2 size={18} />
        </button>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-xl font-bold mb-2">{route.title}</h1>
          <div className="flex items-center gap-3 text-sm opacity-90">
            <span className="flex items-center gap-1"><MapPin size={14} /> {route.city}</span>
            <span className="flex items-center gap-1"><Star size={14} className="fill-current text-yellow-400" /> {route.likes}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <img src={route.creator.avatar} alt={route.creator.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <p className="font-medium">{route.creator.name}</p>
              <p className="text-xs text-gray-500">路线创建者</p>
            </div>
            <button
              onClick={() => setFollowed(!followed)}
              className={`px-4 py-1.5 text-sm rounded-full ${
                followed ? 'bg-blush text-primary' : 'bg-primary text-white'
              }`}
            >
              {followed ? '已关注' : '关注'}
            </button>
          </div>
          <p className="text-sm text-gray-600">{route.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: MapPin, label: '距离', value: `${route.distance}km`, color: 'text-primary' },
            { icon: Clock, label: '时长', value: `${route.duration}分钟`, color: 'text-secondary' },
            { icon: Users, label: '难度', value: route.difficulty, color: 'text-orange-500' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-3 text-center shadow-sm">
              <item.icon size={20} className={`mx-auto mb-1 ${item.color}`} />
              <p className="text-lg font-bold">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <h3 className="font-semibold p-4 border-b border-gray-100">路线地图</h3>
          <div className="h-48">
            {mapReady && (
              <MapContainer
                center={center}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline
                  positions={route.pathCoordinates}
                  color="#FF6B35"
                  weight={4}
                  opacity={0.8}
                />
              </MapContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">路线标签</h3>
          <div className="flex flex-wrap gap-2">
            {route.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-orange-50 text-primary text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">评论 ({route.comments})</h3>
            <button
              onClick={() => alert('当前 demo 已展示精选评论，完整评论页后续接入。')}
              className="text-primary text-sm"
            >
              查看全部
            </button>
          </div>
          <div className="space-y-3">
            {[
              { user: '宠物达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', content: '这条路线真的很棒！带着我家柯基走了一圈，非常适合狗狗撒欢~', time: '2小时前', likes: 12 },
              { user: '遛宠新手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', content: '第一次走这条路线，环境很好，强烈推荐！', time: '5小时前', likes: 8 }
            ].map((comment, idx) => (
              <div key={idx} className="flex gap-3">
                <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{comment.user}</span>
                    <span className="text-xs text-gray-400">{comment.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                  <button
                    onClick={() => setLikedComments(prev => ({ ...prev, [idx]: !prev[idx] }))}
                    className={`flex items-center gap-1 mt-2 ${
                      likedComments[idx] ? 'text-primary' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart size={14} className={likedComments[idx] ? 'fill-current' : ''} />
                    <span className="text-xs">{comment.likes + (likedComments[idx] ? 1 : 0)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1 px-4 py-2 rounded-full transition-colors ${
            liked ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Heart size={18} className={liked ? 'fill-current' : ''} />
          <span className="text-sm">{route.likes + (liked ? 1 : 0)}</span>
        </button>

        <button
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-1 px-4 py-2 rounded-full transition-colors ${
            saved ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Bookmark size={18} className={saved ? 'fill-current' : ''} />
          <span className="text-sm">收藏</span>
        </button>

        <button
          onClick={publishRoute}
          className="flex items-center gap-1 px-4 py-2 rounded-full bg-secondary text-white text-sm"
        >
          <Upload size={16} />
          <span>发布路线</span>
        </button>

        <Link to="/checkin" className="flex-1 py-3 bg-primary text-white rounded-full font-semibold text-center">
          开始遛宠
        </Link>
      </div>

      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Upload className="text-primary" />
              发布路线
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">路线名称</label>
                <input
                  type="text"
                  defaultValue={route.title}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">路线描述</label>
                <textarea
                  defaultValue={route.description}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">添加照片</label>
                <div className="flex gap-2">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <Camera size={24} className="text-gray-400" />
                  </div>
                  <div className="w-20 h-20 rounded-xl overflow-hidden">
                    <img src={route.coverImage} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">路线标签</label>
                <div className="flex flex-wrap gap-2">
                  {['公园', '环湖', '草坪', '免费', '宠物友好'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-orange-50 text-primary text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium"
              >
                取消
              </button>
              <button
                onClick={() => {
                  alert('路线发布成功！\n感谢您的分享，其他宠主可以看到这条路线了。')
                  setShowPublishModal(false)
                }}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-medium"
              >
                发布
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
