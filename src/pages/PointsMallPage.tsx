import React, { useState } from 'react';
import { Calendar, Check, Lock, ShoppingBag, Ticket } from 'lucide-react';
import { HyloProductVisual } from '../components/HyloBrandAssets';
import { ResilientImage } from '../components/ResilientImage';
import { RewardGallerySlider } from '../components/RewardGallerySlider';
import {
  CHECKIN_POINTS_WINDOW,
  DURATION_TIERS,
  MALL_REWARDS,
  REDEMPTION_DEADLINE,
} from '../data/campaignData';
import { useAppState } from '../context/AppStateContext';
import { MallReward } from '../types';

export const PointsMallPage: React.FC = () => {
  const { points, totalMinutes, redemptions, redeemMallReward, openSubPage } = useAppState();
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'vouchers' | 'merchandise'>('all');
  const [selectedStyleMap, setSelectedStyleMap] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const currentTier =
    [...DURATION_TIERS].reverse().find((t) => totalMinutes >= t.minMinutes) || DURATION_TIERS[0];
  const nextTier = DURATION_TIERS.find((t) => t.minMinutes > totalMinutes);

  const visibleRewards =
    categoryFilter === 'all'
      ? MALL_REWARDS
      : MALL_REWARDS.filter((item) => item.category === categoryFilter);

  const handleRedeem = (reward: MallReward) => {
    const activeIdx = selectedStyleMap[reward.id] || 0;
    const chosenStyle = reward.gallery?.[activeIdx]?.styleName;
    const payload = chosenStyle
      ? { ...reward, title: `${reward.title}（${chosenStyle}）` }
      : reward;
    const res = redeemMallReward(payload);
    setFeedback({ ok: res.ok, text: res.message });
  };

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <section className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7">
          <p className="text-xs text-sky-700">积分商城 · 优惠券与校园周边好礼</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            用护眼积分兑换海露优惠券与限定周边
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-xl leading-relaxed">
            可兑换海露玻璃酸钠滴眼液立减券（1/2/3/5盒对应 -8/-16/-24/-40 元），以及海露钟限定帆布包、随行水杯、明信片套装与亚克力挂件。
          </p>
          <p className="mt-3 text-xs text-sky-800 inline-flex flex-wrap items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" aria-hidden="true" />
            <span>
              打卡得积分：{CHECKIN_POINTS_WINDOW} · 奖品兑换截止：{REDEMPTION_DEADLINE}
            </span>
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
              <span>前往官方商城</span>
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
        {[
          { id: 'all' as const, label: '全部奖品' },
          { id: 'vouchers' as const, label: '海露优惠券' },
          { id: 'merchandise' as const, label: '帆布包 · 水杯 · 明信片 · 挂件' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategoryFilter(tab.id)}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
              categoryFilter === tab.id
                ? 'bg-sky-600 text-white'
                : 'text-slate-500 hover:text-slate-900 hover:bg-sky-50/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visibleRewards.map((item) => {
          const tierUnlocked = totalMinutes >= item.requiredMinutesTier;
          const canAfford = points >= item.pointsCost;
          const eligible = tierUnlocked && canAfford;
          const isVoucher = item.category === 'vouchers';

          return (
            <article
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/70 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {isVoucher ? (
                  <HyloProductVisual
                    boxes={Number(item.boxCountLabel?.match(/\d+/)?.[0] || 1)}
                    title={item.title}
                    specLabel={item.boxCountLabel}
                    className="aspect-[4/3]"
                  />
                ) : item.gallery && item.gallery.length > 0 ? (
                  <RewardGallerySlider
                    slides={item.gallery}
                    title={item.title}
                    activeIndex={selectedStyleMap[item.id] || 0}
                    onSelectIndex={(idx) =>
                      setSelectedStyleMap((prev) => ({ ...prev, [item.id]: idx }))
                    }
                  />
                ) : (
                  <div className="aspect-[4/3] bg-sky-50 overflow-hidden">
                    <ResilientImage
                      src={item.imageUrl || ''}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-xs text-slate-400">
                    {isVoucher
                      ? `${item.boxCountLabel} · ${item.tierName} · 优惠 -${item.discountAmount} 元`
                      : `${item.specLabel || '限定周边'} · ${item.tierName} · 余 ${item.stock} 件`}
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
                  {isVoucher && typeof item.originalPrice === 'number' ? (
                    <p className="text-[11px] text-slate-400 tabular-nums">
                      原价 ¥{item.originalPrice} · 券后 ¥{item.finalPrice}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400">
                      实物好礼 · 截止 {REDEMPTION_DEADLINE} 兑换
                    </p>
                  )}
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
                      <span>{isVoucher ? '兑换立减券' : '兑换奖品'}</span>
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
