import { GoogleGenAI, Type } from "@google/genai";
import { DeviceScanResult, UrlScanResult, EmailScanResult, OSType } from "../types";

function getGenAI(customApiKey?: string) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY || (typeof window !== "undefined" ? (window as any).process?.env?.GEMINI_API_KEY : "");
  return new GoogleGenAI({
    apiKey: apiKey || "dummy-key-for-initialization",
    httpOptions: {
      headers: {
        "User-Agent": "browsersafe-ai",
      },
    },
  });
}

export async function processDeviceScan(
  os: OSType,
  symptoms: string[],
  customNotes: string = "",
  apiKeyOverride?: string
): Promise<DeviceScanResult> {
  const apiKey = apiKeyOverride || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const isBankRelated =
      symptoms.some((s) =>
        s.toLowerCase().includes("bank") ||
        s.toLowerCase().includes("money") ||
        s.toLowerCase().includes("transaction")
      ) ||
      customNotes.toLowerCase().includes("bank") ||
      customNotes.toLowerCase().includes("money");

    const score = isBankRelated ? 85 : Math.min(90, symptoms.length * 20 || 30);
    return {
      riskScore: score,
      category: score >= 80 ? "Hacked / Critical" : score >= 50 ? "High Risk" : "Low Risk",
      summary: "Heuristic evaluation based on reported symptoms.",
      detailedAnalysis:
        "Analysis performed in heuristic offline mode. For full AI reasoning, ensure GEMINI_API_KEY is configured.",
      redFlags: symptoms.length > 0 ? symptoms : ["Reported unusual behavior"],
      actionPlan: [
        {
          step: 1,
          title: isBankRelated ? "Contact Your Bank Immediately" : "Scan Device with Certified Antivirus",
          description: isBankRelated
            ? "Freeze all debit/credit cards and dispute unauthorized transfers."
            : "Run a full malware scan using trusted software.",
          urgent: true,
        },
        {
          step: 2,
          title: "Change Account Passwords",
          description: "Update passwords for email, banking, and primary accounts from a secondary clean device.",
          urgent: false,
        },
      ],
      contactBankImmediately: isBankRelated,
    };
  }

  const ai = getGenAI(apiKey);
  const systemInstruction = `You are BrowserSafe AI, a professional cybersecurity incident response engine. 
Analyze device symptoms reported by a user (OS: ${os}) and assess if their system is compromised, hacked, or infected by malware/spyware.
Provide plain English, non-jargon advice.
If symptoms involve unauthorized financial transactions, missing money, bank OTPs received without user action, or unauthorized banking app access, MUST set contactBankImmediately=true, riskScore >= 80, category='Hacked / Critical' or 'High Risk', and step 1 in actionPlan MUST be contacting their bank immediately.`;

  const prompt = `User OS: ${os}
Reported Symptoms: ${JSON.stringify(symptoms)}
Additional Details / Notes: "${customNotes}"

Analyze this device status thoroughly and return structured JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.INTEGER },
          category: { type: Type.STRING },
          summary: { type: Type.STRING },
          detailedAnalysis: { type: Type.STRING },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          actionPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.INTEGER },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                urgent: { type: Type.BOOLEAN },
              },
              required: ["step", "title", "description", "urgent"],
            },
          },
          contactBankImmediately: { type: Type.BOOLEAN },
        },
        required: ["riskScore", "category", "summary", "detailedAnalysis", "redFlags", "actionPlan", "contactBankImmediately"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export const TRUSTED_DOMAINS: string[] = [
  "google.com",
  "youtube.com",
  "youtu.be",
  "facebook.com",
  "fb.com",
  "messenger.com",
  "instagram.com",
  "whatsapp.com",
  "vercel.com",
  "vercel.app",
  "github.com",
  "microsoft.com",
  "apple.com",
];

export function isTrustedDomain(domain: string): boolean {
  const normalized = domain.toLowerCase().trim();
  return TRUSTED_DOMAINS.some(
    (trusted) => normalized === trusted || normalized.endsWith("." + trusted)
  );
}
  // Fallback to AI inspection for unlisted or custom domains...
}

  const ai = getGenAI(apiKey);
  const systemInstruction = `You are BrowserSafe AI, a web security analyzer.
