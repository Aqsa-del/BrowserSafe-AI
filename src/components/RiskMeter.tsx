import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Skull, Shield } from 'lucide-react';
import { RiskCategory } from '../types';

interface RiskMeterProps {
  score: number;
  category: RiskCategory;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, category }) => {
  // Color configuration based on score
  const getColorScheme = (score: number, category: string) => {
    if (score >= 80 || category.includes('Hacked') || category.includes('Malicious')) {
      return {
        bg: 'bg-rose-500/10 border-rose-500/30',
        text: 'text-rose-600 dark:text-rose-400',
        bar: 'bg-gradient-to-r from-amber-500 via-rose-500 to-red-600',
        badge: 'bg-rose-500 text-white',
        icon: Skull,
        label: 'CRITICAL RISK',
      };
    }
    if (score >= 60 || category.includes('High') || category.includes('Phishing')) {
      return {
        bg: 'bg-orange-500/10 border-orange-500/30',
        text: 'text-orange-600 dark:text-orange-400',
        bar: 'bg-gradient-to-r from-amber-400 to-orange-500',
        badge: 'bg-orange-500 text-white',
        icon: ShieldAlert,
        label: 'HIGH RISK',
      };
    }
    if (score >= 35 || category.includes('Suspicious') || category.includes('Medium')) {
      return {
        bg: 'bg-amber-500/10 border-amber-500/30',
        text: 'text-amber-600 dark:text-amber-400',
        bar: 'bg-gradient-to-r from-yellow-400 to-amber-500',
        badge: 'bg-amber-500 text-slate-900',
        icon: AlertTriangle,
        label: 'SUSPICIOUS',
      };
    }
    if (score >= 15 || category.includes('Low')) {
      return {
        bg: 'bg-blue-500/10 border-blue-500/30',
        text: 'text-blue-600 dark:text-blue-400',
        bar: 'bg-gradient-to-r from-teal-400 to-blue-500',
        badge: 'bg-blue-500 text-white',
        icon: Shield,
        label: 'LOW RISK',
      };
    }
    return {
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      bar: 'bg-gradient-to-r from-emerald-400 to-teal-500',
      badge: 'bg-emerald-600 text-white',
      icon: ShieldCheck,
      label: 'SAFE',
    };
  };

  const scheme = getColorScheme(score, category);
  const IconComponent = scheme.icon;

  return (
    <div className={`p-5 rounded-2xl border ${scheme.bg} backdrop-blur-sm transition-all duration-300`}>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${scheme.badge} shadow-sm`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Risk Verdict
            </div>
            <div className={`text-xl font-bold ${scheme.text} tracking-tight`}>
              {category}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            {score}<span className="text-sm font-normal text-slate-500">/100</span>
          </div>
          <div className="text-xs font-medium text-slate-500">Risk Score</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${scheme.bar}`}
          style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
        <span>0 Safe</span>
        <span>25 Low</span>
        <span>50 Suspicious</span>
        <span>75 High</span>
        <span>100 Critical</span>
      </div>
    </div>
  );
};
