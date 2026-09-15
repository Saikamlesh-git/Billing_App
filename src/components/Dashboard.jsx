import { useMemo } from "react";
import { formatCurrency } from "../utils/calculations.js";

export default function Dashboard({ billingHistory, products, onNewBill }) {
  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = today.toLocaleDateString("en-IN");
    const todayBills = billingHistory.filter((b) => b.date === todayStr);
    const todaySales = todayBills.reduce((sum, b) => sum + (b.total || 0), 0);
    return {
      todayBills: todayBills.length,
      todaySales,
      totalProducts: products.length,
      recentBills: billingHistory.slice(0, 5).length,
    };
  }, [billingHistory, products]);

  const statCards = [
    {
      icon: "🧾",
      label: "Today's Bills",
      value: stats.todayBills,
      color: "var(--accent)",
      bg: "var(--accent-light)",
    },
    {
      icon: "💰",
      label: "Today's Sales",
      value: formatCurrency(stats.todaySales),
      color: "var(--success)",
      bg: "var(--success-light)",
    },
    {
      icon: "📦",
      label: "Total Products",
      value: stats.totalProducts,
      color: "var(--warning)",
      bg: "var(--warning-light)",
    },
    {
      icon: "📋",
      label: "Total Bills Saved",
      value: billingHistory.length,
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.12)",
    },
  ];

  return (
    <div className="dashboard-stats">
      {statCards.map((s) => (
        <div className="stat-card" key={s.label}>
          <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
            {s.icon}
          </div>
          <div className="stat-info">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
