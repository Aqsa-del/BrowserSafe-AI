import React from 'react';
import { ShieldAlert, Cpu, LifeBuoy, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenEmergencyGuide: () => void;
  totalScansCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEmergencyGuide, totalScansCount }) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  BrowserSafe <span className="text-indigo-400 font-extrabold">AI</span>
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Security Engine Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Detect phishing links, scam emails, and compromised phone/PC symptoms
              </p>
            </div>
          </div>

          {/* Actions & Badge */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Scans Done: <strong className="text-white">{totalScansCount}</strong></span>
            </div>

            <button
              onClick={onOpenEmergencyGuide}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Hacked / Fraud Help</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
