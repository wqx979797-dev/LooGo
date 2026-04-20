import { useState } from 'react'
import { MapPin, Heart, MessageCircle, Send, Search, Users, Sparkles } from 'lucide-react'
import { routes, posts } from '../data/mockData'

export default function Discover() {
  const [activeTab, setActiveTab] = useState('routes')
  const [likedPosts, setLikedPosts] = useState({})
  const [searchQuery, setSearchQuery] = useState('')

  const toggleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-xl font-bold">发现</h1>
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
            <MapPin size={12} className="inline mr-1" />
            北京市
          </span>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索路线、宠主、服务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2 mt-3">
          {['routes', 'posts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab === 'routes' ? '🚶 路线' : '📱 动态'}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'routes' ? (
        <div className="p-4 space-y-4">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} />
              <h3 className="font-semibold">本周热门路线</h3>
            </div>
            <p className="text-sm opacity-90">奥森公园宠物友好路线已有 512 次遛宠记录</p>
          </div>

          <div className="space-y-4">
            {routes.map((route) => (
              <div key={route.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="relative h-48">
                  <img src={route.coverImage} alt={route.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-semibold text-lg">{route.title}</h3>
                    <div className="flex items-center gap-2 text-sm opacity-90">
                      <MapPin size={14} />
                      <span>{route.city}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{route.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">📏 {route.distance}公里</span>
                    <span className="text-gray-500">⏱️ {route.duration}分钟</span>
                    <span className="px-2 py-0.5 bg-orange-100 text-primary rounded-full text-xs">{route.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <img src={route.creator.avatar} alt={route.creator.name} className="w-8 h-8 rounded-full" />
                      <span className="text-sm text-gray-600">{route.creator.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                      <span className="flex items-center gap-1">
                        <Heart size={16} /> {route.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={16} /> {route.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming" alt="me" className="w-10 h-10 rounded-full" />
              <input
                type="text"
                placeholder="分享你家萌宠的日常..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <Send size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{post.user.name}</p>
                    <p className="text-xs text-gray-500">{post.createdAt}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">{post.content}</p>
                {post.images && post.images.length > 0 && (
                  <div className="rounded-xl overflow-hidden mb-3">
                    <img src={post.images[0]} alt="" className="w-full h-48 object-cover" />
                  </div>
                )}
                <div className="flex items-center justify-between text-gray-400 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1 ${likedPosts[post.id] ? 'text-red-500' : ''}`}
                  >
                    <Heart size={18} className={likedPosts[post.id] ? 'fill-current' : ''} />
                    <span className="text-sm">{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
                  </button>
                  <button className="flex items-center gap-1">
                    <MessageCircle size={18} />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1">
                    <Users size={18} />
                    <span className="text-sm">分享</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
