# 宠伴 - 宠物综合服务平台

## 1. 项目概述

**项目名称**: 宠伴 (PetPal)
**项目类型**: 宠物综合服务Web/APP软件
**核心定位**: 以遛宠路线分享为核心，聚焦养宠人群日常遛宠刚需

## 2. 功能模块

### 2.1 遛宠路线分享 (核心功能)
- 遛宠路线发布与发现
- 路线详情页（距离、时长、难度、适合宠物品类）
- 路线点赞、评论、收藏
- 用户遛宠轨迹记录

### 2.2 遛宠打卡
- 每日遛宠打卡记录
- 打卡日历与统计
- 遛宠成就系统
- 连续打卡挑战

### 2.3 同城宠主互动
- 同城宠主动态Feed
- 宠主社交（关注、点赞、评论）
- 附近遛宠伙伴发现
- 宠主社群/话题

### 2.4 宠物上门服务
- 宠物洗澡、美容预约
- 宠物寄养服务
- 上门喂养服务
- 宠物医疗预约

## 3. 技术栈

- **前端框架**: React + Vite
- **样式方案**: Tailwind CSS
- **路由**: React Router
- **状态管理**: React Context + Hooks
- **图标**: Lucide React
- **地图**: Leaflet (OpenStreetMap)

## 4. 数据模型

### User
```
- id, name, avatar, bio
- location (city, district)
- pets: Pet[]
- stats: { totalWalks, totalDistance, checkinDays }
```

### Pet
```
- id, name, breed, age, avatar
- ownerId
```

### Route
```
- id, title, description, coverImage
- creatorId, city
- distance, duration, difficulty
- pathCoordinates[]
- likes, comments, saves
- tags[]
- createdAt
```

### CheckIn
```
- id, userId, routeId
- date, duration, distance
```

### Service
```
- id, title, description, price
- providerId, type
- rating, reviews
```

## 5. 页面结构

1. **首页** - 遛宠路线推荐Feed
2. **发现** - 探索同城路线、宠主动态
3. **打卡** - 遛宠打卡日历与统计
4. **服务** - 宠物上门服务预约
5. **我的** - 个人中心

## 6. 设计风格

- **主题色**: #FF6B35 (橙色 - 活力、温暖)
- **次要色**: #4ECDC4 (青绿色 - 自然、清新)
- **背景色**: #F8F9FA (浅灰白)
- **文字色**: #2D3436 (深灰)
- **风格**: 温暖、现代、简洁、宠物友好
