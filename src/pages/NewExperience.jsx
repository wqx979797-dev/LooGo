import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
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
    visible: ['p1', 'p2', 'p3', 'p4']
  },
  buddy: {
    label: '搭子',
    hint: '只显示已建立搭子关系的人',
    visible: ['p1', 'p3']
  }
}

const navItems = [
  { id: 'shop', label: '商城', icon: 'shop' },
  { id: 'community', label: '社区', icon: 'people' },
  { id: 'go', label: 'GO', icon: 'go' },
  { id: 'message', label: '消息', icon: 'chat' },
  { id: 'mine', label: '我的', icon: 'dog' }
]

const walkers = [
  { id: 'p1', name: 'Momo', pet: '比熊', role: 'girl', dog: 'orange', position: [40.0129, 116.4575], bubble: '慢走中～' },
  { id: 'p2', name: 'Seven', pet: '柴犬', role: 'boy', dog: 'brown', position: [40.014, 116.4591], bubble: '求搭子!' },
  { id: 'p3', name: 'Luna', pet: '边牧', role: 'girl green', dog: 'black', position: [40.0114, 116.4558], bubble: '草坪见' },
  { id: 'p4', name: '奶盖', pet: '柯基', role: 'boy blue', dog: 'orange', position: [40.0134, 116.4547], bubble: '代遛结束' }
]

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
    title: '像素商城',
    rows: ['能量骨头 x3', '夜遛反光绳', '宠物水壶补给包']
  },
  community: {
    title: '附近社区',
    rows: ['Momo 发布了新路线', 'Seven 正在寻找搭子', 'Luna 分享了补水点']
  },
  message: {
    title: '消息',
    rows: ['Momo：今晚慢走吗？', '系统：你有 2 个搭子邀请', 'Luna：草坪集合～']
  },
  mine: {
    title: '我的档案',
    rows: ['遛遛达人 Lv.12', '今日体力 30/30', '已公开位置：开启']
  }
}

const mapLabels = [
  { text: '朝阳千渠', type: 'river', x: 18, y: 36 },
  { text: '幽静湖', type: 'lake', x: 20, y: 22 },
  { text: '五里桥郊野公园', type: 'park', x: 76, y: 42 },
  { text: '高尔夫花园', type: 'home', x: 10, y: 58 },
  { text: '保利·嘉园', type: 'home', x: 38, y: 66 },
  { text: '首都医科大学附属北京朝阳医院', type: 'hospital', x: 20, y: 82 }
]

const treeDots = [
  [8, 18], [13, 21], [18, 16], [27, 12], [34, 20], [61, 12], [80, 10],
  [9, 43], [17, 47], [29, 45], [67, 48], [74, 50], [88, 44],
  [7, 74], [15, 70], [56, 77], [68, 73], [88, 78]
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

const pixelIcon = (type) => `<span class="game-icon ${type}"><i></i></span>`

const pixelAvatar = (role = 'boy', dog = 'orange') => `
  <span class="pixel-party">
    <span class="pixel-human ${role}">
      <i class="head"></i><i class="body"></i><i class="leg l"></i><i class="leg r"></i>
    </span>
    <span class="pixel-dog ${dog}">
      <i class="ear"></i><i class="body"></i><i class="tail"></i><i class="leg a"></i><i class="leg b"></i>
    </span>
  </span>
`

const createPixelIcon = (walker, hidden = false, bubble = '') => L.divIcon({
  className: `new-pixel-marker ${hidden ? 'is-hidden' : 'is-visible'}`,
  html: `
    <span class="new-pixel-bubble ${bubble ? 'show' : ''}">${bubble}</span>
    ${pixelAvatar(walker.role, walker.dog)}
    <span class="new-pixel-name">${walker.name}</span>
  `,
  iconSize: [100, 92],
  iconAnchor: [50, 64],
  popupAnchor: [0, -54]
})

const createSelfIcon = (bubble = '') => L.divIcon({
  className: 'new-pixel-marker self',
  html: `
    <span class="new-pixel-bubble ${bubble ? 'show' : ''}">${bubble}</span>
    ${pixelAvatar('boy blue self', 'orange self')}
    <span class="new-pixel-name">我</span>
  `,
  iconSize: [108, 94],
  iconAnchor: [54, 66],
  popupAnchor: [0, -56]
})

export default function NewExperience({ onBack }) {
  const [mode, setMode] = useState('loogo')
  const [modeFx, setModeFx] = useState('summon')
  const [activeNav, setActiveNav] = useState(2)
  const [isWalking, setIsWalking] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [path, setPath] = useState([[40.0123, 116.4567]])
  const [message, setMessage] = useState('')
  const [selfBubble, setSelfBubble] = useState('')
  const [walkerBubbles, setWalkerBubbles] = useState(() => Object.fromEntries(walkers.map(w => [w.id, w.bubble])))
  const [sideNotice, setSideNotice] = useState('')
  const dragStartX = useRef(null)

  const visibleWalkerIds = modeMeta[mode].visible
  const currentCenter = path[path.length - 1]
  const activePage = navItems[activeNav].id

  useEffect(() => {
    if (!isWalking) return
    const timer = window.setInterval(() => {
      setSeconds(value => value + 1)
      setPath(prev => {
        const last = prev[prev.length - 1]
        const next = [
          last[0] + (Math.random() - 0.42) * 0.00016,
          last[1] + (Math.random() - 0.45) * 0.00016
        ]
        return [...prev, next]
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [isWalking])

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

  const handleNavClick = (index) => {
    setActiveNav(index)
    if (navItems[index].id === 'go') {
      setIsWalking(prev => !prev)
    }
  }

  const handleSideAction = (action) => {
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
        center={currentCenter}
        zoom={15}
        style={{ height: '100dvh', minHeight: '100vh', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <MapResizer />
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="pixel-map-tiles"
        />
        <Polyline positions={path} color="#5B4636" weight={5} opacity={0.8} dashArray="8 8" />
        <Marker position={currentCenter} icon={createSelfIcon(selfBubble)}>
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

      <div className="game-map-skin">
        <div className="pixel-lake" />
        <div className="pixel-river river-a" />
        <div className="pixel-river river-b" />
        {treeDots.map(([x, y], index) => (
          <span key={`${x}-${y}-${index}`} className="pixel-tree" style={{ left: `${x}%`, top: `${y}%` }} />
        ))}
        {mapLabels.map((label) => (
          <span key={label.text} className={`game-map-label ${label.type}`} style={{ left: `${label.x}%`, top: `${label.y}%` }}>
            {label.text}
          </span>
        ))}
      </div>

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

      <aside className="new-side-actions">
        {sideActions.map((action) => (
          <button key={action.id} onClick={() => handleSideAction(action)}>
            <span dangerouslySetInnerHTML={{ __html: pixelIcon(action.icon) }} />
            <b>{action.label}</b>
          </button>
        ))}
      </aside>

      {sideNotice && <div className="side-notice">{sideNotice}</div>}

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
