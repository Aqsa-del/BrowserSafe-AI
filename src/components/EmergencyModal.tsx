import React from 'react';
import { X, PhoneCall, ShieldAlert, Lock, Smartphone, ExternalLink, AlertTriangle, FileText } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wide">
                Hacked / Financial Fraud Response Plan
              </h3>
              <p className="text-xs text-rose-100">
                Step-by-step emergency checklist if money was lost or phone was compromised
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          
          {/* Priority 1: Bank Fraud */}
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold uppercase text-xs">
              <PhoneCall className="w-4 h-4" /> 1. Financial Fraud Immediate Defense
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-xs font-medium text-slate-800 dark:text-slate-200">
              <li>
                <strong>Call Your Bank Fraud Desk Immediately:</strong> Ask them to freeze your accounts, debit cards, and net banking access.
              </li>
              <li>
                <strong>Block Cards via App:</strong> Open your bank app on a clean device and toggle card temporary lock.
              </li>
              <li>
                <strong>Dispute Transfers:</strong> Request formal transaction dispute / chargeback forms for unauthorized debits.
              </li>
            </ul>
          </div>

          {/* Priority 2: Device Containment */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold uppercase text-xs">
              <Smartphone className="w-4 h-4 text-indigo-500" /> 2. Contain Compromised Device
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-xs">
              <li>
                <strong>Turn Off Internet:</strong> Immediately enable Airplane Mode and disable Wi-Fi to stop malware from sending your passwords or SMS OTPs to remote servers.
              </li>
              <li>
                <strong>Uninstall Unrecognized Apps:</strong> Check Device Settings &gt; Apps. Look for hidden apps without icons or suspicious APKs installed recently.
              </li>
              <li>
                <strong>Boot in Safe Mode:</strong> Boot Android/Windows in Safe Mode to prevent background malware from launching automatically during startup.
              </li>
            </ul>
          </div>

          {/* Priority 3: Password Lockdown */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold uppercase text-xs">
              <Lock className="w-4 h-4 text-indigo-500" /> 3. Account Lockdown
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-xs">
              <li>
                <strong>Change Passwords from a Secondary Clean Device:</strong> Update passwords for Google Account, Apple ID, primary email, and banking.
              </li>
              <li>
                <strong>Log Out All Active Sessions:</strong> Use Google/Apple security settings to "Sign out of all other devices".
              </li>
              <li>
                <strong>Enable Authenticator 2FA:</strong> Replace SMS-based 2FA with app-based 2FA (Google Authenticator or Aegis).
              </li>
            </ul>
          </div>

          {/* Priority 4: Cybercrime Reporting */}
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-xs">
              <FileText className="w-4 h-4" /> 4. Report Incident
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              File an official incident report with your national cybercrime portal (e.g. IC3 in US, Cybercrime portal in India, Action Fraud in UK) and obtain a complaint reference number for bank dispute claims.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Emergency Response Guide
          </button>
        </div>

      </div>
    </div>
  );
};
