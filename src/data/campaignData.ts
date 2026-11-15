import heroBannerImg from '../assets/images/hero_eye_vacation_1794741100003.jpg';
import productSteamMaskImg from '../assets/images/product_steam_mask_1794741100772.jpg';
import productCampusBundleImg from '../assets/images/product_campus_bundle_1794741101605.jpg';
import {
  ActivityMeta,
  BadgeItem,
  CheckInRecord,
  LeaderboardGroup,
  MallReward,
  PomodoroPreset,
  StampSlot,
  StudySession,
} from '../types';

export const HERO_BANNER_IMAGE = heroBannerImg;
export const PRODUCT_WELLNESS_KIT_IMAGE = productSteamMaskImg;
export const PRODUCT_CAMPUS_BUNDLE_IMAGE = productCampusBundleImg;

export const COLLEGES = [
  '计算机科学与技术学院',
  '建筑与设计学院',
  '人文与艺术学院',
  '经济管理学院',
  '生命科学学院',
  '新闻与传播学院',
];

export const STUDENT_CLUBS = [
  '校园摄影社',
  '晨跑与健康协会',
  '开源极客工坊',
  '植物手绘社',
  '思辨辩论社',
  '清茶民谣社',
];

export const POMODORO_PRESETS: PomodoroPreset[] = [
  {
    id: 'focus-25',
    label: '25分钟 标准专注',
    minutes: 25,
    kind: 'focus',
    description: '经典学习节奏，结束后提醒你远眺片刻。',
  },
  {
    id: 'focus-45',
    label: '45分钟 深度自习',
    minutes: 45,
    kind: 'focus',
    description: '适合长篇阅读或编程，定时护眼提示。',
  },
  {
    id: 'focus-15',
    label: '15分钟 轻量冲刺',
    minutes: 15,
    kind: 'focus',
    description: '快速整理笔记或复习卡片的专注单元。',
  },
  {
    id: 'rest-5',
    label: '5分钟 闭目小憩',
    minutes: 5,
    kind: 'rest',
    description: '离开屏幕，轻眨双眼或望向窗外远方。',
  },
];

export const CHECKIN_ACTIVITIES: ActivityMeta[] = [
  {
    type: 'distant_gaze',
    label: '望向远方',
    shortLabel: '远眺',
    leaveHeadline: '远眺假条',
    leaveReason: '暂别屏幕，望向6米外的云朵、树梢与天际线。',
    recommendedMinutes: 5,
    pointsPerSession: 20,
    stampId: 'stamp-horizon',
    description: '凝视远处景物，放松睫状肌紧张。',
  },
  {
    type: 'close_eyes',
    label: '闭眼养神',
    shortLabel: '闭目',
    leaveHeadline: '闭目休养假条',
    leaveReason: '轻闭双眼静坐数分钟，给视神经一段安静的留白。',
    recommendedMinutes: 10,
    pointsPerSession: 25,
    stampId: 'stamp-quiet',
    description: '远离光线刺激，配合深呼吸舒缓眼压。',
  },
  {
    type: 'outdoor_walk',
    label: '户外看绿散步',
    shortLabel: '散步',
    leaveHeadline: '校园绿意假条',
    leaveReason: '走出自习室，在林荫道与自然光下慢慢走一圈。',
    recommendedMinutes: 15,
    pointsPerSession: 35,
    stampId: 'stamp-greenery',
    description: '自然光与柔和绿意有助于缓解视疲劳。',
  },
  {
    type: 'phone_free_meal',
    label: '无手机用餐',
    shortLabel: '无屏用餐',
    leaveHeadline: '专心吃饭假条',
    leaveReason: '把手机放进包里，安安静静享受这一餐。',
    recommendedMinutes: 20,
    pointsPerSession: 30,
    stampId: 'stamp-dining',
    description: '餐桌不刷屏，让眼睛和思绪一起放假。',
  },
  {
    type: 'eye_drops',
    label: '滴护眼液舒缓',
    shortLabel: '滴眼液',
    leaveHeadline: '水润护理假条',
    leaveReason: '暂停阅读，用温和滴眼液为干涩双眼补水。',
    recommendedMinutes: 5,
    pointsPerSession: 15,
    stampId: 'stamp-hydration',
    description: '长时间用眼后及时补充泪膜水分。',
  },
];

