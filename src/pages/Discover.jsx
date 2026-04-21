import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  PawPrint,
  Search,
  Send,
  Shield,
  Sparkles,
  Users
} from 'lucide-react'
import { routes, posts } from '../data/mockData'

const communityTabs = [
  {
    id: 'share',
    label: '分享',
    title: '路线打卡',
    desc: '晒路线、晒萌宠、记录遛宠瞬间',
    icon: Sparkles,
    tone: 'from-blush to-white'
  },
  {
    id: 'city',
    label: '同城',
    title: '附近动态',
    desc: '看看同区宠主正在去哪儿遛',
    icon: MapPin,
    tone: 'from-mint to-white'
  },
  {
    id: 'buddy',
    label: '搭子',
    title: '遛宠搭子',
    desc: '找同时间、同路线、同体型宠友',
    icon: Users,
    tone: 'from-orange-50 to-white'
  }
]

const careNeeds = [
  {
    id: 'feed',
    title: '代喂上门',
    desc: '出差、加班、临时不在家，认证照护员上门喂食换水。',
    price: '¥59 起',
    eta: '最快 45 分钟',
    icon: '喂',
    tags: ['换水', '喂食', '拍照反馈']
  },
  {
    id: 'walk',
    title: '临时代遛',
    desc: '下班太晚或雨后不方便，附近认证遛宠师代遛并回传轨迹。',
    price: '¥39 / 30分钟',
    eta: '最快 30 分钟',
    icon: '遛',
    tags: ['轨迹记录', '安全牵引', '到家反馈']
  }
]

const cityMeetups = [
  {
    title: '今晚 19:30 朝阳公园小型犬慢走局',
    desc: '限 15kg 以下，路线 2.1km，节奏慢，适合新手宠主。',
    meta: ['距离 860m', '已有 6 人', '疫苗互认']
  },
  {
    title: '奥森公园周末放电搭子',
    desc: '适合边牧、柴犬、柯基等精力旺盛犬只，建议带长牵引。',
    meta: ['周六 08:30', '已有 11 人', '草地路线']
  }
]

