export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box confirm-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">🗑️</div>
        <h2 style={{ textAlign: "center", marginBottom: "8px", fontSize: "1.1rem" }}>
          {title || "Are you sure?"}
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "24px" }}>
          {message || "This action cannot be undone."}
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
