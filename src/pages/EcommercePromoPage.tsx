import React, { useState } from 'react';
import { Check, Copy, ExternalLink, ShoppingBag, X } from 'lucide-react';
import { HyloLogoMark, HyloProductVisual } from '../components/HyloBrandAssets';
import { QrCodeSvg } from '../components/QrCodeSvg';
import { HYLO_PRODUCTS, OFFICIAL_MALL_LINK } from '../data/campaignData';
import { useAppState } from '../context/AppStateContext';
import { HyloProductOption } from '../types';

export const EcommercePromoPage: React.FC = () => {
  const { vouchers, claimPromoVoucher, openSubPage, showToast } = useAppState();
  const [storeModalOpen, setStoreModalOpen] = useState(false);

  const handleClaim = (product: HyloProductOption) => {
    claimPromoVoucher(
      product.couponTitle,
      `立减 ¥${product.discountAmount}`,
      product.codePrefix
    );
  };

  const isClaimed = (title: string) => vouchers.some((v) => v.title === title);

  const copyStoreUrl = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_MALL_LINK);
      showToast(`官方商城口令已复制：${OFFICIAL_MALL_LINK}`);
    } catch {
      showToast(`官方商城链接：${OFFICIAL_MALL_LINK}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <section className="bg-[#0062B8] text-white rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2.5 bg-white rounded-xl px-3 py-1.5 mb-3">
            <HyloLogoMark className="h-5 w-auto" />
            <span className="text-[11px] font-medium text-sky-800">官方商城 · 玻璃酸钠滴眼液专场</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-snug">
            海露玻璃酸钠滴眼液专属立减优惠
          </h1>
          <p className="mt-2 text-sm text-sky-100/90 leading-relaxed">
            0.1% 玻璃酸钠 · 不含防腐剂（10ml 约 300 滴）。支持 1 盒、2 盒、3 盒、5 盒四种规格领券立减，复制小程序链接即可直达官方商城。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={copyStoreUrl}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-white text-[#0062B8] hover:bg-sky-50 text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
            <span>复制商城口令</span>
          </button>

          <button
            type="button"
            onClick={() => setStoreModalOpen(true)}
            className="min-h-[48px] px-5 py-3 rounded-xl border border-sky-300/60 hover:bg-sky-700 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            <span>进入官方商城</span>
          </button>
        </div>
      </section>

      {/* Only 海露玻璃酸钠滴眼液 4 Variants: 1盒(78.8/-8), 2盒(157.6/-16), 3盒(236.4/-24), 5盒(394/-40) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {HYLO_PRODUCTS.map((product) => {
          const claimed = isClaimed(product.couponTitle);
          return (
            <article
              key={product.id}
              className="bg-white rounded-3xl border border-slate-200/70 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <HyloProductVisual
                  boxes={product.boxes}
                  title={product.title}
                  specLabel={product.specLabel}
                  className="h-56"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-sky-700 font-medium">{product.specLabel}</span>
                    <span className="font-mono font-semibold text-sky-700 tabular-nums">
                      优惠 -{product.discountAmount} 元
                    </span>
                  </div>
                  <h2 className="mt-1.5 text-lg font-bold text-slate-900">{product.title}</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    官方售价 ¥{product.originalPrice} · 领券立减 ¥{product.discountAmount}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-bold font-mono text-sky-700 tabular-nums">
                    ¥{product.finalPrice}
                  </span>
                  <span className="text-xs font-mono text-slate-400 line-through tabular-nums">
                    ¥{product.originalPrice}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleClaim(product)}
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
                        <span>已领 -{product.discountAmount} 券</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                        <span>领券立减 {product.discountAmount} 元</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStoreModalOpen(true)}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors whitespace-nowrap"
                  >
                    去商城
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <div className="bg-white rounded-2xl border border-slate-200/70 p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          <span>官方商城小程序路径：</span>
          <span className="font-mono text-sky-800 select-all">{OFFICIAL_MALL_LINK}</span>
        </div>
        <button
          type="button"
          onClick={() => openSubPage('mall')}
          className="min-h-[40px] px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-medium transition-colors whitespace-nowrap"
        >
          积分商城兑换券
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
                <p className="text-xs text-sky-700">微信官方商城入口</p>
                <h2 id="store-bridge-title" className="mt-0.5 text-lg font-bold text-slate-900">
                  海露露观察官方小程序商城
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
              <QrCodeSvg seed={OFFICIAL_MALL_LINK} size={88} className="shrink-0" />
              <div className="text-xs text-slate-600 space-y-1 leading-relaxed">
                <p className="font-semibold text-slate-900">复制链接到微信打开</p>
                <p>
                  复制下方小程序链接并发送至微信聊天窗口，点击即可直达「海露露观察」商城选购海露玻璃酸钠滴眼液。
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 break-all select-all">
              {OFFICIAL_MALL_LINK}
            </div>

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={copyStoreUrl}
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium transition-colors"
              >
                复制官方商城链接
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
