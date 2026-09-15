export default function CategoryTabs({ categories, activeCategory, onSelect }) {
  return (
    <div className="category-tabs">
      <button
        className={`cat-tab ${activeCategory === "All" ? "active" : ""}`}
        onClick={() => onSelect("All")}
      >
        <span>🏷️</span> All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`cat-tab ${activeCategory === cat ? "active" : ""}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
