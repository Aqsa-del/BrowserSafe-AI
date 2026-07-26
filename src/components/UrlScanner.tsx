import React, { useState } from 'react';
import { Link as LinkIcon, ShieldCheck, AlertTriangle, ExternalLink, Globe, RefreshCw, Copy, Check, ArrowRight, ShieldAlert } from 'lucide-react';
import { UrlScanResult, ScanHistoryItem } from '../types';
import { RiskMeter } from './RiskMeter';
import { requestUrlScan } from '../services/securityEngine';

interface UrlScannerProps {
  onSaveResult: (item: ScanHistoryItem) => void;
  onShowToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const SAMPLE_URLS = [
  {
    label: 'Fake PayPal Link (.zip TLD)',
    url: 'http://paypal-login-security-update.account-verify.zip/login',
    type: 'phishing',
  },
  {
    label: 'Raw IP Host Link',
    url: 'http://192.168.1.100/bank-of-america/login.php?session=8912',
    type: 'phishing',
  },
  {
    label: 'Typosquatted Brand',
    url: 'http://www.paypa1-update-system.xyz/verify-account',
    type: 'phishing',
  },
  {
    label: 'Safe Official Site',
    url: 'https://www.google.com',
    type: 'safe',
  },
];

export const UrlScanner: React.FC<UrlScannerProps> = ({ onSaveResult, onShowToast }) => {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<UrlScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        onShowToast('Pasted link from clipboard', 'info');
      }
    } catch {
      onShowToast('Clipboard access denied. Please paste manually.', 'error');
    }
  };

  const handleSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    onShowToast('Sample link loaded', 'info');
  };

  const handleCopyResult = () => {
    if (!result) return;
    const text = `BrowserSafe AI URL Inspection
Link: ${result.url}
Verdict: ${result.category} (Risk Score: ${result.riskScore}/100)
Summary: ${result.summary}
Recommendation: ${result.recommendation}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('URL inspection copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please paste or type a URL to inspect.');
      onShowToast('Please enter a URL to inspect', 'error');
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const data = await requestUrlScan(url.trim());
      setResult(data);

      onSaveResult({
        id: 'url_' + Date.now(),
        timestamp: Date.now(),
        type: 'url',
        title: `URL Check (${data.domain || 'Link'}) - ${data.category}`,
        riskScore: data.riskScore,
        category: data.category,
        summary: data.summary,
        details: data,
      });

      onShowToast('Link security scan finished!', 'success');
    } catch (err: any) {
      const msg = err.message || 'Failed to scan URL. Please try again.';
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
              <Globe className="w-3 h-3 text-indigo-400" /> Web & SMS Link Analyzer
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Phishing Link & Deceptive URL Inspector
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Paste any suspicious web link, SMS URL, or email link before clicking. Our AI inspects typosquatting, deceptive subdomains, high-risk TLDs, and brand spoofing.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <span className="text-[11px] font-medium text-slate-400">Try Sample Links:</span>
            <div className="flex flex-wrap gap-1.5 max-w-xs">
              {SAMPLE_URLS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSample(sample.url)}
                  className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* URL Form */}
      <form onSubmit={handleScan} className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Paste Web Address / Link to Verify
          </label>

          <div className="relative flex items-center">
            <div className="absolute left-4 text-slate-400">
              <LinkIcon className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. http://paypal-login-security-update.account-verify.zip/login"
              className="w-full pl-12 pr-28 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="absolute right-2 flex items-center gap-1">
              <button
                type="button"
                onClick={handlePaste}
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                Paste
              </button>
              {url && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
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
              <span>Inspecting Domain Structure & Threat Intelligence...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span>Verify Link Safety</span>
            </>
          )}
        </button>
      </form>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
          <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="grid grid-cols-4 gap-3">
            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
        </div>
      )}

      {/* Results View */}
      {result && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-500" />
                  URL Safety Inspection Report
                </h3>
                <p className="text-xs font-mono text-slate-500 break-all mt-1">
                  {result.url}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyResult}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                {result.riskScore < 30 && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Risk Meter */}
            <RiskMeter score={result.riskScore} category={result.category} />

            {/* Technical Domain Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Technical Domain Breakdown
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Actual Registered Domain</div>
                  <div className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">
                    {result.domainAnalysis.actualDomain || result.domain}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Impersonated Brand</div>
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                    {result.domainAnalysis.detectedBrand || 'None Detected'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Typosquatting Trick</div>
                  <div className="text-xs font-bold mt-1">
                    {result.domainAnalysis.isTyposquatting ? (
                      <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> YES
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400">NO</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Suspicious TLD / IP Host</div>
                  <div className="text-xs font-bold mt-1">
                    {result.domainAnalysis.suspiciousTLD || result.domainAnalysis.usesIPAddress ? (
                      <span className="text-rose-600 dark:text-rose-400">High Risk</span>
                    ) : (
                      <span className="text-slate-600 dark:text-slate-300">Standard</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Verdict & Recommendation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Summary
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {result.summary}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Recommendation
                </h4>
                <p className="text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 font-semibold leading-relaxed">
                  {result.recommendation}
                </p>
              </div>
            </div>

            {/* Red Flags List */}
            {result.redFlags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-500" /> Link Red Flags Identified ({result.redFlags.length})
                </h4>
                <div className="space-y-1.5">
                  {result.redFlags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Steps */}
            {result.actionSteps.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Next Steps
                </h4>
                <div className="space-y-2">
                  {result.actionSteps.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                      <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{step}</span>
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
