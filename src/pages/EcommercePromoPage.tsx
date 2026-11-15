import React, { useState } from 'react';
import { Check, ExternalLink, ShoppingBag, Ticket, X } from 'lucide-react';
import { QrCodeSvg } from '../components/QrCodeSvg';
import { ResilientImage } from '../components/ResilientImage';
import { PRODUCT_CAMPUS_BUNDLE_IMAGE, PRODUCT_WELLNESS_KIT_IMAGE } from '../data/campaignData';
import { useAppState } from '../context/AppStateContext';

interface BundleOffer {
  id: string;
  title: string;
  subtitle: string;
  campusPrice: string;
  regularPrice: string;
  discountLabel: string;
  couponTitle: string;
  codePrefix: string;
  imageUrl: string;
  items: string[];
}

const CAMPUS_BUNDLES: BundleOffer[] = [
  {
    id: 'bundle-desk-recovery',
    title: '晚自习舒缓护眼套装',
    subtitle: '校园专享 · 恒温热敷与眼周清润组合',
    campusPrice: '¥89',
    regularPrice: '¥135',
    discountLabel: '校园立省 33%',
    couponTitle: '晚自习舒缓套装 67折专享券',
    codePrefix: 'HLNIGHT',
    imageUrl: PRODUCT_WELLNESS_KIT_IMAGE,
    items: ['洋甘菊蒸汽眼罩 10 片装', '植物舒缓眼部精华 15ml', '20-20-20 桌面提示卡'],
  },
  {
    id: 'bundle-outdoor-tote',
    title: '海露钟户外放空随行礼盒',
    subtitle: '帆布通勤袋 + 海蓝色遮光眼罩 + 磨砂马克杯',
    campusPrice: '¥129',
    regularPrice: '¥188',
    discountLabel: '学生 7 折券',
    couponTitle: '户外放空礼盒 7折优惠券',
    codePrefix: 'HLOUT',
    imageUrl: PRODUCT_CAMPUS_BUNDLE_IMAGE,
    items: ['有机棉海蓝织带帆布袋', '立体遮光舒睡眼罩', '素白哑光陶瓷桌面杯'],
  },
];

export const EcommercePromoPage: React.FC = () => {
  const { vouchers, claimPromoVoucher, openSubPage, showToast } = useAppState();
  const [storeModalOpen, setStoreModalOpen] = useState(false);

  const handleClaim = (bundle: BundleOffer) => {
    claimPromoVoucher(bundle.couponTitle, bundle.discountLabel, bundle.codePrefix);
  };

  const handleClaimGeneral = () => {
    claimPromoVoucher('海露官方旗舰店 20 元无门槛券', '立减 ¥20', 'HL20');
  };

  const isClaimed = (title: string) => vouchers.some((v) => v.title === title);

  const copyStoreUrl = async () => {
    try {
      await navigator.clipboard.writeText('https://mall.hailuzhong.campus/student');
      showToast('官方商城链接已复制。');
    } catch {
      showToast('商城链接：https://mall.hailuzhong.campus/student');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <section className="bg-sky-700 text-white rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-xs text-sky-200">校园专属礼遇 · 海露官方商城联动</p>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold leading-snug">
            学生专享护眼套装与即时领券
          </h1>
          <p className="mt-2 text-sm text-sky-100/90 leading-relaxed">
            一键领取校园专属优惠券至你的海露钟卡券包，下单可直接抵扣。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleClaimGeneral}
            disabled={isClaimed('海露官方旗舰店 20 元无门槛券')}
            className={`min-h-[48px] px-5 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap ${
              isClaimed('海露官方旗舰店 20 元无门槛券')
                ? 'bg-sky-800 text-sky-200 cursor-default'
                : 'bg-white text-sky-800 hover:bg-sky-50'
            }`}
          >
            <Ticket className="w-4 h-4" aria-hidden="true" />
            <span>
              {isClaimed('海露官方旗舰店 20 元无门槛券') ? '已领 ¥20 通用券' : '领 ¥20 店铺券'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStoreModalOpen(true)}
            className="min-h-[48px] px-5 py-3 rounded-xl border border-sky-400/60 hover:bg-sky-600 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            <span>进入官方商城</span>
          </button>
        </div>
      </section>

      {/* Featured Bundles */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CAMPUS_BUNDLES.map((bundle) => {
          const claimed = isClaimed(bundle.couponTitle);
          return (
            <article
              key={bundle.id}
              className="bg-white rounded-3xl border border-slate-200/70 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-60 bg-sky-50 overflow-hidden">
                  <ResilientImage
                    src={bundle.imageUrl}
                    alt={bundle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-medium text-sky-700">{bundle.discountLabel}</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">{bundle.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{bundle.subtitle}</p>

                  <ul className="mt-4 space-y-1.5 text-xs text-slate-500">
                    {bundle.items.map((it) => (
                      <li key={it}>· {it}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-bold font-mono text-sky-700 tabular-nums">
                    {bundle.campusPrice}
                  </span>
                  <span className="text-xs font-mono text-slate-400 line-through tabular-nums">
                    {bundle.regularPrice}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleClaim(bundle)}
                    disabled={claimed}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                      claimed
                        ? 'bg-sky-50 text-sky-700'
                        : 'bg-sky-600 hover:bg-sky-700 text-white'
                    }`}
                  >
                    {claimed ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>已领券</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                        <span>立即领券</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStoreModalOpen(true)}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors whitespace-nowrap"
                  >
                    商城入口
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <div className="bg-white rounded-2xl border border-slate-200/70 p-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          领取后的优惠券会自动存放在「我的 - 我的卡券」中，可随时查看券码。
        </p>
        <button
          type="button"
          onClick={() => openSubPage('mall')}
          className="min-h-[40px] px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-medium transition-colors whitespace-nowrap"
        >
          查看积分商城
        </button>
      </div>

      {/* Storefront Bridge Modal */}
      {storeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="store-bridge-title"
        >
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-sky-700">电商平台直连</p>
                <h2 id="store-bridge-title" className="mt-0.5 text-lg font-bold text-slate-900">
                  海露钟官方护眼旗舰店
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setStoreModalOpen(false)}
                aria-label="关闭商城弹窗"
                className="min-h-[44px] min-w-[44px] -mt-2 -mr-2 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-[#F6FAFE] border border-slate-200/60 p-4 flex items-center gap-4">
              <QrCodeSvg seed="MALL-HAILUZHONG-2026" size={88} className="shrink-0" />
              <div className="text-xs text-slate-600 space-y-1 leading-relaxed">
                <p className="font-semibold text-slate-900">扫码或复制链接跳转</p>
                <p>
                  打开合作电商小程序或官方店铺页，结算时输入你在海露钟领取的校园优惠码即可减免。
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-600 truncate">
              https://mall.hailuzhong.campus/student
            </div>

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={copyStoreUrl}
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium transition-colors"
              >
                复制店铺链接
              </button>
              <button
                type="button"
                onClick={() => setStoreModalOpen(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
