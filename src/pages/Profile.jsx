import { useState } from 'react'
import { MapPin, Calendar, Clock, Heart, MessageCircle, Bookmark, Settings, ChevronRight, Award, PawPrint, TrendingUp, Star } from 'lucide-react'
import { currentUser, achievements, posts } from '../data/mockData'

export default function Profile() {
  const [activeTab, setActiveTab] = useState('posts')

  const tabs = [
    { id: 'posts', label: '动态', icon: MessageCircle },
    { id: 'routes', label: '路线', icon: MapPin },
    { id: 'saved', label: '收藏', icon: Bookmark }
  ]

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-r from-primary to-orange-400 px-4 pt-8 pb-20 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">我的</h1>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Settings size={22} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white p-1">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{currentUser.name}</h2>
            <p className="text-sm opacity-90 flex items-center gap-1 mt-1">
              <MapPin size={14} />
              {currentUser.location.city} · {currentUser.location.district}
            </p>
            <p className="text-sm opacity-80 mt-1">{currentUser.bio}</p>
          </div>
        </div>
      </header>

      <div className="px-4 -mt-12">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="grid grid-cols-4 divide-x divide-gray-100 text-center">
            {[
              { label: '遛宠', value: currentUser.stats.totalWalks, suffix: '次' },
              { label: '距离', value: currentUser.stats.totalDistance, suffix: 'km' },
              { label: '打卡', value: currentUser.stats.checkinDays, suffix: '天' },
              { label: '关注', value: 28, suffix: '' }
            ].map((stat, idx) => (
              <div key={idx} className="py-2">
                <p className="text-lg font-bold text-gray-800">{stat.value}{stat.suffix}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="bg-white rounded-2xl p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Award size={18} className="text-primary" />
            我的宠物
          </h3>
          <div className="flex gap-3 overflow-x-auto">
            {currentUser.pets.map((pet) => (
              <div key={pet.id} className="flex-shrink-0 text-center">
                <div className="w-16 h-16 rounded-full bg-orange-100 p-1 mx-auto mb-2">
                  <img src={pet.avatar} alt={pet.name} className="w-full h-full rounded-full" />
                </div>
                <p className="text-sm font-medium">{pet.name}</p>
                <p className="text-xs text-gray-500">{pet.breed}</p>
              </div>
            ))}
            <button className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors">
              <span className="text-xl">+</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Star size={18} className="text-yellow-500" />
            遛宠成就
          </h3>
          <div className="space-y-3">
            {achievements.slice(0, 4).map((ach) => (
              <div key={ach.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">
                  {ach.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{ach.name}</p>
                  <p className="text-xs text-gray-500">{ach.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary">{ach.progress}/{ach.target}</p>
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(ach.progress / ach.target) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4">
            {activeTab === 'posts' && posts.slice(0, 3).map((post) => (
              <div key={post.id} className="flex gap-3">
                <img src={post.user.avatar} alt="" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-2">{post.createdAt}</p>
                  <p className="text-sm line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-gray-400">
                    <span className="flex items-center gap-1 text-xs">
                      <Heart size={14} /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <MessageCircle size={14} /> {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'routes' && (
              <div className="text-center py-8 text-gray-400">
                <PawPrint size={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">还没有发布过路线</p>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="text-center py-8 text-gray-400">
                <Bookmark size={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">还没有收藏的路线</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {[
          { icon: '📋', label: '我的订单', path: '/orders' },
          { icon: '💳', label: '钱包', path: '/wallet' },
          { icon: '🔔', label: '消息通知', path: '/notifications' },
          { icon: '❓', label: '帮助与反馈', path: '/help' }
        ].map((item, idx) => (
          <button key={idx} className="w-full bg-white rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  )
}
