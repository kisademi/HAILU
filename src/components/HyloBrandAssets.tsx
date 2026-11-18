import React from 'react';

export const HYLO_ASSET_PATHS = {
  logo: './assets/aistudio/5a7b588aeb8c48f68d8afcc4372bac58_b467d427.jpg',
  mascot: './assets/aistudio/14114632aa6f4462bba15f9295a93fd6_d5b8ba56.jpg',
  product: './assets/aistudio/d7e608f919ac41b4921508c5935101a6_55f84edb.png',
} as const;

interface HyloLogoMarkProps {
  variant?: 'horizontal' | 'stacked';
  className?: string;
}

export const HyloLogoMark: React.FC<HyloLogoMarkProps> = ({
  variant = 'horizontal',
  className = 'h-7 w-auto',
}) => {
  const viewBox = variant === 'horizontal' ? '45 85 990 250' : '240 440 600 520';
  return (
    <svg
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label="海露 HYLO 官方品牌标识"
      preserveAspectRatio="xMidYMid meet"
    >
      <image href={HYLO_ASSET_PATHS.logo} width="1080" height="1003" />
    </svg>
  );
};

interface HyloMascotCharacterProps {
  variant?: 'front' | 'turnaround';
  className?: string;
}

export const HyloMascotCharacter: React.FC<HyloMascotCharacterProps> = ({
  variant = 'front',
  className = 'w-14 h-24',
}) => {
  const viewBox = variant === 'front' ? '98 85 208 415' : '95 75 970 435';
  return (
    <svg
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label="海露官方滴眼液瓶宝 IP 形象"
      preserveAspectRatio="xMidYMid meet"
    >
      <image href={HYLO_ASSET_PATHS.mascot} width="1080" height="583" />
    </svg>
  );
};

interface HyloProductVisualProps {
  boxes: number;
  title: string;
  specLabel?: string;
  className?: string;
}

export const HyloProductVisual: React.FC<HyloProductVisualProps> = ({
  boxes,
  title,
  specLabel,
  className = 'h-52',
}) => {
  const visibleLayers = Math.min(boxes, 3);

  return (
    <div
      className={`relative w-full bg-gradient-to-b from-[#E8F4FD] via-[#F2F8FE] to-white overflow-hidden flex items-center justify-center p-4 ${className}`}
    >
      {/* Subtle circular sky glow echoing the HYLO eye motif */}
      <div
        className="absolute w-36 h-36 rounded-full bg-sky-200/35 blur-xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Brand & Spec Corner Label */}
      <div className="absolute top-3 left-3 z-10 bg-white/95 rounded-lg px-2 py-1 border border-sky-100 shadow-xs">
        <HyloLogoMark className="h-4 w-auto" />
      </div>
      <div className="absolute top-3 right-3 z-10 bg-[#0062B8] text-white text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg tabular-nums">
        {specLabel || `${boxes}盒装`}
      </div>

      {/* Official Transparent Product Render (stacked softly for multi-box SKUs) */}
      <div className="relative h-full flex items-center justify-center pt-3">
        {visibleLayers >= 3 && (
          <img
            src={HYLO_ASSET_PATHS.product}
            alt=""
            aria-hidden="true"
            className="h-[84%] w-auto object-contain opacity-45 -translate-x-10 scale-90 select-none pointer-events-none"
          />
        )}
        {visibleLayers >= 2 && (
          <img
            src={HYLO_ASSET_PATHS.product}
            alt=""
            aria-hidden="true"
            className="h-[90%] w-auto object-contain opacity-75 -translate-x-4 scale-95 select-none pointer-events-none"
          />
        )}
        <img
          src={HYLO_ASSET_PATHS.product}
          alt={title}
          className={`relative z-10 h-full w-auto object-contain drop-shadow-[0_10px_18px_rgba(0,98,184,0.14)] ${
            visibleLayers > 1 ? 'translate-x-3' : ''
          }`}
        />
      </div>

      {boxes > 1 && (
        <span className="absolute bottom-2.5 right-3 z-10 text-[11px] font-mono font-semibold text-[#0062B8] bg-white/90 px-2 py-0.5 rounded-md border border-sky-100 tabular-nums">
          ×{boxes} 盒组合
        </span>
      )}
    </div>
  );
};

interface HyloMerchVisualProps {
  rewardId: string;
  title: string;
  className?: string;
}

