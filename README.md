# Royal Ghee & Sweets 👑
**Premium Desi Ghee & Traditional Pakistani Sweets eCommerce Website**

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- MongoDB (local or Atlas)
- npm

### 1. Backend Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and configure:
```bash
copy .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/royalghee
JWT_SECRET=your_super_secret_key_here
PORT=5000
ADMIN_EMAIL=adiln8n@gmail.com
ADMIN_PASSWORD=Adil90475
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

> **Admin is auto-created on first start** using `.env` credentials (bcrypt hashed).

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

### 3. Admin Panel

URL: http://localhost:5173/admin/login

**Credentials (change after first login!):**
- Email: `adiln8n@gmail.com`  
- Password: `Adil90475`

---

## 📁 Project Structure

```
my desi ghee site/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/       # JWT auth
│   ├── server.js        # Express entry point
│   ├── seed.js          # Auto-seeds admin + data
│   └── .env             # ⚠️ Never commit this!
│
└── frontend/
    ├── src/
    │   ├── components/  # Navbar, Footer, ProductCard, WhatsApp
    │   ├── pages/       # Home, Products, Cart, Checkout, etc.
    │   ├── admin/       # Admin panel pages
    │   ├── context/     # Cart, Language, Auth contexts
    │   └── i18n/        # EN/UR translations
    └── index.html
```

---

## 🌍 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | Public | Admin login |
| GET | `/api/products` | Public | List products |
| GET | `/api/products/:id` | Public | Product detail |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| GET | `/api/categories` | Public | List categories |
| POST | `/api/orders` | Public | Place order |
| GET | `/api/orders` | Admin | All orders |
| PUT | `/api/orders/:id/status` | Admin | Update status |

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Forest Green | `#1A3C2E` | Nav, dark sections |
| Royal Gold | `#C9A84C` | Buttons, accents |
| Ivory Cream | `#FDF8F0` | Background |
| Deep Maroon | `#6B1414` | Discounts/sale |

**Fonts**: Playfair Display (headings) + Inter (body) + Noto Nastaliq Urdu

---

## 📱 Features

- ✅ **Bilingual** — English + اردو with RTL support
- ✅ **WhatsApp** — Floating button + WhatsApp order links
- ✅ **Cart** — LocalStorage persistence, free delivery logic
- ✅ **Stock** — Auto-reduce on order, block checkout at 0
- ✅ **Admin Panel** — Full CRUD for products, orders, categories
- ✅ **JWT Auth** — bcrypt passwords, 7-day tokens, auto-logout
- ✅ **SEO** — Meta tags, semantic HTML, structured content

---

## 🚀 Production Deployment

### Option 1: VPS (Recommended)
1. Install MongoDB on server
2. Clone repo, configure `.env`
3. `npm start` (backend), `npm run build` (frontend)
4. Serve `frontend/dist/` with Nginx

### Option 2: Free Hosting
- **Backend**: Railway.app or Render.com (free tier)
- **Frontend**: Vercel or Netlify
- **Database**: MongoDB Atlas (free 512MB)

---

## 📞 Contact Details

- 📱 Phone: +92 344 127 2427
- 📧 Email: adiln8n@gmail.com  
- 💬 WhatsApp: https://wa.me/923441272427

---

> Made with ❤️ for Royal Ghee & Sweets
