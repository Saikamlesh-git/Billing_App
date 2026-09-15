/**
 * whatsapp.js — build a clean, well-aligned WhatsApp bill message
 * Uses only safe characters that render perfectly in WhatsApp
 */

import { formatCurrency } from "./calculations.js";

export function buildWhatsAppMessage(bill) {
  // Pad a label and value so totals align nicely
  const pad = (label, value, width = 22) =>
    label.padEnd(width, " ") + value;

  // Format each item line clearly
  const itemLines = bill.items
    .map((item, i) => {
      const num = String(i + 1).padStart(2, " ");
      const amount = formatCurrency(item.qty * item.price);
      return `  ${num}. ${item.name}\n      ${item.qty} × ${formatCurrency(item.price)} = *${amount}*`;
    })
    .join("\n");

  const divider = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
  const thinLine = "─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─";

  const msg =
`🛍️ *CARRY BILLING*
_Hotel Essentials & Supplies_
${divider}

🧾 *Invoice:*  ${bill.invoiceNo}
📅 *Date:*     ${bill.date}
🕐 *Time:*     ${bill.time}
🏨 *Hotel:*    ${bill.hotelName}

${thinLine}
📦 *ITEMS:*
${itemLines}

${divider}
${pad("Subtotal:", formatCurrency(bill.subtotal))}
${bill.discount > 0 ? pad("Discount:", `- ${formatCurrency(bill.discount)}`) + "\n" : ""}*${pad("TOTAL:", formatCurrency(bill.total))}*
${divider}

🙏 _Thank you for your business!_
_Carry Billing — Hotel Essentials & Supplies_`;

  return msg.trim();
}

export function openWhatsApp(bill) {
  const msg = buildWhatsAppMessage(bill);
  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/?text=${encoded}`, "_blank");
}
