import React, { useState } from 'react';
import { Award, Building2, Users } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export const LeaderboardPage: React.FC = () => {
  const { user, totalMinutes, weekMinutes, streakDays, leaderboardGroups, navigateTab } =
    useAppState();
  const [groupFilter, setGroupFilter] = useState<'college' | 'club'>('college');

  const filtered = leaderboardGroups.filter((g) => g.type === groupFilter);
  const myGroupName = groupFilter === 'college' ? user.college : user.club;
  const myGroupIndex = filtered.findIndex((g) => g.name === myGroupName);
  const myGroup = myGroupIndex >= 0 ? filtered[myGroupIndex] : null;

  const estimatedPersonalRank = Math.max(1, 48 - Math.floor(totalMinutes / 8));
  const totalCampusParticipants = 612;

  return (
    <div className="space-y-6">
      {/* Personal Ranking Banner */}
      <section className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7">
          <p className="text-xs text-sky-700">校园「远眺」排行榜</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            温柔的校园集体护眼接力
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-xl leading-relaxed">
            每一次望向窗外和户外漫步，都会为你的学院和社团累计远眺时长，一起保持轻松不内卷的护眼节奏。
          </p>
        </div>

        <div className="lg:col-span-5 bg-[#F6FAFE] rounded-2xl border border-slate-200/60 p-5 grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-slate-400">个人排名</p>
            <p className="mt-1 text-2xl font-bold font-mono text-sky-700 tabular-nums">
              #{estimatedPersonalRank}
            </p>
            <p className="text-[11px] text-slate-400 tabular-nums">共 {totalCampusParticipants} 人</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">累计护眼</p>
            <p className="mt-1 text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalMinutes}m
            </p>
            <p className="text-[11px] text-slate-400 tabular-nums">本周 {weekMinutes}m</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">连续天数</p>
            <p className="mt-1 text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {streakDays} 天
            </p>
            <p className="text-[11px] text-slate-400">保持中</p>
          </div>
        </div>
      </section>

      {/* Filter & Rankings */}
      <section className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-1 p-1 bg-[#F6FAFE] rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setGroupFilter('college')}
              className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                groupFilter === 'college'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>学院榜</span>
            </button>
            <button
              type="button"
              onClick={() => setGroupFilter('club')}
              className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                groupFilter === 'club'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
              <span>社团榜</span>
            </button>
          </div>

          {myGroup && (
            <div className="text-xs text-slate-500">
              我的{groupFilter === 'college' ? '学院' : '社团'}：
              <span className="font-semibold text-sky-800">
                第 {myGroupIndex + 1} 名 · {myGroup.name}
              </span>{' '}
              · <span className="font-mono tabular-nums">{myGroup.totalMinutes} 分钟</span>
            </div>
          )}
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {filtered.map((group, idx) => {
            const isUsersGroup = group.name === myGroupName;
            const maxTotal = filtered[0]?.totalMinutes || 1;
            const barPct = Math.max(12, Math.round((group.totalMinutes / maxTotal) * 100));

            return (
              <div
                key={group.id}
                className={`py-4 px-3 -mx-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isUsersGroup ? 'bg-sky-50/60' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-semibold tabular-nums shrink-0 ${
                      idx === 0
                        ? 'bg-sky-600 text-white'
                        : idx < 3
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">{group.name}</p>
                      {isUsersGroup && (
                        <span className="text-[11px] font-medium text-sky-700 shrink-0">
                          · 所属集体
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 tabular-nums">
                      {group.membersCount} 位成员 · 人均 {group.avgMinutes} 分钟
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:w-60 shrink-0">
                  <div className="flex-1 h-1.5 rounded-full bg-sky-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-sky-600 transition-all duration-300"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono font-semibold text-slate-900 tabular-nums w-20 text-right">
                    {group.totalMinutes.toLocaleString()}m
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-sky-600" aria-hidden="true" />
            <span>通过自习室护眼休息或日常打卡，即可贡献集体时长。</span>
          </p>
          <button
            type="button"
            onClick={() => navigateTab('checkin')}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium transition-colors whitespace-nowrap"
          >
            贡献护眼时长
          </button>
        </div>
      </section>
    </div>
  );
};
