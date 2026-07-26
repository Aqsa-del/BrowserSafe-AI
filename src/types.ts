export type OSType = 'android' | 'ios' | 'windows' | 'mac' | 'other';

export type RiskCategory = 'Safe' | 'Low Risk' | 'Medium Risk' | 'Suspicious' | 'High Risk' | 'Likely Phishing' | 'Malicious' | 'Hacked / Critical';

export interface ActionStep {
  step: number;
  title: string;
  description: string;
  urgent: boolean;
}

export interface DeviceScanRequest {
  os: OSType;
  symptoms: string[];
  customNotes?: string;
}

export interface DeviceScanResult {
  riskScore: number;
  category: RiskCategory;
  summary: string;
  detailedAnalysis: string;
  redFlags: string[];
  actionPlan: ActionStep[];
  contactBankImmediately: boolean;
}

export interface UrlScanRequest {
  url: string;
}

export interface DomainAnalysis {
  detectedBrand?: string;
  actualDomain: string;
  isTyposquatting: boolean;
  usesIPAddress: boolean;
  suspiciousTLD: boolean;
  excessSubdomains: boolean;
  protocol: string;
}

export interface UrlScanResult {
  url: string;
  domain: string;
  riskScore: number;
  category: RiskCategory;
  summary: string;
  domainAnalysis: DomainAnalysis;
  redFlags: string[];
  recommendation: string;
  actionSteps: string[];
}

export interface EmailScanRequest {
  sender?: string;
  subject?: string;
  emailBody: string;
}

export interface EmailScanResult {
  riskScore: number;
  category: RiskCategory;
  summary: string;
  senderAnalysis: {
    isSpoofed: boolean;
    reason: string;
  };
  redFlags: string[];
  psychologicalTriggers: string[];
  actionPlan: string[];
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  type: 'device' | 'url' | 'email';
  title: string;
  riskScore: number;
  category: RiskCategory;
  summary: string;
  details: DeviceScanResult | UrlScanResult | EmailScanResult;
}
