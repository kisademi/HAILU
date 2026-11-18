import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  BASE_LEADERBOARD_GROUPS,
  BASE_TODAY_CHECKINS,
  CHECKIN_ACTIVITIES,
  INITIAL_BADGES,
  INITIAL_CHECKINS,
  INITIAL_EYECARE_RECORDS,
  INITIAL_STAMPS,
  INITIAL_STUDY_SESSIONS,
  OFFLINE_BOOTH_CODES,
  STUDY_MODE_OPTIONS,
} from '../data/campaignData';
import {
  BadgeItem,
  CheckInActivityType,
  CheckInRecord,
  EyeCareRecord,
  LeaderboardGroup,
  MallReward,
  PosterPayload,
  RedemptionRecord,
  StampSlot,
  StudyModeOption,
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
  todayCheckInParticipants: number;
  eyeCareRecords: EyeCareRecord[];
  checkIns: CheckInRecord[];
  studySessions: StudySession[];
  stamps: StampSlot[];
  badges: BadgeItem[];
  redemptions: RedemptionRecord[];
  vouchers: VoucherItem[];
  claimedStampMilestones: number[];
}

const STORAGE_KEY = 'hailuzhong_mini_program_v4';

const DEFAULT_STATE: PersistedState = {
  isAuthorized: false,
  user: {
    name: '林浅',
    school: '',
    college: '计算机科学与技术学院',
    enrollmentYear: '',
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
  todayCheckInParticipants: BASE_TODAY_CHECKINS,
  eyeCareRecords: INITIAL_EYECARE_RECORDS,
  checkIns: INITIAL_CHECKINS,
  studySessions: INITIAL_STUDY_SESSIONS,
  stamps: INITIAL_STAMPS,
  badges: INITIAL_BADGES,
  redemptions: [
    {
      id: 'red-init-1',
      rewardId: 'reward-hylo-1',
      rewardTitle: '海露玻璃酸钠滴眼液 · 1盒立减8元券',
      category: 'vouchers',
      pointsSpent: 40,
      code: 'HYLO8-9421',
      redeemedAt: '5月8日 · 18:10',
      status: 'Active',
    },
  ],
  vouchers: [
    {
      id: 'v-init-1',
      title: '海露玻璃酸钠滴眼液 1盒立减8元券',
      discountLabel: '立减 ¥8',
      code: 'HYLO8-9421',
      source: '积分商城兑换',
      expiresAt: '2026-06-07',
      claimedAt: '5月8日',
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
  todayCheckInParticipants: number;
  eyeCareRecords: EyeCareRecord[];
  pendingEyeCareRecords: EyeCareRecord[];
  checkIns: CheckInRecord[];
  studySessions: StudySession[];
  stamps: StampSlot[];
  badges: BadgeItem[];
  redemptions: RedemptionRecord[];
  vouchers: VoucherItem[];
  claimedStampMilestones: number[];
  posterPayload: PosterPayload | null;
  toastMessage: string | null;

  selectedStudyMode: StudyModeOption;
  isPostStudyRest: boolean;
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

  selectStudyMode: (mode: StudyModeOption) => void;
  setCustomTimerMinutes: (minutes: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  endTimer: () => void;
  simulateTimerComplete: () => void;
  triggerBreakReminderPreview: () => void;
  dismissBreakPopup: () => void;
  startBreakTimerFromPopup: () => void;

  submitCheckInFromRecord: (
    recordId: string,
    locationNote: string,
    leaveReason: string
  ) => CheckInRecord | null;
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
      return {
        ...DEFAULT_STATE,
        ...parsed,
        user: { ...DEFAULT_STATE.user, ...(parsed.user || {}) },
      };
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Ignore storage errors
    }
  }, [persisted]);

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [subPage, setSubPage] = useState<SubPageId>(null);
  const [posterPayload, setPosterPayload] = useState<PosterPayload | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedStudyMode, setSelectedStudyMode] = useState<StudyModeOption>(STUDY_MODE_OPTIONS[0]);
  const [isPostStudyRest, setIsPostStudyRest] = useState<boolean>(false);
  const [customMinutes, setCustomMinutes] = useState<number>(STUDY_MODE_OPTIONS[0].defaultMinutes);
  const [secondsLeft, setSecondsLeft] = useState<number>(STUDY_MODE_OPTIONS[0].defaultMinutes * 60);
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
    }, 3600);
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const completeTimerSession = useCallback(
    (
      minutesCompleted: number,
      status: 'completed' | 'ended_early',
      mode: StudyModeOption,
      postStudyRest: boolean
    ) => {
      const cleanMins = Math.max(1, minutesCompleted);
      const nowLabel = formatNowLabel();

      // Study/Work creates a study record and prompts 5-min rest (does NOT create a check-inable eye-care record directly)
      if (mode.kind === 'study' && !postStudyRest) {
        const session: StudySession = {
          id: `ss-${Date.now()}`,
          activityType: 'study_work',
          modeLabel: mode.label,
          focusMinutes: cleanMins,
          completedAt: nowLabel,
          status,
          isEyeCareRecord: false,
        };
        setPersisted((prev) => ({
          ...prev,
          points: prev.points + (status === 'completed' ? 10 : 0),
          studySessions: [session, ...prev.studySessions],
        }));

        if (status === 'completed') {
          setLastCompletedFocusMinutes(cleanMins);
          if (persisted.user.breakReminderEnabled) {
            setShowBreakPopup(true);
          } else {
            setShowBreakPopup(true);
          }
        } else {
          showToast('学习/工作已结束，未完成 5 分钟休息不会生成护眼记录。');
        }
        return;
      }

      // Either a 5-min post-study rest OR one of the 5 inherent eye-care behaviors
      const eyeActivity: CheckInActivityType = postStudyRest
        ? 'close_eyes'
        : (mode.id as CheckInActivityType);
      const recordLabel = postStudyRest ? '专注后 5 分钟休息' : mode.label;
      const sourceLabel = postStudyRest ? '自习室 · 休息5分钟' : `自习室 · ${mode.label}`;

      const session: StudySession = {
        id: `ss-${Date.now()}`,
        activityType: postStudyRest ? 'close_eyes' : mode.id,
        modeLabel: recordLabel,
        focusMinutes: cleanMins,
        completedAt: nowLabel,
        status,
        isEyeCareRecord: true,
      };

      const newEyeCareRecord: EyeCareRecord = {
        id: `ecr-${Date.now()}`,
        activity: eyeActivity,
        label: recordLabel,
        durationMinutes: cleanMins,
        completedAt: nowLabel,
        sourceLabel,
        checkedIn: false,
      };

      setPersisted((prev) => {
        const nextTotal = prev.totalMinutes + cleanMins;
        const nextBadges = prev.badges.map((b) => {
          if (b.id === 'badge-120-min' && nextTotal >= 120 && !b.unlocked) {
            return { ...b, unlocked: true, unlockedAt: '今天' };
          }
          return b;
        });

        return {
          ...prev,
          todayMinutes: prev.todayMinutes + cleanMins,
          weekMinutes: prev.weekMinutes + cleanMins,
          totalMinutes: nextTotal,
          studySessions: [session, ...prev.studySessions],
          eyeCareRecords: [newEyeCareRecord, ...prev.eyeCareRecords],
          badges: nextBadges,
        };
      });

      if (postStudyRest) {
        setIsPostStudyRest(false);
        setSelectedStudyMode(STUDY_MODE_OPTIONS[0]);
        setCustomMinutes(STUDY_MODE_OPTIONS[0].defaultMinutes);
        setSecondsLeft(STUDY_MODE_OPTIONS[0].defaultMinutes * 60);
      }

      showToast(`已完成「${recordLabel}」（${cleanMins} 分钟），已生成可打卡护眼记录！`);
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
          completeTimerSession(customMinutes, 'completed', selectedStudyMode, isPostStudyRest);
          return customMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, customMinutes, selectedStudyMode, isPostStudyRest, completeTimerSession]);

  const authorizeUser = useCallback(
    (profile: Partial<UserProfile>) => {
      setPersisted((prev) => {
        const name = (profile.name ?? prev.user.name).trim() || '林浅';
        const school = (profile.school ?? prev.user.school).trim();
        const college = school ? (profile.college ?? prev.user.college) : '';
        const enrollmentYear = (profile.enrollmentYear ?? prev.user.enrollmentYear).trim();
        const nextUser: UserProfile = {
          ...prev.user,
          ...profile,
          name,
          school,
          college,
          enrollmentYear,
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
      showToast('欢迎来到海露钟，已进入全国护眼排行。');
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
        const nextSchool = patch.school !== undefined ? patch.school.trim() : prev.user.school;
        const nextCollege = nextSchool
          ? patch.college !== undefined
            ? patch.college
            : prev.user.college || '计算机科学与技术学院'
          : '';
        return {
          ...prev,
          user: {
            ...prev.user,
            ...patch,
            name: nextName,
            school: nextSchool,
            college: nextCollege,
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

  const selectStudyMode = useCallback((mode: StudyModeOption) => {
    setTimerRunning(false);
    setTimerHasStarted(false);
    setIsPostStudyRest(false);
    setSelectedStudyMode(mode);
    setCustomMinutes(mode.defaultMinutes);
    setSecondsLeft(mode.defaultMinutes * 60);
  }, []);

  const setCustomTimerMinutes = useCallback(
    (minutes: number) => {
      if (isPostStudyRest) return;
      const clamped = Math.max(1, Math.min(90, minutes));
      setTimerRunning(false);
      setTimerHasStarted(false);
      setCustomMinutes(clamped);
      setSecondsLeft(clamped * 60);
    },
    [isPostStudyRest]
  );

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
      completeTimerSession(elapsedMinutes, 'ended_early', selectedStudyMode, isPostStudyRest);
    } else {
      if (isPostStudyRest) {
        setIsPostStudyRest(false);
        setSelectedStudyMode(STUDY_MODE_OPTIONS[0]);
        setCustomMinutes(STUDY_MODE_OPTIONS[0].defaultMinutes);
        setSecondsLeft(STUDY_MODE_OPTIONS[0].defaultMinutes * 60);
      }
      showToast('计时已重置。');
    }
  }, [customMinutes, secondsLeft, selectedStudyMode, isPostStudyRest, completeTimerSession, showToast]);

  const simulateTimerComplete = useCallback(() => {
    setTimerRunning(false);
    setTimerHasStarted(false);
    setSecondsLeft(customMinutes * 60);
    completeTimerSession(customMinutes, 'completed', selectedStudyMode, isPostStudyRest);
  }, [customMinutes, selectedStudyMode, isPostStudyRest, completeTimerSession]);

  const triggerBreakReminderPreview = useCallback(() => {
    setLastCompletedFocusMinutes(customMinutes);
    setShowBreakPopup(true);
  }, [customMinutes]);

  const dismissBreakPopup = useCallback(() => {
    setShowBreakPopup(false);
    showToast('本次未选择休息，未生成可打卡护眼记录。');
  }, [showToast]);

  const startBreakTimerFromPopup = useCallback(() => {
    setShowBreakPopup(false);
    setIsPostStudyRest(true);
    setCustomMinutes(5);
    setSecondsLeft(5 * 60);
    setTimerRunning(true);
    setTimerHasStarted(true);
    setSubPage(null);
    setActiveTab('study');
    showToast('已开始 5 分钟休息计时，完成后将生成可打卡护眼记录。');
  }, [showToast]);

  const buildPosterFromRecord = useCallback(
    (record: CheckInRecord, user: UserProfile): PosterPayload => ({
      id: record.id,
      studentName: user.name,
      school: user.school,
      college: user.college,
      enrollmentYear: user.enrollmentYear,
      activityLabel: record.label,
      leaveReason: record.leaveReason,
      durationMinutes: record.durationMinutes,
      timestamp: record.timestamp,
      locationNote: record.locationNote || '窗边休息角',
      leaveCode: `HL-${record.id.slice(-4).toUpperCase()}`,
      participantOrder: record.participantOrder || BASE_TODAY_CHECKINS,
    }),
    []
  );

  const submitCheckInFromRecord = useCallback(
    (recordId: string, locationNote: string, leaveReason: string): CheckInRecord | null => {
      const targetRecord = persisted.eyeCareRecords.find((r) => r.id === recordId && !r.checkedIn);
      if (!targetRecord) {
        showToast('请先在海露钟自习室完成护眼计时，获取可用护眼记录。');
        return null;
      }

      const meta =
        CHECKIN_ACTIVITIES.find((a) => a.type === targetRecord.activity) || CHECKIN_ACTIVITIES[0];
      const bonus = Math.floor(targetRecord.durationMinutes / 10) * 5;
      const earnedPoints = meta.pointsPerSession + bonus;

      let newlyUnlockedStampTitle: string | undefined;
      const nextParticipantOrder = persisted.todayCheckInParticipants + 1;

      const cleanLocation = locationNote.trim() || '主图书馆窗边';
      const cleanReason = leaveReason.trim() || meta.leaveReason;

      const newCheckIn: CheckInRecord = {
        id: `ci-${Date.now()}`,
        activity: targetRecord.activity,
        label: targetRecord.label,
        durationMinutes: targetRecord.durationMinutes,
        pointsEarned: earnedPoints,
        timestamp: formatNowLabel(),
        locationNote: cleanLocation,
        leaveReason: cleanReason,
        participantOrder: nextParticipantOrder,
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
          newCheckIn.stampUnlocked = newlyUnlockedStampTitle;
        }

        const unlockedCount = nextStamps.filter((s) => s.unlocked).length;
        const nextBadges = prev.badges.map((b) => {
          if (b.id === 'badge-passport-full' && unlockedCount >= 5 && !b.unlocked) {
            return { ...b, unlocked: true, unlockedAt: '今天' };
          }
          return b;
        });

        const nextEyeCareRecords = prev.eyeCareRecords.map((r) =>
          r.id === recordId ? { ...r, checkedIn: true } : r
        );

        return {
          ...prev,
          points: prev.points + earnedPoints,
          todayCheckInParticipants: nextParticipantOrder,
          eyeCareRecords: nextEyeCareRecords,
          checkIns: [newCheckIn, ...prev.checkIns],
          stamps: nextStamps,
          badges: nextBadges,
        };
      });

      const poster = buildPosterFromRecord(newCheckIn, persisted.user);
      setPosterPayload(poster);
      showToast(
        newlyUnlockedStampTitle
          ? `已申请护眼请假条！你是今日第 ${nextParticipantOrder} 位打卡人，解锁「${newlyUnlockedStampTitle}」印章。`
          : `已申请护眼请假条！你是今日第 ${nextParticipantOrder} 位打卡人（+${earnedPoints} 积分）。`
      );
      return newCheckIn;
    },
    [
      persisted.eyeCareRecords,
      persisted.todayCheckInParticipants,
      persisted.user,
      buildPosterFromRecord,
      showToast,
    ]
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
              title: '眼假期护照 · 海露3盒立减24元券',
              discountLabel: '立减 ¥24',
              code: `HZ24-${Math.floor(1000 + Math.random() * 9000)}`,
              source: '护照集章礼 (3枚)',
              expiresAt: '2026-06-07',
              claimedAt: '今天',
            }
          : {
              id: `v-ms5-${Date.now()}`,
              title: '眼假期护照 · 海露5盒立减40元券',
              discountLabel: '立减 ¥40',
              code: `HZ40-${Math.floor(1000 + Math.random() * 9000)}`,
              source: '护照集章礼 (5枚)',
              expiresAt: '2026-06-07',
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
          message: `还差 ${reward.pointsCost - persisted.points} 积分即可兑换该奖品。`,
        };
      }

      const isVoucher = reward.category === 'vouchers' && typeof reward.discountAmount === 'number';
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const code = isVoucher ? `HYLO-${reward.discountAmount}-${randomSuffix}` : `HL-GIFT-${randomSuffix}`;

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

      const voucher: VoucherItem = {
        id: `v-mall-${Date.now()}`,
        title: reward.title,
        discountLabel: isVoucher ? `立减 ¥${reward.discountAmount}` : '实物奖品凭证',
        code,
        source: isVoucher ? '积分商城兑换' : '积分商城周边兑奖',
        expiresAt: '2026-06-07',
        claimedAt: '今天',
      };

      setPersisted((prev) => ({
        ...prev,
        points: prev.points - reward.pointsCost,
        redemptions: [record, ...prev.redemptions],
        vouchers: [voucher, ...prev.vouchers],
      }));

      const msg = isVoucher
        ? `兑换成功「${reward.title}」，券码：${code}`
        : `兑换成功「${reward.title}」，核销码：${code}（请于6月7日前凭码领取）`;
      showToast(msg);
      return { ok: true, message: msg };
    },
    [persisted.totalMinutes, persisted.points, showToast]
  );

  const claimPromoVoucher = useCallback(
    (title: string, discountLabel: string, codePrefix: string): { ok: boolean; message: string } => {
      const alreadyClaimed = persisted.vouchers.some((v) => v.title === title);
      if (alreadyClaimed) {
        return { ok: false, message: '你已领取过该规格优惠券。' };
      }
      const code = `${codePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
      const voucher: VoucherItem = {
        id: `v-promo-${Date.now()}`,
        title,
        discountLabel,
        code,
        source: '海露官方商城活动',
        expiresAt: '2026-06-07',
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

  const pendingEyeCareRecords = useMemo(
    () => persisted.eyeCareRecords.filter((r) => !r.checkedIn),
    [persisted.eyeCareRecords]
  );

  const leaderboardGroups = useMemo(() => {
    const extraMinutes = Math.max(0, persisted.totalMinutes - DEFAULT_STATE.totalMinutes);
    return BASE_LEADERBOARD_GROUPS.map((group) => {
      if (persisted.user.school && group.type === 'college' && group.name === persisted.user.college) {
        const nextTotal = group.totalMinutes + extraMinutes;
        return {
          ...group,
          totalMinutes: nextTotal,
          avgMinutes: Math.round(nextTotal / group.membersCount),
        };
      }
      if (group.id === 'nat-bj') {
        const nextTotal = group.totalMinutes + extraMinutes;
        return {
          ...group,
          totalMinutes: nextTotal,
          avgMinutes: Math.round(nextTotal / group.membersCount),
        };
      }
      return group;
    }).sort((a, b) => b.totalMinutes - a.totalMinutes);
  }, [persisted.totalMinutes, persisted.user.school, persisted.user.college]);

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
    todayCheckInParticipants: persisted.todayCheckInParticipants,
    eyeCareRecords: persisted.eyeCareRecords,
    pendingEyeCareRecords,
    checkIns: persisted.checkIns,
    studySessions: persisted.studySessions,
    stamps: persisted.stamps,
    badges: persisted.badges,
    redemptions: persisted.redemptions,
    vouchers: persisted.vouchers,
    claimedStampMilestones: persisted.claimedStampMilestones,
    posterPayload,
    toastMessage,
    selectedStudyMode,
    isPostStudyRest,
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
    selectStudyMode,
    setCustomTimerMinutes,
    startTimer,
    pauseTimer,
    endTimer,
    simulateTimerComplete,
    triggerBreakReminderPreview,
    dismissBreakPopup,
    startBreakTimerFromPopup,
    submitCheckInFromRecord,
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
