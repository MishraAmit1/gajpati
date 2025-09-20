import dotenv from "dotenv";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import mime from "mime";

dotenv.config();

const router = express.Router();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "files";

// Fix: Properly parse allowed prefixes
const allowedPrefixes = (
  process.env.ASSET_PROXY_ALLOWED_PREFIXES ||
  "products,blog,nature,avatars,blog-content"
)
  .split(",")
  .map((s) => s.trim());

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
router.get("/test", (req, res) => {
  console.log("Test route hit!");
  res.json({ message: "Uploads route is working" });
});
router.get(/^\/(.+)$/, async (req, res) => {
  const key = req.params[0];

  // Detailed logging
  console.log("=== PROXY REQUEST DEBUG ===");
  console.log("Full URL:", req.originalUrl);
  console.log("Key extracted:", key);
  console.log("Allowed prefixes:", allowedPrefixes);

  try {
    if (!key) {
      console.log("Error: No key provided");
      return res.status(400).send("Bad request");
    }

    if (key.includes("..")) {
      console.log("Error: Invalid path (contains ..)");
      return res.status(400).send("Invalid path");
    }

    // Debug prefix checking
    console.log("Checking prefixes:");
    const isAllowed = allowedPrefixes.some((prefix) => {
      const allowed = key.startsWith(prefix);
      console.log(`  ${prefix}: ${allowed}`);
      return allowed;
    });

    console.log("Final isAllowed:", isAllowed);

    if (!isAllowed) {
      console.log("ERROR: Path not allowed!");
      return res.status(403).send("Forbidden path");
    }

    console.log("Path allowed, downloading from Supabase...");

    // Download from Supabase
    const { data, error } = await supabase.storage.from(BUCKET).download(key);

    if (error || !data) {
      console.error("Supabase download error:", error?.message || "No data");
      return res.status(404).send("Not found");
    }

    // Set CORS headers
    const allowedOrigins = [
      "https://gajpatiindustries.com",
      "https://www.gajpatiindustries.com",
      "https://admin.gajpatiindustries.com",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ];

    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }

    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Range"
    );

    // Set content type
    const type = mime.getType(key) || "application/octet-stream";
    res.setHeader("Content-Type", type);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    // Send file
    const buffer = Buffer.from(await data.arrayBuffer());
    return res.status(200).end(buffer);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).send("Server error");
  }
});

export default router;