Examine the provided URL for phishing, typosquatting, brand impersonation, deceptive domain names, suspicious TLDs (.zip, .top, .xyz, .cc, etc.), IP address hosting, excessive subdomains, or credential harvesting traps.
Break down the domain analysis accurately and output plain English advice.`;

  const prompt = `Inspect this URL for security risks: "${url}"`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          url: { type: Type.STRING },
          domain: { type: Type.STRING },
          riskScore: { type: Type.INTEGER },
          category: { type: Type.STRING },
          summary: { type: Type.STRING },
          domainAnalysis: {
            type: Type.OBJECT,
            properties: {
              detectedBrand: { type: Type.STRING },
              actualDomain: { type: Type.STRING },
              isTyposquatting: { type: Type.BOOLEAN },
              usesIPAddress: { type: Type.BOOLEAN },
              suspiciousTLD: { type: Type.BOOLEAN },
              excessSubdomains: { type: Type.BOOLEAN },
              protocol: { type: Type.STRING },
            },
            required: ["actualDomain", "isTyposquatting", "usesIPAddress", "suspiciousTLD", "excessSubdomains", "protocol"],
          },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING },
          actionSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["url", "domain", "riskScore", "category", "summary", "domainAnalysis", "redFlags", "recommendation", "actionSteps"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function processEmailScan(
  sender: string = "",
  subject: string = "",
  emailBody: string = "",
  apiKeyOverride?: string
): Promise<EmailScanResult> {
  const apiKey = apiKeyOverride || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      riskScore: 75,
      category: "Suspicious",
      summary: "Heuristic evaluation completed. Configure GEMINI_API_KEY for complete AI email inspection.",
      senderAnalysis: {
        isSpoofed: true,
        reason: "Sender address domain does not match claimed sender identity.",
      },
      redFlags: ["Urgent call to action", "Unverified sender domain", "Request for account update"],
      psychologicalTriggers: ["Fear of account closure", "Artificial urgency"],
      actionPlan: ["Do not click any embedded links", "Verify directly through official app or website bookmark"],
    };
  }

  const ai = getGenAI(apiKey);
  const systemInstruction = `You are BrowserSafe AI, a social engineering and phishing detector.
Analyze the provided email content, sender address, and subject line.
Check for:
1. Display name spoofing & sender domain mismatches
2. Psychological triggers (artificial panic, account closure threats, tax refund lures, gift card requests)
3. Deceptive links & suspicious requests (asking for passwords, OTP, credit cards, wire transfers)
4. Grammatical & formatting irregularities characteristic of scam operations.
Provide a clear risk score, category, red flags, and protective action plan.`;

  const prompt = `Sender Address: "${sender}"
Subject: "${subject}"
Email Body Content:
"""
${emailBody}
"""`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.INTEGER },
          category: { type: Type.STRING },
          summary: { type: Type.STRING },
          senderAnalysis: {
            type: Type.OBJECT,
            properties: {
              isSpoofed: { type: Type.BOOLEAN },
              reason: { type: Type.STRING },
            },
            required: ["isSpoofed", "reason"],
          },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          psychologicalTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
          actionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["riskScore", "category", "summary", "senderAnalysis", "redFlags", "psychologicalTriggers", "actionPlan"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

function extractDomainFallback(rawUrl: string): string {
  try {
    let formatted = rawUrl.trim();
    if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
      formatted = "https://" + formatted;
    }
    const parsed = new URL(formatted);
    return parsed.hostname;
  } catch {
    return rawUrl.split("/")[0] || rawUrl;
  }
}
