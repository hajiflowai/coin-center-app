# Workspace Rules: Coin Center Development & UX Guidelines

This workspace is for **Coin Center (ศูนย์ข้อมูลและแอปสแกนเหรียญประจำร้าน)** — a specialized Web Application & Node.js Home Server designed for coin collectors, storefront management, and smart camera-based coin scanning.

## 🎯 Primary Goal: Ease of Use & High Efficiency (ใช้งานง่าย สะดวกรวดเร็ว)

All AI agents and developers working on this codebase must prioritize:
1. **Zero-Friction UX**: Every feature should require the minimum number of clicks/taps.
2. **Storefront & Private Mode Dual-Use**:
   - Storefront Mode (`โหมดเปิดหน้าร้าน`): Automatically hides sensitive cost prices (`ราคาทุน`) when presenting screens to customers.
   - Private Mode (`โหมดส่วนตัว`): Shows full cost details and profit metrics for shop owners.
3. **Mobile & Tablet First Responsiveness**:
   - Store staff use mobile phones and iPad/Android tablets at the counter and in storage.
   - Touch targets must be at least 44x44px.
   - Camera scanner must support mobile rear cameras (`facingMode: 'environment'`).
4. **LAN Connectivity**:
   - QR code for LAN access allows instant pairing with smartphones without manual IP typing.
5. **Clean Architecture**:
   - Backend: Express.js in `server.js` with simple JSON persistence in `data/coins.json`.
   - Frontend: Vanilla HTML5, CSS3 with glassmorphism design system (`public/css/styles.css`), and modular JS (`public/js/app.js`, `public/js/scanner.js`).

---

## 🛠️ Key Developer Routines

- **Adding API Endpoints**: Keep signatures clear in `server.js` under `/api/...`.
- **Modifying Data Schema**: Ensure backwards compatibility for existing coins in `data/coins.json`.
- **UI Enhancements**: Use CSS variables defined in `styles.css` (`--accent-gold`, `--accent-blue`, `--bg-dark`, `--glass-bg`).
- **User Feedback**: Prefer non-blocking Toast notifications over standard browser `alert()` popups.
