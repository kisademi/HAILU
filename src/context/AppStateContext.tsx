import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  BASE_LEADERBOARD_GROUPS,
  CHECKIN_ACTIVITIES,
  INITIAL_BADGES,
  INITIAL_CHECKINS,
  INITIAL_STAMPS,
  INITIAL_STUDY_SESSIONS,
  MALL_REWARDS,
  OFFLINE_BOOTH_CODES,
  POMODORO_PRESETS,
} from '../data/campaignData';
import {
  BadgeItem,
  CheckInActivityType,
  CheckInRecord,
  LeaderboardGroup,
  MallReward,
  PomodoroPreset,
  PosterPayload,
  RedemptionRecord,
  StampSlot,
  StudySession,
  SubPageId,
  TabId,
  UserProfile,
  VoucherItem,
} from '../types';

interface PersistedState {
  isAuthorized: boolean;
  user: UserProfile;
  points: number;
  todayMinutes: number;
  weekMinutes: number;
  totalMinutes: number;
  streakDays: number;
  checkIns: CheckInRecord[];
  studySessions: StudySession[];
  stamps: StampSlot[];
  badges: BadgeItem[];
  redemptions: RedemptionRecord[];
  vouchers: VoucherItem[];
  claimedStampMilestones: number[];
}

const STORAGE_KEY = 'hailuzhong_mini_program_v1';

const DEFAULT_STATE: PersistedState = {
  isAuthorized: false,
  user: {
    name: '林浅',
    studentId: '20260418',
    college: '计算机科学与技术学院',
    club: '校园摄影社',
    dailyGoalMinutes: 30,
    soundEnabled: true,
    breakReminderEnabled: true,
    avatarInitials: '林浅',
  },
  points: 185,
  todayMinutes: 15,
  weekMinutes: 75,
  totalMinutes: 135,
  streakDays: 3,
  checkIns: INITIAL_CHECKINS,
  studySessions: INITIAL_STUDY_SESSIONS,
  stamps: INITIAL_STAMPS,
  badges: INITIAL_BADGES,
  redemptions: [
    {
      id: 'red-init-1',
      rewardId: 'reward-voucher-15',
      rewardTitle: '海露旗舰店 85 折学生券',
      category: 'vouchers',
      pointsSpent: 60,
      code: 'HLZ-85-9421',
      redeemedAt: '11月14日 · 18:10',
      status: 'Active',
    },
  ],
  vouchers: [
    {
      id: 'v-init-1',
      title: '海露旗舰店 85 折学生券',
      discountLabel: '85 折',
      code: 'HLZ-85-9421',
      source: '积分商城兑换',
      expiresAt: '2026-12-31',
      claimedAt: '11月14日',
    },
  ],
  claimedStampMilestones: [],
};

