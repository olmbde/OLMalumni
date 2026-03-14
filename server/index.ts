import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  submitContactRequest,
  getContactRequests,
  deleteContactRequest,
} from "./routes/contact-requests";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Contact requests routes
  app.post("/api/contact-requests", submitContactRequest);
  app.get("/api/contact-requests", getContactRequests);
  app.delete("/api/contact-requests/:id", deleteContactRequest);

  return app;
}
