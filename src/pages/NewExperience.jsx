import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
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
  { id: 'shop', label: '商城', icon: '▦' },
  { id: 'community', label: '社区', icon: '◍' },
  { id: 'go', label: 'GO', icon: '▶' },
  { id: 'clinic', label: '就诊', icon: '✚' },
  { id: 'mine', label: '我的', icon: '♙' }
]

const walkers = [
  { id: 'p1', name: 'Momo', pet: '比熊', avatar: '🐶', position: [40.0129, 116.4575], bubble: '慢走中～' },
  { id: 'p2', name: 'Seven', pet: '柴犬', avatar: '🦊', position: [40.014, 116.4591], bubble: '求搭子!' },
  { id: 'p3', name: 'Luna', pet: '边牧', avatar: '🐾', position: [40.0114, 116.4558], bubble: '草坪见' },
  { id: 'p4', name: '奶盖', pet: '猫猫', avatar: '🐱', position: [40.0134, 116.4547], bubble: '代遛结束' }
]

const createPixelIcon = (avatar, name, hidden = false, bubble = '') => L.divIcon({
  className: `new-pixel-marker ${hidden ? 'is-hidden' : 'is-visible'}`,
  html: `
    <span class="new-pixel-bubble ${bubble ? 'show' : ''}">${bubble}</span>
    <span class="new-pixel-pet">${avatar}</span>
    <span class="new-pixel-name">${name}</span>
  `,
  iconSize: [74, 76],
  iconAnchor: [37, 54],
  popupAnchor: [0, -54]
})

const createSelfIcon = (bubble = '') => L.divIcon({
  className: 'new-pixel-marker self',
  html: `
    <span class="new-pixel-bubble ${bubble ? 'show' : ''}">${bubble}</span>
    <span class="new-pixel-pet self-pet">🐕</span>
    <span class="new-pixel-name">我</span>
  `,
  iconSize: [78, 78],
  iconAnchor: [39, 56],
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
  const dragStartX = useRef(null)

  const visibleWalkerIds = modeMeta[mode].visible
  const currentCenter = path[path.length - 1]

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
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
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
              icon={createPixelIcon(walker.avatar, walker.name, !visible, visible ? walkerBubbles[walker.id] : '')}
            >
              <Popup>{walker.name} · {walker.pet}</Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <div className="new-map-overlay" />

      <header className="new-top-panel">
        <button className="new-back-button" onClick={onBack}>旧版</button>
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

      <div className={`new-portal-fx ${modeFx}`} />

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
                <span>{item.icon}</span>
                <b>{item.id === 'go' && isWalking ? displayTime : item.label}</b>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
