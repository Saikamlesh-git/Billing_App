import { useState, useMemo } from "react";
import { formatCurrency, isValidPrice } from "../utils/calculations.js";
import { saveProducts, saveCategories } from "../utils/storage.js";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { showToast } from "./Toast.jsx";

const COMMON_UNITS = ["Pack", "Piece", "Bundle", "Roll", "Box", "Kg", "Meter"];

export default function ProductManager({
  products,
  categories,
  onProductsUpdated,
  onCategoriesUpdated,
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Form state
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0] || "Carry Bags");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("Pack");
  const [formError, setFormError] = useState("");

  // Add Category modal / inline form state
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, selectedCategory, search]);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setCategory(categories[0] || "Carry Bags");
    setPrice("");
    setUnit("Pack");
    setFormError("");
  };

  const handleEditClick = (prod) => {
    setEditingId(prod.id);
    setName(prod.name);
    setCategory(prod.category);
    setPrice(String(prod.price));
    setUnit(prod.unit || "Pack");
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Product name is required.");
      return;
    }
    const numPrice = parseFloat(price);
    if (!isValidPrice(numPrice) || numPrice < 0) {
      setFormError("Please enter a valid product price.");
      return;
    }
    if (!category) {
      setFormError("Please select a category.");
      return;
    }

    if (editingId) {
      // Update
      const updated = products.map((p) =>
        p.id === editingId
          ? {
              ...p,
              name: name.trim(),
              category,
              price: numPrice,
              unit: unit.trim() || "Piece",
            }
          : p
      );
      saveProducts(updated);
      onProductsUpdated(updated);
      showToast("Product updated successfully!", "success");
    } else {
      // Add
      const newProd = {
        id: "prod-" + Date.now(),
        name: name.trim(),
        category,
        price: numPrice,
        unit: unit.trim() || "Piece",
      };
      const updated = [newProd, ...products];
      saveProducts(updated);
      onProductsUpdated(updated);
      showToast("Product added successfully!", "success");
    }

    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const updated = products.filter((p) => p.id !== deleteTarget.id);
    saveProducts(updated);
    onProductsUpdated(updated);
    if (editingId === deleteTarget.id) resetForm();
    showToast(`Deleted ${deleteTarget.name}`, "success");
    setDeleteTarget(null);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast("Category already exists.", "warning");
      return;
    }
    const updated = [...categories, trimmed];
    saveCategories(updated);
    onCategoriesUpdated(updated);
    setCategory(trimmed);
    setNewCatName("");
    setShowAddCat(false);
    showToast(`Added category: "${trimmed}"`, "success");
  };

  return (
    <div className="pm-view">
      <div className="pm-header">
        <div>
          <h2 style={{ fontWeight: 800, fontSize: "1.4rem" }}>📦 Product Management</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 4 }}>
            Add, update, or remove hotel supply products and categories.
          </p>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setShowAddCat(true)}
        >
          + Add Category
        </button>
      </div>

      <div className="pm-grid">
        {/* Left column: Add/Edit Product Form */}
        <div className="pm-form-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>
            {editingId && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. SSP 10X14 or Royal 12X12"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFormError("");
                }}
              />
            </div>

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="form-label">Category *</label>
                <button
                  type="button"
                  style={{ background: "none", border: "none", color: "var(--accent)", fontSize: "0.75rem", cursor: "pointer" }}
                  onClick={() => setShowAddCat(true)}
                >
                  + New
                </button>
              </div>
              <select
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setFormError("");
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Unit</label>
                <select
                  className="input"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  {COMMON_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formError && <span className="form-error">{formError}</span>}

            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 6 }}>
              {editingId ? "Update Product" : "Save Product"}
            </button>
          </form>
        </div>

        {/* Right column: Products list & Filter/Search */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div className="search-bar-wrap" style={{ flex: 1, minWidth: "220px" }}>
              <span className="search-icon">🔍</span>
              <input
                className="input search-input"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input"
              style={{ width: "auto", minWidth: "160px" }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state card" style={{ padding: "40px" }}>
              <span style={{ fontSize: "2.5rem" }}>📦</span>
              <div style={{ fontWeight: 600 }}>No products found</div>
              <div className="text-sm text-muted">Try a different search or add a new product.</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Unit</th>
                    <th style={{ textAlign: "right" }}>Rate (₹)</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td>
                        <span className="badge badge-accent">{p.category}</span>
                      </td>
                      <td style={{ color: "var(--text-secondary)" }}>{p.unit || "Piece"}</td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--rupee)" }}>
                        {formatCurrency(p.price)}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleEditClick(p)}
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{
                              background: "var(--danger-light)",
                              color: "var(--danger)",
                              border: "none",
                            }}
                            onClick={() => setDeleteTarget(p)}
                            title="Delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCat && (
        <div className="modal-overlay" onClick={() => setShowAddCat(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 16 }}>
              + Add New Category
            </h3>
            <form onSubmit={handleAddCategory} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  className="input"
                  type="text"
                  placeholder="e.g. Cutlery, Cleaning, Packaging"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  autoFocus
                />
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowAddCat(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Product Dialog */}
      {deleteTarget && (
        <ConfirmDialog
          title={`Delete ${deleteTarget.name}?`}
          message={`Are you sure you want to remove "${deleteTarget.name}" from products? This cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
