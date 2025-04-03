import type { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";
import * as puppeteer from "puppeteer";

// Create a singleton browser instance
let browserInstance: puppeteer.Browser | null = null;

// Simple PDF cache
interface CacheEntry {
  buffer: Uint8Array<ArrayBufferLike>;
  timestamp: number;
}
const pdfCache: Record<string, CacheEntry> = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

// Clean expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(pdfCache).forEach((key) => {
    if (now - pdfCache[key].timestamp > CACHE_TTL) {
      delete pdfCache[key];
    }
  });
}, 15 * 60 * 1000);

async function getBrowser() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
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

    // Optional: Handle cleanup on server shutdown
    process.on("SIGINT", () => {
      if (browserInstance) browserInstance.close();
    });
  }

  return browserInstance;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const siteUrl = process.env.SITE_URL || "http://localhost:3000";
    const { path } = req.query || {};

    let timesheetPath = path;

    if (timesheetPath === "86bczf1oqv") {
      timesheetPath = "timesheet-demo";
    }

    if (!timesheetPath) {
      throw new Error("Path is required");
    }

    // Create a cache key based on the request parameters
    const cacheKey = `${timesheetPath as string}`;

    // Check if we have a cached version of this PDF
    if (
      pdfCache[cacheKey] &&
      Date.now() - pdfCache[cacheKey].timestamp < CACHE_TTL
    ) {
      console.info(`Serving cached PDF for ${timesheetPath}`);

      // Serve the cached PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=timesheet.pdf"
      );
      res.setHeader("X-Cache", "HIT");
      res.write(pdfCache[cacheKey].buffer);
      res.end();

      return;
    }

    console.info(`Generating new PDF for ${timesheetPath}`);

    // Rest of your existing PDF generation code
    let page = null;

    try {
      const browser = await getBrowser();
      page = await browser.newPage();

      page.setDefaultNavigationTimeout(60000);
      page.setDefaultTimeout(60000);

      await page.evaluateOnNewDocument(() => {
        window.addEventListener("load", async () => {
          if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
          }
        });
      });

      await page.goto(`${siteUrl}/${timesheetPath}?print=true`, {
        waitUntil: "networkidle0",
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      await page.evaluate(async () => {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
          document.body.style.opacity = "0.99";
          await new Promise((resolve) => setTimeout(resolve, 100));
          document.body.style.opacity = "1";
        }
      });

      const pdfBuffer = await page.pdf({
        format: "A3",
        printBackground: true,
        scale: 0.9,
        preferCSSPageSize: true,
      });

      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const compressedPdfBuffer = await pdfDoc.save({
        useObjectStreams: false,
        updateFieldAppearances: false,
      });

      if (page) {
        await page.close();
      }

      // Store in cache
      pdfCache[cacheKey] = {
        buffer: compressedPdfBuffer,
        timestamp: Date.now(),
      };

      // Send the response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=timesheet.pdf"
      );
      res.setHeader("X-Cache", "MISS");
      res.write(compressedPdfBuffer);
      res.end();
    } catch (innerError) {
      if (page) await page.close();
      throw innerError;
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}
