import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { ProtectedRoute, RoleRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MainPage from './pages/MainPage'
import RestaurantsPage from './pages/RestaurantsPage'
import RestaurantDetailPage from './pages/RestaurantDetailPage'
import SearchPage from './pages/SearchPage'
import CartPage from './pages/CartPage'
import OwnerPanel from './pages/OwnerPanel'
import AdminPanel from './pages/AdminPanel'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <div style={{ minHeight: '100vh', background: '#0d0d0d' }}>
            <Navbar />
            <main style={{ paddingTop: 60 }}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/search" element={<SearchPage />} />

                {/* Restaurant detail - public but shows menu add-to-cart for logged in */}
                <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />

                {/* Protected: requires login */}
                <Route
                  path="/main"
                  element={
                    <ProtectedRoute>
                      <MainPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />

                {/* Role-based routes */}
                <Route
                  path="/owner"
                  element={
                    <RoleRoute role="owner">
                      <OwnerPanel />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <RoleRoute role="admin">
                      <AdminPanel />
                    </RoleRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
