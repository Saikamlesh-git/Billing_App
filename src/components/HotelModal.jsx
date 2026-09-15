import { useState } from "react";
import { saveHotelName } from "../utils/storage.js";

export default function HotelModal({ existingName, onSave }) {
  const [name, setName] = useState(existingName || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter the hotel name before creating a bill.");
      return;
    }
    saveHotelName(trimmed);
    onSave(trimmed);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="hotel-modal-icon">🏨</div>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "8px" }}>
            {existingName ? "Change Hotel" : "Create New Bill"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {existingName
              ? "Enter the name of the hotel you're billing for."
              : "Welcome to Carry Billing! Enter the hotel name to begin."}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="form-group">
            <label className="form-label">Hotel Name *</label>
            <input
              className="input"
              type="text"
              placeholder="e.g. Hotel Grand Palace"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              autoFocus
            />
            {error && <span className="form-error">{error}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full">
            {existingName ? "Update & Continue" : "Start Billing →"}
          </button>

          {existingName && (
            <button
              type="button"
              className="btn btn-ghost w-full"
              onClick={() => onSave(existingName)}
            >
              Keep "{existingName}"
            </button>
          )}
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          🔒 Internal billing system — no login required
        </p>
      </div>
    </div>
  );
}
