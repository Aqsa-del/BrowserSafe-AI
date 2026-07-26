import React, { useState } from 'react';
import { Smartphone, Monitor, AlertTriangle, ShieldCheck, PhoneCall, CheckCircle2, RefreshCw, Zap, Lightbulb, Copy, Check } from 'lucide-react';
import { DeviceScanResult, OSType, ScanHistoryItem } from '../types';
import { RiskMeter } from './RiskMeter';
import { requestDeviceScan } from '../services/securityEngine';

interface DeviceScannerProps {
  onSaveResult: (item: ScanHistoryItem) => void;
  onShowToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const COMMON_SYMPTOMS = [
  { id: 'bank_unauthorized', text: 'Money debited or bank OTP SMS received without my action', highRisk: true },
  { id: 'unknown_apps', text: 'Unrecognized app icons or software appeared on device', highRisk: true },
  { id: 'constant_popups', text: 'Constant full-screen ads or popups even on home screen', highRisk: false },
  { id: 'battery_overheat', text: 'Severe battery drain & phone gets hot when idle', highRisk: false },
  { id: 'account_locked', text: 'Passwords or recovery emails changed unexpectedly', highRisk: true },
  { id: 'contacts_spammed', text: 'Friends report receiving spam links sent from my account', highRisk: true },
  { id: 'cam_mic_active', text: 'Camera or microphone indicator lights turn on randomly', highRisk: false },
  { id: 'sluggish_data_spike', text: 'Extreme lag and unexplained high mobile data usage', highRisk: false },
];

export const DeviceScanner: React.FC<DeviceScannerProps> = ({ onSaveResult, onShowToast }) => {
  const [os, setOs] = useState<OSType>('android');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<DeviceScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const toggleSymptom = (symptomText: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomText)
        ? prev.filter((s) => s !== symptomText)
        : [...prev, symptomText]
    );
  };

  const handlePreset = (presetType: 'financial' | 'popups' | 'clean') => {
    if (presetType === 'financial') {
      setOs('android');
      setSelectedSymptoms([
        'Money debited or bank OTP SMS received without my action',
        'Unrecognized app icons or software appeared on device',
      ]);
      setCustomNotes('I installed a fake bank update APK file from an SMS link yesterday and today $250 was transferred out of my bank account.');
      onShowToast('Loaded Bank Fraud sample scenario', 'info');
    } else if (presetType === 'popups') {
      setOs('android');
      setSelectedSymptoms([
        'Constant full-screen ads or popups even on home screen',
        'Severe battery drain & phone gets hot when idle',
        'Extreme lag and unexplained high mobile data usage',
      ]);
      setCustomNotes('Phone keeps showing loud casino ads every 2 minutes even when no apps are open.');
      onShowToast('Loaded Adware & Popups scenario', 'info');
    } else if (presetType === 'clean') {
      setOs('ios');
      setSelectedSymptoms([]);
      setCustomNotes('My phone battery is discharging slightly faster after the latest software update. Is it hacked?');
      onShowToast('Loaded Low-Risk query sample', 'info');
    }
  };

  const handleCopyResult = () => {
    if (!result) return;
    const text = `BrowserSafe AI Device Scan Report
Verdict: ${result.category} (Risk Score: ${result.riskScore}/100)
Summary: ${result.summary}
Action Steps:
${result.actionPlan.map((a) => `${a.step}. ${a.title}: ${a.description}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Scan report copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0 && !customNotes.trim()) {
      setError('Please select at least one symptom or describe what happened in the text box.');
      onShowToast('Please select symptoms or enter details to scan', 'error');
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const data = await requestDeviceScan(os, selectedSymptoms, customNotes);
      setResult(data);

      onSaveResult({
        id: 'dev_' + Date.now(),
        timestamp: Date.now(),
        type: 'device',
        title: `Device Check (${os.toUpperCase()}) - ${data.category}`,
        riskScore: data.riskScore,
        category: data.category,
        summary: data.summary,
        details: data,
      });

      onShowToast('Device security analysis complete!', 'success');
    } catch (err: any) {
      const msg = err.message || 'Failed to analyze device symptoms. Please try again.';
      setError(msg);
      onShowToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Intro Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-indigo-900/50 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Zap className="w-3 h-3 text-indigo-400" /> System Compromise Inspector
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Is Your Phone or Computer Hacked?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Select your OS and symptoms below. Our security engine will evaluate whether you have adware, spyware, financial malware, or a false alarm — and give you immediate recovery steps.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <span className="text-[11px] font-medium text-slate-400">Quick Test Samples:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handlePreset('financial')}
                className="px-2.5 py-1 text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
              >
                Bank Money Missing
              </button>
              <button
                type="button"
                onClick={() => handlePreset('popups')}
                className="px-2.5 py-1 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
              >
                Popup Ads & Heat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleScan} className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        
        {/* Step 1: Operating System */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            1. Select Operating System
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { id: 'android', label: 'Android Phone', icon: Smartphone },
              { id: 'ios', label: 'iPhone / iPad', icon: Smartphone },
              { id: 'windows', label: 'Windows PC', icon: Monitor },
              { id: 'mac', label: 'MacBook / Mac', icon: Monitor },
              { id: 'other', label: 'Other OS', icon: Monitor },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = os === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setOs(item.id as OSType)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Check Symptoms */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            2. Check Any Symptoms You Notice
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {COMMON_SYMPTOMS.map((symptom) => {
              const isChecked = selectedSymptoms.includes(symptom.text);
              return (
                <div
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.text)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-500'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span>{symptom.text}</span>
                    {symptom.highRisk && (
                      <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        High Risk
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Describe Details */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            3. Describe what happened (Free Text Details)
          </label>
          <textarea
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            rows={3}
            placeholder="e.g. 'I downloaded an update app from a link sent on WhatsApp, now my phone shows popups and I received a bank OTP SMS...'"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Device Security with Gemini AI...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span>Run Device Compromise Scan</span>
            </>
          )}
        </button>
      </form>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
          <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
        </div>
      )}

      {/* Results View */}
      {result && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Emergency Financial Warning Banner */}
          {result.contactBankImmediately && (
            <div className="p-5 rounded-2xl bg-rose-600 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-2 border-rose-400">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-black text-base sm:text-lg tracking-wide uppercase">
                  <AlertTriangle className="w-6 h-6 text-amber-300 animate-bounce shrink-0" />
                  EMERGENCY ACTION REQUIRED: FINANCIAL RISK DETECTED
                </div>
                <p className="text-xs sm:text-sm text-rose-100">
                  Your symptoms suggest active unauthorized access to bank accounts or SMS OTP interception. Freeze your cards immediately!
                </p>
              </div>

              <a
                href="tel:1800"
                className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white text-rose-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-rose-50 transition-colors shrink-0"
              >
                <PhoneCall className="w-4 h-4 text-rose-600" />
                Call Bank Fraud Helpline
              </a>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                Security Assessment Report
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyResult}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Report'}</span>
                </button>

                <span className="text-xs text-slate-500 font-medium hidden sm:inline">OS: {os.toUpperCase()}</span>
              </div>
            </div>

            {/* Risk Meter Gauge */}
            <RiskMeter score={result.riskScore} category={result.category} />

            {/* Summary & Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Verdict Summary
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {result.summary}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Technical Explanation
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {result.detailedAnalysis}
                </p>
              </div>
            </div>

            {/* Identified Red Flags */}
            {result.redFlags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Key Warning Signals ({result.redFlags.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.redFlags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Plan */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Immediate Defense & Recovery Action Plan
              </h4>

              <div className="space-y-2.5">
                {result.actionPlan.map((action) => (
                  <div
                    key={action.step}
                    className={`p-4 rounded-xl border transition-all ${
                      action.urgent
                        ? 'bg-rose-500/10 border-rose-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          action.urgent ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white dark:bg-slate-700'
                        }`}
                      >
                        {action.step}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                            {action.title}
                          </h5>
                          {action.urgent && (
                            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-rose-500 text-white">
                              DO FIRST
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Helpful Disclaimer */}
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                <strong>Disclaimer:</strong> BrowserSafe AI provides heuristic analysis based on reported symptoms. If you suspect active monetary fraud, contact your bank and local cybercrime helpline immediately.
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