export default function Discover() {
  const [activeTab, setActiveTab] = useState('share')
  const [likedPosts, setLikedPosts] = useState({})
  const [searchQuery, setSearchQuery] = useState('')

  const activeTabMeta = communityTabs.find(tab => tab.id === activeTab)

  const visiblePosts = useMemo(() => {
    if (!searchQuery.trim()) return posts
    return posts.filter(post => post.content.includes(searchQuery.trim()) || post.user.name.includes(searchQuery.trim()))
  }, [searchQuery])

  const toggleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const publishPost = () => {
    alert('发布入口已响应：正式版会打开图文/路线打卡编辑器。')
  }

  return (
    <div className="min-h-screen pb-4">
      <header className="sticky top-0 z-20 bg-light/90 backdrop-blur-xl px-4 pt-4 pb-3 border-b border-orange-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-primary">LooGo 社区</p>
            <h1 className="text-2xl font-bold text-cocoa">发现宠友和路线</h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blush to-mint flex items-center justify-center floaty">
            <PawPrint size={24} className="text-primary" />
          </div>
        </div>

        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/70" />
          <input
            type="text"
            placeholder="搜索路线、宠主、同城活动..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/85 rounded-2xl text-sm shadow-sm border border-orange-100 focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {communityTabs.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-2xl p-3 text-left transition-all ${
                  active
                    ? 'bg-white shadow-md scale-[1.02] border border-primary/20'
                    : 'bg-white/60 border border-transparent'
                }`}
              >
                <Icon size={18} className={active ? 'text-primary' : 'text-gray-400'} />
                <p className={`mt-2 text-sm font-bold ${active ? 'text-cocoa' : 'text-gray-500'}`}>{tab.label}</p>
              </button>
            )
          })}
        </div>
      </header>

      <main className="p-4 space-y-5">
        <section className={`soft-card rounded-[28px] bg-gradient-to-br ${activeTabMeta.tone} p-5 border border-white shadow-sm`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-primary mb-1">当前模块</p>
              <h2 className="text-xl font-bold text-cocoa">{activeTabMeta.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{activeTabMeta.desc}</p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-white/75 text-xs font-semibold text-primary">
              宠友友好
            </span>
          </div>
        </section>

        {activeTab === 'share' && (
          <section className="space-y-4">
            <div className="bg-white/85 rounded-[26px] p-4 shadow-sm border border-orange-100 soft-card">
              <div className="flex items-center gap-3">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming" alt="me" className="w-11 h-11 rounded-2xl bg-blush" />
                <input
                  type="text"
                  placeholder="分享今天的遛宠路线和可爱瞬间..."
                  className="flex-1 bg-cream rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
                <button
                  onClick={publishPost}
                  className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-white shadow-sm active:scale-95 transition-transform"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>

            {visiblePosts.map((post) => (
              <article key={post.id} className="bg-white/90 rounded-[28px] shadow-sm border border-orange-100 overflow-hidden soft-card">
                <div className="p-4 flex items-center gap-3">
                  <img src={post.user.avatar} alt={post.user.name} className="w-11 h-11 rounded-2xl bg-blush" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-cocoa">{post.user.name}</p>
                    <p className="text-xs text-gray-400">{post.createdAt} · 路线打卡</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-mint text-secondary text-xs font-semibold">
                    已分享
                  </span>
                </div>
                <p className="px-4 pb-3 text-sm text-gray-600 leading-6">{post.content}</p>
                {post.images && post.images.length > 0 && (
                  <img src={post.images[0]} alt="" className="w-full h-56 object-cover" />
                )}
                <div className="p-4 flex items-center justify-between text-gray-400">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 ${likedPosts[post.id] ? 'text-primary' : ''}`}
                  >
                    <Heart size={18} className={likedPosts[post.id] ? 'fill-current' : ''} />
                    <span className="text-sm">{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
                  </button>
                  <button
                    onClick={() => alert('评论面板已响应：正式版会打开评论详情。')}
                    className="flex items-center gap-1.5"
                  >
                    <MessageCircle size={18} />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <span className="flex items-center gap-1.5 text-sm">
                    <MapPin size={18} />
                    附近路线
                  </span>
                </div>
              </article>
            ))}
          </section>
        )}

        {activeTab === 'city' && (
          <section className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {routes.slice(0, 4).map((route) => (
                <Link to={`/route/${route.id}`} key={route.id} className="bg-white/90 rounded-[24px] overflow-hidden border border-orange-100 shadow-sm soft-card">
                  <img src={route.coverImage} alt={route.title} className="w-full h-28 object-cover" />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-cocoa line-clamp-1">{route.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{route.distance}km · {route.duration}分钟</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'buddy' && (
          <section className="space-y-4">
            {cityMeetups.map((meetup) => (
              <article key={meetup.title} className="bg-white/90 rounded-[28px] p-4 border border-orange-100 shadow-sm soft-card">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-mint flex items-center justify-center">
                    <Users size={22} className="text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-cocoa">{meetup.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-6">{meetup.desc}</p>
                    <div className="flex gap-2 flex-wrap mt-3">
                      {meetup.meta.map(item => (
                        <span key={item} className="px-2.5 py-1 rounded-full bg-cream text-xs text-gray-500">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-cocoa">照料需求</h2>
              <p className="text-xs text-gray-500">代喂、代遛放在社区场景里自然转化</p>
            </div>
            <Link to="/services" className="text-sm text-primary font-semibold">更多服务</Link>
          </div>

          <div className="grid gap-3">
            {careNeeds.map((care) => (
              <Link
                to="/services"
                key={care.id}
                className="bg-white/90 rounded-[28px] p-4 border border-orange-100 shadow-sm flex gap-4 soft-card"
              >
                <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blush to-mint flex items-center justify-center text-xl font-bold text-primary">
                  {care.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-cocoa">{care.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 leading-6">{care.desc}</p>
                    </div>
                    <span className="text-sm font-bold text-primary whitespace-nowrap">{care.price}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-mint text-xs text-secondary font-semibold">
                      <Clock size={12} />
                      {care.eta}
                    </span>
                    {care.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-full bg-cream text-xs text-gray-500">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-white to-mint rounded-[28px] p-4 border border-white shadow-sm soft-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center">
              <Shield size={22} className="text-secondary" />
            </div>
            <div>
              <h2 className="font-bold text-cocoa">社区安全机制</h2>
              <p className="text-xs text-gray-500">宠物档案、疫苗互认、服务实名认证</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { icon: PawPrint, label: '宠物档案' },
              { icon: Calendar, label: '同行预约' },
              { icon: Shield, label: '服务保障' }
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-2xl bg-white/75 p-3">
                <Icon size={18} className="mx-auto text-primary mb-1" />
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
