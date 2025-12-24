
# Sewa Lashes ✨

A clean, full‑stack salon & e‑commerce starter: React (Vite + Tailwind) frontend, Node/Express backend with Prisma, gallery uploads (Cloudinary), bookings, products, and an admin panel.

---

**Tech summary**
- **Frontend:** React + Vite, Tailwind CSS, modular components for auth, bookings, gallery, products, admin. 🖥️
- **Backend:** Node + Express API, Prisma ORM, controllers for auth/bookings/products/services. ⚙️
- **Media:** Cloudinary integration for image/video uploads. 🖼️

**Highlights**
- Booking & availability system ✅
- Product catalog, cart, checkout ✅
- Gallery upload & admin management ✅
- Role-based admin features + protected routes ✅

---

## Quick start (development)

Prereqs: Node.js 16+, npm (or pnpm). For local DB you can use SQLite or Postgres.

1) Install dependencies

```bash
cd client && npm install
cd ../server && npm install
````

2. Environment

Create `.env` files for each service. Example variables are shown below.

3. Database (server)

```bash
cd server
npx prisma migrate dev --name init
node prisma/seed.js   # optional, if present
```

4. Run both apps

```bash
# terminal A
cd client && npm run dev

# terminal B
cd server && npm run dev
```

---

## Recommended .env (examples)

Client (`client/.env`)

```
VITE_API_URL=http://localhost:4000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

Server (`server/.env`)

```
DATABASE_URL="file:./dev.db"    # or postgres://user:pass@host:5432/db
JWT_SECRET=supersecretvalue
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Useful commands

- Start frontend: `cd client && npm run dev`
- Start backend: `cd server && npm run dev`
- Build frontend: `cd client && npm run build`
- Prisma CLI: `cd server && npx prisma ...`

---

## Project layout (top-level)

- `client/` — React app (Vite) with `src/` components, pages, services
- `server/` — Express API, `src/controllers`, `routes`, `utils`, `prisma/` schema

---

If you want, I can now:

- add `client/.env.example` and `server/.env.example` (I can create them now) ✅
- add short `client/README.md` and `server/README.md` with env examples and run commands ✅


