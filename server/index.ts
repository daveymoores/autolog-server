import bodyParser from "body-parser";
import cors from "cors";
import express, { Express, Request, Response, NextFunction } from "express";
import * as http from "http";
import next from "next";
import rateLimit from "express-rate-limit";

const dev = process.env.NODE_ENV !== "production";
const port = 3000;
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

// Create API route-specific rate limiters
const requestLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const approveLimiter = rateLimit({
  windowMs: ONE_HOUR, // 1 hour
  max: 50, // Limit each IP to 50 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message:
    "Too many approval requests from this IP, please try again after an hour",
});

// PDF generation rate limiter - more restrictive since PDF generation is resource-intensive
const pdfLimiter = rateLimit({
  windowMs: ONE_HOUR, // 1 hour
  max: 30, // Limit each IP to 30 PDF generations per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: "PDF generation limit reached, please try again after an hour",
});

nextApp.prepare().then(async () => {
  const app: Express = express();
  const server: http.Server = http.createServer(app);

  app.set("trust proxy", 1);

  app.use(cors());
  app.use(bodyParser.json());

  app.get("/favicon.ico", function (req, res) {
    res.sendStatus(204);
  });

  // Custom middleware to apply rate limiting only to specific API routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Check if the request is for the specific API routes
    if (req.url.startsWith("/api/request")) {
      return requestLimiter(req, res, next);
    } else if (req.url.startsWith("/api/approve")) {
      return approveLimiter(req, res, next);
    } else if (req.url.startsWith("/api/generate-pdf")) {
      return pdfLimiter(req, res, next);
    }

    // Pass through for all other routes
    return next();
  });

  app.get("/:timesheet", (req, res) => {
    return handle(req, res);
  });

  app.get("*", (req, res) => handle(req, res));

  server.listen(port, (err?: unknown) => {
    if (err) {
      console.error("Failed to start server:", err);
      process.exit(1);
    }
    console.info(`Server is listening on port ${port}`);
  });
});
