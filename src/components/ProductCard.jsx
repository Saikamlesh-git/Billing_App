import { useState, useRef } from "react";
import { formatCurrency, isValidQty } from "../utils/calculations.js";

export default function ProductCard({ product, cartItem, onQtyChange, onAdd }) {
  const [inputVal, setInputVal] = useState("");
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  const currentQty = cartItem ? cartItem.qty : 0;
  const inCart = currentQty > 0;

  const handleMinus = () => {
    if (currentQty <= 0) return;
    onQtyChange(product.id, currentQty - 1);
  };

  const handlePlus = () => {
    onQtyChange(product.id, currentQty + 1);
  };

  const handleQtyClick = () => {
    setEditing(true);
    setInputVal(currentQty === 0 ? "" : String(currentQty));
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitInput = () => {
    setEditing(false);
    if (inputVal === "" || inputVal === String(currentQty)) return;
    const num = parseFloat(inputVal);
    if (!isValidQty(num) || num < 0) return;
    onQtyChange(product.id, Math.floor(num));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") commitInput();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <div className={`product-card ${inCart ? "in-cart" : ""}`}>
      <div>
        <div className="product-category">{product.category}</div>
        <div className="product-name">{product.name}</div>
        {product.unit && (
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
            per {product.unit}
          </div>
        )}
      </div>

      <div className="product-price">
        {formatCurrency(product.price)}
      </div>

      <div className="product-card-footer">
        {!inCart ? (
          <button
            className="btn btn-outline btn-sm add-btn"
            onClick={() => onAdd(product.id)}
          >
            + Add
          </button>
        ) : (
          <div className="qty-controls">
            <button
              className="qty-btn"
              onClick={handleMinus}
              title="Decrease"
            >
              −
            </button>

            {editing ? (
              <input
                ref={inputRef}
                className="input qty-input"
                type="number"
                min="0"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onBlur={commitInput}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <button
                className="qty-input input"
                style={{
                  cursor: "text",
                  background: "var(--success-light)",
                  borderColor: "var(--success)",
                  color: "var(--success)",
                  fontWeight: 700,
                }}
                onClick={handleQtyClick}
                title="Click to type quantity"
              >
                {currentQty}
              </button>
            )}

            <button className="qty-btn" onClick={handlePlus} title="Increase">
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
