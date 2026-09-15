/**
 * calculations.js — price / total helpers
 */

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function calcLineAmount(qty, price) {
  return Math.round(qty * price * 100) / 100;
}

export function calcSubtotal(cartItems) {
  return cartItems.reduce((sum, item) => sum + calcLineAmount(item.qty, item.price), 0);
}

export function calcTotal(subtotal, discount) {
  const d = Math.max(0, parseFloat(discount) || 0);
  return Math.max(0, subtotal - d);
}

export function isValidQty(val) {
  const n = parseFloat(val);
  return !isNaN(n) && n >= 0 && Number.isFinite(n);
}

export function isValidPrice(val) {
  const n = parseFloat(val);
  return !isNaN(n) && n >= 0 && Number.isFinite(n);
}
