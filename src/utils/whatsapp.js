/**
 * whatsapp.js — build WhatsApp share message & URL
 */

import { formatCurrency } from "./calculations.js";

export function buildWhatsAppMessage(bill) {
  const lines = bill.items
    .map(
      (item) =>
        `  ${item.name} - ${item.qty} × ${formatCurrency(item.price)} = ${formatCurrency(item.qty * item.price)}`
    )
    .join("\n");

  const msg = `
╔══════════════════════════╗
       CARRY BILLING
  Hotel Essentials & Supplies
╚══════════════════════════╝

🧾 Invoice: ${bill.invoiceNo}
📅 Date: ${bill.date}  🕐 ${bill.time}
🏨 Hotel: ${bill.hotelName}

─────────────────────────────
ITEMS:
${lines}

─────────────────────────────
Subtotal:  ${formatCurrency(bill.subtotal)}
Discount:  ${formatCurrency(bill.discount)}
*TOTAL:    ${formatCurrency(bill.total)}*
─────────────────────────────

Thank you for your business! 🙏
  `.trim();

  return msg;
}

export function openWhatsApp(bill) {
  const msg = buildWhatsAppMessage(bill);
  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/?text=${encoded}`, "_blank");
}
