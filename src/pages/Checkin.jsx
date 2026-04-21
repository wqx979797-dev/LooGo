import { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Flame, Trophy, ChevronLeft, ChevronRight, Plus, Target, Play, Pause, X, Camera, Share2, Map } from 'lucide-react'
import { checkins, currentUser, routes } from '../data/mockData'
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'

export default function Checkin() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0))
  const [showCheckinModal, setShowCheckinModal] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingDistance, setRecordingDistance] = useState(0)
  const [pathCoordinates, setPathCoordinates] = useState([])
  const [showRecordingModal, setShowRecordingModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [checkinPhoto, setCheckinPhoto] = useState(null)
  const [completedRecording, setCompletedRecording] = useState({ time: 0, distance: 0 })
  const [locationMessage, setLocationMessage] = useState('尚未开始定位')

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth)

  const getCheckinDates = () => {
    return checkins.map(c => c.date)
  }

  const isCheckedIn = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return getCheckinDates().includes(dateStr)
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  const totalDistance = checkins.reduce((sum, c) => sum + c.distance, 0)
  const totalDuration = checkins.reduce((sum, c) => sum + c.duration, 0)
  const currentStreak = 5

  // 真实定位优先；如果浏览器拒绝或不可用，再回退到演示轨迹。
  useEffect(() => {
    let interval
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
        setRecordingDistance(prev => prev + 0.01)
        setPathCoordinates(prev => {
          const basePath = prev.length > 0 ? prev : [[40.0123, 116.4567]]
          const last = basePath[basePath.length - 1]
          const newLat = last[0] + (Math.random() - 0.5) * 0.001
          const newLng = last[1] + (Math.random() - 0.5) * 0.001
          return [...basePath, [newLat, newLng]]
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const startRecording = () => {
    const beginWithCoordinate = (coordinate, message) => {
      setLocationMessage(message)
      setIsRecording(true)
      setRecordingTime(0)
      setRecordingDistance(0)
      setPathCoordinates([coordinate])
      setShowCheckinModal(false)
      setShowRecordingModal(true)
    }

    if (!navigator.geolocation) {
      beginWithCoordinate([40.0123, 116.4567], '当前浏览器不支持定位，已使用演示坐标。')
      alert('当前浏览器不支持定位，已使用演示坐标继续。')
      return
    }

    setLocationMessage('正在申请定位权限...')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        beginWithCoordinate(
          [position.coords.latitude, position.coords.longitude],
          `定位成功：${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`
        )
      },
      (error) => {
        const reason = error.code === error.PERMISSION_DENIED
          ? '你拒绝了定位权限'
          : error.code === error.TIMEOUT
            ? '定位超时'
            : '当前位置不可用'
        beginWithCoordinate([40.0123, 116.4567], `${reason}，已使用演示坐标。`)
        alert(`${reason}，本次使用演示坐标继续记录。`)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  const stopRecording = () => {
    setIsRecording(false)
    setShowRecordingModal(false)
    setCompletedRecording({ time: recordingTime, distance: recordingDistance })
    setShowShareModal(true)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const center = pathCoordinates.length > 0 ? pathCoordinates[0] : [40.0123, 116.4567]

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-primary to-secondary px-4 py-6 text-white">
        <h1 className="text-xl font-bold mb-1">遛宠打卡</h1>
        <p className="text-sm opacity-90">坚持遛宠，让宠物更健康</p>
      </header>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={20} className="text-orange-500" />
              <span className="text-sm text-gray-600">连续打卡</span>
            </div>
            <p className="text-2xl font-bold text-primary">{currentStreak} <span className="text-sm font-normal">天</span></p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={20} className="text-yellow-500" />
              <span className="text-sm text-gray-600">本月打卡</span>
            </div>
            <p className="text-2xl font-bold text-primary">{checkins.length} <span className="text-sm font-normal">次</span></p>
          </div>
        </div>

        <button
          onClick={() => setShowCheckinModal(true)}
          className="w-full py-4 bg-primary text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-95 transition-transform"
        >
          <Plus size={20} />
          立即打卡
        </button>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h3 className="font-semibold">{currentMonth.getFullYear()}年 {monthNames[currentMonth.getMonth()]}</h3>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {weekDays.map((day, idx) => (
              <div key={idx} className="text-gray-400 py-2 text-xs">{day}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, idx) => (
              <div key={`empty-${idx}`} className="py-2" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1
              const checked = isCheckedIn(day)
              return (
                <div key={day} className="py-2">
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm ${
                    checked
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                    {day}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">本月统计</h3>
            <span className="text-sm text-gray-500">共{checkins.length}次遛宠</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-primary">{totalDistance.toFixed(1)}</p>
              <p className="text-xs text-gray-500">总公里数</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-secondary">{totalDuration}</p>
              <p className="text-xs text-gray-500">总分钟数</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">最近打卡</h3>
          <div className="space-y-3">
            {checkins.slice(0, 5).map((checkin) => {
              const route = routes.find(r => r.id === checkin.routeId)
              return (
                <div key={checkin.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{route?.title || '未知路线'}</p>
                    <p className="text-xs text-gray-500">{checkin.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{checkin.distance}km</p>
                    <p className="text-xs text-gray-500">{checkin.duration}分钟</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {showCheckinModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end z-50"
          onClick={() => setShowCheckinModal(false)}
        >
          <div
            className="bg-white w-full rounded-t-3xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Target className="text-primary" />
              选择打卡方式
            </h3>
            <div className="space-y-4">
              <button
                onClick={startRecording}
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-primary to-orange-400 rounded-xl text-white"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Map size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">实时记录路线</h4>
                  <p className="text-sm opacity-90">开启GPS，记录完整遛宠轨迹</p>
                </div>
                <Play size={20} />
              </button>
              <button
                onClick={() => {
                  setShowCheckinModal(false)
                  alert('打卡成功！')
                }}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Camera size={24} className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">快速打卡</h4>
                  <p className="text-sm text-gray-500">上传照片，快速完成打卡</p>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
            <button
              onClick={() => setShowCheckinModal(false)}
              className="w-full mt-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {showRecordingModal && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button onClick={stopRecording} className="text-gray-500">
              <ChevronLeft size={24} />
            </button>
            <h3 className="font-semibold">正在记录路线</h3>
            <button onClick={stopRecording} className="text-primary">结束</button>
          </div>
          <div className="p-4">
            <div className="bg-gray-100 rounded-2xl p-4 mb-4 text-center">
              <p className="text-4xl font-bold text-primary mb-2">{formatTime(recordingTime)}</p>
              <p className="text-lg text-gray-600">{recordingDistance.toFixed(2)} km</p>
              <p className="text-xs text-gray-500 mt-2">{locationMessage}</p>
            </div>
          </div>
          <div className="flex-1 p-4">
            <div className="h-64 bg-gray-100 rounded-2xl overflow-hidden">
              <MapContainer
                center={center}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                dragging={true}
                touchZoom={true}
                doubleClickZoom={true}
                boxZoom={true}
                keyboard={true}
                inertia={true}
                inertiaDeceleration={3000}
                inertiaMaxSpeed={1500}
                easeLinearity={0.25}
                worldCopyJump={true}
                attributionControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {pathCoordinates.length > 0 && (
                  <>
                    <Polyline
                      positions={pathCoordinates}
                      color="#FF6B35"
                      weight={4}
                      opacity={0.8}
                    />
                    <Marker position={pathCoordinates[pathCoordinates.length - 1]}>
                      <Popup>当前位置</Popup>
                    </Marker>
                  </>
                )}
              </MapContainer>
            </div>
          </div>
          <div className="p-6 pb-12 border-t border-gray-200 flex items-center justify-center gap-8">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30"
            >
              {isRecording ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <button
              onClick={stopRecording}
              className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end z-50"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white w-full rounded-t-3xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">遛宠完成！</h3>
            <p className="text-sm text-gray-500 mb-4">
              本次遛宠 {completedRecording.distance.toFixed(2)}km，耗时 {Math.floor(completedRecording.time / 60)}分{completedRecording.time % 60}秒
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">添加照片</label>
              <div className="flex gap-2">
                {checkinPhoto ? (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                    <img src={checkinPhoto} alt="打卡照片" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setCheckinPhoto(null)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setCheckinPhoto('https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80')}
                    className="w-24 h-24 bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300"
                  >
                    <Camera size={24} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-400">拍摄照片</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">分享文字</label>
              <textarea
                defaultValue={`今天带豆豆出来遛弯，走了${completedRecording.distance.toFixed(2)}公里！🐕`}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowShareModal(false)
                  setCheckinPhoto(null)
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium"
              >
                稍后再说
              </button>
              <button
                onClick={() => {
                  alert('打卡成功！\n您的遛宠记录已保存，精彩瞬间已分享给好友！')
                  setShowShareModal(false)
                  setCheckinPhoto(null)
                  setRecordingTime(0)
                  setRecordingDistance(0)
                  setPathCoordinates([])
                }}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-medium"
              >
                立即打卡
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
