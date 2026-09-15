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
          <h2 style={{ fontWeight: 800, fontSize: "1.35rem", letterSpacing: "-0.02em" }}>
            📋 Billing History
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 4 }}>
            Showing {filtered.length} of {history.length} completed bill{history.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="search-bar-wrap" style={{ minWidth: 260, maxWidth: 320 }}>
          <span className="search-icon">🔍</span>
          <input
            className="input search-input"
            placeholder="Search invoice or hotel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state" style={{ padding: "60px 0" }}>
          <span style={{ fontSize: "3rem" }}>📋</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: "1.05rem" }}>
              {search ? "No matching records found" : "No billing history yet"}
            </div>
            <div className="text-sm text-muted" style={{ marginTop: 4 }}>
              {search ? `No bills found for "${search}"` : "Generated bills will appear here automatically"}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop full-width professional table */}
          <div className="table-wrap history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th style={{ width: "18%" }}>Invoice No</th>
                  <th style={{ width: "26%" }}>Hotel / Customer</th>
                  <th style={{ width: "20%" }}>Date &amp; Time</th>
                  <th style={{ width: "12%" }}>Items</th>
                  <th style={{ width: "12%", textAlign: "right" }}>Total</th>
                  <th style={{ width: "12%", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((bill) => (
                  <tr key={bill.invoiceNo}>
                    <td>
                      <span className="table-invoice-tag">
                        {bill.invoiceNo}
                      </span>
                    </td>
                    <td>
                      <span className="table-hotel-name">{bill.hotelName}</span>
                    </td>
                    <td>
                      <div className="table-datetime">
                        <span className="table-date">📅 {bill.date}</span>
                        <span className="table-time">🕐 {bill.time}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-accent">
                        {bill.items.length} {bill.items.length === 1 ? "item" : "items"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className="table-total-amount">
                        {formatCurrency(bill.total)}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-outline btn-sm table-btn"
                          onClick={() => setViewBill(bill)}
                          title="View Receipt"
                        >
                          👁 View
                        </button>
                        <button
                          className="btn btn-sm table-btn-delete"
                          onClick={() => setDeleteTarget(bill)}
                          title="Delete Bill"
                        >
                          🗑 Delete
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
          confirmLabel="Delete"
          isDanger={true}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
