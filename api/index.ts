/**
 * Vercel serverless function entry point.
 *
 * This file exports the Express app as a handler for Vercel.
 * It is NOT used for local development — `server/index.ts` is used locally.
 * Vercel automatically compiles this file and routes /api/* requests to it.
 */

import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

const app = express();
const httpServer = createServer(app);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Initialize routes once per container (lazy, cached across warm invocations)
let ready: Promise<void> | null = null;

function ensureInitialized(): Promise<void> {
  if (!ready) {
    ready = registerRoutes(httpServer, app).then(() => {
      app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        console.error("Internal Server Error:", err);
        if (!res.headersSent) {
          res.status(status).json({ message });
        }
      });
    });
  }
  return ready;
}

export default async function handler(req: Request, res: Response) {
  await ensureInitialized();
  return app(req, res);
}
