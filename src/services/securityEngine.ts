import { DeviceScanResult, UrlScanResult, EmailScanResult, OSType } from "../types";
import { processDeviceScan, processUrlScan, processEmailScan } from "./aiScannerCore";

export async function requestDeviceScan(
  os: OSType,
  symptoms: string[],
  customNotes: string = ""
): Promise<DeviceScanResult> {
  try {
    const res = await fetch("/api/scan/device", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ os, symptoms, customNotes }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // API endpoint unreachable, fallback to client-side runner
  }

  // Fallback to client-side engine
  return await processDeviceScan(os, symptoms, customNotes);
}

export async function requestUrlScan(url: string): Promise<UrlScanResult> {
  try {
    const res = await fetch("/api/scan/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // API endpoint unreachable
  }

  // Fallback to client-side engine
  return await processUrlScan(url);
}

export async function requestEmailScan(
  sender: string = "",
  subject: string = "",
  emailBody: string = ""
): Promise<EmailScanResult> {
  try {
    const res = await fetch("/api/scan/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, subject, emailBody }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // API endpoint unreachable
  }

  // Fallback to client-side engine
  return await processEmailScan(sender, subject, emailBody);
}