export const HyloMerchVisual: React.FC<HyloMerchVisualProps> = ({
  rewardId,
  title,
  className = 'h-44',
}) => {
  if (rewardId === 'reward-merch-bag') {
    return (
      <div
        className={`relative w-full bg-gradient-to-b from-[#EAF4FD] to-[#F7FBFF] overflow-hidden flex items-center justify-center p-4 ${className}`}
        role="img"
        aria-label={title}
      >
        <div className="relative flex flex-col items-center">
          {/* Tote Straps */}
          <div className="flex gap-9 -mb-2 z-0">
            <div className="w-8 h-9 rounded-t-full border-[5px] border-[#0062B8] border-b-0" />
          </div>
          {/* Canvas Tote Body */}
          <div className="relative z-10 w-32 h-32 rounded-b-2xl rounded-t-md bg-[#FCFDFE] border border-slate-200/90 shadow-[0_10px_22px_rgba(15,23,42,0.08)] flex flex-col items-center justify-between py-2.5 px-3">
            <HyloLogoMark className="h-3.5 w-auto" />
            <div className="flex items-center gap-2">
              <HyloMascotCharacter className="w-8 h-14" />
              <div className="text-left">
                <p className="text-[10px] font-bold text-[#0062B8] leading-tight">给眼睛</p>
                <p className="text-[10px] font-bold text-sky-600 leading-tight">放个假</p>
                <p className="text-[8px] font-mono text-slate-400 mt-0.5">#海露钟</p>
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-[#0062B8] via-sky-400 to-sky-200" />
          </div>
        </div>
        <span className="absolute bottom-2.5 right-3 text-[10px] font-medium text-[#0062B8] bg-white/90 px-2 py-0.5 rounded-md border border-sky-100">
          周边设计打样
        </span>
      </div>
    );
  }

  if (rewardId === 'reward-merch-cup') {
    return (
      <div
        className={`relative w-full bg-gradient-to-b from-[#EAF4FD] to-[#F7FBFF] overflow-hidden flex items-center justify-center p-4 ${className}`}
        role="img"
        aria-label={title}
      >
        {/* Tumbler echoing COMOD bottle silhouette & colors */}
        <div className="relative flex flex-col items-center">
          {/* Tapered HYLO Blue Cap */}
          <div className="w-9 h-5 bg-[#0077C8] rounded-t-lg shadow-xs border border-[#0062B8]/30" />
          <div className="w-16 h-2.5 bg-slate-100 border border-slate-200 rounded-t-md" />
          {/* Frosted White & Sky-Blue Body */}
          <div className="w-20 h-26 rounded-b-2xl rounded-t-sm bg-white border border-slate-200/90 shadow-[0_12px_24px_rgba(0,98,184,0.12)] overflow-hidden flex flex-col justify-between">
            <div className="pt-2 px-2 flex flex-col items-center gap-1">
              <HyloLogoMark className="h-3 w-auto" />
              {/* Iconic HYLO Eye Circle Motif */}
              <div className="w-7 h-7 rounded-full bg-[#2495D3] flex items-center justify-center mt-0.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#0E2B48] relative">
                  <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 rounded-full bg-sky-200" />
                </div>
              </div>
            </div>
            <div className="h-9 bg-[#2495D3] px-2 flex flex-col items-center justify-center text-white">
              <span className="text-[9px] font-bold tracking-wide">海露钟</span>
              <span className="text-[7px] text-sky-100">HYLO CARE</span>
            </div>
          </div>
        </div>
        <span className="absolute bottom-2.5 right-3 text-[10px] font-medium text-[#0062B8] bg-white/90 px-2 py-0.5 rounded-md border border-sky-100">
          海露瓶造型水杯
        </span>
      </div>
    );
  }

  if (rewardId === 'reward-merch-postcard') {
    return (
      <div
        className={`relative w-full bg-gradient-to-b from-[#EAF4FD] to-[#F7FBFF] overflow-hidden flex items-center justify-center p-4 ${className}`}
        role="img"
        aria-label={title}
      >
        <div className="relative w-64 h-32 flex items-center justify-center">
          {/* Back Postcard with Official IP Turnaround Sheet */}
          <div className="w-44 h-28 bg-white rounded-xl border border-slate-200 shadow-md -rotate-6 -translate-x-7 p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-mono text-sky-700">HYLO IP SERIES</span>
              <span className="text-[8px] text-slate-400">01/04</span>
            </div>
            <HyloMascotCharacter variant="turnaround" className="w-full h-16" />
            <span className="text-[8px] text-slate-400 text-right">给眼睛放个假</span>
          </div>

          {/* Front Postcard with HYLO Brand Logo & Eye Emblem */}
          <div className="relative z-10 w-44 h-28 bg-gradient-to-br from-[#F2F8FE] to-white rounded-xl border border-sky-200 shadow-lg rotate-3 translate-x-7 p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="bg-white rounded px-1 py-0.5">
                <HyloLogoMark className="h-3 w-auto" />
              </div>
              <div className="w-6 h-6 rounded-full bg-[#2495D3] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#0E2B48]" />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-900">海露钟 · 眼假期明信片</p>
              <p className="text-[9px] text-sky-700 mt-0.5">#海露钟 #给眼睛放个假</p>
            </div>
          </div>
        </div>
        <span className="absolute bottom-2.5 right-3 text-[10px] font-medium text-[#0062B8] bg-white/90 px-2 py-0.5 rounded-md border border-sky-100">
          4张套装设计
        </span>
      </div>
    );
  }

  // reward-merch-charm
  return (
    <div
      className={`relative w-full bg-gradient-to-b from-[#EAF4FD] to-[#F7FBFF] overflow-hidden flex items-center justify-center p-4 ${className}`}
      role="img"
      aria-label={title}
    >
      <div className="relative flex items-center gap-4">
        {/* Acrylic Die-Cut Mascot Keychain */}
        <div className="flex flex-col items-center">
          {/* Silver Ring & Clasp */}
          <div className="w-5 h-5 rounded-full border-2 border-slate-400 bg-white/70" />
          <div className="w-1 h-2 bg-slate-400" />
          {/* Clear Acrylic Rim around Official IP Character */}
          <div className="p-2 rounded-2xl bg-white/95 border-2 border-sky-300/80 shadow-[0_8px_20px_rgba(0,98,184,0.16)] flex items-center justify-center">
            <HyloMascotCharacter className="w-11 h-20" />
          </div>
        </div>

        {/* Companion Blue HYLO Mini Acrylic Tag */}
        <div className="flex flex-col items-center translate-y-2">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 bg-white" />
          <div className="bg-white border-2 border-sky-200 rounded-xl px-2.5 py-2 shadow-sm flex flex-col items-center gap-1">
            <HyloLogoMark variant="stacked" className="w-9 h-8" />
            <span className="text-[8px] font-medium text-sky-700">护眼挂件</span>
          </div>
        </div>
      </div>

      <span className="absolute bottom-2.5 right-3 text-[10px] font-medium text-[#0062B8] bg-white/90 px-2 py-0.5 rounded-md border border-sky-100">
        瓶宝亚克力挂件
      </span>
    </div>
  );
};
