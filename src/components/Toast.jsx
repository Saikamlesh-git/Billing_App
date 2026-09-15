import { useEffect, useState } from "react";

let toastIdCounter = 0;

// Singleton event emitter
const listeners = new Set();
export function showToast(message, type = "info") {
  const id = ++toastIdCounter;
  listeners.forEach((fn) => fn({ id, message, type }));
}

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    };
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span style={{ fontWeight: 700, fontSize: "1rem" }}>{icons[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
