import React from 'react';
import { Calendar, CheckCircle2, Gift, ShieldAlert } from 'lucide-react';
import { CHECKIN_POINTS_WINDOW, DURATION_TIERS, REDEMPTION_DEADLINE } from '../data/campaignData';
import { useAppState } from '../context/AppStateContext';

export const EventRulesPage: React.FC = () => {
  const { navigateTab, openSubPage } = useAppState();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <section className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8">
        <p className="text-xs text-sky-700">海露钟活动说明</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          活动规则、阶梯奖励与合规披露
        </h1>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          了解护眼打卡的参与周期、自习室休息闭环规则、阶梯解锁条件以及全国与校园榜单说明。
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-[#F6FAFE] border border-slate-200/60 p-5">
            <div className="flex items-center gap-2 text-sky-700 font-semibold text-sm">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>1. 活动时间</span>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              打卡获得积分时间：<strong>{CHECKIN_POINTS_WINDOW}</strong>。积分兑换奖品（优惠券及帆布包、水杯、明信片、挂件等周边）截止至{' '}
              <strong>{REDEMPTION_DEADLINE}</strong>，请及时在积分商城完成兑换与核销。
            </p>
          </div>

          <div className="rounded-2xl bg-[#F6FAFE] border border-slate-200/60 p-5">
            <div className="flex items-center gap-2 text-sky-700 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>2. 护眼记录与请假闭环</span>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              在「自习室」选择「学习/工作」结束后，需选择进行 5 分钟休息才能留下可打卡的护眼记录；选择「望向远方 / 闭眼养神 / 户外散步 / 无手机用餐 / 滴眼药水舒缓」则本身为护眼行为，结束后直接生成记录。凭记录在「打卡」填写地点和缘由即可申请护眼请假条。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2 text-slate-900">
          <Gift className="w-5 h-5 text-sky-600" aria-hidden="true" />
          <h2 className="text-base font-bold">3. 护眼时长阶梯与可兑换奖品</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {DURATION_TIERS.map((tier) => (
            <div key={tier.name} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">{tier.name}</p>
                <p className="text-xs text-slate-500">{tier.perks}</p>
              </div>
              <span className="text-xs font-mono text-sky-700 tabular-nums">
                累计 {tier.minMinutes} 分钟以上
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed space-y-1.5">
          <p className="font-semibold text-slate-800">眼假期护照集章规则</p>
          <p>· 集齐 3 枚印章：可领取海露玻璃酸钠滴眼液 3 盒立减 24 元券及 +50 积分。</p>
          <p>· 集齐 5 枚印章：可领取海露玻璃酸钠滴眼液 5 盒立减 40 元券及 +120 积分。</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => openSubPage('mall')}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium transition-colors"
          >
            前往积分商城兑奖
          </button>
          <button
            type="button"
            onClick={() => openSubPage('promo')}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors"
          >
            前往官方商城领券
          </button>
          <button
            type="button"
            onClick={() => navigateTab('study')}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors"
          >
            前往自习室计时
          </button>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-slate-900">
          <ShieldAlert className="w-5 h-5 text-sky-600" aria-hidden="true" />
          <h2 className="text-base font-bold">4. 合规与健康免责声明</h2>
        </div>

        <div className="mt-4 space-y-3 text-xs text-slate-500 leading-relaxed">
          <p>
            <strong>非医疗用途声明：</strong>「海露钟」仅提供日常用眼休息提醒与健康习惯记录，不构成任何医疗诊断或临床眼科建议。如持续出现眼痛、视物模糊等不适症状，请及时前往正规医院眼科就诊。
          </p>
          <p>
            <strong>公平统计原则：</strong>打卡页面不支持手填护眼行为与时长，所有护眼记录均须经海露钟自习室计时或休息闭环生成。
          </p>
          <p>
            <strong>卡券、奖品与隐私说明：</strong>海露玻璃酸钠滴眼液立减券可在官方商城核销，帆布包、水杯、明信片与挂件需于 {REDEMPTION_DEADLINE} 前凭核销码领取。你的昵称、学校与打卡记录均保存在本地会话中，可在「我的 - 设置」内随时修改或清除。
          </p>
        </div>
      </section>
    </div>
  );
};
