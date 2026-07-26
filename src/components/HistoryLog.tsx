import React, { useState } from 'react';
import { History, Download, Trash2, Search, Smartphone, Link as LinkIcon, Mail, Copy, Check, FileSpreadsheet, FileJson } from 'lucide-react';
import { ScanHistoryItem } from '../types';

interface HistoryLogProps {
  history: ScanHistoryItem[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
  onShowToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({
  history,
  onClearHistory,
  onDeleteItem,
  onShowToast,
}) => {
  const [search, setSearch] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'device' | 'url' | 'email'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleExportCSV = () => {
    if (history.length === 0) {
      onShowToast('Scan history is empty. Nothing to export.', 'error');
      return;
    }

    const headers = ['Timestamp', 'Date', 'Type', 'Title', 'Risk Score', 'Category', 'Summary'];
    const rows = history.map((item) => [
      item.timestamp,
      new Date(item.timestamp).toLocaleString(),
      item.type,
      `"${item.title.replace(/"/g, '""')}"`,
      item.riskScore,
      `"${item.category}"`,
      `"${item.summary.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `browsersafe-scan-history-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('Exported scan history to CSV successfully!', 'success');
  };

  const handleExportJSON = () => {
    if (history.length === 0) {
      onShowToast('Scan history is empty. Nothing to export.', 'error');
      return;
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.setAttribute('download', `browsersafe-scan-history-${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('Exported scan history to JSON successfully!', 'success');
  };

  const handleCopyItem = (item: ScanHistoryItem) => {
    const text = `BrowserSafe AI Scan Record
Date: ${new Date(item.timestamp).toLocaleString()}
Type: ${item.type.toUpperCase()}
Title: ${item.title}
Risk: ${item.category} (${item.riskScore}/100)
Summary: ${item.summary}`;

    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    onShowToast('Scan record copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeIcon = (type: ScanHistoryItem['type']) => {
    switch (type) {
      case 'device':
        return <Smartphone className="w-4 h-4 text-indigo-500" />;
      case 'url':
        return <LinkIcon className="w-4 h-4 text-emerald-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-amber-500" />;
    }
  };

  const getRiskBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    if (score >= 50) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-indigo-500" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Security Scan History & Logs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Persistent audit trail of all URLs, emails, and devices evaluated.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={history.length === 0}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handleExportJSON}
              disabled={history.length === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={onClearHistory}
              disabled={history.length === 0}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history log..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
            {(['all', 'device', 'url', 'email'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  filterType === t
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Logs List */}
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
            <History className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              No scan history records found matching your query.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
                      {getTypeIcon(item.type)}
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase border ${getRiskBadgeColor(
                        item.riskScore
                      )}`}
                    >
                      {item.category} ({item.riskScore})
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopyItem(item)}
                      title="Copy log details"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      title="Delete log"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 pl-1">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
