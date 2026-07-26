import { processEmailScan } from "../src/services/aiScannerCore";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { sender = "", subject = "", emailBody = "" } = req.body || {};
    if (!emailBody && !subject && !sender) {
      return res.status(400).json({ error: "Please provide email text, subject, or sender address." });
    }
    const result = await processEmailScan(sender, subject, emailBody);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Vercel Serverless email scan error:", err);
    return res.status(500).json({ error: "Failed to scan email: " + err.message });
  }
}
