import React from 'react';
import { Smartphone, Link as LinkIcon, Mail, History } from 'lucide-react';

export type TabType = 'device' | 'url' | 'email' | 'history';

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  historyCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  historyCount,
}) => {
  const tabs = [
    {
      id: 'device' as TabType,
      label: 'Device Symptom Checker',
      shortLabel: 'Device Health',
      icon: Smartphone,
      description: 'Check if phone or PC is hacked',
      badge: 'Urgent Help',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
    {
      id: 'url' as TabType,
      label: 'URL & Link Inspector',
      shortLabel: 'URL Safety',
      icon: LinkIcon,
      description: 'Detect phishing links & fake sites',
      badge: null,
    },
    {
      id: 'email' as TabType,
      label: 'Fake Email Detector',
      shortLabel: 'Email Check',
      icon: Mail,
      description: 'Verify suspicious email headers & body',
      badge: null,
    },
    {
      id: 'history' as TabType,
      label: 'Scan History & Reports',
      shortLabel: 'History',
      icon: History,
      description: 'Saved logs & emergency action plans',
      badge: historyCount > 0 ? `${historyCount}` : null,
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[65px] z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>

                {tab.badge && (
                  <span
                    className={`ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      isActive
                        ? 'bg-white/20 text-white border-white/30'
                        : tab.badgeColor || 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
