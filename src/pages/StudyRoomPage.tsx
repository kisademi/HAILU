import React from 'react';
import { BellRing, CheckCircle2, FastForward, Pause, Play, Square } from 'lucide-react';
import { HyloMascotCharacter } from '../components/HyloBrandAssets';
import { STUDY_MODE_OPTIONS } from '../data/campaignData';
import { useAppState } from '../context/AppStateContext';

const QUICK_MINUTES = [5, 10, 15, 25, 45];

export const StudyRoomPage: React.FC = () => {
  const {
    selectedStudyMode,
    isPostStudyRest,
    customMinutes,
    secondsLeft,
    timerRunning,
    timerHasStarted,
    studySessions,
    pendingEyeCareRecords,
    selectStudyMode,
    setCustomTimerMinutes,
    startTimer,
    pauseTimer,
    endTimer,
    simulateTimerComplete,
    triggerBreakReminderPreview,
    navigateTab,
  } = useAppState();

  const totalSeconds = customMinutes * 60;
  const elapsedFraction = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const radius = 108;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - elapsedFraction);

  const activeTitle = isPostStudyRest ? '课间 5 分钟护眼休息' : selectedStudyMode.label;
  const activeHint = isPostStudyRest
    ? '你已选择学习/工作后的 5 分钟休息，倒计时完成后将生成一条可打卡的护眼记录。'
    : selectedStudyMode.description;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Timer & 6 Mode Selector */}
      <section className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-14 rounded-2xl bg-[#F2F8FE] border border-sky-100 flex items-center justify-center p-1 shrink-0">
              <HyloMascotCharacter className="w-8 h-12" />
            </div>
            <div>
              <p className="text-xs text-sky-700">
                {isPostStudyRest
                  ? '休息护眼中'
                  : selectedStudyMode.kind === 'study'
                    ? '专注事务'
                    : '护眼行为计时'}
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                海露钟自习室
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={triggerBreakReminderPreview}
              className="min-h-[40px] px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <BellRing className="w-3.5 h-3.5" aria-hidden="true" />
              <span>休息提示弹窗</span>
            </button>
          </div>
        </div>

        {/* 6 Focus / Eye-Care Options */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-600">1. 选择本次专注内容</span>
            <span className="text-[11px] text-slate-400">
              除「学习/工作」外均为直接护眼行为
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STUDY_MODE_OPTIONS.map((mode) => {
              const active = !isPostStudyRest && selectedStudyMode.id === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => selectStudyMode(mode)}
                  className={`min-h-[54px] px-3 py-2.5 rounded-2xl border text-left transition-colors ${
                    active
                      ? 'bg-sky-50/80 border-sky-500 text-sky-950'
                      : 'bg-white border-slate-200 hover:border-sky-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold">{mode.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {mode.kind === 'study' ? '结束提醒休息5分钟' : '完成后可直接打卡'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timer Ring */}
        <div className="mt-7 flex flex-col items-center">
          <div className="relative w-60 h-60 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 250 250" aria-hidden="true">
              <circle
                cx="125"
                cy="125"
                r={radius}
                fill="none"
                stroke="#EDF4FB"
                strokeWidth="10"
              />
              <circle
                cx="125"
                cy="125"
                r={radius}
                fill="none"
                stroke={isPostStudyRest || selectedStudyMode.kind === 'eyecare' ? '#0EA5E9' : '#0284C7'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-[stroke-dashoffset] duration-500 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <span className="text-xs text-slate-400">
                {timerRunning ? '进行中' : timerHasStarted ? '已暂停' : '准备就绪'}
              </span>
              <span className="mt-1 text-5xl font-bold font-mono text-slate-900 tracking-tight tabular-nums">
                {mm}:{ss}
              </span>
              <span className="mt-2 text-xs font-medium text-sky-700">{activeTitle}</span>
            </div>
          </div>

          {/* Duration Picker */}
          {!isPostStudyRest && (
            <div className="mt-6 w-full max-w-md space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>2. 选择时长</span>
                <span className="font-mono font-medium text-slate-900 tabular-nums">
                  {customMinutes} 分钟
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {QUICK_MINUTES.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    disabled={timerRunning}
                    onClick={() => setCustomTimerMinutes(mins)}
                    className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-mono transition-colors disabled:opacity-50 ${
                      customMinutes === mins
                        ? 'bg-sky-600 text-white'
                        : 'bg-[#F6FAFE] text-slate-600 hover:bg-sky-50'
                    }`}
                  >
                    {mins}分钟
                  </button>
                ))}
              </div>

              <input
                id="pomodoro-duration-range"
                aria-label="自定义倒计时时长"
                type="range"
                min={1}
                max={90}
                value={customMinutes}
                disabled={timerRunning}
                onChange={(e) => setCustomTimerMinutes(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer disabled:opacity-50"
              />
            </div>
          )}

          {/* Controls */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 w-full max-w-md">
            {!timerRunning ? (
              <button
                type="button"
                onClick={startTimer}
                className="flex-1 min-w-[130px] min-h-[48px] px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <Play className="w-4 h-4" aria-hidden="true" />
                <span>{timerHasStarted ? '继续' : '开始计时'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={pauseTimer}
                className="flex-1 min-w-[130px] min-h-[48px] px-5 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <Pause className="w-4 h-4" aria-hidden="true" />
                <span>暂停</span>
              </button>
            )}

            <button
              type="button"
              onClick={endTimer}
              className="min-h-[48px] px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Square className="w-4 h-4" aria-hidden="true" />
              <span>结束</span>
            </button>

            <button
              type="button"
              onClick={simulateTimerComplete}
              className="min-h-[48px] px-4 py-3 rounded-xl border border-sky-200 hover:bg-sky-50 text-sky-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <FastForward className="w-3.5 h-3.5" aria-hidden="true" />
              <span>完成本次计时</span>
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-500 text-center max-w-md leading-relaxed">
            {activeHint}
          </p>
        </div>
      </section>

      {/* Right: Pending Check-inable Eye Care Records + Session History */}
      <section className="lg:col-span-5 space-y-5">
        <div className="bg-white rounded-3xl border border-slate-200/70 p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900">可打卡护眼记录</h2>
            <span className="text-xs font-mono text-sky-700 tabular-nums">
              待申请 {pendingEyeCareRecords.length} 条
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            完成 5 分钟学习后休息，或直接完成望向远方等护眼行为后生成。
          </p>

          {pendingEyeCareRecords.length > 0 ? (
            <div className="mt-4 divide-y divide-slate-100">
              {pendingEyeCareRecords.slice(0, 4).map((rec) => (
                <div key={rec.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{rec.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {rec.completedAt} · {rec.sourceLabel}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-sky-700 tabular-nums whitespace-nowrap">
                    {rec.durationMinutes} 分钟
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-xs text-slate-400 py-3">
              暂无待打卡记录，完成一次护眼计时或休息后即可去申请护眼请假条。
            </p>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigateTab('checkin')}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>去打卡页申请护眼请假条</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/70 p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900">近期自习室记录</h2>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              共 {studySessions.length} 次
            </span>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {studySessions.slice(0, 5).map((session) => (
              <div key={session.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{session.modeLabel}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {session.completedAt} ·{' '}
                    {session.isEyeCareRecord ? '已生成护眼记录' : '学习/工作记录'}
                  </p>
                </div>
                <span className="text-sm font-mono font-medium text-sky-700 tabular-nums whitespace-nowrap">
                  {session.focusMinutes} 分钟
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
