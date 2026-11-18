import React, { useState } from 'react';
import { Copy, Download, Stamp } from 'lucide-react';
import { HyloLogoMark, HyloMascotCharacter } from '../components/HyloBrandAssets';
import { QrCodeSvg } from '../components/QrCodeSvg';
import { BASE_TODAY_CHECKINS, POSTER_HASHTAGS } from '../data/campaignData';
import { useAppState } from '../context/AppStateContext';

export const SharePosterPage: React.FC = () => {
  const { posterPayload, user, checkIns, todayCheckInParticipants, showToast, navigateTab } =
    useAppState();
  const [downloading, setDownloading] = useState(false);

  const fallback = checkIns[0];
  const poster = posterPayload || {
    id: fallback?.id || 'hl-default',
    studentName: user.name,
    school: user.school,
    college: user.college,
    enrollmentYear: user.enrollmentYear,
    activityLabel: fallback?.label || '望向远方',
    leaveReason:
      fallback?.leaveReason || '暂别屏幕，望向6米外的云朵、树梢与天际线。',
    durationMinutes: fallback?.durationMinutes || 10,
    timestamp: fallback?.timestamp || '今天',
    locationNote: fallback?.locationNote || '主图书馆四楼窗边',
    leaveCode: 'HL-2026',
    participantOrder: fallback?.participantOrder || todayCheckInParticipants || BASE_TODAY_CHECKINS,
  };

  const identityLine = poster.school
    ? `${poster.school}${poster.college ? ` · ${poster.college}` : ''}${poster.enrollmentYear ? ` · ${poster.enrollmentYear}` : ''}`
    : `全国护眼同行者${poster.enrollmentYear ? ` · ${poster.enrollmentYear}入学` : ''}`;

  const orderLabel = `你是今日第 ${poster.participantOrder.toLocaleString()} 位已经打卡的人`;

  const handleCopyShareText = async () => {
    const text = `【护眼请假条】${poster.studentName}是今日第 ${poster.participantOrder} 位打卡护眼的人，正在${poster.locationNote}进行 ${poster.durationMinutes} 分钟「${poster.activityLabel}」。${POSTER_HASHTAGS}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast('分享文案与话题已复制。');
    } catch {
      showToast(`可复制话题：${POSTER_HASHTAGS}`);
    }
  };

  const handleDownloadPoster = () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 750;
      canvas.height = 1040;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#EDF5FC';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(44, 44, 662, 952, 28);
      ctx.fill();

      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.roundRect(44, 44, 662, 168, [28, 28, 0, 0]);
      ctx.fill();

      ctx.fillStyle = '#BAE6FD';
      ctx.font = '500 20px sans-serif';
      ctx.fillText('海露钟 · 护眼通行证', 86, 102);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 42px sans-serif';
      ctx.fillText('护眼请假条', 86, 158);

      ctx.fillStyle = '#E0F2FE';
      ctx.font = '600 20px monospace';
      ctx.fillText(poster.leaveCode, 560, 102);

      ctx.fillStyle = '#64748B';
      ctx.font = '500 20px sans-serif';
      ctx.fillText('请假人', 86, 270);
      ctx.fillStyle = '#0F172A';
      ctx.font = '700 32px sans-serif';
      ctx.fillText(poster.studentName, 86, 312);

      ctx.fillStyle = '#475569';
      ctx.font = '400 21px sans-serif';
      ctx.fillText(identityLine, 86, 348);

      ctx.fillStyle = '#0369A1';
      ctx.font = '600 21px sans-serif';
      ctx.fillText(orderLabel, 86, 384);

      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(86, 412);
      ctx.lineTo(664, 412);
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = '500 20px sans-serif';
      ctx.fillText('休假方式与时长', 86, 460);
      ctx.fillStyle = '#0369A1';
      ctx.font = '700 30px sans-serif';
      ctx.fillText(`${poster.activityLabel} · ${poster.durationMinutes} 分钟`, 86, 502);

      ctx.fillStyle = '#F6FAFE';
      ctx.beginPath();
      ctx.roundRect(86, 536, 578, 160, 20);
      ctx.fill();

      ctx.fillStyle = '#0F172A';
      ctx.font = '400 24px sans-serif';
      const chars = Array.from(poster.leaveReason);
      let line = '';
      let y = 588;
      for (const ch of chars) {
        const test = line + ch;
        if (ctx.measureText(test).width > 515) {
          ctx.fillText(line, 116, y);
          line = ch;
          y += 36;
        } else {
          line = test;
        }
      }
      if (line) ctx.fillText(line, 116, y);

      ctx.fillStyle = '#64748B';
      ctx.font = '400 20px sans-serif';
      ctx.fillText(`地点：${poster.locationNote}`, 86, 750);
      ctx.fillText(`时间：${poster.timestamp}`, 86, 784);

      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(576, 756, 58, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#0284C7';
      ctx.font = '700 20px sans-serif';
      ctx.fillText('已准假', 545, 754);
      ctx.font = '400 14px sans-serif';
      ctx.fillText('护眼休息', 547, 776);

      ctx.strokeStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.moveTo(86, 848);
      ctx.lineTo(664, 848);
      ctx.stroke();

      ctx.fillStyle = '#0369A1';
      ctx.font = '600 20px sans-serif';
      ctx.fillText(POSTER_HASHTAGS, 86, 900);
      ctx.fillStyle = '#64748B';
      ctx.font = '400 18px sans-serif';
      ctx.fillText('扫码进入「海露钟」小程序，一起给眼睛放假', 86, 938);

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `海露钟护眼请假条-${poster.leaveCode.toLowerCase()}.png`;
      link.href = url;
      link.click();
      showToast('请假条海报已保存为 PNG。');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
      {/* Left: Minimalist Leave Request Poster */}
      <div className="lg:col-span-7 flex justify-center">
        <article className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 overflow-hidden">
          <div className="bg-[#0062B8] text-white px-6 py-6 flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white rounded-lg px-2 py-1 mb-2">
                <HyloLogoMark className="h-3.5 w-auto" />
                <span className="text-[10px] font-medium text-sky-800">海露钟 · 护眼通行证</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">护眼请假条</h1>
            </div>
            <span className="font-mono text-xs text-sky-100 tabular-nums">
              {poster.leaveCode}
            </span>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] text-slate-400">请假人</p>
                <p className="text-lg font-bold text-slate-900">{poster.studentName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{identityLine}</p>
                <p className="text-xs font-medium text-sky-700 mt-1.5 tabular-nums">
                  {orderLabel}
                </p>
              </div>
              <div className="w-12 h-16 rounded-xl bg-[#F2F8FE] border border-sky-100 flex items-center justify-center p-1 shrink-0">
                <HyloMascotCharacter className="w-9 h-13" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] text-slate-400">休假方式</p>
                <p className="text-sm font-bold text-sky-800">{poster.activityLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-400">请假时长</p>
                <p className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                  {poster.durationMinutes} 分钟
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F6FAFE] border border-slate-200/60 p-4">
              <p className="text-xs text-sky-700 font-medium">离屏休息事由</p>
              <p className="mt-1.5 text-sm text-slate-800 leading-relaxed">
                「{poster.leaveReason}」
              </p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="text-xs text-slate-400 space-y-1">
                <p>地点：{poster.locationNote}</p>
                <p>时间：{poster.timestamp}</p>
              </div>

              <div className="w-19 h-19 rounded-full border-2 border-sky-600 text-sky-700 flex flex-col items-center justify-center -rotate-6 shrink-0">
                <Stamp className="w-3.5 h-3.5 mb-0.5" aria-hidden="true" />
                <span className="text-[11px] font-bold">已准假</span>
                <span className="text-[9px]">护眼休息</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-sky-700">{POSTER_HASHTAGS}</p>
                <p className="text-[11px] text-slate-400">
                  扫码进入「海露钟」一起记录护眼时刻
                </p>
              </div>
              <QrCodeSvg seed={`POSTER-${poster.leaveCode}`} size={72} className="shrink-0" />
            </div>
          </div>
        </article>
      </div>

      {/* Right: Share & Save Controls */}
      <aside className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-7 space-y-5">
        <div>
          <p className="text-xs text-sky-700">分享请假海报</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            保存或转发你的护眼请假条
          </h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            海报已标注你是今日第{' '}
            <span className="font-mono font-semibold text-sky-700 tabular-nums">
              {poster.participantOrder.toLocaleString()}
            </span>{' '}
            位打卡护眼的人，带上 {POSTER_HASHTAGS} 分享给好友吧。
          </p>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleDownloadPoster}
            disabled={downloading}
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>{downloading ? '正在生成图片...' : '保存海报图片 (PNG)'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyShareText}
            className="w-full min-h-[44px] px-5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
            <span>复制分享文案与话题</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTab('checkin')}
            className="w-full min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm transition-colors"
          >
            继续护眼打卡
          </button>
        </div>
      </aside>
    </div>
  );
};
