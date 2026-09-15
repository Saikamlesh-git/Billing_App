import { useMemo, useState } from "react";
import ProductCard from "./ProductCard.jsx";
import CategoryTabs from "./CategoryTabs.jsx";

export default function ProductGrid({ products, categories, cart, onQtyChange, onAdd }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
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
  }, [products, activeCategory, search]);

  const getCartItem = (productId) => cart.find((c) => c.id === productId);

  return (
    <div className="billing-left">
      {/* Search + Category toolbar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="search-bar-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="input search-input"
            type="text"
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {/* Grid */}
      <div className="product-grid-container">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: "3rem" }}>📦</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>No products found</div>
              <div className="text-sm text-muted">
                {search ? `No results for "${search}"` : "Add products in the Products section"}
              </div>
            </div>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cartItem={getCartItem(product.id)}
                onQtyChange={onQtyChange}
                onAdd={onAdd}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
