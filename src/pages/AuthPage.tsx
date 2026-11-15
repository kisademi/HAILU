import React, { useState } from 'react';
import { ArrowRight, Eye, ShieldCheck } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { COLLEGES, HERO_BANNER_IMAGE, STUDENT_CLUBS } from '../data/campaignData';
import { useAppState } from '../context/AppStateContext';

export const AuthPage: React.FC = () => {
  const { user, authorizeUser } = useAppState();
  const [name, setName] = useState(user.name);
  const [studentId, setStudentId] = useState(user.studentId);
  const [college, setCollege] = useState(user.college);
  const [club, setClub] = useState(user.club);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError('请先确认并同意校园护眼活动参与说明。');
      return;
    }
    if (!name.trim()) {
      setError('请输入你的昵称或姓名。');
      return;
    }
    setError(null);
    authorizeUser({
      name: name.trim(),
      studentId: studentId.trim() || '20260418',
      college,
      club,
    });
  };

  return (
    <div className="min-h-screen bg-[#F6FAFE] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Visual Column */}
        <div className="lg:col-span-5 relative flex flex-col justify-between bg-sky-900 text-white min-h-[240px] lg:min-h-[540px]">
          <ResilientImage
            src={HERO_BANNER_IMAGE}
            alt="阳光明媚的校园图书馆窗景，窗外绿意盎然、晴空辽阔"
            className="absolute inset-0 w-full h-full object-cover"
            fallbackLabel="海露钟校园护眼计划"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/85 via-sky-950/30 to-sky-950/15" />

          <div className="relative z-10 p-6 sm:p-8 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/95 text-sky-700 flex items-center justify-center">
              <Eye className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              海露钟
            </span>
          </div>

          <div className="relative z-10 p-6 sm:p-8 space-y-2.5">
            <p className="text-xs text-sky-200">
              校园护眼轻打卡 · 2026 秋季学期
            </p>
            <h1 className="text-2xl font-bold leading-snug text-white">
              暂离屏幕，给双眼一段安静的蓝色假期。
            </h1>
            <p className="text-xs text-sky-100/90 leading-relaxed">
              用番茄钟管理自习节奏，记录远眺与看绿，集齐五枚眼假期印章。
            </p>
          </div>
        </div>

        {/* Right Authorization Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <p className="text-xs font-medium text-sky-700">校园身份授权</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              进入海露钟小程序
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              绑定所在学院与社团，你的每一次护眼休息都将计入集体远眺时长。
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-medium text-slate-600 mb-1.5">
                    同学昵称
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例如：林浅"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label htmlFor="auth-sid" className="block text-xs font-medium text-slate-600 mb-1.5">
                    学号（选填）
                  </label>
                  <input
                    id="auth-sid"
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="20260418"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="auth-college" className="block text-xs font-medium text-slate-600 mb-1.5">
                  所在学院
                </label>
                <select
                  id="auth-college"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
                >
                  {COLLEGES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="auth-club" className="block text-xs font-medium text-slate-600 mb-1.5">
                  参与社团
                </label>
                <select
                  id="auth-club"
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
                >
                  {STUDENT_CLUBS.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-xs text-slate-500 leading-relaxed">
                  我已阅读并同意海露钟校园护眼活动规则，允许将我的打卡时长计入学院与社团统计。
                </span>
              </label>

              {error && (
                <p role="alert" className="text-xs font-medium text-rose-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <span>授权并进入海露钟</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" aria-hidden="true" />
              <span>数据仅保存在本地会话，可在「我的 - 设置」中随时切换或退出。</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
