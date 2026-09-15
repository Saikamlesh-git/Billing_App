/**
 * server/server.js — Production Sync Server for Render Deployment
 */

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Persistent JSON file storage (zero setup, works immediately on Render free tier)
const DATA_FILE = path.join(__dirname, "data_store.json");

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    return {
      products: [],
      categories: ["Carry Bags", "Sheets", "Cups", "Rolls", "Other Essentials"],
      history: [],
      hotelName: "",
      invoiceSeq: { date: "", count: 0 },
    };
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return {
      products: [],
      categories: ["Carry Bags", "Sheets", "Cups", "Rolls", "Other Essentials"],
      history: [],
      hotelName: "",
      invoiceSeq: { date: "", count: 0 },
    };
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save data:", err);
  }
}

// ─── Health Check for Render ────────────────────────────────────────────────
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

// ─── API Routes ─────────────────────────────────────────────────────────────

// Get all sync data at once (fast single round-trip for devices)
app.get("/api/sync", (req, res) => {
  res.json(loadData());
});

// Products
app.get("/api/products", (req, res) => {
  res.json(loadData().products || []);
});

app.post("/api/products", (req, res) => {
  const data = loadData();
  data.products = req.body;
  saveData(data);
  res.json({ success: true, products: data.products });
});

// Categories
app.get("/api/categories", (req, res) => {
  res.json(loadData().categories || []);
});

app.post("/api/categories", (req, res) => {
  const data = loadData();
  data.categories = req.body;
  saveData(data);
  res.json({ success: true, categories: data.categories });
});

// History / Bills (max 30)
app.get("/api/history", (req, res) => {
  res.json(loadData().history || []);
});

app.post("/api/bills", (req, res) => {
  const data = loadData();
  const bill = req.body;
  if (!data.history) data.history = [];
  data.history.unshift(bill);
  data.history = data.history.slice(0, 30); // keep latest 30
  saveData(data);
  res.json({ success: true, bill });
});

app.delete("/api/bills/:invoiceNo", (req, res) => {
  const data = loadData();
  data.history = (data.history || []).filter((b) => b.invoiceNo !== req.params.invoiceNo);
  saveData(data);
  res.json({ success: true });
});

// Hotel Name
app.get("/api/hotel", (req, res) => {
  res.json({ hotelName: loadData().hotelName || "" });
});

app.post("/api/hotel", (req, res) => {
  const data = loadData();
  data.hotelName = req.body.hotelName || "";
  saveData(data);
  res.json({ success: true, hotelName: data.hotelName });
});

// ─── Static Files & SPA Fallback ────────────────────────────────────────────
// Check dist directory at both relative and process.cwd() locations
const possibleDist = [
  path.join(__dirname, "../dist"),
  path.join(process.cwd(), "dist"),
];

let distDir = possibleDist.find((p) => fs.existsSync(p));

if (distDir) {
  app.use(express.static(distDir));
  app.use((req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
} else {
  // Fallback if dist isn't built yet
  app.get("/", (req, res) => {
    res.send("Carry Billing API is running. Build frontend with `npm run build`.");
  });
}

// Bind to 0.0.0.0 explicitly for Render container routing
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Carry Billing Server running on port ${PORT} (0.0.0.0)`);
});
