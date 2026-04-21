export const currentUser = {
  id: 'user1',
  name: '小明',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming',
  bio: '柯基爱好者，每天遛宠两小时🐕',
  location: { city: '北京市', district: '朝阳区' },
  pets: [
    { id: 'pet1', name: '豆豆', breed: '柯基', age: 3, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=corgi' },
    { id: 'pet2', name: '小白', breed: '萨摩耶', age: 2, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=samoyed' }
  ],
  stats: { totalWalks: 156, totalDistance: 328.5, checkinDays: 45 }
}

export const routes = [
  {
    id: 'route1',
    title: '朝阳公园遛宠精华路线',
    description: '环湖一周，风景优美，草坪开阔，适合各类宠物奔跑撒欢',
    coverImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    creator: { id: 'user2', name: '宠物达人小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang' },
    city: '北京市',
    distance: 3.5,
    duration: 45,
    difficulty: '简单',
    pathCoordinates: [
      [40.0123, 116.4567],
      [40.0130, 116.4580],
      [40.0145, 116.4590],
      [40.0150, 116.4575],
      [40.0138, 116.4560]
    ],
    likes: 328,
    comments: 56,
    saves: 89,
    tags: ['公园', '环湖', '草坪', '免费'],
    createdAt: '2024-01-15'
  },
  {
    id: 'route2',
    title: '奥森公园宠物友好路线',
    description: '专业遛宠区域，有专门的爱宠乐园，设施完善',
    coverImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
    creator: { id: 'user3', name: '遛宠教练阿杰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jie' },
    city: '北京市',
    distance: 5.2,
    duration: 65,
    difficulty: '中等',
    pathCoordinates: [
      [40.0250, 116.4030],
      [40.0260, 116.4050],
      [40.0275, 116.4060],
      [40.0280, 116.4040],
      [40.0265, 116.4025]
    ],
    likes: 512,
    comments: 89,
    saves: 156,
    tags: ['公园', '宠物乐园', '塑胶跑道'],
    createdAt: '2024-01-12'
  },
  {
    id: 'route3',
    title: '胡同里的小众遛宠路线',
    description: '老北京胡同深度游，人少安静，偶遇其他萌宠几率高',
    coverImage: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80',
    creator: { id: 'user4', name: '胡同遛宠达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hutong' },
    city: '北京市',
    distance: 2.8,
    duration: 35,
    difficulty: '简单',
    pathCoordinates: [
      [39.9350, 116.4030],
      [39.9355, 116.4045],
      [39.9365, 116.4050],
      [39.9360, 116.4035],
      [39.9348, 116.4028]
    ],
    likes: 189,
    comments: 34,
    saves: 45,
    tags: ['胡同', '人少', '老北京', '偶遇萌宠'],
    createdAt: '2024-01-10'
  },
  {
    id: 'route4',
    title: '温榆河畔宠物亲水路线',
    description: '滨河绿道，夏日玩水圣地，但要注意安全哦',
    coverImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',
    creator: { id: 'user5', name: '亲水遛宠俱乐部', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=river' },
    city: '北京市',
    distance: 4.1,
    duration: 55,
    difficulty: '中等',
    pathCoordinates: [
      [40.0650, 116.5430],
      [40.0660, 116.5450],
      [40.0675, 116.5460],
      [40.0680, 116.5440],
      [40.0665, 116.5425]
    ],
    likes: 423,
    comments: 67,
    saves: 112,
    tags: ['河边', '亲水', '绿道', '夏日必去'],
    createdAt: '2024-01-08'
  },
  {
    id: 'route5',
    title: '郊区农场宠物撒欢路线',
    description: '超大农场，宠物可以自由奔跑，体验田园生活',
    coverImage: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80',
    creator: { id: 'user6', name: '农场主老张', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=farm' },
    city: '北京市',
    distance: 6.8,
    duration: 90,
    difficulty: '较难',
    pathCoordinates: [
      [40.1250, 116.6030],
      [40.1260, 116.6050],
      [40.1275, 116.6060],
      [40.1280, 116.6040],
      [40.1265, 116.6025]
    ],
    likes: 298,
    comments: 45,
    saves: 78,
    tags: ['农场', '郊区', '自由奔跑', '田园'],
    createdAt: '2024-01-05'
  }
]

export const checkins = [
  { id: 'check1', userId: 'user1', routeId: 'route1', date: '2024-01-20', duration: 50, distance: 3.8 },
  { id: 'check2', userId: 'user1', routeId: 'route2', date: '2024-01-19', duration: 65, distance: 5.0 },
  { id: 'check3', userId: 'user1', routeId: 'route1', date: '2024-01-18', duration: 45, distance: 3.2 },
  { id: 'check4', userId: 'user1', routeId: 'route3', date: '2024-01-17', duration: 38, distance: 2.5 },
  { id: 'check5', userId: 'user1', routeId: 'route2', date: '2024-01-16', duration: 70, distance: 5.5 },
  { id: 'check6', userId: 'user1', routeId: 'route1', date: '2024-01-15', duration: 52, distance: 3.6 },
  { id: 'check7', userId: 'user1', routeId: 'route4', date: '2024-01-14', duration: 58, distance: 4.2 },
  { id: 'check8', userId: 'user1', routeId: 'route1', date: '2024-01-13', duration: 48, distance: 3.4 }
]

export const services = [
  {
    id: 'svc5',
    title: '临时代遛服务',
    description: '加班、雨天、临时出门不方便？认证遛宠师上门接宠，记录完整遛宠轨迹并回传照片',
    price: 39,
    provider: { id: 'prov5', name: 'LooGo 代遛小队', rating: 4.9, avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=prov5' },
    type: 'walk',
    duration: 30,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80'
  },
  {
    id: 'svc1',
    title: '专业宠物洗澡美容',
    description: '包括洗澡、吹干、修剪指甲、清理耳道等专业服务',
    price: 120,
    provider: { id: 'prov1', name: '萌爪宠物工作室', rating: 4.9, avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=prov1' },
    type: 'bath',
    duration: 60,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&q=80'
  },
  {
    id: 'svc2',
    title: '上门喂养服务',
    description: '出差、旅游不在家？我们来照顾您的小可爱',
    price: 80,
    provider: { id: 'prov2', name: '宠伴上门服务', rating: 4.8, avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=prov2' },
    type: 'feed',
    duration: 30,
    image: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=400&q=80'
  },
  {
    id: 'svc3',
    title: '宠物寄养托管',
    description: '安全舒适的寄养环境，每日更新宠物状态',
    price: 150,
    provider: { id: 'prov3', name: '爱宠之家寄养中心', rating: 4.7, avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=prov3' },
    type: 'boarding',
    duration: 1440,
    image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=400&q=80'
  },
  {
    id: 'svc4',
    title: '宠物医疗预约',
    description: '合作正规宠物医院，疫苗、体检、常见病诊疗',
    price: 0,
    provider: { id: 'prov4', name: '爱心宠物医院', rating: 4.6, avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=prov4' },
    type: 'medical',
    duration: 60,
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&q=80'
  }
]

export const posts = [
  {
    id: 'post1',
    user: { id: 'user2', name: '宠物达人小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang' },
    content: '今天的朝阳公园遛宠太开心了！豆包交到了新朋友🐕‍🦺',
    images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80'],
    likes: 89,
    comments: 23,
    createdAt: '2小时前'
  },
  {
    id: 'post2',
    user: { id: 'user3', name: '遛宠教练阿杰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jie' },
    content: '训练成果展示：豆豆已经学会坐下和握手了！🎉',
    images: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80'],
    likes: 156,
    comments: 45,
    createdAt: '5小时前'
  },
  {
    id: 'post3',
    user: { id: 'user4', name: '胡同遛宠达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hutong' },
    content: '胡同里偶遇一只超可爱的柯基！有没有人认识它？',
    images: ['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&q=80'],
    likes: 234,
    comments: 67,
    createdAt: '昨天'
  }
]

export const achievements = [
  { id: 'ach1', name: '初次打卡', description: '完成第一次遛宠打卡', icon: '🎯', progress: 1, target: 1 },
  { id: 'ach2', name: '连续7天', description: '连续遛宠打卡7天', icon: '🔥', progress: 7, target: 7 },
  { id: 'ach3', name: '千里之行', description: '累计遛宠距离超过100公里', icon: '🛣️', progress: 328.5, target: 100 },
  { id: 'ach4', name: '社交达人', description: '评论超过50次', icon: '💬', progress: 45, target: 50 },
  { id: 'ach5', name: '路线收藏家', description: '收藏路线超过20条', icon: '⭐', progress: 12, target: 20 }
]