export const INITIAL_STAMPS: StampSlot[] = [
  {
    id: 'stamp-greenery',
    slotIndex: 1,
    title: '林荫看绿',
    subtitle: '户外绿意漫步',
    requirement: '完成一次「户外看绿散步」打卡',
    unlocked: true,
    unlockedAt: '11月13日 · 15:20',
    source: 'online',
  },
  {
    id: 'stamp-horizon',
    slotIndex: 2,
    title: '天际远眺',
    subtitle: '凝望六米外远景',
    requirement: '完成一次「望向远方」打卡',
    unlocked: true,
    unlockedAt: '11月14日 · 10:45',
    source: 'online',
  },
  {
    id: 'stamp-quiet',
    slotIndex: 3,
    title: '闭目留白',
    subtitle: '安静闭眼小憩',
    requirement: '完成一次「闭眼养神」打卡',
    unlocked: false,
  },
  {
    id: 'stamp-dining',
    slotIndex: 4,
    title: '无屏食光',
    subtitle: '专心吃一顿饭',
    requirement: '完成一次「无手机用餐」打卡',
    unlocked: false,
  },
  {
    id: 'stamp-hydration',
    slotIndex: 5,
    title: '水润展位',
    subtitle: '护眼液或线下同步',
    requirement: '打卡「滴护眼液」或同步线下展位码',
    unlocked: false,
  },
];

export const INITIAL_BADGES: BadgeItem[] = [
  {
    id: 'badge-first-gaze',
    title: '初见远方',
    criteria: '完成首次护眼打卡',
    unlocked: true,
    unlockedAt: '11月13日',
  },
  {
    id: 'badge-3day-streak',
    title: '三日坚持',
    criteria: '连续 3 天完成护眼记录',
    unlocked: true,
    unlockedAt: '11月15日',
  },
  {
    id: 'badge-120-min',
    title: '晴空行者',
    criteria: '累计护眼时长达到 120 分钟',
    unlocked: false,
  },
  {
    id: 'badge-passport-full',
    title: '全章收藏家',
    criteria: '集齐眼假期护照全部 5 枚印章',
    unlocked: false,
  },
];

export const DURATION_TIERS = [
  {
    minMinutes: 0,
    name: '初露阶',
    perks: '可兑换基础店铺优惠券与电子徽章',
  },
  {
    minMinutes: 60,
    name: '晴空阶',
    perks: '解锁蒸汽眼罩试用装与校园专属折扣',
  },
  {
    minMinutes: 150,
    name: '海屿阶',
    perks: '解锁限定帆布周边与校园音乐/展览门票',
  },
];

export const MALL_REWARDS: MallReward[] = [
  {
    id: 'reward-voucher-15',
    title: '海露旗舰店 85 折学生券',
    category: 'vouchers',
    pointsCost: 60,
    requiredMinutesTier: 0,
    tierName: '初露阶 (0分钟起)',
    description: '适用于蒸汽眼罩、润眼滴露及校园护眼套装。',
    stock: 180,
  },
  {
    id: 'reward-steam-sample',
    title: '洋甘菊恒温蒸汽眼罩 (3片装)',
    category: 'samples',
    pointsCost: 110,
    requiredMinutesTier: 60,
    tierName: '晴空阶 (60分钟起)',
    description: '40°C 温和热敷，舒缓晚自习后的眼部酸涩。',
    imageUrl: PRODUCT_WELLNESS_KIT_IMAGE,
    stock: 42,
  },
  {
    id: 'reward-tote-bundle',
    title: '海露钟限定帆布袋与遮光眼罩',
    category: 'merchandise',
    pointsCost: 220,
    requiredMinutesTier: 150,
    tierName: '海屿阶 (150分钟起)',
    description: '厚磅本白帆布袋搭配海蓝色立体舒睡眼罩。',
    imageUrl: PRODUCT_CAMPUS_BUNDLE_IMAGE,
    stock: 18,
  },
  {
    id: 'reward-botanic-ticket',
    title: '校园温室草坪音乐会入场券',
    category: 'tickets',
    pointsCost: 160,
    requiredMinutesTier: 60,
    tierName: '晴空阶 (60分钟起)',
    description: '周末傍晚植物园玻璃温室不插电听歌名额。',
    stock: 24,
  },
  {
    id: 'reward-voucher-30',
    title: '学生护眼礼盒 7 折满减券',
    category: 'vouchers',
    pointsCost: 140,
    requiredMinutesTier: 60,
    tierName: '晴空阶 (60分钟起)',
    description: '认证校园身份专享，支持叠加秋季活动折扣。',
    stock: 95,
  },
  {
    id: 'reward-serum-sample',
    title: '植物舒缓护眼喷雾便携装',
    category: 'samples',
    pointsCost: 90,
    requiredMinutesTier: 0,
    tierName: '初露阶 (0分钟起)',
    description: '小巧随身装，适合放在图书馆桌面随时清润。',
    stock: 64,
  },
];

