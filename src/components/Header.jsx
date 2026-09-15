export default function Header({ hotelName, activeView, onChangeHotel, onViewChange }) {
  const navItems = [
    { key: "billing", label: "Billing", icon: "🧾" },
    { key: "history", label: "History", icon: "📋" },
    { key: "products", label: "Products", icon: "📦" },
  ];

  return (
    <>
      <header className="header">
        {/* Logo */}
        <div className="header-logo">
          <div className="header-logo-icon">🛍️</div>
          <span className="header-brand">Carry Billing</span>
        </div>

        {/* Hotel badge */}
        {hotelName && (
          <div className="header-hotel" onClick={onChangeHotel} title="Click to change hotel">
            <span className="header-hotel-emoji">🏨</span>
            <span className="header-hotel-label">Billing for:</span>
            <span className="header-hotel-name">{hotelName}</span>
            <span className="header-hotel-edit">✎</span>
          </div>
        )}

        {/* Desktop Nav */}
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

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`mobile-nav-btn ${activeView === item.key ? "active" : ""}`}
            onClick={() => onViewChange(item.key)}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            <span className="mobile-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
