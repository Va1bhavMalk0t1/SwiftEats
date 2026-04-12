# QuickBite — Food Delivery Frontend

A production-grade React + Tailwind frontend for a food delivery app (Swiggy/Zomato-style), connected to your Node.js/Express/MySQL backend.

---

## Quick Start

```bash
cd quickbite
npm install
npm run dev
```

Open http://localhost:3000

---

## Folder Structure

```
src/
├── api/
│   └── index.js              # Axios instance + all API calls (auth, food, restaurant, search, admin)
│
├── context/
│   ├── AuthContext.jsx        # User auth state, login/signup/logout, auto-login
│   ├── CartContext.jsx        # Cart items, add/remove/clear, totals
│   └── ToastContext.jsx       # Global toast notifications
│
├── components/
│   ├── Navbar.jsx             # Role-aware navbar with cart badge
│   ├── FoodCard.jsx           # Food card with add/remove qty controls
│   ├── RestaurantCard.jsx     # Restaurant card, navigates to detail
│   ├── ProtectedRoute.jsx     # Auth guard + role guard
│   └── Spinner.jsx            # Loading spinner (inline or fullPage)
│
├── pages/
│   ├── HomePage.jsx           # Landing page with hero, stats, features
│   ├── LoginPage.jsx          # JWT login form, redirects back to intended page
│   ├── SignupPage.jsx         # Signup form with validation
│   ├── MainPage.jsx           # Browse foods grouped by category with tabs
│   ├── RestaurantsPage.jsx    # Restaurant list with city/status filter + pagination
│   ├── RestaurantDetailPage.jsx # Restaurant info + full menu grouped by category
│   ├── SearchPage.jsx         # Search foods and restaurants
│   ├── CartPage.jsx           # Cart with qty controls, taxes, checkout simulation
│   ├── OwnerPanel.jsx         # Add food + create restaurant (owner role)
│   ├── AdminPanel.jsx         # Assign admin/owner roles (admin role)
│   └── NotFoundPage.jsx       # 404 page
│
├── App.jsx                    # Root router with all routes
├── main.jsx                   # React entry point
└── index.css                  # Global styles + Tailwind
```

---

## Backend Connection

The `vite.config.js` proxies all `/api` requests to `http://localhost:5000`.

API calls live in `src/api/index.js`:

| Export | Endpoints |
|---|---|
| `authAPI` | POST /signup, POST /signin, GET /user |
| `foodAPI` | GET /foods/home, GET /foods/home/categories, GET /foods/home/categories/:cat, POST /foods |
| `restaurantAPI` | GET /restaurants, GET /restaurants/:id, GET /restaurants/:id/menu, POST, PUT, DELETE |
| `searchAPI` | GET /search |
| `adminAPI` | PUT /users/make-admin/:id, PUT /users/make-owner/:id |

---

## Known Backend Bugs to Fix

1. **`authController.js`** — `results[0]` should be `result[0]` in `userController`
2. **`db.js` exports** — `adminController.js` uses `const connection = require(...)` but `ownerMiddleware.js` uses `const { connection } = require(...)` — pick one style
3. **`restaurantRouter.js`** — `router.put('/')` for create should be `router.post('/')`
4. **`searchController.js`** — uses `foods.res_id` but the column may be `restaurant_id` — check your DB schema

---

## Routes

| Path | Access | Page |
|---|---|---|
| `/` | Public | Landing / Hero |
| `/login` | Public | Login |
| `/signup` | Public | Signup |
| `/restaurants` | Public | Restaurant list |
| `/restaurants/:id` | Public | Restaurant menu |
| `/search` | Public | Search |
| `/main` | Login required | Browse foods |
| `/cart` | Login required | Cart + checkout |
| `/owner` | Owner role | Owner panel |
| `/admin` | Admin role | Admin panel |

---

## Tech Stack

- React 18 + React Router v6
- Tailwind CSS v3
- Axios (with JWT interceptor)
- Vite (dev server + proxy)
- Google Fonts: Syne (headings) + DM Sans (body)
