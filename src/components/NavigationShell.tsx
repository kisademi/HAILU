import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Home,
  Timer,
  Trophy,
  User,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { SubPageId, TabId } from '../types';

const NAV_TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'study', label: '自习室', icon: Timer },
  { id: 'checkin', label: '打卡', icon: CheckCircle2 },
  { id: 'leaderboard', label: '排行榜', icon: Trophy },
  { id: 'profile', label: '我的', icon: User },
];

const SUBPAGE_TITLES: Record<Exclude<SubPageId, null>, string> = {
  mall: '积分商城',
  rules: '活动规则',
  promo: '校园专享好礼',
  poster: '护眼请假条',
};

export const NavigationShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeTab,
    subPage,
    navigateTab,
    openSubPage,
    timerRunning,
    secondsLeft,
    toastMessage,
    clearToast,
  } = useAppState();

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const mobileTitle = subPage
    ? SUBPAGE_TITLES[subPage]
    : NAV_TABS.find((t) => t.id === activeTab)?.label || '海露钟';

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAFE] text-slate-900">
      {/* Desktop Top Bar (Minimalist 3-Zone Contract) */}
      <header className="hidden md:block sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/70">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => navigateTab('home')}
            className="text-base font-bold tracking-tight text-slate-900 hover:text-sky-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <Eye className="w-5 h-5 text-sky-600" aria-hidden="true" />
            <span>海露钟</span>
          </button>

          <nav aria-label="主导航" className="flex items-center gap-7">
            {NAV_TABS.map((tab) => {
              const isActive = !subPage && activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigateTab(tab.id)}
                  className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                    isActive
                      ? 'text-sky-700 border-sky-600'
                      : 'text-slate-500 border-transparent hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => navigateTab('study')}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <Timer className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="tabular-nums">
                {timerRunning ? `专注中 ${mm}:${ss}` : '开始专注'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Top Bar */}
      <header className="md:hidden sticky top-0 z-30 h-12 bg-white/90 backdrop-blur-md border-b border-slate-200/70 px-3 flex items-center justify-between">
        <div className="w-11 flex items-center justify-start">
          {subPage ? (
            <button
              type="button"
              onClick={() => openSubPage(null)}
              aria-label="返回"
              className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center text-slate-700 hover:text-sky-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Eye className="w-4 h-4" aria-hidden="true" />
            </div>
          )}
        </div>

        <h1 className="text-sm font-semibold text-slate-900 truncate max-w-[60vw]">
          {mobileTitle}
        </h1>

        <div className="w-11 flex items-center justify-end">
          {timerRunning ? (
            <button
              type="button"
              onClick={() => navigateTab('study')}
              className="text-xs font-mono font-semibold text-sky-700 tabular-nums whitespace-nowrap"
            >
              {mm}:{ss}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openSubPage('rules')}
              className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-xs font-medium text-sky-700"
            >
              规则
            </button>
          )}
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 md:top-20 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md">
          <div className="bg-slate-900/95 text-white text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between gap-3">
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={clearToast}
              className="text-sky-300 hover:text-white text-xs font-medium shrink-0 whitespace-nowrap"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-24 md:py-10">
        {subPage && (
          <div className="hidden md:flex items-center justify-between mb-6 pb-4 border-b border-slate-200/70">
            <button
              type="button"
              onClick={() => openSubPage(null)}
              className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回{NAV_TABS.find((t) => t.id === activeTab)?.label || '首页'}</span>
            </button>
            <span className="text-xs text-slate-500">{SUBPAGE_TITLES[subPage]}</span>
          </div>
        )}
        {children}
      </main>

      {/* Mobile Fixed 5-Tab Bottom Bar */}
      <nav
        aria-label="底部导航"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/70 pb-safe"
      >
        <div className="grid grid-cols-5 h-14 items-center">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = !subPage && activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => navigateTab(tab.id)}
                className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                  isActive ? 'text-sky-600' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className="text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
