import React, { useEffect, useState } from 'react';
import { CheckCircle2, FileImage, Lock, MapPin, Sparkles, Timer, Users } from 'lucide-react';
import { CHECKIN_ACTIVITIES } from '../data/campaignData';
import { useAppState } from '../context/AppStateContext';

export const CheckInPage: React.FC = () => {
  const {
    pendingEyeCareRecords,
    checkIns,
    todayCheckInParticipants,
    submitCheckInFromRecord,
    openPosterForCheckIn,
    openSubPage,
    navigateTab,
  } = useAppState();

  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    pendingEyeCareRecords[0]?.id || ''
  );
  const [locationNote, setLocationNote] = useState<string>('主图书馆四楼窗边');
  const [leaveReason, setLeaveReason] = useState<string>(
    '在屏幕前专注了一段时间，现在离开屏幕让双眼自然放松。'
  );
  const [justSubmittedId, setJustSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingEyeCareRecords.some((r) => r.id === selectedRecordId)) {
      const next = pendingEyeCareRecords[0];
      setSelectedRecordId(next?.id || '');
      if (next) {
        const meta = CHECKIN_ACTIVITIES.find((a) => a.type === next.activity);
        if (meta) setLeaveReason(meta.leaveReason);
      }
    }
  }, [pendingEyeCareRecords, selectedRecordId]);

  const selectedRecord =
    pendingEyeCareRecords.find((r) => r.id === selectedRecordId) || pendingEyeCareRecords[0];

  const handleSelectRecord = (id: string) => {
    setSelectedRecordId(id);
    const rec = pendingEyeCareRecords.find((r) => r.id === id);
    const meta = rec ? CHECKIN_ACTIVITIES.find((a) => a.type === rec.activity) : null;
    if (meta) {
      setLeaveReason(meta.leaveReason);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    const created = submitCheckInFromRecord(selectedRecord.id, locationNote, leaveReason);
    if (created) {
      setJustSubmittedId(created.id);
      openSubPage('poster');
    }
  };

  const selectedMeta = selectedRecord
    ? CHECKIN_ACTIVITIES.find((a) => a.type === selectedRecord.activity) || CHECKIN_ACTIVITIES[0]
    : null;
  const previewPoints =
    selectedRecord && selectedMeta
      ? selectedMeta.pointsPerSession + Math.floor(selectedRecord.durationMinutes / 10) * 5
      : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Record-locked Leave Application Form (Only Location & Reason editable) */}
      <section className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-sky-700">申请护眼请假条</p>
          <p className="text-xs text-slate-500 inline-flex items-center gap-1.5 tabular-nums">
            <Users className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
            <span>今日已有 {todayCheckInParticipants.toLocaleString()} 人打卡</span>
          </p>
        </div>

        <h1 className="mt-1.5 text-2xl font-bold text-slate-900">
          使用自习室护眼记录打卡请假
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
          护眼行为与时长均由「海露钟自习室」真实记录锁定，此处仅需填写打卡地点与请假缘由。
        </p>

        {pendingEyeCareRecords.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-[#F6FAFE] border border-slate-200/70 p-6 text-center space-y-3">
            <Timer className="w-8 h-8 text-sky-600 mx-auto" aria-hidden="true" />
            <h2 className="text-base font-bold text-slate-900">暂无可打卡的护眼记录</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              请先前往海露钟自习室完成「望向远方 / 闭眼养神 / 户外散步 / 无手机用餐 / 滴眼药水舒缓」，或在「学习/工作」结束后选择 5 分钟休息。
            </p>
            <button
              type="button"
              onClick={() => navigateTab('study')}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium inline-flex items-center gap-2 transition-colors"
            >
              <Timer className="w-4 h-4" aria-hidden="true" />
              <span>前往海露钟自习室</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Step 1: Pick from existing Study Room EyeCareRecords (Behavior & Duration are locked) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-medium text-slate-600">
                  1. 选择自习室护眼记录（行为与时长已锁定）
                </span>
                <span className="text-xs font-mono text-sky-700 tabular-nums">
                  可选 {pendingEyeCareRecords.length} 条
                </span>
              </div>
              <div className="space-y-2">
                {pendingEyeCareRecords.map((rec) => {
                  const isSelected = selectedRecord?.id === rec.id;
                  return (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => handleSelectRecord(rec.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-colors ${
                        isSelected
                          ? 'bg-sky-50/80 border-sky-500 text-sky-950'
                          : 'bg-white border-slate-200 hover:border-sky-200 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-sky-600 shrink-0" aria-hidden="true" />
                          <span className="text-sm font-semibold">{rec.label}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          {rec.completedAt} · {rec.sourceLabel}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-semibold text-sky-700 tabular-nums shrink-0">
                        {rec.durationMinutes} 分钟
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Location only */}
            <div>
              <label htmlFor="checkin-location" className="block text-xs font-medium text-slate-600 mb-1.5">
                2. 打卡地点
              </label>
              <div className="relative">
                <MapPin
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  id="checkin-location"
                  type="text"
                  required
                  value={locationNote}
                  onChange={(e) => setLocationNote(e.target.value)}
                  placeholder="例如：主图书馆四楼窗边 / 校园银杏道"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
                />
              </div>
            </div>

            {/* Step 3: Leave Reason only */}
            <div>
              <label htmlFor="checkin-reason" className="block text-xs font-medium text-slate-600 mb-1.5">
                3. 请假缘由（将印在护眼请假条上）
              </label>
              <textarea
                id="checkin-reason"
                rows={3}
                required
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="写下此刻暂离屏幕的理由..."
                className="w-full p-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 resize-none"
              />
            </div>

            {selectedRecord && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  本次将记录：{selectedRecord.label} · {selectedRecord.durationMinutes} 分钟
                </span>
                <span className="font-mono text-sky-700 tabular-nums">
                  预计 +{previewPoints} 积分 · 第 {(todayCheckInParticipants + 1).toLocaleString()} 位
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>提交打卡并申请护眼请假条</span>
            </button>
          </form>
        )}
      </section>

      {/* Right: Completed Check-ins & Leave Posters */}
      <section className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-slate-900">已申请的打卡记录</h2>
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
                  {item.timestamp} · {item.locationNote} · 第 {item.participantOrder.toLocaleString()} 位
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
