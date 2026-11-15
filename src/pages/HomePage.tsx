import React from 'react';
import {
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  Gift,
  ShoppingBag,
  Stamp,
  Timer,
} from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { HERO_BANNER_IMAGE } from '../data/campaignData';
import { useAppState } from '../context/AppStateContext';

export const HomePage: React.FC = () => {
  const {
    user,
    todayMinutes,
    weekMinutes,
    totalMinutes,
    streakDays,
    points,
    stamps,
    checkIns,
    navigateTab,
    openSubPage,
    openLatestPoster,
  } = useAppState();

  const goal = user.dailyGoalMinutes || 30;
  const progressPct = Math.min(100, Math.round((todayMinutes / goal) * 100));
  const unlockedStamps = stamps.filter((s) => s.unlocked).length;

  const ringRadius = 38;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progressPct / 100);

  return (
    <div className="space-y-6">
      {/* Minimalist Hero Split */}
      <section className="bg-white rounded-3xl border border-slate-200/70 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-9 flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate-500">
              {user.college} · {user.club}
            </p>
            <h1 className="mt-2.5 text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              你好，{user.name}。今天也给双眼留一点清澈的休息时间。
            </h1>
            <p className="mt-2.5 text-sm text-slate-500 leading-relaxed max-w-lg">
              用专注计时陪伴学习，在休息提示响起时望向窗外，积攒你的眼假期护眼印章。
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTab('study')}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Timer className="w-4 h-4" aria-hidden="true" />
              <span>开始专注</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTab('checkin')}
              className="min-h-[48px] px-5 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>护眼打卡</span>
            </button>
            <button
              type="button"
              onClick={openLatestPoster}
              className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm inline-flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <span>请假条</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[200px] lg:min-h-[260px] bg-sky-50">
          <ResilientImage
            src={HERO_BANNER_IMAGE}
            alt="明亮安静的校园图书馆窗台与远处绿树晴空"
            className="w-full h-full object-cover"
            fallbackLabel="校园晴空窗景"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/60 via-transparent to-transparent flex items-end p-5">
            <div className="text-white">
              <p className="text-xs text-sky-100">今日护眼目标</p>
              <p className="text-lg font-bold font-mono tabular-nums">
                {todayMinutes} / {goal} 分钟 ({progressPct}%)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Minimalist Metric Blocks */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">今日护眼</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {todayMinutes}m
            </p>
            <p className="mt-0.5 text-xs text-sky-700 tabular-nums">目标 {goal}m</p>
          </div>
          <svg width="56" height="56" viewBox="0 0 100 100" className="shrink-0 -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r={ringRadius} fill="none" stroke="#EBF4FC" strokeWidth="9" />
            <circle
              cx="50"
              cy="50"
              r={ringRadius}
              fill="none"
              stroke="#0284C7"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringOffset}
            />
          </svg>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/70 p-5">
          <p className="text-xs text-slate-500">连续打卡</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {streakDays} 天
          </p>
          <p className="mt-0.5 text-xs text-slate-400 tabular-nums">
            本周 {weekMinutes}m · 累计 {totalMinutes}m
          </p>
        </div>

        <button
          type="button"
          onClick={() => openSubPage('mall')}
          className="bg-white rounded-2xl border border-slate-200/70 hover:border-sky-300 p-5 text-left transition-colors"
        >
          <p className="text-xs text-slate-500">可用积分</p>
          <p className="mt-1 text-2xl font-bold text-sky-700 font-mono tabular-nums">
            {points}
          </p>
          <p className="mt-0.5 text-xs text-sky-600">前往积分商城 →</p>
        </button>

        <button
          type="button"
          onClick={() => navigateTab('profile')}
          className="bg-white rounded-2xl border border-slate-200/70 hover:border-sky-300 p-5 text-left transition-colors"
        >
          <p className="text-xs text-slate-500">护照印章</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {unlockedStamps} / 5
          </p>
          <p className="mt-0.5 text-xs text-sky-600">
            {unlockedStamps >= 3 ? '已解锁集章礼 →' : `还差 ${3 - unlockedStamps} 枚解锁 →`}
          </p>
        </button>
      </section>

      {/* Stamp Wall Preview & Minimalist Shortcuts */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">眼假期护照进度</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  集齐 3 枚领 8 折券 · 集齐 5 枚领校园护眼礼盒
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigateTab('profile')}
                className="text-xs font-medium text-sky-700 hover:text-sky-900 whitespace-nowrap shrink-0"
              >
                查看全部
              </button>
            </div>

            <div className="mt-5 grid grid-cols-5 gap-2.5">
              {stamps.map((stamp) => (
                <button
                  key={stamp.id}
                  type="button"
                  onClick={() => navigateTab('profile')}
                  className={`min-h-[82px] rounded-2xl border p-2.5 flex flex-col items-center justify-center text-center transition-colors ${
                    stamp.unlocked
                      ? 'bg-sky-50/70 border-sky-200 text-sky-900'
                      : 'bg-slate-50/50 border-dashed border-slate-200 text-slate-400 hover:border-sky-200'
                  }`}
                >
                  <Stamp
                    className={`w-4 h-4 mb-1.5 ${stamp.unlocked ? 'text-sky-600' : 'text-slate-300'}`}
                    aria-hidden="true"
                  />
                  <span className="text-[11px] font-medium leading-tight">{stamp.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>最近记录：{checkIns[0]?.label || '暂无'}</span>
            <span className="tabular-nums">{checkIns[0]?.timestamp || ''}</span>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-3.5">
          <button
            type="button"
            onClick={() => openSubPage('promo')}
            className="bg-sky-600 hover:bg-sky-700 text-white rounded-2xl p-5 text-left flex items-center justify-between gap-4 transition-colors"
          >
            <div>
              <p className="text-xs text-sky-100">校园专属礼券</p>
              <h3 className="mt-1 text-base font-bold">领取海露校园护眼礼盒券</h3>
              <p className="mt-1 text-xs text-sky-100/90">
                蒸汽眼罩与夜间修护组合，学生最高立省 33%
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
          </button>

          <div className="grid grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => openSubPage('mall')}
              className="bg-white hover:border-sky-300 rounded-2xl border border-slate-200/70 p-4 text-left flex flex-col justify-between min-h-[96px] transition-colors"
            >
              <Gift className="w-5 h-5 text-sky-600" aria-hidden="true" />
              <div className="mt-3">
                <h3 className="text-sm font-bold text-slate-900">积分商城</h3>
                <p className="text-xs text-slate-400 mt-0.5">小样与周边</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => openSubPage('rules')}
              className="bg-white hover:border-sky-300 rounded-2xl border border-slate-200/70 p-4 text-left flex flex-col justify-between min-h-[96px] transition-colors"
            >
              <BookOpen className="w-5 h-5 text-sky-600" aria-hidden="true" />
              <div className="mt-3">
                <h3 className="text-sm font-bold text-slate-900">活动规则</h3>
                <p className="text-xs text-slate-400 mt-0.5">阶梯与说明</p>
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigateTab('leaderboard')}
            className="bg-white hover:border-sky-300 rounded-2xl border border-slate-200/70 p-4 text-left flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">校园远眺排行榜</h3>
                <p className="text-xs text-slate-400">查看{user.college}实时排名</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
};
