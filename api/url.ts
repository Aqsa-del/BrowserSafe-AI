import { processUrlScan } from "../src/services/aiScannerCore";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { url } = req.body || {};
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    const result = await processUrlScan(url);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Vercel Serverless url scan error:", err);
    return res.status(500).json({ error: "Failed to scan URL: " + err.message });
  }
}
