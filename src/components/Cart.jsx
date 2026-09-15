import { useState } from "react";
import { formatCurrency, calcSubtotal, calcTotal } from "../utils/calculations.js";
import { showToast } from "./Toast.jsx";

export default function Cart({ cart, hotelName, onQtyChange, onRemove, onClear, onGenerate, onChangeHotel }) {
  const [discount, setDiscount] = useState(0);
  const [discountInput, setDiscountInput] = useState("");

  const subtotal = calcSubtotal(cart);
  const discountAmt = parseFloat(discountInput) || 0;
  const total = calcTotal(subtotal, discountAmt);

  const handleGenerate = () => {
    if (!hotelName) {
      showToast("Please enter the hotel name before creating a bill.", "error");
      onChangeHotel();
      return;
    }
    if (cart.length === 0) {
      showToast("Please add at least one product to generate the bill.", "error");
      return;
    }
    onGenerate({ discount: discountAmt, subtotal, total });
  };

  const handleClear = () => {
    onClear();
    setDiscountInput("");
  };

  return (
    <div className="cart-panel" id="cart-panel">
      {/* Header */}
      <div className="cart-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1.1rem" }}>🛒</span>
          <span className="section-title">Current Bill</span>
          {cart.length > 0 && (
            <span className="badge badge-accent">{cart.length}</span>
          )}
        </div>
        {cart.length > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={handleClear}>
            Clear
          </button>
        )}
      </div>

      {/* Hotel name */}
      <div className="cart-hotel">
        Hotel: <span>{hotelName || "—"}</span>
        {!hotelName && (
          <button
            style={{ marginLeft: 8, background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}
            onClick={onChangeHotel}
          >
            Set hotel name ↗
          </button>
        )}
      </div>

      {/* Empty state */}
      {cart.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Cart is empty</div>
          <div className="text-sm text-muted">Click + Add on any product to start billing</div>
        </div>
      ) : (
        <>
          {/* Column headers */}
          <div className="cart-table-header">
            <span>Product</span>
            <span style={{ textAlign: "right" }}>Qty</span>
            <span className="cart-rate-col" style={{ textAlign: "right" }}>Rate</span>
            <span style={{ textAlign: "right" }}>Amount</span>
            <span></span>
          </div>

          {/* Items */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-sub">{item.category}</div>
                </div>
                <div className="cart-item-qty">×{item.qty}</div>
                <div className="cart-item-rate cart-rate-col">₹{item.price}</div>
                <div className="cart-item-amount">{formatCurrency(item.qty * item.price)}</div>
                <button
                  className="cart-remove-btn"
                  onClick={() => onRemove(item.id)}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <div className="cart-footer">
        {/* Discount */}
        <div className="discount-row">
          <label>Discount ₹</label>
          <input
            className="input discount-input"
            type="number"
            min="0"
            placeholder="0"
            value={discountInput}
            onChange={(e) => setDiscountInput(e.target.value)}
          />
        </div>

        {/* Totals */}
        <div className="cart-totals">
          <div className="cart-total-row">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {discountAmt > 0 && (
            <div className="cart-total-row">
              <span style={{ color: "var(--warning)" }}>Discount</span>
              <span style={{ color: "var(--warning)" }}>− {formatCurrency(discountAmt)}</span>
            </div>
          )}
          <div className="cart-grand-total">
            <span>Grand Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="cart-actions">
          <button
            className="btn btn-success btn-lg w-full"
            onClick={handleGenerate}
            disabled={cart.length === 0}
          >
            🧾 Generate Bill
          </button>
        </div>
      </div>
    </div>
  );
}
