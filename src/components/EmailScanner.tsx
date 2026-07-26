import React, { useState } from 'react';
import { Mail, ShieldCheck, AlertTriangle, UserX, BrainCircuit, CheckCircle2, RefreshCw, Copy, Check } from 'lucide-react';
import { EmailScanResult, ScanHistoryItem } from '../types';
import { RiskMeter } from './RiskMeter';
import { requestEmailScan } from '../services/securityEngine';

interface EmailScannerProps {
  onSaveResult: (item: ScanHistoryItem) => void;
  onShowToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const EMAIL_SAMPLES = [
  {
    name: 'PayPal Account Suspended',
    sender: 'PayPal Billing <service-billing@paypa1-update-notice.xyz>',
    subject: 'URGENT: Your account has been locked due to suspicious activity!',
    body: `Dear Customer,

We detected an unauthorized sign-in to your PayPal account from an unknown IP address. To prevent permanent account suspension, you must verify your identity within 24 hours.

Click the secure link below to update your debit card and password immediately:
http://paypal-login-security-update.account-verify.zip/login

If you do not verify within 24 hours, your remaining balance will be frozen permanently.

Thank you,
PayPal Fraud Security Department`,
  },
  {
    name: 'Geek Squad $499 Invoice Scam',
    sender: 'Geek Squad Support <invoices@tech-support-desk-service.online>',
    subject: 'Invoice Paid: $499.99 for 3-Year Cyber Protection Plan',
    body: `Thank you for your renewal!

We have successfully processed a charge of $499.99 on your saved credit card for Geek Squad Total Tech Care Auto-Renewal (Invoice #GS-882910).

If you did not authorize this subscription or wish to cancel and request an immediate full refund, call our 24/7 billing helpline right away:
+1 (800) 555-0199

Do not reply to this email as this inbox is unmonitored.`,
  },
  {
    name: 'DHL Package Pending Delivery',
    sender: 'DHL Express <delivery-notice@dhl-express-tracking-portal.top>',
    subject: 'Delivery On Hold: Unpaid Customs Duty Fee ($2.99)',
    body: `Your package (Tracking #DHL-9921820) could not be delivered today due to an unpaid customs clearance fee of $2.99.

Please pay the outstanding fee online to schedule delivery:
http://dhl-express-tracking-portal.top/pay-fee

Failure to pay within 48 hours will result in package return to sender.`,
  },
];

export const EmailScanner: React.FC<EmailScannerProps> = ({ onSaveResult, onShowToast }) => {
  const [sender, setSender] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EmailScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleLoadSample = (sample: typeof EMAIL_SAMPLES[0]) => {
    setSender(sample.sender);
    setSubject(sample.subject);
    setEmailBody(sample.body);
    onShowToast(`Loaded sample email: ${sample.name}`, 'info');
  };

  const handleCopyResult = () => {
    if (!result) return;
    const text = `BrowserSafe AI Email Phishing Inspection
Subject: ${subject || 'Unspecified'}
Sender: ${sender || 'Unspecified'}
Verdict: ${result.category} (Risk Score: ${result.riskScore}/100)
Summary: ${result.summary}
Sender Spoofed: ${result.senderAnalysis.isSpoofed ? 'YES' : 'NO'} (${result.senderAnalysis.reason})
Action Steps:
${result.actionPlan.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Email analysis copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailBody.trim() && !subject.trim() && !sender.trim()) {
      setError('Please enter at least email text, subject line, or sender address.');
      onShowToast('Please provide email details to analyze', 'error');
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const data = await requestEmailScan(sender, subject, emailBody);
      setResult(data);

      onSaveResult({
        id: 'eml_' + Date.now(),
        timestamp: Date.now(),
        type: 'email',
        title: `Email Check (${subject ? subject.slice(0, 30) + '...' : 'Scam Email'}) - ${data.category}`,
        riskScore: data.riskScore,
        category: data.category,
        summary: data.summary,
        details: data,
      });

      onShowToast('Email phishing scan completed!', 'success');
    } catch (err: any) {
      const msg = err.message || 'Failed to scan email. Please try again.';
      setError(msg);
      onShowToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-indigo-900/50 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Mail className="w-3 h-3 text-indigo-400" /> Phishing & Scam Email Inspector
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Fake Email & Social Engineering Detector
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Paste suspicious email text, headers, or subject lines. Our AI detects brand impersonation, deceptive display names, psychological pressure, and scam invoice traps.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <span className="text-[11px] font-medium text-slate-400">Load Common Scams:</span>
            <div className="flex flex-wrap gap-1.5 max-w-xs">
              {EMAIL_SAMPLES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadSample(sample)}
                  className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleScan} className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sender Address or Name
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g. PayPal Security <service-billing@paypa1-update.xyz>"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. URGENT: Your account has been suspended!"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Email Content / Message Body
          </label>
          <textarea
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            rows={6}
            placeholder="Paste the full email text here..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Email for Phishing & Psychological Triggers...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span>Analyze Email for Phishing</span>
            </>
          )}
        </button>
      </form>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
          <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      )}

      {/* Results View */}
      {result && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-500" />
                Email Phishing Analysis Report
              </h3>

              <button
                type="button"
                onClick={handleCopyResult}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Report'}</span>
              </button>
            </div>

            {/* Risk Gauge */}
            <RiskMeter score={result.riskScore} category={result.category} />

            {/* Sender Spoof Analysis */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <UserX className="w-4 h-4 text-indigo-500" /> Sender Verification Analysis
              </div>
              <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                {result.senderAnalysis.isSpoofed ? (
                  <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> DECEPTIVE SENDER SPOOFING DETECTED
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Sender Domain Appears Normal
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {result.senderAnalysis.reason}
              </p>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Verdict Summary
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {result.summary}
              </p>
            </div>

            {/* Psychological Triggers */}
            {result.psychologicalTriggers.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-indigo-500" /> Psychological Manipulation Tactics Detected
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.psychologicalTriggers.map((trigger, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-xs font-semibold"
                    >
                      ⚠️ {trigger}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Red Flags List */}
            {result.redFlags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email Red Flags Identified ({result.redFlags.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.redFlags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Plan */}
            {result.actionPlan.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Recommended Action Steps
                </h4>
                <div className="space-y-2">
                  {result.actionPlan.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      • {step}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
