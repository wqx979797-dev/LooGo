import { useEffect, useMemo, useRef, useState } from 'react'
import { ImageOverlay, MapContainer, Marker, Polyline, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

const modeMeta = {
  solo: {
    label: '独遛',
    hint: '隐身模式，只记录自己',
    visible: []
  },
  loogo: {
    label: 'loogo',
    hint: '正常模式，发现附近宠友',
    visible: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12']
  },
  buddy: {
    label: '搭子',
    hint: '只显示已建立搭子关系的人',
    visible: ['p1', 'p3', 'p5', 'p8', 'p11']
  }
}

const navItems = [
  { id: 'shop', label: '商城', icon: 'shop' },
  { id: 'community', label: '社区', icon: 'community' },
  { id: 'go', label: 'GO', icon: 'go' },
  { id: 'messages', label: '消息', icon: 'message' },
  { id: 'mine', label: '我的', icon: 'reward' }
]

const MAP_WIDTH = 8192
const MAP_HEIGHT = 8192
const IMAGE_BOUNDS = [[0, 0], [MAP_HEIGHT, MAP_WIDTH]]
const PIXEL_INITIAL_ZOOM = -1.42
const PIXEL_MIN_ZOOM = -1.68
const REAL_INITIAL_ZOOM = 16
const START_CENTER_REAL = [39.92915, 116.60963]

const toImagePoint = (xPercent, yPercent) => [MAP_HEIGHT * yPercent, MAP_WIDTH * xPercent]

const walkers = [
  { id: 'p1', name: 'Momo', pet: '橘猫', asset: '1_marker_90f.gif', position: toImagePoint(0.30, 0.35), realPosition: [39.93015, 116.60905], bubble: '慢走中～' },
  { id: 'p2', name: 'Seven', pet: '橘猫', asset: '2_marker_90f.gif', position: toImagePoint(0.72, 0.34), realPosition: [39.927, 116.6158], bubble: '求搭子!' },
  { id: 'p3', name: 'Luna', pet: '柯基', asset: '3_marker_90f.gif', position: toImagePoint(0.24, 0.55), realPosition: [39.9342, 116.6039], bubble: '草坪见' },
  { id: 'p4', name: '奶盖', pet: '萨摩耶', asset: '4_marker_90f.gif', position: toImagePoint(0.78, 0.55), realPosition: [39.9244, 116.6173], bubble: '代遛结束' },
  { id: 'p5', name: '阿布', pet: '柯基', asset: '6_marker_90f.gif', position: toImagePoint(0.38, 0.70), realPosition: [39.92905, 116.61015], bubble: '休息中' },
  { id: 'p6', name: '栗子', pet: '柴犬', asset: '1_marker_90f.gif', position: toImagePoint(0.66, 0.70), realPosition: [39.9227, 116.6079], bubble: '补水啦' },
  { id: 'p7', name: '花花', pet: '猫咪', asset: '2_marker_90f.gif', position: toImagePoint(0.47, 0.28), realPosition: [39.9368, 116.6142], bubble: '晒太阳' },
  { id: 'p8', name: '团子', pet: '柯基', asset: '3_marker_90f.gif', position: toImagePoint(0.58, 0.43), realPosition: [39.9325, 116.6206], bubble: '等搭子' },
  { id: 'p9', name: '豆包', pet: '柴犬', asset: '4_marker_90f.gif', position: toImagePoint(0.16, 0.74), realPosition: [39.9206, 116.5998], bubble: '路线不错' },
  { id: 'p10', name: '小八', pet: '柯基', asset: '6_marker_90f.gif', position: toImagePoint(0.86, 0.72), realPosition: [39.9382, 116.5986], bubble: '慢跑中' },
  { id: 'p11', name: '乌龙', pet: '柴犬', asset: '1_marker_90f.gif', position: toImagePoint(0.18, 0.27), realPosition: [39.9165, 116.6216], bubble: '已签到' },
  { id: 'p12', name: '可乐', pet: '猫咪', asset: '2_marker_90f.gif', position: toImagePoint(0.83, 0.28), realPosition: [39.9412, 116.6268], bubble: '回家啦' }
]

const START_CENTER = toImagePoint(0.52, 0.56)

const sideActions = [
  { id: 'sign', label: '签到', icon: 'calendar' },
  { id: 'route', label: '路线', icon: 'route' },
  { id: 'task', label: '任务', icon: 'task' },
  { id: 'water', label: '补水点', icon: 'water' },
  { id: 'poop', label: '排泄点', icon: 'poop' },
  { id: 'hospital', label: '医院', icon: 'hospital' },
  { id: 'toilet', label: '卫生间', icon: 'toilet' }
]

const panelContent = {
  shop: {
    title: '宠物商城',
    subtitle: '给今天的遛宠补一点装备和能量',
    hero: '今日补给站',
    cards: [
      { title: '像素补水随行杯', meta: '今日推荐 · 1.2km 门店有货', tag: '补水', art: 'water' },
      { title: '夜遛反光牵引绳', meta: '社区热卖 · 可用骨头币抵扣', tag: '夜遛', art: 'leash' },
      { title: '能量零食包', meta: '120 骨头币抵扣 · 柴犬最爱', tag: '零食', art: 'snack' },
      { title: '便携拾便套装', meta: '排泄点旁热销 · 今日九折', tag: '清洁', art: 'poop' }
    ]
  },
  community: {
    title: '同城社区',
    subtitle: '看附近宠友的路线、打卡和搭子邀请',
    hero: '附近正在热聊',
    cards: [
      { title: 'Momo 分享了湖边慢走线', meta: '1.8km · 18 张打卡图 · 适合小型犬', tag: '路线', art: 'route' },
      { title: 'Seven 找 19:30 柴犬搭子', meta: '680m · 已有 3 位宠友响应', tag: '搭子', art: 'people' },
      { title: 'Luna 标记干净补水点', meta: '910m · 12 人确认可用', tag: '补水', art: 'water' },
      { title: '周末宠物友好草坪局', meta: '同城活动 · 可一键报名', tag: '活动', art: 'flag' }
    ]
  },
  messages: {
    title: '宠友消息',
    subtitle: '附近宠友、搭子邀请和服务通知都在这里',
    hero: '消息中心',
    cards: [
      { title: 'Momo 发来搭子邀请', meta: '今晚 19:30 · 湖边慢走线 · 可加入', tag: '搭子', art: 'community' },
      { title: '路线评论提醒', meta: 'Seven 夸你的补水点标记很有用', tag: '评论', art: 'message' },
      { title: '服务进度通知', meta: '上门代喂订单已完成 · 附 3 张照片', tag: '服务', art: 'task' },
      { title: '系统奖励到账', meta: '路线发布奖励 +20 骨头币', tag: '奖励', art: 'reward' }
    ]
  },
  mine: {
    title: '我的档案',
    subtitle: '等级、路线、宠物资料和位置公开设置',
    hero: '遛遛达人 Lv.12',
    cards: [
      { title: '本月遛宠报告', meta: '8 次 · 12.6km · 超过 72% 宠友', tag: '报告', art: 'task' },
      { title: '豆豆的宠物档案', meta: '柯基 · 3 岁 · 喜欢草坪路线', tag: '宠物', art: 'reward' },
      { title: '我的路线收藏', meta: '6 条路线 · 2 条公开分享', tag: '路线', art: 'route' },
      { title: '隐私与位置模式', meta: '随独遛 / loogo / 搭子自动切换', tag: '隐私', art: 'shield' }
    ]
  }
}

const sidePanelContent = {
  sign: { title: '今日签到', rows: ['连续签到第 5 天', '领取 +10 骨头币', '明天可领补水券'], action: '立即签到' },
  route: { title: '路线指引', rows: ['推荐湖边放电路线', '途经补水点和排泄点', '可在结束后上传为路线'], action: '开始指引' },
  task: { title: '今日任务', rows: ['遛宠 20 分钟', '发送 1 条地图消息', '标记 1 个便民点'], action: '查看任务' },
  water: { title: '补水点', rows: ['已在地图显示 3 个补水点', '最近约 180m', '宠友确认水源干净'], action: '导航过去' },
  poop: { title: '排泄点', rows: ['已在地图显示 3 个排泄点', '含垃圾桶与纸巾提醒', '可继续标记新点位'], action: '导航过去' },
  hospital: { title: '医院', rows: ['已在地图显示附近医院', '最近约 1.2km', '支持紧急路线'], action: '紧急导航' },
  toilet: { title: '卫生间', rows: ['已在地图显示附近卫生间', '最近约 320m', '包含宠物等候区备注'], action: '导航过去' }
}

const facilityGroups = {
  water: [
    { id: 'water-1', label: '泉泉补水点', position: toImagePoint(0.42, 0.44), realPosition: [39.93005, 116.60875], type: 'water' },
    { id: 'water-2', label: '林边水站', position: toImagePoint(0.68, 0.57), realPosition: [39.92905, 116.61155], type: 'water' },
    { id: 'water-3', label: '湖口补给', position: toImagePoint(0.33, 0.72), realPosition: [39.92755, 116.60785], type: 'water' }
  ],
  poop: [
    { id: 'poop-1', label: '清洁桶 A', position: toImagePoint(0.38, 0.52), realPosition: [39.92925, 116.60835], type: 'poop' },
    { id: 'poop-2', label: '草坪排泄点', position: toImagePoint(0.62, 0.66), realPosition: [39.92815, 116.61085], type: 'poop' },
    { id: 'poop-3', label: '南门清洁站', position: toImagePoint(0.48, 0.78), realPosition: [39.92715, 116.60928], type: 'poop' }
  ],
  hospital: [
    { id: 'hospital-1', label: '宠物医院', position: toImagePoint(0.28, 0.58), realPosition: [39.9287, 116.60728], type: 'hospital' },
    { id: 'hospital-2', label: '夜间急诊', position: toImagePoint(0.77, 0.42), realPosition: [39.93025, 116.61226], type: 'hospital' }
  ],
  toilet: [
    { id: 'toilet-1', label: '公园卫生间', position: toImagePoint(0.36, 0.38), realPosition: [39.93042, 116.60818], type: 'toilet' },
    { id: 'toilet-2', label: '北侧卫生间', position: toImagePoint(0.73, 0.73), realPosition: [39.92752, 116.61192], type: 'toilet' }
  ]
}

const routeGuidePath = [
  START_CENTER,
  toImagePoint(0.49, 0.52),
  toImagePoint(0.42, 0.44),
  toImagePoint(0.38, 0.52),
  toImagePoint(0.33, 0.72)
]

const routeGuidePathReal = [
  START_CENTER_REAL,
  [39.92902, 116.60918],
  [39.93005, 116.60875],
  [39.92925, 116.60835],
  [39.92755, 116.60785]
]

function MapResizer() {
  const map = useMap()

  useEffect(() => {
    const refresh = () => map.invalidateSize()
    const timers = [0, 240, 700].map((delay) => window.setTimeout(refresh, delay))
    window.addEventListener('resize', refresh)
    window.addEventListener('orientationchange', refresh)
    return () => {
      timers.forEach(window.clearTimeout)
      window.removeEventListener('resize', refresh)
      window.removeEventListener('orientationchange', refresh)
    }
  }, [map])

  return null
}

function MapFollower({ center }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: false })
  }, [center, map])

  return null
}