export const INITIAL_CHECKINS: CheckInRecord[] = [
  {
    id: 'ci-init-1',
    activity: 'distant_gaze',
    label: '望向远方',
    durationMinutes: 10,
    pointsEarned: 20,
    timestamp: '今天 · 09:30',
    locationNote: '主图书馆四楼窗边',
    leaveReason: '暂别屏幕，望向6米外的云朵、树梢与天际线。',
    stampUnlocked: '天际远眺',
  },
  {
    id: 'ci-init-2',
    activity: 'outdoor_walk',
    label: '户外看绿散步',
    durationMinutes: 15,
    pointsEarned: 35,
    timestamp: '昨天 · 16:10',
    locationNote: '中心草坪银杏道',
    leaveReason: '走出自习室，在林荫道与自然光下慢慢走一圈。',
    stampUnlocked: '林荫看绿',
  },
];

export const INITIAL_STUDY_SESSIONS: StudySession[] = [
  {
    id: 'ss-init-1',
    modeLabel: '25分钟 标准专注',
    focusMinutes: 25,
    completedAt: '今天 · 09:25',
    status: 'completed',
  },
];

export const BASE_LEADERBOARD_GROUPS: LeaderboardGroup[] = [
  {
    id: 'col-arch',
    name: '建筑与设计学院',
    type: 'college',
    totalMinutes: 4820,
    membersCount: 146,
    avgMinutes: 33,
  },
  {
    id: 'col-cs',
    name: '计算机科学与技术学院',
    type: 'college',
    totalMinutes: 4590,
    membersCount: 162,
    avgMinutes: 28,
  },
  {
    id: 'col-hum',
    name: '人文与艺术学院',
    type: 'college',
    totalMinutes: 3910,
    membersCount: 118,
    avgMinutes: 33,
  },
  {
    id: 'col-life',
    name: '生命科学学院',
    type: 'college',
    totalMinutes: 3440,
    membersCount: 104,
    avgMinutes: 33,
  },
  {
    id: 'col-econ',
    name: '经济管理学院',
    type: 'college',
    totalMinutes: 3180,
    membersCount: 112,
    avgMinutes: 28,
  },
  {
    id: 'col-jour',
    name: '新闻与传播学院',
    type: 'college',
    totalMinutes: 2760,
    membersCount: 89,
    avgMinutes: 31,
  },
  {
    id: 'club-photo',
    name: '校园摄影社',
    type: 'club',
    totalMinutes: 1940,
    membersCount: 48,
    avgMinutes: 40,
  },
  {
    id: 'club-botan',
    name: '植物手绘社',
    type: 'club',
    totalMinutes: 1720,
    membersCount: 41,
    avgMinutes: 42,
  },
  {
    id: 'club-run',
    name: '晨跑与健康协会',
    type: 'club',
    totalMinutes: 1650,
    membersCount: 52,
    avgMinutes: 32,
  },
  {
    id: 'club-oss',
    name: '开源极客工坊',
    type: 'club',
    totalMinutes: 1490,
    membersCount: 57,
    avgMinutes: 26,
  },
  {
    id: 'club-tea',
    name: '清茶民谣社',
    type: 'club',
    totalMinutes: 1210,
    membersCount: 34,
    avgMinutes: 36,
  },
  {
    id: 'club-deb',
    name: '思辨辩论社',
    type: 'club',
    totalMinutes: 1080,
    membersCount: 39,
    avgMinutes: 28,
  },
];

export const OFFLINE_BOOTH_CODES: Record<string, { stampId: string; location: string }> = {
  LIB2026: { stampId: 'stamp-hydration', location: '主图书馆一楼护眼服务台' },
  GREEN20: { stampId: 'stamp-greenery', location: '中心草坪绿意打卡点' },
  REST05: { stampId: 'stamp-quiet', location: '学生活动中心静息区' },
  DINING: { stampId: 'stamp-dining', location: '北苑食堂无屏餐桌' },
  SKY2026: { stampId: 'stamp-horizon', location: '观景露台远眺点' },
};