function computeInitials(name: string): string {
  const clean = name.trim();
  if (!clean) return '海露';
  if (/[\u4e00-\u9fa5]/.test(clean)) {
    return clean.slice(-2);
  }
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatNowLabel(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `今天 · ${hh}:${mm}`;
}

interface AppContextValue {
  isAuthorized: boolean;
  user: UserProfile;
  activeTab: TabId;
  subPage: SubPageId;
  points: number;
  todayMinutes: number;
  weekMinutes: number;
  totalMinutes: number;
  streakDays: number;
  checkIns: CheckInRecord[];
  studySessions: StudySession[];
  stamps: StampSlot[];
  badges: BadgeItem[];
  redemptions: RedemptionRecord[];
  vouchers: VoucherItem[];
  claimedStampMilestones: number[];
  posterPayload: PosterPayload | null;
  toastMessage: string | null;

  selectedPreset: PomodoroPreset;
  customMinutes: number;
  secondsLeft: number;
  timerRunning: boolean;
  timerHasStarted: boolean;
  showBreakPopup: boolean;
  lastCompletedFocusMinutes: number;

  leaderboardGroups: LeaderboardGroup[];

  authorizeUser: (profile: Partial<UserProfile>) => void;
  signOut: () => void;
  updateUserSettings: (patch: Partial<UserProfile>) => void;
  navigateTab: (tab: TabId) => void;
  openSubPage: (page: SubPageId) => void;
  clearToast: () => void;
  showToast: (msg: string) => void;

  selectPreset: (preset: PomodoroPreset) => void;
  setCustomTimerMinutes: (minutes: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  endTimer: () => void;
  triggerBreakReminderPreview: () => void;
  dismissBreakPopup: () => void;
  startBreakTimerFromPopup: () => void;

  submitCheckIn: (
    activity: CheckInActivityType,
    durationMinutes: number,
    locationNote: string
  ) => CheckInRecord;
  syncOfflineStamp: (code: string) => { ok: boolean; message: string };
  claimStampMilestone: (threshold: 3 | 5) => { ok: boolean; message: string };

  redeemMallReward: (reward: MallReward) => { ok: boolean; message: string };
  claimPromoVoucher: (title: string, discountLabel: string, codePrefix: string) => { ok: boolean; message: string };

  openPosterForCheckIn: (record: CheckInRecord) => void;
  openLatestPoster: () => void;
}

const AppStateContext = createContext<AppContextValue | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persisted, setPersisted] = useState<PersistedState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_STATE;
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return { ...DEFAULT_STATE, ...parsed };
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Ignore storage quota errors
    }
  }, [persisted]);

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [subPage, setSubPage] = useState<SubPageId>(null);
  const [posterPayload, setPosterPayload] = useState<PosterPayload | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedPreset, setSelectedPreset] = useState<PomodoroPreset>(POMODORO_PRESETS[0]);
  const [customMinutes, setCustomMinutes] = useState<number>(POMODORO_PRESETS[0].minutes);
  const [secondsLeft, setSecondsLeft] = useState<number>(POMODORO_PRESETS[0].minutes * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerHasStarted, setTimerHasStarted] = useState<boolean>(false);
  const [showBreakPopup, setShowBreakPopup] = useState<boolean>(false);
  const [lastCompletedFocusMinutes, setLastCompletedFocusMinutes] = useState<number>(25);

  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3400);
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const completeTimerSession = useCallback(
    (minutesCompleted: number, status: 'completed' | 'ended_early', modeLabel: string, kind: 'focus' | 'rest') => {
      const session: StudySession = {
        id: `ss-${Date.now()}`,
        modeLabel,
        focusMinutes: Math.max(1, minutesCompleted),
        completedAt: formatNowLabel(),
        status,
      };

      setPersisted((prev) => {
        const addedEyeMinutes = kind === 'rest' ? Math.max(1, minutesCompleted) : 0;
        const nextTotal = prev.totalMinutes + addedEyeMinutes;
        const nextBadges = prev.badges.map((b) => {
          if (b.id === 'badge-120-min' && nextTotal >= 120 && !b.unlocked) {
            return { ...b, unlocked: true, unlockedAt: '今天' };
          }
          return b;
        });

        return {
          ...prev,
          todayMinutes: prev.todayMinutes + addedEyeMinutes,
          weekMinutes: prev.weekMinutes + addedEyeMinutes,
          totalMinutes: nextTotal,
          points: prev.points + (status === 'completed' ? 10 : 0),
          studySessions: [session, ...prev.studySessions],
          badges: nextBadges,
        };
      });

      if (kind === 'focus' && status === 'completed') {
        setLastCompletedFocusMinutes(minutesCompleted);
        if (persisted.user.breakReminderEnabled) {
          setShowBreakPopup(true);
        } else {
          showToast('专注已完成（+10 积分），记得远眺放松双眼。');
        }
      } else if (kind === 'rest') {
        showToast(`护眼休息已完成（+${Math.max(1, minutesCompleted)} 分钟护眼时长）。`);
      } else {
        showToast('本次自习记录已保存。');
      }
    },
    [persisted.user.breakReminderEnabled, showToast]
  );

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setTimerRunning(false);
          setTimerHasStarted(false);
          completeTimerSession(
            customMinutes,
            'completed',
            selectedPreset.label,
            selectedPreset.kind
          );
          return customMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, customMinutes, selectedPreset, completeTimerSession]);

  const authorizeUser = useCallback(
    (profile: Partial<UserProfile>) => {
      setPersisted((prev) => {
        const name = (profile.name ?? prev.user.name).trim() || '林浅';
        const nextUser: UserProfile = {
          ...prev.user,
          ...profile,
          name,
          avatarInitials: computeInitials(name),
        };
        return {
          ...prev,
          isAuthorized: true,
          user: nextUser,
        };
      });
      setActiveTab('home');
      setSubPage(null);
      showToast('校园身份已授权，欢迎来到海露钟。');
    },
    [showToast]
  );

  const signOut = useCallback(() => {
    setTimerRunning(false);
    setPersisted((prev) => ({
      ...prev,
      isAuthorized: false,
    }));
    setSubPage(null);
    setActiveTab('home');
  }, []);

  const updateUserSettings = useCallback(
    (patch: Partial<UserProfile>) => {
      setPersisted((prev) => {
        const nextName = patch.name !== undefined ? patch.name.trim() || prev.user.name : prev.user.name;
        return {
          ...prev,
          user: {
            ...prev.user,
            ...patch,
            name: nextName,
            avatarInitials: computeInitials(nextName),
          },
        };
      });
      showToast('设置已更新。');
    },
    [showToast]
  );

  const navigateTab = useCallback((tab: TabId) => {
    setSubPage(null);
    setActiveTab(tab);
  }, []);

  const openSubPage = useCallback((page: SubPageId) => {
    setSubPage(page);
  }, []);

  const selectPreset = useCallback((preset: PomodoroPreset) => {
    setTimerRunning(false);
    setTimerHasStarted(false);
    setSelectedPreset(preset);
    setCustomMinutes(preset.minutes);
    setSecondsLeft(preset.minutes * 60);
  }, []);

  const setCustomTimerMinutes = useCallback((minutes: number) => {
    const clamped = Math.max(1, Math.min(90, minutes));
    setTimerRunning(false);
    setTimerHasStarted(false);
    setCustomMinutes(clamped);
    setSecondsLeft(clamped * 60);
  }, []);

  const startTimer = useCallback(() => {
    setTimerRunning(true);
    setTimerHasStarted(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerRunning(false);
  }, []);

  const endTimer = useCallback(() => {
    const elapsedSeconds = customMinutes * 60 - secondsLeft;
    const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    setTimerRunning(false);
    setTimerHasStarted(false);
    setSecondsLeft(customMinutes * 60);
    if (elapsedSeconds >= 5) {
      completeTimerSession(
        elapsedMinutes,
        'ended_early',
        `${customMinutes}分钟 自定义专注`,
        selectedPreset.kind
      );
    } else {
      showToast('计时已重置。');
    }
  }, [customMinutes, secondsLeft, selectedPreset.kind, completeTimerSession, showToast]);

  const triggerBreakReminderPreview = useCallback(() => {
    setLastCompletedFocusMinutes(customMinutes);
    setShowBreakPopup(true);
  }, [customMinutes]);

  const dismissBreakPopup = useCallback(() => {
    setShowBreakPopup(false);
  }, []);

  const startBreakTimerFromPopup = useCallback(() => {
    const restPreset = POMODORO_PRESETS.find((p) => p.kind === 'rest') || POMODORO_PRESETS[3];
    setShowBreakPopup(false);
    setSelectedPreset(restPreset);
    setCustomMinutes(restPreset.minutes);
    setSecondsLeft(restPreset.minutes * 60);
    setTimerRunning(true);
    setTimerHasStarted(true);
    setSubPage(null);
    setActiveTab('study');
  }, []);

  const buildPosterFromRecord = useCallback(
    (record: CheckInRecord, user: UserProfile): PosterPayload => ({
      id: record.id,
      studentName: user.name,
      college: user.college,
      club: user.club,
      activityLabel: record.label,
      leaveReason: record.leaveReason,
      durationMinutes: record.durationMinutes,
      timestamp: record.timestamp,
      locationNote: record.locationNote || '校园窗边休息角',
      leaveCode: `HL-${record.id.slice(-4).toUpperCase()}`,
    }),
    []
  );

  const submitCheckIn = useCallback(
    (activity: CheckInActivityType, durationMinutes: number, locationNote: string): CheckInRecord => {
      const meta = CHECKIN_ACTIVITIES.find((a) => a.type === activity) || CHECKIN_ACTIVITIES[0];
      const cleanDuration = Math.max(1, Math.min(120, durationMinutes));
      const bonus = Math.floor(cleanDuration / 10) * 5;
      const earnedPoints = meta.pointsPerSession + bonus;

      let newlyUnlockedStampTitle: string | undefined;

      const recordId = `ci-${Date.now()}`;
      const newRecord: CheckInRecord = {
        id: recordId,
        activity,
        label: meta.label,
        durationMinutes: cleanDuration,
        pointsEarned: earnedPoints,
        timestamp: formatNowLabel(),
        locationNote: locationNote.trim() || '校园自习区',
        leaveReason: meta.leaveReason,
      };

      setPersisted((prev) => {
        const nextStamps = prev.stamps.map((s) => {
          if (s.id === meta.stampId && !s.unlocked) {
            newlyUnlockedStampTitle = s.title;
            return {
              ...s,
              unlocked: true,
              unlockedAt: formatNowLabel(),
              source: 'online' as const,
            };
          }
          return s;
        });

        if (newlyUnlockedStampTitle) {
          newRecord.stampUnlocked = newlyUnlockedStampTitle;
        }

        const unlockedCount = nextStamps.filter((s) => s.unlocked).length;
        const nextTotalMinutes = prev.totalMinutes + cleanDuration;

        const nextBadges = prev.badges.map((b) => {
          if (b.id === 'badge-120-min' && nextTotalMinutes >= 120 && !b.unlocked) {
            return { ...b, unlocked: true, unlockedAt: '今天' };
          }
          if (b.id === 'badge-passport-full' && unlockedCount >= 5 && !b.unlocked) {
            return { ...b, unlocked: true, unlockedAt: '今天' };
          }
          return b;
        });

        return {
          ...prev,
          points: prev.points + earnedPoints,
          todayMinutes: prev.todayMinutes + cleanDuration,
          weekMinutes: prev.weekMinutes + cleanDuration,
          totalMinutes: nextTotalMinutes,
          checkIns: [newRecord, ...prev.checkIns],
          stamps: nextStamps,
          badges: nextBadges,
        };
      });

      const poster = buildPosterFromRecord(newRecord, persisted.user);
      setPosterPayload(poster);
      showToast(
        newlyUnlockedStampTitle
          ? `打卡成功（+${earnedPoints} 积分），解锁「${newlyUnlockedStampTitle}」印章。`
          : `打卡成功（+${earnedPoints} 积分，+${cleanDuration} 分钟护眼时长）。`
      );
      return newRecord;
    },
    [persisted.user, buildPosterFromRecord, showToast]
  );

  const syncOfflineStamp = useCallback(
    (rawCode: string): { ok: boolean; message: string } => {
      const normalized = rawCode.trim().toUpperCase();
      const entry = OFFLINE_BOOTH_CODES[normalized];
      if (!entry) {
        return {
          ok: false,
          message: '未识别的展位码，可尝试 LIB2026、GREEN20、REST05、DINING 或 SKY2026。',
        };
      }

      const targetStamp = persisted.stamps.find((s) => s.id === entry.stampId);
      if (targetStamp?.unlocked) {
        return {
          ok: false,
          message: `「${targetStamp.title}」印章已在你的护照中。`,
        };
      }

      setPersisted((prev) => {
        const nextStamps = prev.stamps.map((s) =>
          s.id === entry.stampId
            ? {
                ...s,
                unlocked: true,
                unlockedAt: `${formatNowLabel()} · ${entry.location}`,
                source: 'offline' as const,
              }
            : s
        );
        const unlockedCount = nextStamps.filter((s) => s.unlocked).length;
        const nextBadges = prev.badges.map((b) =>
          b.id === 'badge-passport-full' && unlockedCount >= 5 && !b.unlocked
            ? { ...b, unlocked: true, unlockedAt: '今天' }
            : b
        );
        return {
          ...prev,
          points: prev.points + 30,
          stamps: nextStamps,
          badges: nextBadges,
        };
      });

      const msg = `已同步「${targetStamp?.title}」线下印章（${entry.location}，+30 积分）。`;
      showToast(msg);
      return { ok: true, message: msg };
    },
    [persisted.stamps, showToast]
  );

  const claimStampMilestone = useCallback(
    (threshold: 3 | 5): { ok: boolean; message: string } => {
      const unlockedCount = persisted.stamps.filter((s) => s.unlocked).length;
      if (unlockedCount < threshold) {
        return { ok: false, message: `需先集齐 ${threshold} 枚印章后才可领取该奖励。` };
      }
      if (persisted.claimedStampMilestones.includes(threshold)) {
        return { ok: false, message: `${threshold} 章里程碑奖励已领取。` };
      }

      const voucher: VoucherItem =
        threshold === 3
          ? {
              id: `v-ms3-${Date.now()}`,
              title: '眼假期护照 · 集满3章 8折优惠券',
              discountLabel: '8 折',
              code: `HZ3-${Math.floor(1000 + Math.random() * 9000)}`,
              source: '护照集章礼 (3枚)',
              expiresAt: '2026-12-31',
              claimedAt: '今天',
            }
          : {
              id: `v-ms5-${Date.now()}`,
              title: '眼假期护照 · 集满5章 校园礼盒兑换券',
              discountLabel: '免费领',
              code: `HZ5-${Math.floor(1000 + Math.random() * 9000)}`,
              source: '护照集章礼 (5枚)',
              expiresAt: '2026-12-31',
              claimedAt: '今天',
            };

      setPersisted((prev) => ({
        ...prev,
        points: prev.points + (threshold === 3 ? 50 : 120),
        claimedStampMilestones: [...prev.claimedStampMilestones, threshold],
        vouchers: [voucher, ...prev.vouchers],
      }));

      const msg = `已领取 ${threshold} 章礼遇，券码 ${voucher.code} 已放入卡券包。`;
      showToast(msg);
      return { ok: true, message: msg };
    },
    [persisted.stamps, persisted.claimedStampMilestones, showToast]
  );

  const redeemMallReward = useCallback(
    (reward: MallReward): { ok: boolean; message: string } => {
      if (persisted.totalMinutes < reward.requiredMinutesTier) {
        return {
          ok: false,
          message: `需达到「${reward.tierName}」（累计 ${reward.requiredMinutesTier} 分钟）方可兑换。`,
        };
      }
      if (persisted.points < reward.pointsCost) {
        return {
          ok: false,
          message: `还差 ${reward.pointsCost - persisted.points} 积分即可兑换该好礼。`,
        };
      }

      const code = `HL-${reward.category.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const record: RedemptionRecord = {
        id: `red-${Date.now()}`,
        rewardId: reward.id,
        rewardTitle: reward.title,
        category: reward.category,
        pointsSpent: reward.pointsCost,
        code,
        redeemedAt: formatNowLabel(),
        status: 'Active',
      };

      const maybeVoucher: VoucherItem | null =
        reward.category === 'vouchers' || reward.category === 'tickets'
          ? {
              id: `v-mall-${Date.now()}`,
              title: reward.title,
              discountLabel: reward.category === 'tickets' ? '入场券' : '优惠券',
              code,
              source: '积分商城兑换',
              expiresAt: '2026-12-31',
              claimedAt: '今天',
            }
          : null;

      setPersisted((prev) => ({
        ...prev,
        points: prev.points - reward.pointsCost,
        redemptions: [record, ...prev.redemptions],
        vouchers: maybeVoucher ? [maybeVoucher, ...prev.vouchers] : prev.vouchers,
      }));

      const msg = `兑换成功「${reward.title}」，核销码：${code}`;
      showToast(msg);
      return { ok: true, message: msg };
    },
    [persisted.totalMinutes, persisted.points, showToast]
  );

  const claimPromoVoucher = useCallback(
    (title: string, discountLabel: string, codePrefix: string): { ok: boolean; message: string } => {
      const alreadyClaimed = persisted.vouchers.some((v) => v.title === title);
      if (alreadyClaimed) {
        return { ok: false, message: '你已领取过该校园店铺优惠券。' };
      }
      const code = `${codePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
      const voucher: VoucherItem = {
        id: `v-promo-${Date.now()}`,
        title,
        discountLabel,
        code,
        source: '海露校园商城活动',
        expiresAt: '2026-12-31',
        claimedAt: '今天',
      };
      setPersisted((prev) => ({
        ...prev,
        vouchers: [voucher, ...prev.vouchers],
      }));
      const msg = `优惠券已领取（${code}），已保存至我的卡券。`;
      showToast(msg);
      return { ok: true, message: msg };
    },
    [persisted.vouchers, showToast]
  );

  const openPosterForCheckIn = useCallback(
    (record: CheckInRecord) => {
      setPosterPayload(buildPosterFromRecord(record, persisted.user));
      setSubPage('poster');
    },
    [buildPosterFromRecord, persisted.user]
  );

  const openLatestPoster = useCallback(() => {
    const latest = persisted.checkIns[0] || INITIAL_CHECKINS[0];
    setPosterPayload(buildPosterFromRecord(latest, persisted.user));
    setSubPage('poster');
  }, [persisted.checkIns, persisted.user, buildPosterFromRecord]);

  const leaderboardGroups = useMemo(() => {
    const extraMinutes = Math.max(0, persisted.totalMinutes - DEFAULT_STATE.totalMinutes);
    return BASE_LEADERBOARD_GROUPS.map((group) => {
      if (group.name === persisted.user.college || group.name === persisted.user.club) {
        const nextTotal = group.totalMinutes + extraMinutes;
        return {
          ...group,
          totalMinutes: nextTotal,
          avgMinutes: Math.round(nextTotal / group.membersCount),
        };
      }
      return group;
    }).sort((a, b) => b.totalMinutes - a.totalMinutes);
  }, [persisted.totalMinutes, persisted.user.college, persisted.user.club]);

  void MALL_REWARDS;

  const value: AppContextValue = {
    isAuthorized: persisted.isAuthorized,
    user: persisted.user,
    activeTab,
    subPage,
    points: persisted.points,
    todayMinutes: persisted.todayMinutes,
    weekMinutes: persisted.weekMinutes,
    totalMinutes: persisted.totalMinutes,
    streakDays: persisted.streakDays,
    checkIns: persisted.checkIns,
    studySessions: persisted.studySessions,
    stamps: persisted.stamps,
    badges: persisted.badges,
    redemptions: persisted.redemptions,
    vouchers: persisted.vouchers,
    claimedStampMilestones: persisted.claimedStampMilestones,
    posterPayload,
    toastMessage,
    selectedPreset,
    customMinutes,
    secondsLeft,
    timerRunning,
    timerHasStarted,
    showBreakPopup,
    lastCompletedFocusMinutes,
    leaderboardGroups,
    authorizeUser,
    signOut,
    updateUserSettings,
    navigateTab,
    openSubPage,
    clearToast,
    showToast,
    selectPreset,
    setCustomTimerMinutes,
    startTimer,
    pauseTimer,
    endTimer,
    triggerBreakReminderPreview,
    dismissBreakPopup,
    startBreakTimerFromPopup,
    submitCheckIn,
    syncOfflineStamp,
    claimStampMilestone,
    redeemMallReward,
    claimPromoVoucher,
    openPosterForCheckIn,
    openLatestPoster,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export function useAppState(): AppContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
