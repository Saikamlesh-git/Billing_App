export default function Header({ hotelName, activeView, onChangeHotel, onViewChange }) {
  const navItems = [
    { key: "billing", label: "Billing", icon: "🧾" },
    { key: "history", label: "History", icon: "📋" },
    { key: "products", label: "Products", icon: "📦" },
  ];

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo">
        <div className="header-logo-icon">🛍️</div>
        <span className="header-brand">Carry Billing</span>
      </div>

      {/* Hotel badge */}
      {hotelName && (
        <div className="header-hotel" onClick={onChangeHotel} title="Click to change hotel">
          <span style={{ fontSize: "0.8rem" }}>🏨</span>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>Billing for:</span>
          <span className="header-hotel-name">{hotelName}</span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>✎</span>
        </div>
      )}

      {/* Nav */}
      <nav className="header-nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`header-nav-btn ${activeView === item.key ? "active" : ""}`}
            onClick={() => onViewChange(item.key)}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}
