import { useEffect, useMemo, useRef, useState } from 'react'
import { ImageOverlay, MapContainer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
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
    visible: ['p1', 'p2', 'p3', 'p4', 'p5']
  },
  buddy: {
    label: '搭子',
    hint: '只显示已建立搭子关系的人',
    visible: ['p1', 'p3', 'p5']
  }
}

const navItems = [
  { id: 'shop', label: '商城', icon: 'shop' },
  { id: 'community', label: '社区', icon: 'people' },
  { id: 'go', label: 'GO', icon: 'go' },
  { id: 'clinic', label: '就诊', icon: 'hospital' },
  { id: 'mine', label: '我的', icon: 'dog' }
]

const MAP_WIDTH = 4000
const MAP_HEIGHT = 2988
const IMAGE_BOUNDS = [[0, 0], [MAP_HEIGHT, MAP_WIDTH]]

const toImagePoint = (xPercent, yPercent) => [MAP_HEIGHT * yPercent, MAP_WIDTH * xPercent]

const walkers = [
  { id: 'p1', name: 'Momo', pet: '橘猫', asset: '1_marker_90f.gif', position: toImagePoint(0.53, 0.44), bubble: '慢走中～' },
  { id: 'p2', name: 'Seven', pet: '橘猫', asset: '2_marker_90f.gif', position: toImagePoint(0.58, 0.53), bubble: '求搭子!' },
  { id: 'p3', name: 'Luna', pet: '柯基', asset: '3_marker_90f.gif', position: toImagePoint(0.43, 0.62), bubble: '草坪见' },
  { id: 'p4', name: '奶盖', pet: '萨摩耶', asset: '4_marker_90f.gif', position: toImagePoint(0.61, 0.71), bubble: '代遛结束' },
  { id: 'p5', name: '阿布', pet: '柯基', asset: '6_marker_90f.gif', position: toImagePoint(0.47, 0.36), bubble: '休息中' }
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
    rows: ['补水随行杯 · 今日推荐', '夜遛反光牵引绳 · 附近有货', '能量零食包 · 可用 120 骨头币抵扣']
  },
  community: {
    title: '同城社区',
    rows: ['Momo 分享了朝阳公园慢走线', 'Seven 正在找 19:30 柴犬搭子', 'Luna 标记了一个干净补水点']
  },
  clinic: {
    title: '就诊服务',
    rows: ['附近医院：首都医科大学附属北京朝阳医院', '可预约：疫苗 / 体检 / 皮肤科', '紧急导航：一键生成宠物友好路线']
  },
  mine: {
    title: '我的档案',
    rows: ['遛遛达人 Lv.12 · 今日体力 30/30', '本月遛宠 8 次 · 累计 12.6km', '位置公开：随模式自动切换']
  }
}

const sidePanelContent = {
  sign: ['今日签到 +10 骨头币', '连续签到第 5 天', '明天可领取补水券'],
  route: ['附近推荐：湖边放电路线', '已收藏：朝阳公园慢走线', '上传路线：记录结束后可发布'],
  task: ['今日任务：遛宠 20 分钟', '社交任务：发送 1 条地图消息', '探索任务：标记 1 个补水点'],
  water: ['最近补水点 180m', '宠友确认：水源干净', '可一键导航前往'],
  poop: ['最近排泄点 260m', '含垃圾桶与纸巾提醒', '可标记新的清洁点'],
  hospital: ['最近医院 1.2km', '营业中 · 可电话预约', '支持紧急路线导航'],
  toilet: ['最近卫生间 320m', '位于公园东门旁', '宠物可临时等候区']
}

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
    map.flyTo(center, map.getZoom(), {
      animate: true,
      duration: 0.55
    })
  }, [center, map])

  return null
}

const pixelIcon = (type) => `<span class="game-icon ${type}"><i></i></span>`

const characterAsset = (fileName) => `${import.meta.env.BASE_URL}characters/${fileName}`

const createPixelIcon = (walker, hidden = false, bubble = '') => L.divIcon({
  className: `new-pixel-marker ${hidden ? 'is-hidden' : 'is-visible'}`,
  html: `
    <span class="new-pixel-bubble ${bubble ? 'show' : ''}">${bubble}</span>
    <img class="new-character-sprite" src="${characterAsset(walker.asset)}" alt="${walker.name}" />
    <span class="new-pixel-name">${walker.name}</span>
  `,
  iconSize: [132, 132],
  iconAnchor: [66, 116],
  popupAnchor: [0, -96]
})

const createSelfIcon = (bubble = '', isWalking = false) => L.divIcon({
  className: 'new-pixel-marker self',
  html: `
    <span class="new-pixel-bubble ${bubble ? 'show' : ''}">${bubble}</span>
    <img class="new-character-sprite self" src="${characterAsset(isWalking ? '5.1_marker_90f.gif' : '5_marker_90f.gif')}" alt="我" />
    <span class="new-pixel-name">我</span>
  `,
  iconSize: [140, 140],
  iconAnchor: [70, 124],
  popupAnchor: [0, -104]
})

