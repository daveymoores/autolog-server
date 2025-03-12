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
        "--font-render-hinting=none", // Improve font rendering
      ],
    });

    const page = await browser.newPage();

    // Preload fonts and ensure they're ready before PDF generation
    await page.evaluateOnNewDocument(() => {
      // This forces the browser to download and use web fonts
      window.addEventListener("load", async () => {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
          console.info("All fonts loaded and ready");
        }
      });
    });

    console.info(`${siteUrl}/${path}?print=true`);

    // Navigate to the page you want to capture
    await page.goto(`${siteUrl}/${path}?print=true`, {
      waitUntil: "networkidle0",
    });

    // Add a delay to ensure fonts are fully loaded
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Ensure fonts are loaded by checking document.fonts status
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
        // Force a repaint to ensure fonts are applied
        document.body.style.opacity = "0.99";
        await new Promise((resolve) => setTimeout(resolve, 100));
        document.body.style.opacity = "1";
      }
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A3",
      printBackground: true,
      scale: 0.9,
      preferCSSPageSize: true, // Use CSS print styles when available
    });

    // Close the browser
    await browser.close();

    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // Compress the PDF
    const compressedPdfBuffer = await pdfDoc.save({
      useObjectStreams: false,
      updateFieldAppearances: false,
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
