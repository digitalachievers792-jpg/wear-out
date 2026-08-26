# WEAR OUT — Streetwear E-Commerce (Full-Stack)

A production-grade full-stack e-commerce site for the **Wear Out** streetwear brand.
Built with **React (Vite) + TailwindCSS** on the frontend and **Node.js + Express + MongoDB (Mongoose)** on the backend.

> **Purpose of this file:** This README is written so that any AI assistant (or future you) can read it, understand the
> current state of the project, and safely continue editing. Read the "How to resume / edit" section at the bottom first.

---

## 1. Current Project State (as of last update)

- **Public site (light theme):** Home (scroll hero + featured products), Category pages (Shirts, Trousers, Caps, **Un Stitch**),
  Coming Soon pages (Watches, Accessories, Shoes), Product Detail, Cart, Checkout, About, Contact, **Search**.
- **Hero:** A scroll-driven "WEAR OUT" wordmark (`BrandHero.jsx`). The featured image (`/assets/featured-hero.png`) reveals on
  scroll. The wordmark uses the **Orbitron** font (weight 900), forward slant (~8°), tight spacing, and a **metallic + 3D bevel**
  style (`.hero-metal` in `src/index.css`). The golden "WO" ring and the white outline were removed per owner request.
- **Logo:** `frontend/public/assets/logo.png` is shown in the navbar and footer (no circle frame). It is also the favicon.
- **Products:** name, description, price, multiple sizes, category, image, `featured` (bool), `rating` (0–5, halves allowed).
  Edited entirely from the admin panel; changes reflect live on the site.
- **Homepage "DROP 001" section** shows **only `featured: true`** products. Category pages show **all** products in that
  category regardless of `featured`.
- **Star rating:** Admin can set a 1–5 star rating per product (clickable stars in the product form). It displays on product
  cards and the product detail page via `StarRating.jsx`.
- **Global search:** A search bar in the navbar navigates to `/search?q=...`, which queries all products by name/description/
  category (case-insensitive regex on the backend).
- **Admin panel (light theme):** Products CRUD (with image upload), Orders (with one-click copy of customer data), Customers,
  Reviews moderation, Courier Hub, Analytics, Logistics AI. The **"Admin" navbar/footer link is hidden from public visitors**;
  it only appears once an admin is logged in. The login route `/admin/login` is still reachable directly.
- **Mobile:** Fully responsive. Hero text uses `clamp()`; `overflow-x: clip` on body prevents horizontal scroll; cart rows wrap
  on small screens. Admin tables have horizontal scroll.

### Known limitations / deliberate decisions
- Images are uploaded to the backend's local disk (`backend/uploads/products`) and served at `/uploads/<file>`. This works for
  dev and small deployments, but for production you should move to cloud storage (Cloudinary/S3) because ephemeral hosts wipe
  disk. See Deployment section.
- The backend uses **MongoDB via `mongodb-memory-server`** for local dev (a real mongod binary runs on `127.0.0.1:27017`,
  data persisted in `backend/devdata`). In production set `MONGO_URI` to MongoDB Atlas.
- `FigureHero.jsx` and `WoLogo.jsx` exist but are **unused** (leftover from earlier hero experiments). Safe to ignore/delete.
- Build emits a >500 kB chunk warning (Recharts + Framer Motion). Non-blocking.

---

## 2. Tech Stack / Libraries

### Frontend (`frontend/`)
| Purpose | Library |
|---------|---------|
| Framework / build | React 18 + Vite |
| Styling | TailwindCSS (custom theme colors: `mist`, `bone`, `gold`, `gold-light`, `ink`, `slate`) |
| Animation | Framer Motion (hero scroll effects) |
| Charts (admin) | Recharts |
| Routing | React Router v6 |
| HTTP | Axios (instance in `src/api.js`, baseURL `/api`, attaches admin JWT) |
| Fonts | Bebas Neue (`font-display`), Inter (`font-body`), **Orbitron** (hero wordmark, loaded in `index.html`) |

