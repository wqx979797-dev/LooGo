import { useState, useEffect, useRef } from 'react'
import { Calendar, MapPin, Clock, Flame, Trophy, ChevronLeft, ChevronRight, Plus, Target, Play, Pause, X, Camera, Share2, Map } from 'lucide-react'
import { checkins, currentUser, routes } from '../data/mockData'
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

const pixelPetIcon = L.divIcon({
  className: 'pixel-map-marker',
  html: '<span class="pixel-map-marker-core">🐾</span>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -18]
})

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
  const [shareText, setShareText] = useState('')
  const [publishAsRoute, setPublishAsRoute] = useState(true)
  const watchIdRef = useRef(null)
  const lastKnownCoordinateRef = useRef(null)

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

  const haversineKm = (from, to) => {
    const toRad = (value) => value * Math.PI / 180
    const radius = 6371
    const dLat = toRad(to[0] - from[0])
    const dLng = toRad(to[1] - from[1])
    const a = Math.sin(dLat / 2) ** 2
      + Math.cos(toRad(from[0])) * Math.cos(toRad(to[0])) * Math.sin(dLng / 2) ** 2
    return 2 * radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const appendCoordinate = (coordinate) => {
    setPathCoordinates(prev => {
      if (prev.length === 0) return [coordinate]
      const last = prev[prev.length - 1]
      const steps = 6
      const interpolated = Array.from({ length: steps }, (_, index) => {
        const ratio = (index + 1) / steps
        return [
          last[0] + (coordinate[0] - last[0]) * ratio,
          last[1] + (coordinate[1] - last[1]) * ratio
        ]
      })
      const distance = haversineKm(last, coordinate)
      setRecordingDistance(prevDistance => prevDistance + distance)
      interpolated.forEach((point, index) => {
        window.setTimeout(() => {
          setPathCoordinates(current => [...current, point])
        }, (index + 1) * 120)
      })
      return prev
    })
  }

  // 真实定位优先；定位更新较慢时用插值补点，让轨迹视觉更顺滑。
  useEffect(() => {
    let interval
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
        if (!watchIdRef.current && lastKnownCoordinateRef.current) {
          const last = lastKnownCoordinateRef.current
          const next = [
            last[0] + (Math.random() - 0.48) * 0.00022,
            last[1] + (Math.random() - 0.48) * 0.00022
          ]
          lastKnownCoordinateRef.current = next
          appendCoordinate(next)
        }
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [isRecording])

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  const startRecording = () => {
    const beginWithCoordinate = (coordinate, message) => {
      setLocationMessage(message)
      setIsRecording(true)
      setRecordingTime(0)
      setRecordingDistance(0)
      setPathCoordinates([coordinate])
      lastKnownCoordinateRef.current = coordinate
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
        const firstCoordinate = [position.coords.latitude, position.coords.longitude]
        beginWithCoordinate(
          firstCoordinate,
          `定位成功：${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`
        )
        watchIdRef.current = navigator.geolocation.watchPosition(
          (nextPosition) => {
            const nextCoordinate = [nextPosition.coords.latitude, nextPosition.coords.longitude]
            lastKnownCoordinateRef.current = nextCoordinate
            setLocationMessage(`实时定位中：${nextCoordinate[0].toFixed(5)}, ${nextCoordinate[1].toFixed(5)}`)
            appendCoordinate(nextCoordinate)
          },
          () => {
            setLocationMessage('实时定位暂不可用，正在用平滑演示轨迹继续。')
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 3000
          }
        )
      },
      (error) => {
        const reason = error.code === error.PERMISSION_DENIED
          ? '你拒绝了定位权限'
          : error.code === error.TIMEOUT
            ? '定位超时'
            : '当前位置不可用'
        beginWithCoordinate([40.0123, 116.4567], `${reason}，已使用平滑演示坐标。`)
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
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setShowRecordingModal(false)
    setCompletedRecording({ time: recordingTime, distance: recordingDistance })
    setShareText(`今天带豆豆出来遛弯，走了${recordingDistance.toFixed(2)}公里！🐕`)
    setShowShareModal(true)
  }

  const resetRecording = () => {
    setShowShareModal(false)
    setCheckinPhoto(null)
    setRecordingTime(0)
    setRecordingDistance(0)
    setPathCoordinates([])
    setPublishAsRoute(true)
    setShareText('')
  }

  const confirmCheckin = (publish = false) => {
    alert(publish
      ? '发布成功！本次轨迹已保存为路线分享，其他宠主可以看到并加入啦。'
      : '保存成功！本次遛宠记录已保存到你的打卡记录。'
    )
    resetRecording()
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
        <div className="fixed inset-0 bg-cream z-[9999] flex flex-col">
          <div className="h-14 flex items-center justify-between px-4 border-b border-orange-100 bg-white/90 backdrop-blur-xl z-[1001]">
            <button onClick={stopRecording} className="pixel-mini-icon text-cocoa">
              ‹
            </button>
            <h3 className="font-semibold">正在记录路线</h3>
            <button onClick={stopRecording} className="text-primary">结束</button>
          </div>

          <div className="relative flex-1 min-h-0">
            <div className="absolute top-4 left-4 right-4 z-[1000] bg-white/90 backdrop-blur-xl rounded-[24px] p-4 text-center shadow-sm border border-orange-100">
              <p className="text-4xl font-black text-primary tracking-[0.12em]">{formatTime(recordingTime)}</p>
              <p className="text-lg text-cocoa mt-1">{recordingDistance.toFixed(2)} km</p>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{locationMessage}</p>
            </div>

            <div className="absolute inset-0">
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
                      color="#F59F85"
                      weight={5}
                      opacity={0.9}
                    />
                    <Marker position={pathCoordinates[pathCoordinates.length - 1]} icon={pixelPetIcon}>
                      <Popup>当前位置</Popup>
                    </Marker>
                  </>
                )}
              </MapContainer>
            </div>

            <div className="recording-arc-dock">
              <div className="recording-arc-surface" />
              <button
                onClick={() => setIsRecording(!isRecording)}
                className="recording-arc-button primary"
                aria-label={isRecording ? '暂停记录' : '继续记录'}
              >
                <span className="pixel-action-icon">{isRecording ? 'Ⅱ' : '▶'}</span>
              </button>
              <button
                onClick={stopRecording}
                className="recording-arc-button danger"
                aria-label="结束记录"
              >
                <span className="pixel-action-icon">×</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end z-50"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white w-full max-h-[88vh] rounded-t-3xl animate-slide-up flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-5 pb-3 border-b border-orange-100">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">遛宠完成！</h3>
              <p className="text-sm text-gray-500">
                本次遛宠 {completedRecording.distance.toFixed(2)}km，耗时 {Math.floor(completedRecording.time / 60)}分{completedRecording.time % 60}秒
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
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
                      <span className="text-xs text-gray-400">上传照片</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">分享文字</label>
                <textarea
                  value={shareText}
                  onChange={(event) => setShareText(event.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <button
                onClick={() => setPublishAsRoute(!publishAsRoute)}
                className={`w-full flex items-center justify-between rounded-2xl p-4 border ${
                  publishAsRoute ? 'bg-blush border-primary/30 text-cocoa' : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                <span className="font-medium">同时上传为路线分享</span>
                <span>{publishAsRoute ? '已开启' : '未开启'}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 pb-[calc(16px+env(safe-area-inset-bottom))] border-t border-orange-100 bg-white">
              <button
                onClick={resetRecording}
                className="py-3 bg-gray-100 text-gray-600 rounded-xl font-medium"
              >
                取消
              </button>
              <button
                onClick={() => confirmCheckin(false)}
                className="py-3 bg-mint text-secondary rounded-xl font-medium"
              >
                保存记录
              </button>
              <button
                onClick={() => confirmCheckin(true)}
                className="py-3 bg-primary text-white rounded-xl font-medium"
              >
                确认发布
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
