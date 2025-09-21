import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { Header } from './components/layout/Header';
import { HomePage } from './components/home/HomePage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProductList } from './components/products/ProductList';
import { CartPage } from './components/cart/CartPage';
import { OrdersPage } from './components/orders/OrdersPage';
import { WishlistPage } from './components/wishlist/WishlistPage';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { Toaster } from './components/ui/sonner';
import { NewsletterPopup } from './components/newsletter/NewsletterPopup';
import { PromoNotifier } from './components/notifications/PromoNotifier';

// Protected route component
function ProtectedRoute({ children, allowedRoles }: { children?: React.ReactNode; allowedRoles: string[] }) {
  const { state } = useApp();
  const { currentUser } = state;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Customer only route
function CustomerRoute({ children }: { children?: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['customer']}>{children}</ProtectedRoute>;
}

// Farmer only route
function FarmerRoute({ children }: { children?: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['farmer']}>{children}</ProtectedRoute>;
}

// Driver only route
function DriverRoute({ children }: { children?: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['driver']}>{children}</ProtectedRoute>;
}

function AppContent() {
  const { state } = useApp();
  const { currentUser } = state;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductList />} />
          
          {/* Auth routes */}
          <Route 
            path="/login" 
            element={currentUser ? <Navigate to="/" replace /> : <LoginForm />} 
          />
          <Route 
            path="/register" 
            element={currentUser ? <Navigate to="/" replace /> : <RegisterForm />} 
          />

          {/* Customer routes */}
          <Route 
            path="/cart" 
            element={
              <CustomerRoute>
                <CartPage />
              </CustomerRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <CustomerRoute>
                <OrdersPage />
              </CustomerRoute>
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <CustomerRoute>
                <WishlistPage />
              </CustomerRoute>
            } 
          />

          {/* Farmer routes */}
          <Route 
            path="/farmer/dashboard" 
            element={
              <FarmerRoute>
                <FarmerDashboard />
              </FarmerRoute>
            } 
          />

          {/* Driver routes */}
          <Route 
            path="/driver/dashboard" 
            element={
              <DriverRoute>
                <DriverDashboard />
              </DriverRoute>
            } 
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {/* Global popups and notifications */}
      <PromoNotifier />
      <NewsletterPopup />
      <Toaster position="top-right" richColors />
    </div>
  );
}

function App() {
  return (
    <AppProvider
      children={
        <Router>
          <AppContent />
        </Router>
      }
    />
  );
}

export default App;