import React, { useState } from 'react';
import { Check, Lock, ShoppingBag, Ticket } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { DURATION_TIERS, MALL_REWARDS } from '../data/campaignData';
import { useAppState } from '../context/AppStateContext';
import { MallCategory, MallReward } from '../types';

const CATEGORY_TABS: { id: MallCategory; label: string }[] = [
  { id: 'all', label: '全部好礼' },
  { id: 'vouchers', label: '优惠券' },
  { id: 'samples', label: '体验小样' },
  { id: 'merchandise', label: '限定周边' },
  { id: 'tickets', label: '活动门票' },
];

const CATEGORY_LABELS: Record<Exclude<MallCategory, 'all'>, string> = {
  vouchers: '优惠券',
  samples: '体验小样',
  merchandise: '限定周边',
  tickets: '活动门票',
};

export const PointsMallPage: React.FC = () => {
  const { points, totalMinutes, redemptions, redeemMallReward, openSubPage } = useAppState();
  const [category, setCategory] = useState<MallCategory>('all');
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const currentTier =
    [...DURATION_TIERS].reverse().find((t) => totalMinutes >= t.minMinutes) || DURATION_TIERS[0];
  const nextTier = DURATION_TIERS.find((t) => t.minMinutes > totalMinutes);

  const visibleRewards =
    category === 'all'
      ? MALL_REWARDS
      : MALL_REWARDS.filter((item) => item.category === category);

  const handleRedeem = (reward: MallReward) => {
    const res = redeemMallReward(reward);
    setFeedback({ ok: res.ok, text: res.message });
  };

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <section className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7">
          <p className="text-xs text-sky-700">积分商城与阶梯礼遇</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            用护眼时长解锁校园专属好礼
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-xl leading-relaxed">
            累计护眼时长越高，可解锁的礼遇等级越高，包含洋甘菊蒸汽眼罩、海露钟帆布袋与草坪音乐会入场券。
          </p>
        </div>

        <div className="lg:col-span-5 bg-[#F6FAFE] rounded-2xl border border-slate-200/60 p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">当前积分</p>
              <p className="text-3xl font-bold font-mono text-sky-700 tabular-nums">
                {points}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openSubPage('promo')}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-sky-300 text-sky-800 text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>商城礼盒</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-800">
              当前等级：{currentTier.name} ({totalMinutes}分钟)
            </span>
            <span className="text-slate-400 tabular-nums">
              {nextTier
                ? `差 ${nextTier.minMinutes - totalMinutes} 分钟升至${nextTier.name}`
                : '已解锁全部等级'}
            </span>
          </div>
        </div>
      </section>

      {feedback && (
        <div
          role="status"
          className={`rounded-2xl px-4 py-3 text-xs font-medium border ${
            feedback.ok
              ? 'bg-sky-50 border-sky-200 text-sky-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-white rounded-2xl border border-slate-200/70 w-fit">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategory(tab.id)}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
              category === tab.id
                ? 'bg-sky-600 text-white'
                : 'text-slate-500 hover:text-slate-900 hover:bg-sky-50/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleRewards.map((item) => {
          const tierUnlocked = totalMinutes >= item.requiredMinutesTier;
          const canAfford = points >= item.pointsCost;
          const eligible = tierUnlocked && canAfford;

          return (
            <article
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/70 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {item.imageUrl && (
                  <div className="h-44 bg-sky-50 overflow-hidden">
                    <ResilientImage
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-xs text-slate-400">
                    {CATEGORY_LABELS[item.category]} · {item.tierName}
                  </p>
                  <h2 className="mt-1 text-base font-bold text-slate-900">{item.title}</h2>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-3">
                <div>
                  <span className="text-lg font-bold font-mono text-sky-700 tabular-nums">
                    {item.pointsCost} 积分
                  </span>
                  <p className="text-[11px] text-slate-400 tabular-nums">余 {item.stock} 份</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRedeem(item)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    eligible
                      ? 'bg-sky-600 hover:bg-sky-700 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {!tierUnlocked ? (
                    <>
                      <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>需 {item.requiredMinutesTier} 分钟</span>
                    </>
                  ) : !canAfford ? (
                    <span>需 {item.pointsCost} 积分</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>立即兑换</span>
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Redemption History */}
      <section className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-slate-900">兑换记录</h2>
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            共 {redemptions.length} 条
          </span>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {redemptions.map((rec) => (
            <div key={rec.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Ticket className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{rec.rewardTitle}</p>
                  <p className="text-xs text-slate-400">
                    {rec.redeemedAt} · 核销码：
                    <span className="font-mono font-medium text-sky-800">{rec.code}</span>
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-600 tabular-nums">
                -{rec.pointsSpent} 积分 · {rec.status === 'Active' ? '可使用' : '已核销'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
