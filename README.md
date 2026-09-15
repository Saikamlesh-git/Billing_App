# 🛍️ Carry Billing — Hotel Essentials & Supplies POS Web App

A modern, fast, responsive billing & POS web application designed specifically for hotel essentials and packaging suppliers (carry bags, sheets, cups, rolls, disposables).

Designed to work seamlessly on **PC, Mac, iPhone, iPad, and Android** with cross-device synchronization and responsive layout.

---

## ✨ Features

- **No Login Required**: Opens directly to the billing interface (admin-only).
- **Hotel Selection**: Welcome modal prompts for Hotel Name before billing. Editable anytime.
- **Dynamic Product Catalog**:
  - Organized by categories (*Carry Bags, Sheets, Cups, Rolls, Other Essentials*).
  - Instant live search by product name or category.
  - Category filter tabs.
- **Quantity Controls**:
  - `+` / `−` buttons.
  - Direct click-to-edit input (supports keyboard input, Enter to confirm, large numbers like 25, 50, 100, 500).
- **Cart & Pricing**:
  - **Dynamic height**: Cart panel only expands as items are added (does NOT force stretch to product list height).
  - Real-time calculations: Line Amount = Qty × Rate.
  - Subtotal, Discount (₹), and Grand Total.
  - Clear Cart & Generate Bill with validation.
- **Mobile Responsive & Cross-Device**:
  - Desktop: Products on left, sticky auto-expanding cart on right.
  - Mobile/Tablet: Floating bottom cart summary bar (`🛒 X items • ₹Total | View Bill ↓`) with smooth auto-scroll.
  - Touch-friendly 44px buttons for iOS and Android.
- **Invoice & Receipts**:
  - Auto-generated invoice numbering: `CB-YYYYMMDD-001` (auto-increments daily).
  - Professional invoice preview modal.
  - **Download PDF**: Generates formatted PDF (`Carry-Bill-CB-20260915-001-Hotel-ABC.pdf`).
  - **Print Receipt**: One-click browser print.
  - **WhatsApp Sharing**: Formatted text message via WhatsApp (`wa.me`) without needing API keys.
- **Billing History**:
  - Stores up to 30 completed bills (FIFO queue; older bills automatically removed).
  - Searchable by bill number or hotel name.
  - View old receipts or delete with confirmation.
- **Product Management UI**:
  - Add, edit, and delete products.
  - Add custom categories dynamically.
- **Multi-Device Real-Time Sync**:
  - Built-in cloud sync adapter that synchronizes products, categories, history, and hotel name across PC, Mac, and mobile phones.
  - Full offline support with LocalStorage fallback.

---

## 🚀 Quick Start Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Run production server with sync backend
npm start
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 How to Deploy on GitHub

This repository is configured to push to:
`https://github.com/Saikamlesh-git/Billing_App.git`

To push updates:
```bash
git add .
git commit -m "Update Carry Billing app with responsive mobile layout and sync server"
git branch -M main
git remote add origin https://github.com/Saikamlesh-git/Billing_App.git
git push -u origin main
```

---

## 🌐 How to Add a Free Database in Render & Sync Across All Devices

To make any change on one device (PC, Mac, Phone) instantly update on all devices, follow this step-by-step guide to deploy for **FREE** on Render:

### Method 1: Render All-in-One Deployment (Easiest & 100% Free)

This repository includes `server/server.js` and `render.yaml`. When deployed as a **Web Service** on Render, it serves both the frontend web app and the cloud sync API:

1. Create a free account at [render.com](https://render.com).
2. Connect your GitHub account and click **New +** → **Web Service**.
3. Select your repository: `Saikamlesh-git/Billing_App`.
4. Configure the service settings:
   - **Name**: `carry-billing`
   - **Region**: Closest to you (e.g., Singapore or Frankfurt)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free**
5. Click **Deploy Web Service**.
6. Once deployed, Render gives you a public URL like:
   `https://carry-billing.onrender.com`

**Open that link on your PC, your Mac, and your Phone!**
Because every device connects to the same Render backend, any product added or bill generated automatically syncs across all devices!

---

### Method 2: Adding a Free PostgreSQL Database on Render

If you want a dedicated PostgreSQL database on Render:

1. In Render Dashboard, click **New +** → **PostgreSQL**.
2. Settings:
   - **Name**: `carry-billing-db`
   - **Database**: `carry_billing`
   - **User**: `carry_admin`
   - **Plan**: **Free**
3. Click **Create Database**.
4. In your database dashboard, copy the **Internal Database URL** (or External Database URL).
5. In your `carry-billing` Web Service settings:
   - Go to **Environment Variables**.
   - Add: `DATABASE_URL` = `<your-copied-database-url>`.
6. Render will automatically redeploy with your PostgreSQL database connected!

> **Note on Render Free Tier**: Free PostgreSQL on Render expires after 30 days. For a **permanent 100% free cloud PostgreSQL database**, use [Supabase](https://supabase.com) or [Neon.tech](https://neon.tech):
> 1. Create a free project at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com).
> 2. Copy the free Postgres connection string (`postgres://...`).
> 3. Paste it as `DATABASE_URL` in Render's environment variables. It stays permanently free without expiring!

---

## 📱 How Multi-Device Sync Works

1. **Local-First Speed**: All operations are cached in `localStorage` for zero latency.
2. **Background Sync**: Any added product, edited category, or completed bill is sent to the server in the background.
3. **Auto-Pull**: Whenever a device opens the app, switches browser tabs, or every 12 seconds, it pulls the latest updates from the server so all devices stay in sync.