function MapZoomTracker({ onZoom }) {
  const map = useMapEvents({
    zoom() {
      onZoom(map.getZoom())
    },
    zoomend() {
      onZoom(map.getZoom())
    }
  })

  useEffect(() => {
    onZoom(map.getZoom())
  }, [map, onZoom])

  return null
}

const iconNameMap = {
  sign: 'task',
  calendar: 'task',
  people: 'community',
  dog: 'reward',
  hospital: 'hospital',
  clinic: 'clinic',
  leash: 'route',
  snack: 'reward',
  flag: 'route',
  shield: 'reward',
  chat: 'message'
}

const publicAsset = (path) => {
  const cleanPath = path.replace(/^\//, '')
  const basePath = import.meta.env.BASE_URL || '/'
  if (typeof window !== 'undefined') {
    const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    if (isLocalHost && !window.location.pathname.startsWith(basePath)) {
      return `/${cleanPath}`
    }
  }
  return `${basePath}${cleanPath}`
}
const characterAsset = (fileName) => publicAsset(`characters/${fileName}`)
const mapAsset = (fileName) => publicAsset(`maps/${fileName}`)
const iconAsset = (type) => publicAsset(`icons/${iconNameMap[type] ?? type}.png`)
const pixelIcon = (type) => `<img class="game-icon game-icon-img ${type}" src="${iconAsset(type)}" alt="" />`

const createPixelIcon = (walker, hidden = false, bubble = '', markerScale = 1) => L.divIcon({
  className: `new-pixel-marker ${hidden ? 'is-hidden' : 'is-visible'}`,
  html: `
    <span class="marker-scale ${hidden ? 'is-hidden-scale' : 'is-visible-scale'}" style="--marker-scale:${markerScale}">
      <span class="new-pixel-bubble ${bubble ? 'show' : ''}">${bubble}</span>
      <img class="new-character-sprite" src="${characterAsset(walker.asset)}" alt="${walker.name}" />
      <span class="new-pixel-name">${walker.name}</span>
    </span>
  `,
  iconSize: [132, 132],
  iconAnchor: [66, 116],
  popupAnchor: [0, -96]
})

const createSelfIcon = (bubble = '', isWalking = false, markerScale = 1) => L.divIcon({
  className: `new-pixel-marker self ${isWalking ? 'is-walking' : ''}`,
  html: `
    <span class="marker-scale is-visible-scale" style="--marker-scale:${markerScale}">
      <span class="new-walk-aura"></span>
      <span class="new-pixel-bubble ${bubble ? 'show' : ''}">${bubble}</span>
      <img class="new-character-sprite self" src="${characterAsset(isWalking ? '5.1_marker_90f.gif' : '5_marker_90f.gif')}" alt="我" />
      <span class="new-pixel-name">我</span>
    </span>
  `,
  iconSize: [140, 140],
  iconAnchor: [70, 124],
  popupAnchor: [0, -104]
})

const createFacilityIcon = (place, markerScale = 1) => L.divIcon({
  className: `facility-marker ${place.type}`,
  html: `
    <span class="marker-scale" style="--marker-scale:${Math.max(0.72, markerScale * 0.92)}">
      ${pixelIcon(place.type)}
      <b>${place.label}</b>
    </span>
  `,
  iconSize: [92, 80],
  iconAnchor: [46, 68],
  popupAnchor: [0, -62]
})

export default function NewExperience({ onBack }) {
  const [mapMode, setMapMode] = useState('pixel')
  const [mode, setMode] = useState('loogo')
  const [modeFx, setModeFx] = useState('summon')
  const [activeNav, setActiveNav] = useState(2)
  const [isWalking, setIsWalking] = useState(false)
  const [hasRouteDraft, setHasRouteDraft] = useState(false)
  const [showPublishSheet, setShowPublishSheet] = useState(false)
  const [shareText, setShareText] = useState('今天和豆豆完成了一条超舒服的遛宠路线，推荐给附近宠友！')
  const [panelExpanded, setPanelExpanded] = useState(false)
  const [activePanelDetail, setActivePanelDetail] = useState(null)
  const [visibleFacilityType, setVisibleFacilityType] = useState(null)
  const [guideMode, setGuideMode] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [path, setPath] = useState([START_CENTER])
  const [message, setMessage] = useState('')
  const [selfBubble, setSelfBubble] = useState('')
  const [walkerBubbles, setWalkerBubbles] = useState(() => Object.fromEntries(walkers.map(w => [w.id, ''])))
  const [sideNotice, setSideNotice] = useState('')
  const [activeSide, setActiveSide] = useState(null)
  const [locationStatus, setLocationStatus] = useState('点击 GO 后开始获取定位')
  const dragStartX = useRef(null)
  const watchId = useRef(null)
  const demoTimer = useRef(null)

  const visibleWalkerIds = modeMeta[mode].visible
  const isRealPoint = (point) => Array.isArray(point) && Math.abs(point[0]) <= 90 && Math.abs(point[1]) <= 180
  const rawCenter = path[path.length - 1]
  const currentCenter = mapMode === 'real'
    ? (isRealPoint(rawCenter) ? rawCenter : START_CENTER_REAL)
    : (isRealPoint(rawCenter) ? START_CENTER : rawCenter)
  const displayPath = mapMode === 'real' ? path.filter(isRealPoint) : path.filter(point => !isRealPoint(point))
  const activePage = navItems[activeNav].id
  const routeDistance = Math.max((path.length - 1) * 0.02, 0).toFixed(2)
  const markerScale = mapMode === 'real'
    ? Math.max(0.72, Math.min(1.02, zoomLevel / 18))
    : Math.max(0.56, Math.min(1.05, 0.68 * (2 ** (zoomLevel + 1.45))))
  const selfMarkerScale = markerScale * 1.08
  const visibleFacilities = visibleFacilityType ? facilityGroups[visibleFacilityType] ?? [] : []

  const clearTracking = () => {
    watchId.current = null
    if (demoTimer.current !== null) {
      window.clearInterval(demoTimer.current)
      demoTimer.current = null
    }
  }

  const currentStartCenter = () => (mapMode === 'real' ? START_CENTER_REAL : START_CENTER)

  const startDemoTracking = (statusText = '定位不可用，正在使用平滑演示轨迹') => {
    clearTracking()
    setLocationStatus(statusText)
    const trackingMapMode = mapMode
    demoTimer.current = window.setInterval(() => {
      setSeconds(value => value + 1)
      setPath(prev => {
        const last = prev[prev.length - 1]
        if (trackingMapMode === 'real') {
          const next = [
            last[0] + 0.00008 + (Math.random() - 0.5) * 0.00003,
            last[1] + 0.00007 + (Math.random() - 0.5) * 0.00004
          ]
          return [...prev, next]
        }

        const next = [
          last[0] + (Math.random() - 0.42) * 3.2,
          last[1] + (Math.random() - 0.44) * 3.2
        ]
        return [...prev, [
          Math.max(8, Math.min(MAP_HEIGHT - 8, next[0])),
          Math.max(8, Math.min(MAP_WIDTH - 8, next[1]))
        ]]
      })
    }, 1000)
  }

  useEffect(() => () => clearTracking(), [])

  useEffect(() => {
    clearTracking()
    setIsWalking(false)
    setHasRouteDraft(false)
    setShowPublishSheet(false)
    setGuideMode(false)
    setVisibleFacilityType(null)
    setActiveSide(null)
    setSeconds(0)
    setPath([mapMode === 'real' ? START_CENTER_REAL : START_CENTER])
    setLocationStatus(mapMode === 'real' ? '现实地图已开启，路线与导航使用真实经纬度演示' : '像素地图已开启，点击 GO 开始记录路线')
  }, [mapMode])

  const displayTime = useMemo(() => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0')
    const sec = String(seconds % 60).padStart(2, '0')
    return `${min}:${sec}`
  }, [seconds])

  const switchMode = (nextMode) => {
    if (nextMode === mode) return
    setModeFx('vanish')
    window.setTimeout(() => {
      setMode(nextMode)
      setModeFx('summon')
    }, 280)
  }

  const navOffset = (index) => {
    let diff = index - activeNav
    if (diff > 2) diff -= navItems.length
    if (diff < -2) diff += navItems.length
    return diff
  }

  const rotateNav = (direction) => {
    setActiveNav(value => (value + direction + navItems.length) % navItems.length)
  }

  const startWalk = () => {
    setActiveNav(2)
    setShowPublishSheet(false)
    setHasRouteDraft(true)
    setIsWalking(true)
    setSeconds(0)
    setPath([currentStartCenter()])
    startDemoTracking(mapMode === 'real' ? '现实地图记录中，路线按真实经纬度模拟前进' : '当前是底图演示模式，已开始记录演示轨迹')
  }

  const pauseWalk = () => {
    clearTracking()
    setIsWalking(false)
    setLocationStatus('路线已暂停，可点击继续或结束并上传路线')
  }

  const resumeWalk = () => {
    setActiveNav(2)
    setShowPublishSheet(false)
    setHasRouteDraft(true)
    setIsWalking(true)
    startDemoTracking(mapMode === 'real' ? '继续真实路线记录，人物会沿路线移动' : '继续记录中，路线会平滑延伸')
  }

  const finishWalk = () => {
    clearTracking()
    setIsWalking(false)
    setHasRouteDraft(false)
    setShowPublishSheet(true)
    setLocationStatus('路线已结束，确认后可发布到社区')
  }

  const publishRoute = () => {
    setShowPublishSheet(false)
    setSideNotice('路线已发布到社区与路线库')
    window.setTimeout(() => setSideNotice(''), 2400)
  }

  const cancelPublish = () => {
    setShowPublishSheet(false)
    setLocationStatus('已取消发布，路线保存在本地草稿')
  }

  const locateMe = () => {
    setPath(prev => [...prev, currentStartCenter()])
    setLocationStatus(mapMode === 'real' ? '已回到现实地图中心位置' : '已回到地图中心位置')
  }

  const handleNavClick = (index) => {
    const wasActive = activeNav === index
    setActiveNav(index)
    setPanelExpanded(false)
    setActivePanelDetail(null)
    if (navItems[index].id === 'go') {
      if (!wasActive) return
      if (isWalking) {
        pauseWalk()
      } else if (hasRouteDraft) {
        resumeWalk()
      } else {
        startWalk()
      }
    }
  }

  const handleSideAction = (action) => {
    if (activeSide?.id === action.id) {
      setActiveSide(null)
      return
    }
    setActiveSide(action)
    if (facilityGroups[action.id]) {
      setVisibleFacilityType(action.id)
      setGuideMode(false)
      setSideNotice(`${action.label} 已显示在地图上`)
    } else if (action.id === 'route') {
      setGuideMode(true)
      setVisibleFacilityType('water')
      setSideNotice('路线指引已开启')
    } else if (action.id === 'sign') {
      setSideNotice('签到成功，骨头币 +10')
    } else {
      setSideNotice(`${action.label} 已打开`)
    }
    window.setTimeout(() => setSideNotice(''), 2200)
  }

  const sideActionConfirm = () => {
    if (!activeSide) return
    if (activeSide.id === 'sign') {
      setSideNotice('签到完成，骨头币 +10')
    } else if (facilityGroups[activeSide.id]) {
      setGuideMode(true)
      setSideNotice(`${activeSide.label} 导航已开启`)
    } else {
      setSideNotice(`${activeSide.label} 已确认`)
    }
    setActiveSide(null)
    window.setTimeout(() => setSideNotice(''), 2200)
  }

  const navigateToFacility = (place) => {
    setGuideMode(true)
    setVisibleFacilityType(place.type)
    setPath(prev => [...prev, mapMode === 'real' ? place.realPosition : place.position])
    setSideNotice(`正在导航到 ${place.label}`)
    window.setTimeout(() => setSideNotice(''), 2200)
  }

  const sendMessage = () => {
    const text = message.trim()
    if (!text) return
    setSelfBubble(text)
    setMessage('')
    window.setTimeout(() => setSelfBubble(''), 5000)
  }

  const handleDragEnd = (event) => {
    if (dragStartX.current === null) return
    const delta = event.clientX - dragStartX.current
    dragStartX.current = null
    if (Math.abs(delta) < 28) return
    rotateNav(delta < 0 ? 1 : -1)
  }

  return (
    <div className={`new-experience ${activePage !== 'go' ? 'is-panel-mode' : ''}`}>
      {mapMode === 'pixel' ? (
      <MapContainer
        key="pixel-map"
        crs={L.CRS.Simple}
        center={START_CENTER}
        zoom={PIXEL_INITIAL_ZOOM}
        minZoom={PIXEL_MIN_ZOOM}
        maxZoom={6}
        zoomSnap={0.25}
        zoomDelta={0.5}
        zoomControl
        zoomAnimation={false}
        fadeAnimation={false}
        style={{ height: '100dvh', minHeight: '100vh', width: '100%' }}
        scrollWheelZoom
        doubleClickZoom
        attributionControl={false}
      >
        <MapResizer />
        <MapZoomTracker onZoom={setZoomLevel} />
        <MapFollower center={currentCenter} />
        <ImageOverlay url={mapAsset('ditu-large.jpg')} bounds={IMAGE_BOUNDS} />
        {guideMode && <Polyline positions={mapMode === 'real' ? routeGuidePathReal : routeGuidePath} color="#f4a244" weight={7} opacity={0.86} dashArray="14 10" />}
        <Polyline positions={displayPath} color="#5B4636" weight={6} opacity={0.85} />
        <Marker key={`self-${isWalking ? 'walk' : 'idle'}-${selfMarkerScale.toFixed(2)}`} position={currentCenter} icon={createSelfIcon(selfBubble, isWalking, selfMarkerScale)}>
          <Popup>我的宠物</Popup>
        </Marker>
        {walkers.map((walker) => {
          const visible = visibleWalkerIds.includes(walker.id)
          return (
            <Marker
              key={`${walker.id}-${mode}-${visible}`}
              position={mapMode === 'real' ? walker.realPosition : walker.position}
              icon={createPixelIcon(walker, !visible, visible ? walkerBubbles[walker.id] : '', markerScale)}
              eventHandlers={{
                click: () => {
                  setWalkerBubbles(prev => ({ ...prev, [walker.id]: prev[walker.id] ? '' : walker.bubble }))
                }
              }}
            >
              <Popup>{walker.name} · {walker.pet}</Popup>
            </Marker>
          )
        })}
        {visibleFacilities.map((place) => (
          <Marker
            key={place.id}
            position={mapMode === 'real' ? place.realPosition : place.position}
            icon={createFacilityIcon(place, markerScale)}
            eventHandlers={{ click: () => navigateToFacility(place) }}
          />
        ))}
      </MapContainer>
      ) : (
      <MapContainer
        key="real-map"
        center={START_CENTER_REAL}
        zoom={REAL_INITIAL_ZOOM}
        minZoom={12}
        maxZoom={19}
        zoomSnap={0.25}
        zoomDelta={0.5}
        zoomControl
        zoomAnimation={false}
        fadeAnimation={false}
        style={{ height: '100dvh', minHeight: '100vh', width: '100%' }}
        scrollWheelZoom
        doubleClickZoom
        attributionControl={false}
      >
        <MapResizer />
        <MapZoomTracker onZoom={setZoomLevel} />
        <MapFollower center={currentCenter} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {guideMode && <Polyline positions={routeGuidePathReal} color="#f4a244" weight={7} opacity={0.86} dashArray="14 10" />}
        <Polyline positions={displayPath} color="#5B4636" weight={6} opacity={0.85} />
        <Marker key={`self-real-${isWalking ? 'walk' : 'idle'}-${selfMarkerScale.toFixed(2)}`} position={currentCenter} icon={createSelfIcon(selfBubble, isWalking, selfMarkerScale)}>
          <Popup>我的宠物</Popup>
        </Marker>
        {walkers.map((walker) => {
          const visible = visibleWalkerIds.includes(walker.id)
          return (
            <Marker
              key={`real-${walker.id}-${mode}-${visible}`}
              position={walker.realPosition}
              icon={createPixelIcon(walker, !visible, visible ? walkerBubbles[walker.id] : '', markerScale)}
              eventHandlers={{
                click: () => {
                  setWalkerBubbles(prev => ({ ...prev, [walker.id]: prev[walker.id] ? '' : walker.bubble }))
                }
              }}
            />
          )
        })}
        {visibleFacilities.map((place) => (
          <Marker
            key={`real-${place.id}`}
            position={place.realPosition}
            icon={createFacilityIcon(place, markerScale)}
            eventHandlers={{ click: () => navigateToFacility(place) }}
          />
        ))}
      </MapContainer>
      )}

      <div className="new-map-overlay" />

      {activePage === 'go' && <header className="new-top-panel">
        <div className="new-top-actions">
          <button className="new-back-button" onClick={onBack}>旧版</button>
          <button
            className={`new-map-mode-button ${mapMode === 'real' ? 'real' : ''}`}
            onClick={() => setMapMode(value => value === 'pixel' ? 'real' : 'pixel')}
          >
            {mapMode === 'real' ? '像素地图' : '现实地图'}
          </button>
        </div>
        <section className="player-card">
          <div className="player-avatar">
            <span className="pixel-dog-face"><i></i></span>
          </div>
          <div className="player-info">
            <strong>遛遛达人</strong>
            <div className="level-line"><span>☆</span><b>LV.12</b></div>
            <div className="energy-bar"><i style={{ width: '100%' }}></i><em>30/30</em></div>
          </div>
        </section>
        <div className="new-mode-switch">
          {Object.entries(modeMeta).map(([key, item]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={mode === key ? 'active' : ''}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p>{modeMeta[mode].hint}</p>
      </header>}

      {activePage === 'go' && <section className="map-status-card">
        <strong>{isWalking ? '记录中' : '准备出发'}</strong>
        <span>{displayTime} · {routeDistance}km</span>
        <em>{locationStatus}</em>
      </section>}

      {activePage === 'go' && <button className="locate-button" onClick={locateMe}>回中心</button>}

      {activePage === 'go' && <aside className="new-side-actions">
        {sideActions.map((action) => (
          <button key={action.id} onClick={() => handleSideAction(action)}>
            <span dangerouslySetInnerHTML={{ __html: pixelIcon(action.icon) }} />
            <b>{action.label}</b>
          </button>
        ))}
      </aside>}

      {sideNotice && <div className="side-notice">{sideNotice}</div>}

      {activePage === 'go' && activeSide && (
        <section className="side-action-panel">
          <button className="side-panel-close" onClick={() => setActiveSide(null)}>×</button>
          <h2>{sidePanelContent[activeSide.id]?.title ?? activeSide.label}</h2>
          {sidePanelContent[activeSide.id]?.rows.map((item) => (
            <p key={item}>{item}</p>
          ))}
          <button
            className="side-primary-action"
            onClick={sideActionConfirm}
          >
            {sidePanelContent[activeSide.id]?.action ?? '确认'}
          </button>
        </section>
      )}

      <div className={`new-portal-fx ${modeFx}`} />

      {activePage === 'go' && (
        <section className="new-message-panel">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') sendMessage()
            }}
            placeholder="对附近宠友说点什么..."
          />
          <button onClick={sendMessage}>发送</button>
        </section>
      )}

      {showPublishSheet && (
        <section className="route-publish-sheet" role="dialog" aria-label="发布遛宠路线">
          <button className="sheet-close" onClick={cancelPublish}>×</button>
          <span className="panel-handle" />
          <h2>遛宠完成！</h2>
          <p>本次遛宠 {routeDistance}km，耗时 {displayTime}</p>
          <button className="photo-uploader">
            <span dangerouslySetInnerHTML={{ __html: pixelIcon('camera') }} />
            添加照片
          </button>
          <label>
            分享文字
            <textarea value={shareText} onChange={(event) => setShareText(event.target.value)} />
          </label>
          <div className="route-upload-row">
            <span>同时上传为路线分享</span>
            <b>已开启</b>
          </div>
          <div className="publish-actions">
            <button onClick={cancelPublish}>取消发布</button>
            <button onClick={publishRoute}>确认发布</button>
          </div>
        </section>
      )}

      <section
        className="new-loop-nav"
        onPointerDown={(event) => { dragStartX.current = event.clientX }}
        onPointerUp={handleDragEnd}
        onPointerCancel={() => { dragStartX.current = null }}
      >
        <div className="new-loop-track">
          {navItems.map((item, index) => {
            const offset = navOffset(index)
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(index)}
                className={`new-loop-item offset-${offset} ${offset === 0 ? 'active' : ''} ${item.id === 'go' ? 'go' : ''} ${item.id === 'go' && (isWalking || hasRouteDraft) ? 'route-active' : ''}`}
                style={{
                  '--x': `${offset * 86}px`,
                  '--scale': 1 - Math.abs(offset) * 0.14,
                  '--alpha': 1 - Math.abs(offset) * 0.16
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: pixelIcon(item.icon) }} />
                <b>{item.id === 'go' && isWalking ? displayTime : item.label}</b>
                {item.id === 'go' && activePage === 'go' && (isWalking || hasRouteDraft) && !showPublishSheet && (
                  <span className="go-liquid-actions">
                    <span
                      role="button"
                      tabIndex={0}
                      className="go-action continue"
                      onClick={(event) => {
                        event.stopPropagation()
                        if (isWalking) {
                          pauseWalk()
                        } else {
                          resumeWalk()
                        }
                      }}
                    >
                      {isWalking ? '暂停' : '继续'}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      className="go-action finish"
                      onClick={(event) => {
                        event.stopPropagation()
                        finishWalk()
                      }}
                    >
                      结束并上传
                    </span>
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {activePage !== 'go' && (
        <section className={`new-page-panel ${panelExpanded ? 'expanded' : ''}`}>
          <button
            className="panel-handle"
            onClick={() => setPanelExpanded(value => !value)}
            aria-label={panelExpanded ? '收起面板' : '展开面板'}
          />
          {activePanelDetail ? (
            <article className="panel-detail-card">
              <button className="panel-back" onClick={() => setActivePanelDetail(null)}>返回</button>
              <span className="panel-card-art" dangerouslySetInnerHTML={{ __html: pixelIcon(activePanelDetail.art) }} />
              <i>{activePanelDetail.tag}</i>
              <h2>{activePanelDetail.title}</h2>
              <p>{activePanelDetail.meta}</p>
              <div className="panel-detail-actions">
                <button>收藏</button>
                <button>立即查看</button>
              </div>
            </article>
          ) : (
            <>
              <div className="panel-hero">
                <span className="panel-card-art" dangerouslySetInnerHTML={{ __html: pixelIcon(panelContent[activePage]?.cards[0].art) }} />
                <div>
                  <em>{panelContent[activePage]?.hero}</em>
                  <h2>{panelContent[activePage]?.title}</h2>
                  <p>{panelContent[activePage]?.subtitle}</p>
                </div>
              </div>
              <div className="panel-card-grid">
                {panelContent[activePage]?.cards.map((card) => (
                  <button key={card.title} onClick={() => setActivePanelDetail(card)}>
                    <span className="panel-card-art" dangerouslySetInnerHTML={{ __html: pixelIcon(card.art) }} />
                    <i>{card.tag}</i>
                    <strong>{card.title}</strong>
                    <small>{card.meta}</small>
                  </button>
                ))}
              </div>
              <div className="panel-extra">
                <p>地图会留在后面，点横杠可以收起或展开内容面板。</p>
                <button onClick={() => setPanelExpanded(true)}>展开更多内容</button>
                <button onClick={() => setActiveNav(2)}>回到 GO 地图</button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  )
}
