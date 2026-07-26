import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationTabs, TabType } from './components/NavigationTabs';
import { DeviceScanner } from './components/DeviceScanner';
import { UrlScanner } from './components/UrlScanner';
import { EmailScanner } from './components/EmailScanner';
import { HistoryLog } from './components/HistoryLog';
import { EmergencyModal } from './components/EmergencyModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ScanHistoryItem } from './types';
import { ShieldAlert } from 'lucide-react';

const STORAGE_KEY = 'browsersafe_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('device');
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev.slice(-4), { id, text, type }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Save scan result
  const handleSaveResult = (newItem: ScanHistoryItem) => {
    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 100);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  // Delete individual item from history
  const handleDeleteItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
    showToast('Removed item from scan history', 'info');
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    showToast('Scan history cleared', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Header Bar */}
      <Header
        onOpenEmergencyGuide={() => setIsEmergencyModalOpen(true)}
        totalScansCount={history.length}
      />

      {/* Main Tab Navigation */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        historyCount={history.length}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Selected View */}
        {activeTab === 'device' && (
          <DeviceScanner onSaveResult={handleSaveResult} onShowToast={showToast} />
        )}

        {activeTab === 'url' && (
          <UrlScanner onSaveResult={handleSaveResult} onShowToast={showToast} />
        )}

        {activeTab === 'email' && (
          <EmailScanner onSaveResult={handleSaveResult} onShowToast={showToast} />
        )}

        {activeTab === 'history' && (
          <HistoryLog
            history={history}
            onClearHistory={handleClearHistory}
            onDeleteItem={handleDeleteItem}
            onShowToast={showToast}
          />
        )}

      </main>

      {/* Emergency Guide Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-500" />
            <span className="font-bold text-slate-700 dark:text-slate-300">BrowserSafe AI Security Assistant</span>
          </div>
          <p>
            Heuristic security signals powered by Gemini AI. Always report bank fraud directly to your financial institution.
          </p>
        </div>
      </footer>

    </div>
  );
}