### Backend (`backend/`)
| Purpose | Library |
|---------|---------|
| Server | Express |
| ODM | Mongoose |
| Auth | `jsonwebtoken` (JWT) + `bcryptjs` |
| Validation | `express-validator` |
| Security | `helmet`, `express-rate-limit`, `sanitize-html` |
| Uploads | `multer` (disk storage, 8 MB limit, images only) |
| Local DB (dev) | `mongodb-memory-server` (`npm run dev:db`) |
| Logging/reload | `nodemon` (auto-restarts on backend file changes) |

### Database
- MongoDB. Models: `Product`, `Order`, `Review`, `Admin`, `Courier` (see `backend/models/`).

---

## 3. How to Run (local development)

You need **two servers running at once**: the backend (port 5000) and the frontend (port 5173).

### Prerequisites
- Node.js (LTS) + npm
- No Docker needed (local Mongo is provided by `mongodb-memory-server`)

### Step A — Start MongoDB (local)
```bash
cd backend
npm install
npm run dev:db      # real mongod on 127.0.0.1:27017 (data in backend/devdata)
```
Leave this running. (The backend will also start fine if Mongo is already up.)

### Step B — Start backend (port 5000)
```bash
cd backend
cp .env.example .env     # if missing; values already present in .env
npm run dev              # nodemon; seeds admin user + default couriers on first boot
```
API: `http://localhost:5000`. Health check: `GET /api/health`.

### Step C — Start frontend (port 5173)
```bash
cd frontend
npm install
npm run dev              # Vite dev server
```
Site: `http://localhost:5173`. Vite proxies `/api` **and** `/uploads` → `http://localhost:5000`.

### Production build (frontend)
```bash
cd frontend
npm run build           # outputs frontend/dist/
```

> **Note:** The backend reads `.env` **once at startup** (dotenv). If you change `.env`, you must **restart the backend**
> (`nodemon` does NOT reload on `.env` edits). Code edits to backend `.js` files DO auto-reload.

---

## 4. Project Structure Map

### `frontend/src/`
| Path | Responsibility |
|------|----------------|
| `main.jsx` | React entry |
| `App.jsx` | All routes (public + `/admin/*`) |
| `api.js` | Axios instance + `api` object used everywhere for HTTP |
| `index.css` | Tailwind layers + custom classes: `.text-metallic`, `.text-shade`, `.hero-metal`, `.btn-gold`, `.btn-outline`, `.input-field`, `.admin-surface`, `body { overflow-x: clip }` |
| `categories.js` | **Single source of truth** for categories (`slug`/`label`/`value`). Edit here to add/remove categories. |
| `components/` | |
| `Navbar.jsx` | Logo, category nav, **search bar**, cart icon, Admin link (only when authenticated), mobile menu |
| `AppFooter.jsx` | Footer with shop/company/connect links |
| `Layout.jsx` | Navbar + `<Outlet/>` + Footer wrapper |
| `BrandHero.jsx` | **Scroll hero**: featured image reveal + metallic "WEAR OUT" wordmark. (FigureHero/WoLogo unused.) |
| `ProductCard.jsx` | Product grid card (image, category tag, name, **star rating**, price) |
| `StarRating.jsx` | Fractional star display (0–5) |
| `ProductDetail.jsx` | Full product page (image, rating, size selector, add to cart / buy now, reviews) |
| `ReviewSection.jsx` | Customer reviews + submit (pending approval) |
| `CartContext.jsx` | Cart state (localStorage) |
| `ConfigContext.jsx` | Fetches `/api/admin/config` (contact links, delivery charge, categories) |
| `AdminAuth.jsx` | Admin JWT auth context |
| `pages/` | |
| `Home.jsx` | BrandHero + featured (`featured:true`) grid + category tiles + CTA |
| `Category.jsx` | Lists products for a category; derives category from the URL path via `categories.js` |
| `Search.jsx` | Global search results (`?q=`) |
| `ProductDetail.jsx` | (see components) — actually under pages |
| `Cart.jsx`, `Checkout.jsx` | Cart + checkout (delivery-charge prepaid popup, COD) |
| `About.jsx`, `Contact.jsx`, `ComingSoon.jsx` | Static/coming-soon pages |
| `admin/` | AdminLogin, AdminLayout, Dashboard, Products, Orders, Customers, ReviewsModeration, CourierHub, Logistics, Analytics |

