import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { processDeviceScan, processUrlScan, processEmailScan } from "./src/services/aiScannerCore";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// API Route: Device Symptom & Compromise Check
app.post("/api/scan/device", async (req, res) => {
  try {
    const { os = "android", symptoms = [], customNotes = "" } = req.body;
    const result = await processDeviceScan(os, symptoms, customNotes);
    return res.json(result);
  } catch (err: any) {
    console.error("Error analyzing device:", err);
    return res.status(500).json({ error: "Failed to analyze device symptoms: " + err.message });
  }
});

// API Route: URL & Link Checker
app.post("/api/scan/url", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    const result = await processUrlScan(url);
    return res.json(result);
  } catch (err: any) {
    console.error("Error scanning URL:", err);
    return res.status(500).json({ error: "Failed to scan URL: " + err.message });
  }
});

// API Route: Email Phishing Checker
app.post("/api/scan/email", async (req, res) => {
  try {
    const { sender = "", subject = "", emailBody = "" } = req.body;
    if (!emailBody && !subject && !sender) {
      return res.status(400).json({ error: "Please provide email text, subject, or sender address." });
    }
    const result = await processEmailScan(sender, subject, emailBody);
    return res.json(result);
  } catch (err: any) {
    console.error("Error scanning email:", err);
    return res.status(500).json({ error: "Failed to scan email: " + err.message });
  }
});

// Vite & Express setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BrowserSafe AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
