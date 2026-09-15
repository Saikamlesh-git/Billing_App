import { useState } from "react";
import { formatCurrency } from "../utils/calculations.js";
import { downloadReceiptPDF } from "../utils/pdfGenerator.js";
import { openWhatsApp } from "../utils/whatsapp.js";
import { showToast } from "./Toast.jsx";

export default function Receipt({ bill, onClose, onNewBill }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await downloadReceiptPDF(bill);
      showToast("Receipt downloaded!", "success");
    } catch {
      showToast("Failed to download PDF.", "error");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const el = document.getElementById("receipt-content");
    if (!el) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Invoice — ${bill.date} — ${bill.hotelName}</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"/>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Inter, sans-serif; background: #fff; color: #1a1a1a; }
          </style>
        </head>
        <body>${el.outerHTML}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 600);
  };

  const subtotalFormatted = formatCurrency(bill.subtotal);
  const totalFormatted   = formatCurrency(bill.total);

  return (
    <div className="modal-overlay receipt-modal">
      <div className="modal-box" style={{ maxWidth: 580, padding: 0, overflow: "hidden" }}>

        {/* ── Modal top bar ── */}
        <div style={{
          padding: "14px 20px",
          borderBottom: "1px solid #e8edf5",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-surface)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem",
            }}>🧾</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                Bill Generated
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {bill.date} · {bill.time}
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕ Close</button>
        </div>

        {/* ── Receipt printable area ── */}
        <div id="receipt-content" style={{
          maxHeight: "64vh",
          overflowY: "auto",
          background: "#fff",
          color: "#1a1a1a",
          fontFamily: "Inter, sans-serif",
        }}>
          {/* Header gradient bar */}
          <div style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)",
            padding: "28px 32px 24px",
            color: "#fff",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              CARRY BILLING
            </div>
            <div style={{ fontSize: "0.8rem", opacity: 0.85, marginTop: 4, letterSpacing: "0.05em" }}>
              HOTEL ESSENTIALS &amp; SUPPLIES
            </div>
          </div>

          {/* White content area */}
          <div style={{ padding: "24px 32px" }}>

            {/* Billed To */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 20,
              gap: 16,
            }}>
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
                  Billed To
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                  {bill.hotelName}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
                  Date &amp; Time
                </div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0f172a" }}>
                  {bill.date}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  {bill.time}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "linear-gradient(90deg,#e8edf5,#c7d2e8,#e8edf5)", marginBottom: 18 }} />

            {/* Items table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "#f1f5fd" }}>
                  <th style={{ padding: "9px 12px", textAlign: "left", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#4b5563", borderRadius: "4px 0 0 4px" }}>
                    Product
                  </th>
                  <th style={{ padding: "9px 10px", textAlign: "right", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#4b5563" }}>
                    Qty
                  </th>
                  <th style={{ padding: "9px 10px", textAlign: "right", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#4b5563" }}>
                    Rate
                  </th>
                  <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#4b5563", borderRadius: "0 4px 4px 0" }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5fd" }}>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{item.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: 1 }}>{item.category}</div>
                    </td>
                    <td style={{ padding: "10px", textAlign: "right", fontFamily: "monospace", color: "#475569" }}>
                      {item.qty}
                    </td>
                    <td style={{ padding: "10px", textAlign: "right", fontFamily: "monospace", color: "#475569" }}>
                      ₹{item.price}
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0f172a" }}>
                      {formatCurrency(item.qty * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{
              marginTop: 16,
              borderTop: "1px solid #e2e8f0",
              paddingTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#64748b" }}>
                <span>Subtotal</span>
                <span style={{ fontFamily: "monospace" }}>{subtotalFormatted}</span>
              </div>
              {bill.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#d97706" }}>
                  <span>Discount</span>
                  <span style={{ fontFamily: "monospace" }}>− {formatCurrency(bill.discount)}</span>
                </div>
              )}
              {/* Grand total */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 8,
                padding: "12px 16px",
                background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
                borderRadius: 10,
                color: "#fff",
              }}>
                <span style={{ fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.02em" }}>TOTAL AMOUNT</span>
                <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1.15rem" }}>{totalFormatted}</span>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              marginTop: 20,
              textAlign: "center",
              padding: "14px 0 4px",
              borderTop: "1px dashed #cbd5e1",
            }}>
              <div style={{ fontSize: "1.1rem", marginBottom: 4 }}>🙏</div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1e3a8a" }}>
                Thank you for your business!
              </div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 3 }}>
                Carry Billing — Hotel Essentials &amp; Supplies
              </div>
            </div>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="receipt-actions">
          <button className="btn btn-primary" onClick={handleDownloadPDF} disabled={downloading}>
            {downloading ? "⏳ Generating..." : "⬇️ Download PDF"}
          </button>
          <button className="btn btn-ghost" onClick={handlePrint}>
            🖨️ Print
          </button>
          <button className="btn btn-warning" onClick={() => openWhatsApp(bill)}>
            📱 WhatsApp
          </button>
          {onNewBill && (
            <button className="btn btn-success" onClick={onNewBill}>
              + New Bill
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
