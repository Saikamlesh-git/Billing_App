import { useState } from "react";
import { formatCurrency } from "../utils/calculations.js";
import { deleteBill } from "../utils/storage.js";
import ConfirmDialog from "./ConfirmDialog.jsx";
import Receipt from "./Receipt.jsx";
import { showToast } from "./Toast.jsx";

export default function BillingHistory({ history, onHistoryChange }) {
  const [viewBill, setViewBill] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = history.filter(
    (b) =>
      b.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      b.hotelName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    deleteBill(deleteTarget.invoiceNo);
    onHistoryChange();
    setDeleteTarget(null);
    showToast("Billing record deleted.", "success");
  };

  return (
    <div className="history-view">
      <div className="history-header">
        <div>
          <h2 style={{ fontWeight: 800, fontSize: "1.3rem" }}>📋 Billing History</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 2 }}>
            Last {history.length} completed bill{history.length !== 1 ? "s" : ""} (max 30)
          </p>
        </div>
        <input
          className="input"
          style={{ maxWidth: 280 }}
          placeholder="Search by invoice or hotel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state" style={{ padding: "60px 0" }}>
          <span style={{ fontSize: "3rem" }}>📋</span>
          <div>
            <div style={{ fontWeight: 600 }}>{search ? "No matching records" : "No billing history yet"}</div>
            <div className="text-sm text-muted">
              {search ? `No bills matching "${search}"` : "Generate bills to see them here"}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="table-wrap history-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bill No</th>
                  <th>Hotel</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Items</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((bill) => (
                  <tr key={bill.invoiceNo}>
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--accent)", fontWeight: 600 }}>
                        {bill.invoiceNo}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{bill.hotelName}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{bill.date}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{bill.time}</td>
                    <td>
                      <span className="badge badge-accent">{bill.items.length} items</span>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: "var(--success)", fontFamily: "var(--font-mono)" }}>
                      {formatCurrency(bill.total)}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setViewBill(bill)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ background: "var(--danger-light)", color: "var(--danger)", border: "1px solid transparent" }}
                          onClick={() => setDeleteTarget(bill)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="history-cards">
            {filtered.map((bill) => (
              <div key={bill.invoiceNo} className="history-card">
                <div className="history-card-top">
                  <div>
                    <div className="history-card-invoice">{bill.invoiceNo}</div>
                    <div className="history-card-hotel">{bill.hotelName}</div>
                  </div>
                  <div className="history-card-total">{formatCurrency(bill.total)}</div>
                </div>
                <div className="history-card-meta">
                  <span>📅 {bill.date}</span>
                  <span>🕐 {bill.time}</span>
                  <span className="badge badge-accent">{bill.items.length} items</span>
                </div>
                <div className="history-card-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => setViewBill(bill)}
                  >
                    👁 View Bill
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ background: "var(--danger-light)", color: "var(--danger)", border: "1px solid transparent" }}
                    onClick={() => setDeleteTarget(bill)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* View receipt */}
      {viewBill && (
        <Receipt
          bill={viewBill}
          onClose={() => setViewBill(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete billing record?"
          message={`This will permanently remove bill ${deleteTarget.invoiceNo} for ${deleteTarget.hotelName}. This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