export default function NewExperience({ onBack }) {
  const [mode, setMode] = useState('loogo')
  const [modeFx, setModeFx] = useState('summon')
  const [activeNav, setActiveNav] = useState(2)
  const [isWalking, setIsWalking] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [path, setPath] = useState([START_CENTER])
  const [message, setMessage] = useState('')
  const [selfBubble, setSelfBubble] = useState('')
  const [walkerBubbles, setWalkerBubbles] = useState(() => Object.fromEntries(walkers.map(w => [w.id, w.bubble])))
  const [sideNotice, setSideNotice] = useState('')
  const [activeSide, setActiveSide] = useState(null)
  const [locationStatus, setLocationStatus] = useState('点击 GO 后开始获取定位')
  const dragStartX = useRef(null)
  const watchId = useRef(null)
  const demoTimer = useRef(null)

  const visibleWalkerIds = modeMeta[mode].visible
  const currentCenter = path[path.length - 1]
  const activePage = navItems[activeNav].id

  const clearTracking = () => {
    watchId.current = null
    if (demoTimer.current !== null) {
      window.clearInterval(demoTimer.current)
      demoTimer.current = null
    }
  }

  const startDemoTracking = () => {
    setLocationStatus('定位不可用，正在使用平滑演示轨迹')
    demoTimer.current = window.setInterval(() => {
      setSeconds(value => value + 1)
      setPath(prev => {
        const last = prev[prev.length - 1]
        const next = [
          last[0] + (Math.random() - 0.42) * 3.2,
          last[1] + (Math.random() - 0.44) * 3.2
        ]
        const clamped = [
          Math.max(8, Math.min(MAP_HEIGHT - 8, next[0])),
          Math.max(8, Math.min(MAP_WIDTH - 8, next[1]))
        ]
        return [...prev, clamped]
      })
    }, 1000)
  }

  useEffect(() => () => clearTracking(), [])

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
    setIsWalking(true)
    setSeconds(0)
    setLocationStatus('当前是底图演示模式，已开始记录演示轨迹')
    startDemoTracking()
  }

  const stopWalk = () => {
    clearTracking()
    setIsWalking(false)
    setLocationStatus('路线已暂停，可再次点击 GO 继续记录')
  }

  const locateMe = () => {
    setPath(prev => [...prev, START_CENTER])
    setLocationStatus('已回到地图中心位置')
  }

  const handleNavClick = (index) => {
    setActiveNav(index)
    if (navItems[index].id === 'go') {
      if (isWalking) {
        stopWalk()
      } else {
        startWalk()
      }
    }
  }

  const handleSideAction = (action) => {
    setActiveSide(action)
    setSideNotice(`${action.label} 已打开`)
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
    <div className="new-experience">
      <MapContainer
        crs={L.CRS.Simple}
        center={START_CENTER}
        zoom={1}
        minZoom={0}
        maxZoom={3}
        maxBounds={IMAGE_BOUNDS}
        maxBoundsViscosity={0.92}
        zoomControl
        style={{ height: '100dvh', minHeight: '100vh', width: '100%' }}
        scrollWheelZoom
        doubleClickZoom
        attributionControl={false}
      >
        <MapResizer />
        <MapFollower center={currentCenter} />
        <ImageOverlay url="/maps/zz.png" bounds={IMAGE_BOUNDS} />
        <Polyline positions={path} color="#5B4636" weight={6} opacity={0.85} />
        <Marker position={currentCenter} icon={createSelfIcon(selfBubble, isWalking)}>
          <Popup>我的宠物</Popup>
        </Marker>
        {walkers.map((walker) => {
          const visible = visibleWalkerIds.includes(walker.id)
          return (
            <Marker
              key={`${walker.id}-${mode}-${visible}`}
              position={walker.position}
              icon={createPixelIcon(walker, !visible, visible ? walkerBubbles[walker.id] : '')}
            >
              <Popup>{walker.name} · {walker.pet}</Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <div className="new-map-overlay" />

      <header className="new-top-panel">
        <button className="new-back-button" onClick={onBack}>旧版</button>
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
      </header>

      <section className="map-status-card">
        <strong>{isWalking ? '记录中' : '准备出发'}</strong>
        <span>{displayTime} · {Math.max((path.length - 1) * 0.02, 0).toFixed(2)}km</span>
        <em>{locationStatus}</em>
      </section>

      <button className="locate-button" onClick={locateMe}>回中心</button>

      <aside className="new-side-actions">
        {sideActions.map((action) => (
          <button key={action.id} onClick={() => handleSideAction(action)}>
            <span dangerouslySetInnerHTML={{ __html: pixelIcon(action.icon) }} />
            <b>{action.label}</b>
          </button>
        ))}
      </aside>

      {sideNotice && <div className="side-notice">{sideNotice}</div>}

      {activeSide && (
        <section className="side-action-panel">
          <button onClick={() => setActiveSide(null)}>×</button>
          <h2>{activeSide.label}</h2>
          {sidePanelContent[activeSide.id]?.map((item) => (
            <p key={item}>{item}</p>
          ))}
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
                className={`new-loop-item offset-${offset} ${offset === 0 ? 'active' : ''} ${item.id === 'go' ? 'go' : ''}`}
                style={{
                  '--x': `${offset * 86}px`,
                  '--scale': 1 - Math.abs(offset) * 0.14,
                  '--alpha': 1 - Math.abs(offset) * 0.16
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: pixelIcon(item.icon) }} />
                <b>{item.id === 'go' && isWalking ? displayTime : item.label}</b>
              </button>
            )
          })}
        </div>
      </section>

      {activePage !== 'go' && (
        <section className="new-page-panel">
          <div className="panel-handle" />
          <h2>{panelContent[activePage]?.title}</h2>
          <div className="panel-list">
            {panelContent[activePage]?.rows.map((row) => (
              <button key={row}>{row}</button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
