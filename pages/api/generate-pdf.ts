import type { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";
import puppeteer from "puppeteer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const siteUrl = process.env.SITE_URL || "http://localhost:3000";

    const { path } = req.query || {};

    if (!path) {
      throw new Error("Path is required");
    }

    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--disable-features=IsolateOrigins",
        "--disable-site-isolation-trials",
        "--autoplay-policy=user-gesture-required",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-update",
        "--disable-default-apps",
        "--disable-dev-shm-usage",
        "--disable-domain-reliability",
        "--disable-extensions",
        "--disable-features=AudioServiceOutOfProcess",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-notifications",
        "--disable-offer-store-unmasked-wallet-cards",
        "--disable-popup-blocking",
        "--disable-print-preview",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--disable-setuid-sandbox",
        "--disable-speech-api",
        "--disable-sync",
        "--hide-scrollbars",
        "--ignore-gpu-blacklist",
        "--metrics-recording-only",
        "--mute-audio",
        "--no-default-browser-check",
        "--no-first-run",
        "--no-pings",
        "--no-sandbox",
        "--no-zygote",
        "--password-store=basic",
        "--use-gl=swiftshader",
        "--use-mock-keychain",
      ],
    });

    const page = await browser.newPage();
    console.info(`${siteUrl}/${path}?print=true`);
    // Navigate to the page you want to capture
    await page.goto(`${siteUrl}/${path}?print=true`, {
      waitUntil: "networkidle0",
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A3",
      printBackground: true,
      scale: 0.9,
    });

    // Close the browser
    await browser.close();

    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // Compress the PDF
    const compressedPdfBuffer = await pdfDoc.save({
      useObjectStreams: false, // Disable object streams for better compatibility
      updateFieldAppearances: false, // Disable field appearance updates
    });

    // Set the response headers to indicate a PDF file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=timesheet.pdf");

    // Send the PDF buffer as the response
    res.write(compressedPdfBuffer);
    res.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}
