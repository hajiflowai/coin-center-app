---
name: coin-app-developer
description: Expert agent skill for developing, optimizing, maintaining, and improving usability of the Coin Center app (ศูนย์ข้อมูลและแอปสแกนเหรียญประจำร้าน). Use when requested to add features, improve UX/UI, streamline coin management, optimize scanner performance, or enhance mobile usability.
---

# Coin App Developer Skill

This skill provides comprehensive instructions for developing and optimizing the **Coin Center App** — a private coin data center, smart scanner, and inventory system.

## 🏗️ Project Architecture Overview

```
COIN DATA/
├── server.js               # Node.js + Express backend server
├── package.json            # App dependencies (express, cors, multer, qrcode)
├── data/
│   └── coins.json          # Persistent JSON storage for coin items
└── public/
    ├── index.html          # Single Page Application HTML structure
    ├── css/
    │   └── styles.css      # Glassmorphism & responsive CSS styling
    └── js/
        ├── app.js          # Core client logic, UI state, catalog & dashboard
        └── scanner.js      # WebRTC camera scanner & feature analyzer
```

---

## 🎨 UI/UX Design System Guidelines

1. **Color Palette**:
   - Primary Accent: Gold (`#f59e0b` / `var(--accent-gold)`)
   - Secondary Accent: Blue (`#38bdf8` / `var(--accent-blue)`)
   - Success: Green (`#10b981` / `var(--accent-green)`)
   - Danger/Cost: Red (`#ef4444` / `var(--accent-red)`)
   - Background: Dark Slate (`#0f172a` / `var(--bg-dark)`)
2. **Typography**: Google Fonts 'Inter' with support for Thai text.
3. **Glassmorphism**: Soft backdrop blur, semi-transparent dark panels (`background: rgba(30, 41, 59, 0.7)`), subtle glowing borders (`1px solid rgba(255, 255, 255, 0.1)`).

---

## 🚀 Core Features & Developer Workflows

### 1. Smart Coin Scanner (`/api/scan`)
- Captures canvas frame from WebRTC camera or file input.
- Extracts center color tone, metal type, estimated diameter, and matches against `coins.json`.
- Displays percentage confidence scores and best match highlight.

### 2. Storefront Privacy Mode
- Toggled via `#btn-privacy-toggle`.
- When enabled (`isPrivacyModeEnabled = true`), cost prices (`costPriceTHB`) are hidden across all views and detail modals.

### 3. Quick Stock & Inventory Controls
- Instant increment/decrement of coin stock.
- Fast catalog filtering by country, era, year, and search keywords.

### 4. Home Server LAN Access
- Fetches host IPv4 address dynamically via `/api/network-info`.
- Generates QR code using `qrcode` library so shop staff can scan from smartphones on the same Wi-Fi.

---

## ⚡ Principles for Making the App "Easy to Use" (ใช้งานง่าย)

- **Instant Feedback**: Use non-blocking Toast notifications for actions (add, update, delete, stock adjust).
- **Fast Filter Pills**: Include quick filter preset buttons (e.g. 🇹🇭 เหรียญไทย, 🇦🇺 เหรียญออสเตรเลีย, ⭐ เหรียญหายาก).
- **Image Upload Preview**: Provide live preview when adding or scanning photos.
- **One-Click Quick Stock Adjust**: Allow updating stock directly from catalog cards or detail modals.
- **Responsive Layout**: Ensure touch elements are large and readable on mobile screens.
