import { useState } from "react";
import { formatCurrency } from "../utils/calculations.js";
import { downloadReceiptPDF } from "../utils/pdfGenerator.js";
import { openWhatsApp } from "../utils/whatsapp.js";
import { showToast } from "./Toast.jsx";

export default function Receipt({ bill, onClose, onNewBill, onChangeHotel }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await downloadReceiptPDF(bill);
      showToast("Receipt downloaded successfully!", "success");
    } catch (err) {
      showToast("Failed to download PDF. Please try again.", "error");
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
          <title>Receipt ${bill.invoiceNo}</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"/>
          <style>
            body { font-family: Inter, sans-serif; margin: 0; padding: 0; background: #fff; color: #1a1a1a; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          ${el.outerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 600);
  };

  const handleWhatsApp = () => {
    openWhatsApp(bill);
  };

  return (
    <div className="modal-overlay receipt-modal">
      <div className="modal-box" style={{ maxWidth: 640, padding: 0, overflow: "hidden" }}>
        {/* Modal header */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-modal)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "1.2rem" }}>🧾</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Invoice Generated</div>
              <div style={{ fontSize: "0.78rem", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                {bill.invoiceNo}
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕ Close</button>
        </div>

        {/* Receipt content — captured for PDF */}
        <div id="receipt-content" style={{ maxHeight: "62vh", overflowY: "auto", background: "#fff" }}>
          <div style={{ padding: "36px 40px", background: "#fff", color: "#1a1a1a", fontFamily: "Inter, sans-serif" }}>
            {/* Header */}
            <div className="receipt-title">
              <div className="receipt-company">CARRY BILLING</div>
              <div className="receipt-subtitle">Hotel Essentials &amp; Supplies</div>
            </div>

            <hr className="receipt-divider" />

            {/* INVOICE label */}
            <div style={{ textAlign: "center", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.15em", color: "#555", marginBottom: 14, textTransform: "uppercase" }}>
              — Invoice —
            </div>

            {/* Meta */}
            <div className="receipt-meta">
              <div className="receipt-meta-row">
                <span className="receipt-meta-label">Invoice No</span>
                <span className="receipt-meta-value" style={{ fontFamily: "monospace", color: "#4f7cff" }}>{bill.invoiceNo}</span>
              </div>
              <div className="receipt-meta-row">
                <span className="receipt-meta-label">Date</span>
                <span className="receipt-meta-value">{bill.date}</span>
              </div>
              <div className="receipt-meta-row">
                <span className="receipt-meta-label">Time</span>
                <span className="receipt-meta-value">{bill.time}</span>
              </div>
              <div className="receipt-meta-row">
                <span className="receipt-meta-label">Items</span>
                <span className="receipt-meta-value">{bill.items.length} product{bill.items.length !== 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Hotel */}
            <div className="receipt-hotel-section">
              <div className="receipt-hotel-label">Billed To</div>
              <div className="receipt-hotel-value">{bill.hotelName}</div>
            </div>

            {/* Items table */}
            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style={{ textAlign: "right" }}>Qty</th>
                  <th style={{ textAlign: "right" }}>Rate</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "#888" }}>{item.category}</div>
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>{item.qty}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>₹{item.price}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>
                      {formatCurrency(item.qty * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="receipt-totals" style={{ marginTop: 16 }}>
              <div className="receipt-total-row">
                <span>Subtotal</span>
                <span style={{ fontFamily: "monospace" }}>{formatCurrency(bill.subtotal)}</span>
              </div>
              <div className="receipt-total-row">
                <span>Discount</span>
                <span style={{ fontFamily: "monospace", color: bill.discount > 0 ? "#d97706" : "#888" }}>
                  − {formatCurrency(bill.discount)}
                </span>
              </div>
              <div className="receipt-grand-total">
                <span>TOTAL</span>
                <span style={{ fontFamily: "monospace", color: "#1a1a1a" }}>{formatCurrency(bill.total)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="receipt-footer">
              <div style={{ fontSize: "1rem", marginBottom: 4 }}>🙏</div>
              <div style={{ fontWeight: 600, color: "#444" }}>Thank you for your business!</div>
              <div style={{ marginTop: 4 }}>Carry Billing — Hotel Essentials &amp; Supplies</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="receipt-actions">
          <button
            className="btn btn-primary"
            onClick={handleDownloadPDF}
            disabled={downloading}
          >
            {downloading ? "⏳ Generating..." : "⬇️ Download PDF"}
          </button>
          <button className="btn btn-ghost" onClick={handlePrint}>
            🖨️ Print
          </button>
          <button className="btn btn-warning" onClick={handleWhatsApp}>
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
