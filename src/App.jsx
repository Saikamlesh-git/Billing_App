import { useState, useEffect } from "react";
import "./App.css";

// Utilities
import {
  getProducts,
  getCategories,
  getBillingHistory,
  saveBill,
  getHotelName,
  saveHotelName,
  getNextInvoiceNumber,
  syncFromCloud,
} from "./utils/storage.js";

import { formatCurrency, calcSubtotal } from "./utils/calculations.js";

// Components
import Header from "./components/Header.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import Cart from "./components/Cart.jsx";
import HotelModal from "./components/HotelModal.jsx";
import Receipt from "./components/Receipt.jsx";
import BillingHistory from "./components/BillingHistory.jsx";
import ProductManager from "./components/ProductManager.jsx";
import Toast, { showToast } from "./components/Toast.jsx";

export default function App() {
  // App state
  const [hotelName, setHotelName] = useState(() => getHotelName());
  const [showHotelModal, setShowHotelModal] = useState(!getHotelName());
  const [activeView, setActiveView] = useState("billing"); // "billing" | "history" | "products"

  // Data state
  const [products, setProducts] = useState(() => getProducts());
  const [categories, setCategories] = useState(() => getCategories());
  const [history, setHistory] = useState(() => getBillingHistory());

  // Cart state: array of { id, name, category, price, qty, unit }
  const [cart, setCart] = useState([]);

  // Active generated bill for Receipt modal
  const [activeReceiptBill, setActiveReceiptBill] = useState(null);

  // Multi-Device Cloud Sync: Pull remote updates on mount, focus, and periodic interval
  useEffect(() => {
    const handleSync = (data) => {
      if (data.products) setProducts(data.products);
      if (data.categories) setCategories(data.categories);
      if (data.history) setHistory(data.history);
      if (data.hotelName) setHotelName(data.hotelName);
    };

    syncFromCloud(handleSync);

    const onFocus = () => syncFromCloud(handleSync);
    window.addEventListener("focus", onFocus);
    const timer = setInterval(() => syncFromCloud(handleSync), 12000);

    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(timer);
    };
  }, []);

  // Sync state if products or categories change externally
  const handleProductsUpdated = (newProducts) => {
    setProducts(newProducts);
  };

  const handleCategoriesUpdated = (newCategories) => {
    setCategories(newCategories);
  };

  const handleHistoryChange = () => {
    setHistory(getBillingHistory());
  };

  // Cart actions
  const handleQtyChange = (productId, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, qty } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          unit: product.unit,
          qty,
        },
      ];
    });
  };

  const handleAddToCart = (productId) => {
    const existing = cart.find((item) => item.id === productId);
    handleQtyChange(productId, existing ? existing.qty + 1 : 1);
    showToast("Added to cart", "info");
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    showToast("Cart cleared", "info");
  };

  // Generate bill
  const handleGenerateBill = ({ discount, subtotal, total }) => {
    if (!hotelName) {
      setShowHotelModal(true);
      return;
    }
    if (cart.length === 0) {
      showToast("Please add at least one product to generate the bill.", "error");
      return;
    }

    const now = new Date();
    const invoiceNo = getNextInvoiceNumber();
    const date = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const time = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const newBill = {
      invoiceNo,
      hotelName,
      date,
      time,
      items: [...cart],
      subtotal,
      discount,
      total,
      timestamp: now.getTime(),
    };

    saveBill(newBill);
    setHistory(getBillingHistory());
    setActiveReceiptBill(newBill);
    showToast(`Bill ${invoiceNo} generated successfully!`, "success");
  };

  // Hotel modal save
  const handleSaveHotel = (name) => {
    setHotelName(name);
    saveHotelName(name);
    setShowHotelModal(false);
    showToast(`Billing for: ${name}`, "success");
  };

  // Start new bill
  const handleStartNewBill = () => {
    setCart([]);
    setActiveReceiptBill(null);
    setActiveView("billing");
    showToast("Ready for new bill", "info");
  };

  return (
    <div className="app-layout">
      {/* Toast Notification Container */}
      <Toast />

      {/* Global Header */}
      <Header
        hotelName={hotelName}
        activeView={activeView}
        onChangeHotel={() => setShowHotelModal(true)}
        onViewChange={(view) => setActiveView(view)}
      />

      {/* Main App Content */}
      <main className="main-content">
        {activeView === "billing" && (
          <>
            {/* Billing Main Workspace */}
            <div className="billing-view">
              {/* Left Column: Dashboard Stats, Search, Category Tabs, Product Cards */}
              <div className="billing-left">
                <Dashboard
                  billingHistory={history}
                  products={products}
                  onNewBill={handleStartNewBill}
                />
                <ProductGrid
                  products={products}
                  categories={categories}
                  cart={cart}
                  onQtyChange={handleQtyChange}
                  onAdd={handleAddToCart}
                />
              </div>

              {/* Right Column: Interactive Cart & Checkout Panel */}
              <div className="billing-right">
                <Cart
                  cart={cart}
                  hotelName={hotelName}
                  onQtyChange={handleQtyChange}
                  onRemove={handleRemoveFromCart}
                  onClear={handleClearCart}
                  onGenerate={handleGenerateBill}
                  onChangeHotel={() => setShowHotelModal(true)}
                />
              </div>
            </div>

            {/* Mobile Floating Cart Summary */}
            {cart.length > 0 && (
              <div
                className="mobile-cart-bar"
                onClick={() => {
                  document.getElementById("cart-panel")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="mobile-cart-info">
                  <span className="mobile-cart-badge">
                    {cart.reduce((s, i) => s + i.qty, 0)} items
                  </span>
                  <span className="mobile-cart-total">
                    {formatCurrency(calcSubtotal(cart))}
                  </span>
                </div>
                <button type="button" className="mobile-cart-cta">
                  View Bill ↓
                </button>
              </div>
            )}
          </>
        )}

        {activeView === "history" && (
          <BillingHistory
            history={history}
            onHistoryChange={handleHistoryChange}
          />
        )}

        {activeView === "products" && (
          <ProductManager
            products={products}
            categories={categories}
            onProductsUpdated={handleProductsUpdated}
            onCategoriesUpdated={handleCategoriesUpdated}
          />
        )}
      </main>

      {/* Hotel Name Modal */}
      {showHotelModal && (
        <HotelModal
          existingName={hotelName}
          onSave={handleSaveHotel}
        />
      )}

      {/* Completed Invoice / Receipt Preview Modal */}
      {activeReceiptBill && (
        <Receipt
          bill={activeReceiptBill}
          onClose={() => setActiveReceiptBill(null)}
          onNewBill={handleStartNewBill}
          onChangeHotel={() => {
            setActiveReceiptBill(null);
            setShowHotelModal(true);
          }}
        />
      )}
    </div>
  );
}
