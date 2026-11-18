import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  Gift,
  LogOut,
  QrCode,
  Settings,
  Stamp,
  Ticket,
} from 'lucide-react';
import { COLLEGES } from '../data/campaignData';
import { useAppState } from '../context/AppStateContext';

export const ProfilePassportPage: React.FC = () => {
  const {
    user,
    todayMinutes,
    weekMinutes,
    totalMinutes,
    streakDays,
    points,
    stamps,
    badges,
    vouchers,
    claimedStampMilestones,
    syncOfflineStamp,
    claimStampMilestone,
    updateUserSettings,
    openSubPage,
    signOut,
  } = useAppState();

  const [boothCode, setBoothCode] = useState('');
  const [syncMessage, setSyncMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const unlockedCount = stamps.filter((s) => s.unlocked).length;

  const handleSyncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boothCode.trim()) return;
    const res = syncOfflineStamp(boothCode);
    setSyncMessage({ ok: res.ok, text: res.message });
    if (res.ok) setBoothCode('');
  };

  const handleQuickBoothSync = (code: string) => {
    const res = syncOfflineStamp(code);
    setSyncMessage({ ok: res.ok, text: res.message });
  };

  const handleMilestoneClaim = (threshold: 3 | 5) => {
    const res = claimStampMilestone(threshold);
    setSyncMessage({ ok: res.ok, text: res.message });
  };

  const profileSubline = user.school
    ? `${user.school}${user.college ? ` · ${user.college}` : ''}${user.enrollmentYear ? ` · ${user.enrollmentYear}入学` : ''}`
    : `未填写学校（已参与全国排行）${user.enrollmentYear ? ` · ${user.enrollmentYear}入学` : ''}`;

  return (
    <div className="space-y-6">
      {/* Passport Identity */}
      <section className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-sky-600 text-white font-display font-bold text-base flex items-center justify-center shrink-0">
              {user.avatarInitials}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {user.name}的眼假期护照
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">{profileSubline}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openSubPage('mall')}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Gift className="w-3.5 h-3.5" aria-hidden="true" />
              <span>积分商城 ({points})</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSettings((prev) => !prev)}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Settings className="w-3.5 h-3.5" aria-hidden="true" />
              <span>设置</span>
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="rounded-2xl bg-[#F6FAFE] border border-slate-200/60 p-4">
            <p className="text-xs text-slate-400">今日时长</p>
            <p className="mt-1 text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {todayMinutes}m
            </p>
          </div>
          <div className="rounded-2xl bg-[#F6FAFE] border border-slate-200/60 p-4">
            <p className="text-xs text-slate-400">本周时长</p>
            <p className="mt-1 text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {weekMinutes}m
            </p>
          </div>
          <div className="rounded-2xl bg-[#F6FAFE] border border-slate-200/60 p-4">
            <p className="text-xs text-slate-400">累计总时长</p>
            <p className="mt-1 text-2xl font-bold font-mono text-sky-700 tabular-nums">
              {totalMinutes}m
            </p>
          </div>
          <div className="rounded-2xl bg-[#F6FAFE] border border-slate-200/60 p-4">
            <p className="text-xs text-slate-400">连续打卡</p>
            <p className="mt-1 text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {streakDays} 天
            </p>
          </div>
        </div>
      </section>

      {/* Settings Panel */}
      {showSettings && (
        <section className="bg-white rounded-3xl border border-sky-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">个人资料与提醒设置</h2>
            <button
              type="button"
              onClick={signOut}
              className="min-h-[40px] px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>退出 / 切换账号</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="set-school" className="block text-xs font-medium text-slate-600 mb-1.5">
                学校（选填，留空则仅入全国榜）
              </label>
              <input
                id="set-school"
                type="text"
                value={user.school}
                onChange={(e) => updateUserSettings({ school: e.target.value })}
                placeholder="选填，如：清华大学"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>

            <div>
              <label htmlFor="set-college" className="block text-xs font-medium text-slate-600 mb-1.5">
                所在学院（填学校后生效）
              </label>
              <select
                id="set-college"
                value={user.college || COLLEGES[0]}
                disabled={!user.school.trim()}
                onChange={(e) => updateUserSettings({ college: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm bg-white disabled:bg-slate-50 disabled:text-slate-400"
              >
                {COLLEGES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="set-enrollment" className="block text-xs font-medium text-slate-600 mb-1.5">
                入学时间（选填）
              </label>
              <input
                id="set-enrollment"
                type="text"
                value={user.enrollmentYear}
                onChange={(e) => updateUserSettings({ enrollmentYear: e.target.value })}
                placeholder="选填，如：2024年9月"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>

            <div>
              <label htmlFor="set-goal" className="block text-xs font-medium text-slate-600 mb-1.5">
                每日护眼目标（分钟）
              </label>
              <input
                id="set-goal"
                type="number"
                min={10}
                max={120}
                value={user.dailyGoalMinutes}
                onChange={(e) =>
                  updateUserSettings({ dailyGoalMinutes: Math.max(10, Number(e.target.value)) })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={user.breakReminderEnabled}
                onChange={(e) => updateUserSettings({ breakReminderEnabled: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-sky-600"
              />
              <span>专注结束后弹出「让眼睛休息一下！」提示</span>
            </label>
            <label className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={user.soundEnabled}
                onChange={(e) => updateUserSettings({ soundEnabled: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-sky-600"
              />
              <span>开启轻柔结束提示音</span>
            </label>
          </div>
        </section>
      )}

      {/* 5-Slot Stamp Wall */}
      <section className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              护眼集章墙 ({unlockedCount}/5)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              线上打卡自动集章，亦可在校园展位输入暗号同步线下印章。
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleMilestoneClaim(3)}
              disabled={unlockedCount < 3 || claimedStampMilestones.includes(3)}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                claimedStampMilestones.includes(3)
                  ? 'bg-sky-50 text-sky-700'
                  : unlockedCount >= 3
                    ? 'bg-sky-600 hover:bg-sky-700 text-white'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {claimedStampMilestones.includes(3) ? '已领 3 章奖励' : '领取 3 章立减 ¥24 券'}
            </button>
            <button
              type="button"
              onClick={() => handleMilestoneClaim(5)}
              disabled={unlockedCount < 5 || claimedStampMilestones.includes(5)}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                claimedStampMilestones.includes(5)
                  ? 'bg-sky-50 text-sky-700'
                  : unlockedCount >= 5
                    ? 'bg-sky-600 hover:bg-sky-700 text-white'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {claimedStampMilestones.includes(5) ? '已领 5 章奖励' : '领取 5 章立减 ¥40 券'}
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {stamps.map((stamp) => (
            <div
              key={stamp.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between min-h-[140px] ${
                stamp.unlocked
                  ? 'bg-sky-50/70 border-sky-200 text-slate-900'
                  : 'bg-slate-50/50 border-dashed border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                  0{stamp.slotIndex}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    stamp.unlocked ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Stamp className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm font-bold text-slate-900">{stamp.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stamp.subtitle}</p>
              </div>

              <p className="mt-3 text-[11px] text-sky-700">
                {stamp.unlocked ? stamp.unlockedAt : stamp.requirement}
              </p>
            </div>
          ))}
        </div>

        {/* Offline Stamp Sync */}
        <form
          onSubmit={handleSyncSubmit}
          className="mt-6 pt-5 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <QrCode className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-slate-900">同步线下护照印章</p>
              <p className="text-xs text-slate-500">
                在校园快闪点打卡后可输入展位码同步（点击试填{' '}
                <button
                  type="button"
                  onClick={() => handleQuickBoothSync('LIB2026')}
                  className="font-mono font-medium text-sky-700 underline"
                >
                  LIB2026
                </button>{' '}
                或{' '}
                <button
                  type="button"
                  onClick={() => handleQuickBoothSync('REST05')}
                  className="font-mono font-medium text-sky-700 underline"
                >
                  REST05
                </button>
                ）。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={boothCode}
              onChange={(e) => setBoothCode(e.target.value)}
              placeholder="输入展位码"
              aria-label="线下展位同步码"
              className="h-11 px-3.5 rounded-xl border border-slate-200 font-mono text-sm uppercase w-40 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
            <button
              type="submit"
              className="min-h-[44px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium transition-colors whitespace-nowrap"
            >
              立即同步
            </button>
          </div>
        </form>

        {syncMessage && (
          <p
            role="status"
            className={`mt-3 text-xs font-medium ${
              syncMessage.ok ? 'text-sky-700' : 'text-amber-700'
            }`}
          >
            {syncMessage.text}
          </p>
        )}
      </section>

      {/* Digital Badges + Vouchers Wallet */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/70 p-6">
          <h2 className="text-base font-bold text-slate-900">电子勋章</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-2xl border p-4 flex items-start gap-3 ${
                  badge.unlocked
                    ? 'bg-sky-50/50 border-sky-200'
                    : 'bg-slate-50/60 border-slate-200/70 opacity-70'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    badge.unlocked ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {badge.unlocked ? (
                    <Check className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Award className="w-4 h-4" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{badge.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{badge.criteria}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/70 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-slate-900">我的卡券</h2>
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                {vouchers.length} 张
              </span>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {vouchers.map((v) => (
                <div key={v.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Ticket className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{v.title}</p>
                      <p className="text-xs text-slate-400">
                        {v.source} · 有效期至 {v.expiresAt}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-sky-700 shrink-0">
                    {v.code}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openSubPage('promo')}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-medium transition-colors"
            >
              前往官方商城领券
            </button>
            <button
              type="button"
              onClick={() => openSubPage('rules')}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>活动规则与免责说明</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
