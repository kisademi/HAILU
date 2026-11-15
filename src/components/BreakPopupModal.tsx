import React from 'react';
import { Eye, Sparkles, Timer, X } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export const BreakPopupModal: React.FC = () => {
  const {
    showBreakPopup,
    lastCompletedFocusMinutes,
    dismissBreakPopup,
    startBreakTimerFromPopup,
    submitCheckIn,
    openSubPage,
  } = useAppState();

  if (!showBreakPopup) return null;

  const handleQuickGazeCheckIn = () => {
    submitCheckIn('distant_gaze', 5, '专注结束后远眺');
    dismissBreakPopup();
    openSubPage('poster');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/35 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="break-popup-title"
    >
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8">
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5 sm:hidden" />
        <div className="flex items-start justify-between gap-4">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
            <Eye className="w-5 h-5" aria-hidden="true" />
          </div>
          <button
            type="button"
            onClick={dismissBreakPopup}
            aria-label="关闭休息提醒"
            className="min-h-[44px] min-w-[44px] -mt-2 -mr-2 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-4 text-xs text-sky-700">
          已完成 {lastCompletedFocusMinutes} 分钟专注
        </p>
        <h2 id="break-popup-title" className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">
          让眼睛休息一下！
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          请抬头望向窗外 6 米以外的树梢或云朵至少 20 秒，让肩颈和睫状肌慢慢放松。
        </p>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>20-20-20 护眼法则</span>
          <span className="font-mono text-sky-700 tabular-nums">6 米外 · 20 秒</span>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={startBreakTimerFromPopup}
            className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Timer className="w-4 h-4" aria-hidden="true" />
            <span>开启 5 分钟闭目小憩</span>
          </button>
          <button
            type="button"
            onClick={handleQuickGazeCheckIn}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>打卡 5 分钟远眺并生成请假条</span>
          </button>
          <button
            type="button"
            onClick={dismissBreakPopup}
            className="w-full min-h-[44px] px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-sm transition-colors"
          >
            稍后再说
          </button>
        </div>
      </div>
    </div>
  );
};
