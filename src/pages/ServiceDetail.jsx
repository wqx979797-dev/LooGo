import { useParams, Link } from 'react-router-dom'
import { Star, Clock, MapPin, Shield, ChevronLeft, Calendar, MessageCircle, Check, Award } from 'lucide-react'
import { useState } from 'react'
import { services } from '../data/mockData'

export default function ServiceDetail() {
  const { id } = useParams()
  const service = services.find(s => s.id === id)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [showBooking, setShowBooking] = useState(false)

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">服务不存在</p>
      </div>
    )
  }

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return {
      day: date.getDate(),
      weekDay: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
      full: date.toISOString().split('T')[0]
    }
  })

  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00']

  const reviews = [
    { user: '宠物主人小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=review1', rating: 5, content: '服务非常专业！狗狗洗完澡香香的，毛发也很顺滑。强烈推荐！', date: '2024-01-18' },
    { user: '柯基爱好者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=review2', rating: 5, content: '已经是第三次来了，服务一如既往的好。工作人员都很耐心。', date: '2024-01-15' },
    { user: '养宠新手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=review3', rating: 4, content: '整体不错，就是预约的时候等了稍微久一点。不过服务确实很好。', date: '2024-01-12' }
  ]

  return (
    <div className="min-h-screen pb-24">
      <div className="relative">
        <div className="h-72">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <Link to="/services" className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
          <ChevronLeft size={20} />
        </Link>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 text-sm mb-1">
            <Shield size={14} className="text-green-400" />
            <span>平台认证服务商</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h1 className="text-xl font-bold mb-2">{service.title}</h1>
          <p className="text-sm text-gray-600 mb-3">{service.description}</p>

          <div className="flex items-center gap-4 text-sm mb-3">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={16} className="fill-current" />
              <span className="font-semibold">{service.provider.rating}</span>
              <span className="text-gray-500">(128条评价)</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock size={16} />
              <span>{service.type === 'boarding' ? '按天计费' : `约${service.duration}分钟`}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <img src={service.provider.avatar} alt={service.provider.name} className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="flex-1">
              <p className="font-medium">{service.provider.name}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Shield size={12} className="text-green-500" />
                已完成 256 次服务
              </p>
            </div>
            <button className="px-3 py-1.5 border border-primary text-primary text-sm rounded-full">
              关注
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            选择服务时间
          </h3>

          <div className="flex gap-2 overflow-x-auto pb-3">
            {dates.map((date) => (
              <button
                key={date.full}
                onClick={() => setSelectedDate(date.full)}
                className={`flex-shrink-0 w-14 py-3 rounded-xl text-center transition-colors ${
                  selectedDate === date.full
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <p className="text-xs">{date.weekDay}</p>
                <p className="text-lg font-bold">{date.day}</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {times.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-2 rounded-lg text-sm transition-colors ${
                  selectedTime === time
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Award size={18} className="text-yellow-500" />
            服务保障
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Shield, text: '专业资质认证' },
              { icon: Check, text: '不满意可重做' },
              { icon: Clock, text: '准时上门服务' },
              { icon: Star, text: '售后跟踪回访' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <item.icon size={16} className="text-green-500" />
                <span className="text-gray-600">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">用户评价 ({reviews.length})</h3>
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="pb-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <img src={review.avatar} alt={review.user} className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{review.user}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                  <div className="flex text-yellow-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
        <div className="text-center">
          <p className="text-xl font-bold text-primary">
            {service.price === 0 ? '免费' : `¥${service.price}`}
          </p>
          <p className="text-xs text-gray-500">{service.type === 'boarding' ? '/天' : '/次'}</p>
        </div>
        <button
          onClick={() => setShowBooking(true)}
          className="flex-1 py-3 bg-primary text-white rounded-full font-semibold"
        >
          立即预约
        </button>
        <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <MessageCircle size={20} className="text-gray-600" />
        </button>
      </div>

      {showBooking && selectedDate && selectedTime && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">确认预约</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">服务项目</span>
                <span className="font-medium">{service.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">服务商</span>
                <span className="font-medium">{service.provider.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">预约时间</span>
                <span className="font-medium">{selectedDate} {selectedTime}</span>
              </div>
              <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
                <span className="text-gray-500">支付金额</span>
                <span className="font-bold text-primary text-lg">
                  {service.price === 0 ? '免费' : `¥${service.price}`}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBooking(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-full font-medium"
              >
                取消
              </button>
              <button
                onClick={() => {
                  alert('预约成功！我们会尽快与您联系确认。')
                  setShowBooking(false)
                }}
                className="flex-1 py-3 bg-primary text-white rounded-full font-medium"
              >
                确认支付
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
