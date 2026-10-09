# EMBER & BITE

A premium burger-restaurant website with a working ordering flow, built with **React + Vite**, React Router, Framer Motion, Lucide icons and hand-written CSS (no Tailwind).

> **This is a frontend demo.** Orders and the cart are stored in your browser's LocalStorage only. Nothing is sent to a restaurant or server, and no payments are processed. The restaurant, reviews, offer, opening hours and contact details are fictional samples.

## Pages

| Route    | What it does |
| -------- | ------------ |
| `/`      | Hero, signature dishes (live Add to Cart), why choose us, sample offer, sample reviews, footer |
| `/order` | Filterable menu (14 items), cart drawer, checkout form with validation, order confirmation |

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build locally
npm test           # unit + integration tests (Vitest)
```

Requires Node.js 18 or newer.

## Project structure

```
src/
  components/      Navbar, Footer, ProductCard, CategoryFilter, CartDrawer,
                   CheckoutForm, OrderConfirmation, PriceSummary, Toast, ...
    home/          Hero, FeaturedDishes, WhyChooseUs, SpecialOffer, Reviews
  pages/           Home, Order, NotFound
  data/menu.js     All menu items and categories
  context/         CartContext (state + LocalStorage) and cartReducer
  hooks/           useFocusTrap, useBodyScrollLock
  utils/           pricing (cents maths), validation, orders
  styles/          tokens, base, and one stylesheet per area
  test/            Vitest tests
```

## Pricing rules (demo)

- Delivery fee: **$3.50**, free when the subtotal is **$35.00 or more**.
- Pickup: no fee.
- All maths is done in integer cents to avoid rounding errors.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: EMBER & BITE"
git branch -M main
# create an empty repo on github.com first (no README), then:
git remote add origin https://github.com/<your-username>/ember-and-bite.git
git push -u origin main
```

## Deploy to Vercel

1. Sign in at [vercel.com](https://vercel.com) with GitHub.
2. Click **Add New... > Project** and import the `ember-and-bite` repository.
3. Vercel detects **Vite** automatically. Keep the defaults: build command `npm run build`, output directory `dist`.
4. Click **Deploy**.

`vercel.json` rewrites every path to `index.html`, so visiting `/order` directly works.

## Images

Food photos load from Unsplash. If any image fails to load, the app shows a built-in branded fallback image so layouts never break. To use your own photos, put them in `public/images/` and change the `image` fields in `src/data/menu.js` (for example `/images/burger.jpg`).

