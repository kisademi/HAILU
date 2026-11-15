import React, { useState } from 'react';
import { CheckCircle2, FileImage, MapPin, Sparkles } from 'lucide-react';
import { CHECKIN_ACTIVITIES } from '../data/campaignData';
import { useAppState } from '../context/AppStateContext';
import { CheckInActivityType } from '../types';

const DURATION_OPTIONS = [5, 10, 15, 20, 30];

export const CheckInPage: React.FC = () => {
  const { checkIns, submitCheckIn, openPosterForCheckIn, openSubPage } = useAppState();
  const [selectedActivity, setSelectedActivity] = useState<CheckInActivityType>('distant_gaze');
  const [duration, setDuration] = useState<number>(10);
  const [locationNote, setLocationNote] = useState<string>('主图书馆四楼窗边');
  const [justSubmittedId, setJustSubmittedId] = useState<string | null>(null);

  const activeMeta =
    CHECKIN_ACTIVITIES.find((a) => a.type === selectedActivity) || CHECKIN_ACTIVITIES[0];

  const handleSelectActivity = (type: CheckInActivityType, recommended: number) => {
    setSelectedActivity(type);
    setDuration(recommended);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = submitCheckIn(selectedActivity, duration, locationNote);
    setJustSubmittedId(created.id);
    openSubPage('poster');
  };

  const previewPoints = activeMeta.pointsPerSession + Math.floor(duration / 10) * 5;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Minimalist Check-in Form */}
      <section className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8">
        <p className="text-xs text-sky-700">护眼打卡与请假条</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          记录一次屏幕留白，生成护眼请假条
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          选择护眼方式与时长，即可累计积分并点亮眼假期护照印章。
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <span className="block text-xs font-medium text-slate-600 mb-2.5">
              1. 选择护眼行为
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CHECKIN_ACTIVITIES.map((act) => {
                const isSelected = act.type === selectedActivity;
                return (
                  <button
                    key={act.type}
                    type="button"
                    onClick={() => handleSelectActivity(act.type, act.recommendedMinutes)}
                    className={`min-h-[60px] p-3.5 rounded-2xl border text-left transition-colors ${
                      isSelected
                        ? 'bg-sky-50/80 border-sky-500 text-sky-950'
                        : 'bg-white border-slate-200 hover:border-sky-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{act.label}</span>
                      <span className="text-xs font-mono text-sky-700 tabular-nums shrink-0">
                        +{act.pointsPerSession} 积分
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-1">{act.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-medium text-slate-600">2. 休息时长</span>
              <span className="text-xs font-mono text-sky-700 tabular-nums">
                {duration} 分钟 · 预计 +{previewPoints} 积分
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDuration(mins)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-medium font-mono tabular-nums transition-colors ${
                    duration === mins
                      ? 'bg-sky-600 text-white'
                      : 'bg-[#F6FAFE] text-slate-600 hover:bg-sky-50'
                  }`}
                >
                  {mins} 分钟
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="checkin-location" className="block text-xs font-medium text-slate-600 mb-1.5">
              3. 打卡地点（将印在请假条海报上）
            </label>
            <div className="relative">
              <MapPin
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="checkin-location"
                type="text"
                value={locationNote}
                onChange={(e) => setLocationNote(e.target.value)}
                placeholder="例如：银杏林荫道或图书馆窗边"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs text-sky-700 font-medium">
              请假条事由预览 · {activeMeta.leaveHeadline}
            </p>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              「{activeMeta.leaveReason}」
            </p>
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>完成打卡并生成护眼请假条</span>
          </button>
        </form>
      </section>

      {/* Right: Daily Activity Log */}
      <section className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-slate-900">打卡记录</h2>
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            共 {checkIns.length} 条
          </span>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {checkIns.map((item) => (
            <div
              key={item.id}
              className={`py-4 flex items-start justify-between gap-3 ${
                justSubmittedId === item.id ? 'bg-sky-50/50 -mx-3 px-3 rounded-xl' : ''
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-slate-900 truncate">{item.label}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {item.timestamp} · {item.locationNote}
                </p>
                <p className="mt-1 text-xs font-mono text-sky-700 tabular-nums">
                  {item.durationMinutes} 分钟 · +{item.pointsEarned} 积分
                  {item.stampUnlocked ? ` · 解锁「${item.stampUnlocked}」` : ''}
                </p>
              </div>

              <button
                type="button"
                onClick={() => openPosterForCheckIn(item)}
                className="min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 text-xs font-medium inline-flex items-center gap-1.5 shrink-0 transition-colors whitespace-nowrap"
              >
                <FileImage className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
                <span>请假条</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
