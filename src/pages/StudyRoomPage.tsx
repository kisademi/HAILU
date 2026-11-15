import React from 'react';
import { BellRing, CheckCircle2, Pause, Play, Square } from 'lucide-react';
import { POMODORO_PRESETS } from '../data/campaignData';
import { useAppState } from '../context/AppStateContext';

export const StudyRoomPage: React.FC = () => {
  const {
    selectedPreset,
    customMinutes,
    secondsLeft,
    timerRunning,
    timerHasStarted,
    studySessions,
    selectPreset,
    setCustomTimerMinutes,
    startTimer,
    pauseTimer,
    endTimer,
    triggerBreakReminderPreview,
    navigateTab,
  } = useAppState();

  const totalSeconds = customMinutes * 60;
  const elapsedFraction = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const radius = 112;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - elapsedFraction);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Minimalist Pomodoro Timer */}
      <section className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-sky-700">
              {selectedPreset.kind === 'focus' ? '专注模式' : '护眼模式'}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              海露钟自习室
            </h1>
          </div>

          <button
            type="button"
            onClick={triggerBreakReminderPreview}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <BellRing className="w-3.5 h-3.5" aria-hidden="true" />
            <span>预览休息弹窗</span>
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#F6FAFE] rounded-2xl border border-slate-200/60">
          {POMODORO_PRESETS.map((preset) => {
            const active = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => selectPreset(preset)}
                className={`min-h-[40px] px-2.5 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-white text-sky-800 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Timer Ring */}
        <div className="mt-8 flex flex-col items-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260" aria-hidden="true">
              <circle
                cx="130"
                cy="130"
                r={radius}
                fill="none"
                stroke="#EDF4FB"
                strokeWidth="10"
              />
              <circle
                cx="130"
                cy="130"
                r={radius}
                fill="none"
                stroke={selectedPreset.kind === 'rest' ? '#0EA5E9' : '#0284C7'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-[stroke-dashoffset] duration-500 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-slate-400">
                {timerRunning
                  ? selectedPreset.kind === 'rest'
                    ? '正在闭目休息'
                    : '专注进行中'
                  : timerHasStarted
                    ? '已暂停'
                    : '准备就绪'}
              </span>
              <span className="mt-1 text-5xl font-bold font-mono text-slate-900 tracking-tight tabular-nums">
                {mm}:{ss}
              </span>
              <span className="mt-2 text-xs text-sky-700">
                {selectedPreset.label}
              </span>
            </div>
          </div>

          {/* Slider */}
          <div className="mt-6 w-full max-w-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <label htmlFor="pomodoro-duration-range">自定义倒计时</label>
              <span className="font-mono font-medium text-slate-900 tabular-nums">
                {customMinutes} 分钟
              </span>
            </div>
            <input
              id="pomodoro-duration-range"
              type="range"
              min={1}
              max={60}
              value={customMinutes}
              disabled={timerRunning}
              onChange={(e) => setCustomTimerMinutes(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer disabled:opacity-50"
            />
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-3 w-full max-w-sm">
            {!timerRunning ? (
              <button
                type="button"
                onClick={startTimer}
                className="flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <Play className="w-4 h-4" aria-hidden="true" />
                <span>{timerHasStarted ? '继续专注' : '开始计时'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={pauseTimer}
                className="flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <Pause className="w-4 h-4" aria-hidden="true" />
                <span>暂停</span>
              </button>
            )}

            <button
              type="button"
              onClick={endTimer}
              className="min-h-[48px] px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <Square className="w-4 h-4" aria-hidden="true" />
              <span>结束</span>
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-400 text-center max-w-md">
            {selectedPreset.description} 倒计时结束将自动弹出「让眼睛休息一下！」提示。
          </p>
        </div>
      </section>

      {/* Right: Current Eye-Care Session Records */}
      <section className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-slate-900">本次与近期专注记录</h2>
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            共 {studySessions.length} 次
          </span>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {studySessions.slice(0, 6).map((session) => (
            <div key={session.id} className="py-3.5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{session.modeLabel}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {session.completedAt} ·{' '}
                  {session.status === 'completed' ? '已完成 (+10 积分)' : '提前结束'}
                </p>
              </div>
              <span className="text-sm font-mono font-medium text-sky-700 tabular-nums whitespace-nowrap">
                {session.focusMinutes} 分钟
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigateTab('checkin')}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span>去完成一次护眼打卡</span>
          </button>
        </div>
      </section>
    </div>
  );
};
