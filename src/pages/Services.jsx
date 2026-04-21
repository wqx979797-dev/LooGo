import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Clock, MapPin, Shield, Heart, ArrowRight } from 'lucide-react'
import { services } from '../data/mockData'

const serviceTypes = [
  { id: 'all', name: '全部', icon: '✨' },
  { id: 'walk', name: '代遛', icon: '🦮' },
  { id: 'bath', name: '洗澡美容', icon: '🛁' },
  { id: 'feed', name: '上门喂养', icon: '🍖' },
  { id: 'boarding', name: '寄养托管', icon: '🏠' },
  { id: 'medical', name: '医疗预约', icon: '🏥' }
]

export default function Services() {
  const [activeType, setActiveType] = useState('all')

  const filteredServices = activeType === 'all'
    ? services
    : services.filter(s => s.type === activeType)

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-br from-mint via-white to-blush px-4 py-6 text-cocoa border-b border-orange-100">
        <h1 className="text-xl font-bold mb-1">宠物服务</h1>
        <p className="text-sm text-gray-500">专业服务，放心托付</p>
      </header>

      <div className="p-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {serviceTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeType === type.id
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-white text-gray-600 shadow-sm'
              }`}
            >
              <span className="mr-1">{type.icon}</span>
              {type.name}
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-r from-mint to-white rounded-2xl p-4 flex items-center gap-4 border border-white shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <Shield size={24} className="text-secondary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">平台保障</h3>
            <p className="text-xs text-gray-500">所有服务商均经过实名认证</p>
          </div>
        </div>

        <div className="space-y-4">
          {filteredServices.map((service) => (
            <Link to={`/service/${service.id}`} key={service.id} className="block bg-white/90 rounded-[26px] shadow-sm overflow-hidden border border-orange-100 soft-card">
              <div className="relative h-36">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 rounded-full text-xs font-medium flex items-center gap-1">
                  <Shield size={12} className="text-green-500" />
                  已认证
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{service.description}</p>

                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} className="fill-current" />
                    <span className="font-medium">{service.provider.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock size={14} />
                    <span>{service.type === 'boarding' ? '按天计费' : `${service.duration}分钟`}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <img src={service.provider.avatar} alt={service.provider.name} className="w-8 h-8 rounded-full bg-gray-100" />
                    <span className="text-sm text-gray-600">{service.provider.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      {service.price === 0 ? '免费' : `¥${service.price}`}
                    </span>
                    <ArrowRight size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