### `backend/`
| Path | Responsibility |
|------|----------------|
| `server.js` | Express app, middleware, static `/uploads`, route mounts |
| `config/db.js` | Mongoose connection |
| `models/` | `Product.js`, `Order.js`, `Review.js`, `Admin.js`, `Courier.js` |
| `controllers/` | `productController.js`, `orderController.js`, `reviewController.js`, `adminController.js` (incl. `getPublicConfig`, `login`, `me`), `analyticsController.js` |
| `routes/` | `products.js`, `orders.js`, `reviews.js`, `admin.js`, `courier.js`, `analytics.js`, `auth.js` |
| `middleware/` | `auth.js` (JWT `protect`), `upload.js` (multer), `validate.js`, `rateLimiter.js` |
| `scripts/dev-db.js` | Starts local MongoDB via `mongodb-memory-server` |
| `.env` | All secrets/config (see below) |
| `uploads/products/` | Uploaded product images (served at `/uploads/<filename>`) |

---

## 5. Data Models (key fields)

**Product** (`backend/models/Product.js`)
- `name` (String, req), `description`, `price` (Number, req), `sizes` (String[]), `category` (enum:
  `Shirts, Trousers, Caps, Watches, Accessories, Shoes, Un Stitch`), `rating` (Number 0–5), `image` (filename),
  `inStock` (bool), `featured` (bool).

**Order** — `customer` {fullName, age, city, address, whatsapp, email, gender}, `items` [{product, size, quantity, price}],
`deliveryCharge`, `status`, `reference`, timestamps.

**Review** — `product`, `name`, `rating`, `comment`, `status` (`pending`/`approved`), `adminReply`.

**Admin** — `email`, `passwordHash`. **Courier** — `name`, `active`, plus cost/time metadata.

---

## 6. API Reference (summary)

Public:
- `GET /api/admin/config` — brand + contact links + deliveryCharge + categories
- `GET /api/products` — supports `?category=`, `?featured=true`, `?search=`
- `GET /api/products/:id`
- `POST /api/orders` — create order (rate-limited)
- `POST /api/reviews` — submit review (rate-limited, sanitized)
- `GET /api/reviews/product/:id`, `GET /api/reviews/product/:id/rating`

Admin (require `Authorization: Bearer <token>`):
- `POST /api/admin/login`, `GET /api/admin/me`
- `POST/PUT/DELETE /api/products` (+ `:id`) — image uploaded as `multipart/form-data` field `image`; `rating`, `featured`, `inStock` accepted
- `GET /api/orders`, `PUT /api/orders/:id/status`
- `GET /api/reviews/pending`, `PUT /api/reviews/:id/status`, `DELETE /api/reviews/:id`
- `GET /api/analytics/dashboard`, `/analytics/customers`, `/analytics/logistics`
- `GET /api/courier/couriers`, `POST /api/courier/couriers/:id/toggle`, `GET /api/courier/optimizer`

---

## 7. Environment Variables (`backend/.env`)

| Key | Description | Current dev value |
|-----|-------------|------------------|
| `PORT` | API port | `5000` |
| `MONGO_URI` | MongoDB URI | `mongodb://127.0.0.1:27017/wearout` |
| `JWT_SECRET` | JWT signing secret | dev secret (change in prod) |
| `ADMIN_EMAIL` | Seeded admin email | `admin@wearout.store` |
| `ADMIN_PASSWORD` | Seeded admin password | `wearout123` |
| `CONTACT_WHATSAPP` | WhatsApp number (footer) | `923001234567` (placeholder) |
| `CONTACT_EMAIL` | Email (footer/contact) | `wearout.store@gmail.com` (placeholder) |
| `CONTACT_FACEBOOK` | Facebook URL | placeholder |
| `CONTACT_WHATSAPP_COMMUNITY` | **WhatsApp Community invite link** | `https://chat.whatsapp.com/Fm1YNowj2lS3xivYuMKxQS` |
| `DELIVERY_CHARGE` | Prepaid delivery charge (PKR) | `200` |

