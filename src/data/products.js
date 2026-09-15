/**
 * Carry Billing — Seed Product Data
 * Edit this file to add/remove/modify default products.
 * At runtime, products are stored in localStorage so
 * any changes made through the Product Manager UI persist.
 */

const defaultProducts = [
  // ─── Carry Bags ────────────────────────────────────────────
  { id: "cb-1", name: "SSP 10X14", category: "Carry Bags", price: 5, unit: "Pack" },
  { id: "cb-2", name: "SSP 12X16", category: "Carry Bags", price: 6, unit: "Pack" },
  { id: "cb-3", name: "SSP 14X18", category: "Carry Bags", price: 7.5, unit: "Pack" },
  { id: "cb-4", name: "D-Cut 11X14", category: "Carry Bags", price: 8, unit: "Pack" },
  { id: "cb-5", name: "D-Cut 13X16", category: "Carry Bags", price: 9, unit: "Pack" },
  { id: "cb-6", name: "Loop Handle 10X12", category: "Carry Bags", price: 12, unit: "Pack" },

  // ─── Sheets ───────────────────────────────────────────────
  { id: "sh-1", name: "Royal 12X12", category: "Sheets", price: 8, unit: "Pack" },
  { id: "sh-2", name: "Royal 14X14", category: "Sheets", price: 10, unit: "Pack" },
  { id: "sh-3", name: "Royal 18X18", category: "Sheets", price: 14, unit: "Pack" },
  { id: "sh-4", name: "Premium 12X16", category: "Sheets", price: 11, unit: "Pack" },
  { id: "sh-5", name: "Silver Foil 12X12", category: "Sheets", price: 15, unit: "Pack" },

  // ─── Cups ─────────────────────────────────────────────────
  { id: "cup-1", name: "Paper Cup 65ml", category: "Cups", price: 3, unit: "Pack" },
  { id: "cup-2", name: "Paper Cup 100ml", category: "Cups", price: 4, unit: "Pack" },
  { id: "cup-3", name: "Paper Cup 150ml", category: "Cups", price: 5, unit: "Pack" },
  { id: "cup-4", name: "Paper Cup 200ml", category: "Cups", price: 6, unit: "Pack" },
  { id: "cup-5", name: "Plastic Cup 150ml", category: "Cups", price: 4.5, unit: "Pack" },

  // ─── Rolls ────────────────────────────────────────────────
  { id: "rl-1", name: "Tissue Roll Small", category: "Rolls", price: 12, unit: "Roll" },
  { id: "rl-2", name: "Tissue Roll Large", category: "Rolls", price: 18, unit: "Roll" },
  { id: "rl-3", name: "Kitchen Roll", category: "Rolls", price: 22, unit: "Roll" },
  { id: "rl-4", name: "Cling Wrap 30cm", category: "Rolls", price: 35, unit: "Roll" },
  { id: "rl-5", name: "Aluminium Foil 30cm", category: "Rolls", price: 40, unit: "Roll" },

  // ─── Other Essentials ─────────────────────────────────────
  { id: "oe-1", name: "Disposable Plate 6in", category: "Other Essentials", price: 5, unit: "Pack" },
  { id: "oe-2", name: "Disposable Plate 9in", category: "Other Essentials", price: 7, unit: "Pack" },
  { id: "oe-3", name: "Disposable Spoon", category: "Other Essentials", price: 3, unit: "Pack" },
  { id: "oe-4", name: "Disposable Fork", category: "Other Essentials", price: 3, unit: "Pack" },
  { id: "oe-5", name: "Garbage Bag Small", category: "Other Essentials", price: 8, unit: "Pack" },
  { id: "oe-6", name: "Garbage Bag Large", category: "Other Essentials", price: 12, unit: "Pack" },
  { id: "oe-7", name: "Zip-Lock Bag", category: "Other Essentials", price: 6, unit: "Pack" },
];

export const defaultCategories = [
  "Carry Bags",
  "Sheets",
  "Cups",
  "Rolls",
  "Other Essentials",
];

export default defaultProducts;
