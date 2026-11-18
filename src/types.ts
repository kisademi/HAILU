export type TabId = 'home' | 'study' | 'checkin' | 'leaderboard' | 'profile';

export type SubPageId = 'mall' | 'rules' | 'promo' | 'poster' | null;

export type CheckInActivityType =
  | 'distant_gaze'
  | 'close_eyes'
  | 'outdoor_walk'
  | 'phone_free_meal'
  | 'eye_drops';

export type StudyActivityType = 'study_work' | CheckInActivityType;

export interface StudyModeOption {
  id: StudyActivityType;
  label: string;
  kind: 'study' | 'eyecare';
  defaultMinutes: number;
  description: string;
}

export interface EyeCareRecord {
  id: string;
  activity: CheckInActivityType;
  label: string;
  durationMinutes: number;
  completedAt: string;
  sourceLabel: string;
  checkedIn: boolean;
}

export interface ActivityMeta {
  type: CheckInActivityType;
  label: string;
  shortLabel: string;
  leaveHeadline: string;
  leaveReason: string;
  recommendedMinutes: number;
  pointsPerSession: number;
  stampId: string;
  description: string;
}

export interface UserProfile {
  name: string;
  school: string;
  college: string;
  enrollmentYear: string;
  dailyGoalMinutes: number;
  soundEnabled: boolean;
  breakReminderEnabled: boolean;
  avatarInitials: string;
}

export interface CheckInRecord {
  id: string;
  activity: CheckInActivityType;
  label: string;
  durationMinutes: number;
  pointsEarned: number;
  timestamp: string;
  locationNote: string;
  leaveReason: string;
  stampUnlocked?: string;
  participantOrder: number;
}

export interface StudySession {
  id: string;
  activityType: StudyActivityType;
  modeLabel: string;
  focusMinutes: number;
  completedAt: string;
  status: 'completed' | 'ended_early';
  isEyeCareRecord: boolean;
}

export interface StampSlot {
  id: string;
  slotIndex: number;
  title: string;
  subtitle: string;
  requirement: string;
  unlocked: boolean;
  unlockedAt?: string;
  source?: 'online' | 'offline';
}

export interface BadgeItem {
  id: string;
  title: string;
  criteria: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export type MallCategory = 'all' | 'vouchers' | 'samples' | 'merchandise' | 'tickets';

export interface MallReward {
  id: string;
  title: string;
  boxCountLabel?: string;
  specLabel?: string;
  originalPrice?: number;
  discountAmount?: number;
  finalPrice?: number;
  category: Exclude<MallCategory, 'all'>;
  pointsCost: number;
  requiredMinutesTier: number;
  tierName: string;
  description: string;
  imageUrl?: string;
  stock: number;
}

export interface RedemptionRecord {
  id: string;
  rewardId: string;
  rewardTitle: string;
  category: Exclude<MallCategory, 'all'>;
  pointsSpent: number;
  code: string;
  redeemedAt: string;
  status: 'Active' | 'Used';
}

export interface VoucherItem {
  id: string;
  title: string;
  discountLabel: string;
  code: string;
  source: string;
  expiresAt: string;
  claimedAt: string;
}

export interface LeaderboardGroup {
  id: string;
  name: string;
  type: 'college' | 'national';
  school?: string;
  totalMinutes: number;
  membersCount: number;
  avgMinutes: number;
}

export interface PosterPayload {
  id: string;
  studentName: string;
  school: string;
  college: string;
  enrollmentYear: string;
  activityLabel: string;
  leaveReason: string;
  durationMinutes: number;
  timestamp: string;
  locationNote: string;
  leaveCode: string;
  participantOrder: number;
}

export interface HyloProductOption {
  id: string;
  boxes: number;
  title: string;
  specLabel: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  couponTitle: string;
  codePrefix: string;
  imageUrl: string;
}