> Change these (especially real contact links, JWT secret, admin password) before going live.

---

## 8. Styling / Theme Notes

- Theme is **light**: backgrounds are `mist`/`bone`, accents are `gold` (`#c9a227`-ish gradient), text `slate`/`ink`.
- Tailwind config defines `font-display` (Bebas Neue), `font-body` (Inter), and color tokens. The hero wordmark overrides
  font with **Orbitron** via inline style in `BrandHero.jsx`.
- Metallic text = `.text-metallic` (gold gradient) or `.hero-metal` (gold + bevel shadow) in `src/index.css`.
- Buttons: `.btn-gold` (gold bg), `.btn-outline` (gold border). Inputs: `.input-field`. Admin surfaces: `.admin-surface`.

---

## 9. Deployment (free tier)

- **Frontend → Netlify** (free): build `frontend/` (`npm run build`), deploy `dist/`. Set the build command and publish dir.
  After deploy, the API calls still point to `localhost:5000` in dev — you must change `src/api.js` baseURL (or use env) to
  your backend URL, OR serve the API from the same origin. Recommended: set `VITE_API_BASE` and read it in `api.js`.
- **Backend → Render** (free, sleeps when idle → cold start) or Railway/Fly: deploy `backend/`, set the same `.env` vars,
  and **`MONGO_URI` to MongoDB Atlas** (free M0). Render exposes a public URL — point the frontend there.
- **Database → MongoDB Atlas** (free M0, 512 MB). Replace `MONGO_URI`.
- **Images:** local disk upload works on Render but is ephemeral. For production, switch `multer` storage to Cloudinary/S3.
- Admin panel stays hidden from public (only visible when logged in); login is at `/admin/login`.

---

## 10. How to Resume / Edit (instructions for an AI assistant)

1. **Always start both servers** (backend on 5000, frontend on 5173) before testing any UI change. The site will not load
   data without the backend, and `/uploads` images need the Vite proxy to the backend.
2. **Backend code edits** auto-reload via nodemon. **`.env` edits need a manual backend restart.**
3. **Frontend edits** hot-reload via Vite (HMR). After editing `vite.config.js`, restart the Vite dev server.
4. **Verification:** run `cd frontend && npm run build` to catch JSX/syntax errors across all pages.
5. **Common tasks → where to look:**
   - Add a product category → edit `frontend/src/categories.js` (add `{slug,label,value}`), add the enum value in
     `backend/models/Product.js` + the `isIn` list in `backend/routes/products.js`, add a `<Route>` in `App.jsx` if it needs
     a real page (or point to `ComingSoon`), and add it to the navbar `realCategories` + footer list.
   - Change hero text/style → `frontend/src/components/BrandHero.jsx` + `.hero-metal` in `index.css`.
   - Change logo → replace `frontend/public/assets/logo.png`.
   - Change product card / detail → `ProductCard.jsx` / `ProductDetail.jsx`.
   - Change featured-on-homepage behavior → `Home.jsx` (uses `getProducts({ featured: 'true' })`).
   - Change contact/social links → `backend/.env` `CONTACT_*` then restart backend.
   - Change delivery charge → `backend/.env` `DELIVERY_CHARGE` then restart backend.
   - Admin panel UI → `frontend/src/pages/admin/*`.
6. **Gotchas to remember:**
   - `Category.jsx` derives the category from the URL path (via `categories.js`), not route params — do not "fix" it back to
     `useParams` (that was a bug that broke category pages).
   - The public navbar/footer **Admin link is intentionally hidden** unless authenticated.
   - Product images must be served through the `/uploads` proxy in dev; in production the API and static files must share an
     origin or be correctly proxied.

---

## 11. Admin Access

1. Go to `/admin/login`.
2. Log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` (`admin@wearout.store` / `wearout123` in dev).
3. Manage products, orders, reviews, couriers, analytics. Changes appear live on the public site.

---

*Last updated: project currently in active local development. All core features implemented; pending: real production
deployment, real contact/social links, and (optionally) cloud image storage.*
