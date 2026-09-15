import { useState, useEffect } from "react";

export default function Header({ hotelName, activeView, onChangeHotel, onViewChange }) {
  const navItems = [
    { key: "billing", label: "Billing", icon: "🧾" },
    { key: "history", label: "History", icon: "📋" },
    { key: "products", label: "Products", icon: "📦" },
  ];

  // Theme: "light" (default) or "dark"
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("cb_theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cb_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

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

        {/* Desktop Nav + Theme Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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

          {/* Theme Toggle Button */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
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
        {/* Theme toggle in mobile nav too */}
        <button
          className="mobile-nav-btn"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          <span className="mobile-nav-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
          <span className="mobile-nav-label">{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </nav>
    </>
  );
}
