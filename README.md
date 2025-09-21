<img src="https://socialify.git.ci/SineMag/Farmily/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="Farmily" width="640" height="320" />

# Farmily

A React + Vite project that implements a role-based e-commerce platform with support for customers, farmers, and drivers. The app includes authentication, protected routes, product listing, cart, wishlist, order management, and dashboards for different user roles.

## 🚀 Features
- Authentication (Login & Register) with role-based access control  
- Protected Routes for customers, farmers, and drivers  
- Customer Features: Cart, Orders, Wishlist  
- Farmer Dashboard for managing products and farm-related data  
- Driver Dashboard for delivery management  
- UI Enhancements using Radix UI, Tailwind, and Sonner for notifications  
- Newsletter Popup and Promo Notifications  
- Responsive Layout built with TailwindCSS  

## 📦 Tech Stack
- **Frontend**: React 18, React Router, Vite  
- **UI Components**: Radix UI, Lucide React, TailwindCSS, Sonner, Vaul  
- **State Management**: React Context API  
- **Forms & Validation**: React Hook Form  
- **Charts & Data**: Recharts, Embla Carousel, Day Picker  

## ⚙️ Installation
in bash:
```bash
git clone <your-repo-url>
cd <your-project-folder>
npm install
npm run dev
```

```bash
src/
 ├─ components/
 │   ├─ auth/              # LoginForm, RegisterForm
 │   ├─ cart/              # CartPage
 │   ├─ driver/            # DriverDashboard
 │   ├─ farmer/            # FarmerDashboard
 │   ├─ home/              # HomePage
 │   ├─ layout/            # Header, Layout components
 │   ├─ notifications/     # PromoNotifier
 │   ├─ newsletter/        # NewsletterPopup
 │   ├─ orders/            # OrdersPage
 │   ├─ products/          # ProductList
 │   ├─ ui/                # Sonner (toasts), shared UI
 │   └─ wishlist/          # WishlistPage
 │
 ├─ contexts/
 │   └─ AppContext.tsx     # Global state (user, auth, etc.)
 │
 ├─ App.tsx                # Main App component with routing
 ├─ main.tsx               # React entry point
 └─ index.css              # Global styles
```

## 🔒 Routing & Role-Based Access

- Public Routes: Home, Products, Login, Register

- Customer Routes: Cart, Orders, Wishlist

- Farmer Routes: Farmer Dashboard

- Driver Routes: Driver Dashboard

- Fallback: Unknown routes redirect to /

## 🛠️ Scripts
in bash:
```bash
npm run dev → Start development server

npm run build → Build for production
```

## ✨ Dependencies

#### Key dependencies used:

- react, react-dom, react-router-dom

- @radix-ui/react-* (UI components)

- tailwind-merge, clsx (utility)

- lucide-react (icons)

- sonner (toast notifications)

- recharts (charts)

- react-hook-form (forms)

## 📜 License

- This project is licensed under the MIT License. You are free to use, modify, and distribute it.