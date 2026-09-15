/**
 * storage.js — Hybrid LocalStorage + Cloud Sync for Carry Billing
 * Enables real-time synchronization across PC, Mac, and Mobile devices
 */

import defaultProducts, { defaultCategories } from "../data/products.js";

const KEYS = {
  PRODUCTS: "cb_products",
  CATEGORIES: "cb_categories",
  HISTORY: "cb_history",
  INVOICE_SEQ: "cb_invoice_seq",
  HOTEL_NAME: "cb_hotel_name",
};

const MAX_HISTORY = 30;

// API base URL — if deployed on Render, it defaults to relative "/api"
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// ─── Products ────────────────────────────────────────────────

export function getProducts() {
  const raw = localStorage.getItem(KEYS.PRODUCTS);
  if (!raw) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return defaultProducts;
  }
}

export function saveProducts(products) {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  // Background cloud sync
  fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(products),
  }).catch(() => {
    /* Silent offline fallback */
  });
}

// ─── Categories ──────────────────────────────────────────────

export function getCategories() {
  const raw = localStorage.getItem(KEYS.CATEGORIES);
  if (!raw) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(defaultCategories));
    return defaultCategories;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return defaultCategories;
  }
}

export function saveCategories(categories) {
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  // Background cloud sync
  fetch(`${API_BASE}/api/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categories),
  }).catch(() => {
    /* Silent offline fallback */
  });
}

// ─── Billing History ─────────────────────────────────────────

export function getBillingHistory() {
  const raw = localStorage.getItem(KEYS.HISTORY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveBill(bill) {
  const history = getBillingHistory();
  history.unshift(bill); // newest first
  const trimmed = history.slice(0, MAX_HISTORY);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(trimmed));

  // Background cloud sync
  fetch(`${API_BASE}/api/bills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bill),
  }).catch(() => {
    /* Silent offline fallback */
  });
}

export function deleteBill(invoiceNo) {
  const history = getBillingHistory();
  const updated = history.filter((b) => b.invoiceNo !== invoiceNo);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));

  // Background cloud sync
  fetch(`${API_BASE}/api/bills/${encodeURIComponent(invoiceNo)}`, {
    method: "DELETE",
  }).catch(() => {
    /* Silent offline fallback */
  });
}

// ─── Invoice Numbering ───────────────────────────────────────

export function getNextInvoiceNumber() {
  const today = new Date();
  const dateStr =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0");

  const raw = localStorage.getItem(KEYS.INVOICE_SEQ);
  let seq = { date: "", count: 0 };
  if (raw) {
    try {
      seq = JSON.parse(raw);
    } catch {
      /* ignore */
    }
  }

  if (seq.date !== dateStr) {
    seq = { date: dateStr, count: 0 };
  }

  seq.count += 1;
  localStorage.setItem(KEYS.INVOICE_SEQ, JSON.stringify(seq));

  return `CB-${dateStr}-${String(seq.count).padStart(3, "0")}`;
}

// ─── Hotel Name ──────────────────────────────────────────────

export function getHotelName() {
  return localStorage.getItem(KEYS.HOTEL_NAME) || "";
}

export function saveHotelName(name) {
  const trimmed = name.trim();
  localStorage.setItem(KEYS.HOTEL_NAME, trimmed);

  // Background cloud sync
  fetch(`${API_BASE}/api/hotel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hotelName: trimmed }),
  }).catch(() => {
    /* Silent offline fallback */
  });
}

// ─── Multi-Device Real-Time Sync Pull ─────────────────────────

export async function syncFromCloud(onSync) {
  try {
    const res = await fetch(`${API_BASE}/api/sync`);
    if (!res.ok) return;
    const remote = await res.json();

    const local = {
      products: getProducts(),
      categories: getCategories(),
      history: getBillingHistory(),
      hotelName: getHotelName(),
    };

    let updated = false;

    // Only overwrite products if remote has data AND more items than local
    if (remote.products && remote.products.length > 0 &&
        remote.products.length >= local.products.length) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(remote.products));
      updated = true;
    }

    // Only overwrite categories if remote has data
    if (remote.categories && remote.categories.length > 0) {
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(remote.categories));
      updated = true;
    }

    // Merge history: combine remote + local, deduplicate by invoiceNo, sort newest first
    if (remote.history && Array.isArray(remote.history)) {
      const combined = [...remote.history, ...local.history];
      const seen = new Set();
      const merged = combined
        .filter((b) => {
          if (seen.has(b.invoiceNo)) return false;
          seen.add(b.invoiceNo);
          return true;
        })
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, MAX_HISTORY);

      if (merged.length >= local.history.length) {
        localStorage.setItem(KEYS.HISTORY, JSON.stringify(merged));
        updated = true;
      }
    }

    // Only update hotel name if remote has one and local doesn't
    if (remote.hotelName && !local.hotelName) {
      localStorage.setItem(KEYS.HOTEL_NAME, remote.hotelName);
      updated = true;
    }

    if (updated && onSync) {
      onSync({
        products: getProducts(),
        categories: getCategories(),
        history: getBillingHistory(),
        hotelName: getHotelName(),
      });
    }
  } catch {
    // Backend not reached, continues using local storage seamlessly
  }
}
