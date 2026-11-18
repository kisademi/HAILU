import React from 'react';
import { Timer, X } from 'lucide-react';
import { HyloMascotCharacter } from './HyloBrandAssets';
import { useAppState } from '../context/AppStateContext';

export const BreakPopupModal: React.FC = () => {
  const {
    showBreakPopup,
    lastCompletedFocusMinutes,
    dismissBreakPopup,
    startBreakTimerFromPopup,
  } = useAppState();

  if (!showBreakPopup) return null;

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
          <div className="w-16 h-20 rounded-2xl bg-[#F2F8FE] border border-sky-100 flex items-center justify-center p-1.5 shrink-0">
            <HyloMascotCharacter className="w-12 h-18" />
          </div>
          <button
            type="button"
            onClick={dismissBreakPopup}
            aria-label="暂不休息"
            className="min-h-[44px] min-w-[44px] -mt-2 -mr-2 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-4 text-xs text-sky-700">
          已完成 {lastCompletedFocusMinutes} 分钟「学习/工作」
        </p>
        <h2 id="break-popup-title" className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">
          让眼睛休息一下！
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          海露提醒你进行 5 分钟护眼休息。选择休息并完成后，即可留下一条可用于打卡、申请护眼请假条的护眼记录。
        </p>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>休息建议 · 远眺或闭目养神</span>
          <span className="font-mono text-sky-700 tabular-nums">5 分钟</span>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={startBreakTimerFromPopup}
            className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Timer className="w-4 h-4" aria-hidden="true" />
            <span>开始 5 分钟休息（完成后生成打卡记录）</span>
          </button>
          <button
            type="button"
            onClick={dismissBreakPopup}
            className="w-full min-h-[44px] px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-sm transition-colors"
          >
            暂不休息（不生成护眼记录）
          </button>
        </div>
      </div>
    </div>
  );
};
