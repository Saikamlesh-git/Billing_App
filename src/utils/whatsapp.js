/**
 * whatsapp.js — professional WhatsApp bill message (no internal invoice numbers)
 */

import { formatCurrency } from "./calculations.js";

export function buildWhatsAppMessage(bill) {
  const divider = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
  const thin    = "┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄";

  const itemLines = bill.items
    .map((item, i) => {
      const n      = String(i + 1).padStart(2, " ");
      const amount = formatCurrency(item.qty * item.price);
      return `  ${n}. ${item.name}\n      ${item.qty} × ${formatCurrency(item.price)} = *${amount}*`;
    })
    .join("\n");

  // Only show discount line if there is one
  const discountLine = bill.discount > 0
    ? `💸 *Discount:*   - ${formatCurrency(bill.discount)}\n`
    : "";

  const msg =
`🛍️ *CARRY BILLING*
_Hotel Essentials & Supplies_
${divider}

📅 *Date:*   ${bill.date}
🕐 *Time:*   ${bill.time}
🏨 *Hotel:*  ${bill.hotelName}

${thin}
📦 *ITEMS:*
${itemLines}

${divider}
🧮 *Subtotal:*  ${formatCurrency(bill.subtotal)}
${discountLine}✅ *TOTAL:     ${formatCurrency(bill.total)}*
${divider}

🙏 _Thank you for your business!_
_Carry Billing — Hotel Essentials & Supplies_`;

  return msg.trim();
}

export function openWhatsApp(bill) {
  const msg     = buildWhatsAppMessage(bill);
  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/?text=${encoded}`, "_blank");
}
