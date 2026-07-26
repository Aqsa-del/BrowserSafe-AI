import { processDeviceScan } from "../src/services/aiScannerCore";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { os = "android", symptoms = [], customNotes = "" } = req.body || {};
    const result = await processDeviceScan(os, symptoms, customNotes);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Vercel Serverless device scan error:", err);
    return res.status(500).json({ error: "Failed to analyze device symptoms: " + err.message });
  }
}
