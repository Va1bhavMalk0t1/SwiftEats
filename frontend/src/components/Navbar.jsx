import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, isOwner, logout } = useAuth()
  const { totalCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const linkClass = ({ isActive }) =>
    `text-sm transition-colors duration-200 px-3 py-1.5 rounded-lg ${
      isActive
        ? 'text-[#f0ede6] bg-white/5'
        : 'text-[#888] hover:text-[#f0ede6] hover:bg-white/5'
    }`

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 60,
        background: 'rgba(13,13,13,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2a2a2a',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 8,
      }}
    >
      {/* Brand */}
      <Link
        to="/"
        style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 20,
          color: '#ff5c00',
          textDecoration: 'none',
          marginRight: 'auto',
          letterSpacing: '-0.5px',
        }}
      >
        QuickBite
      </Link>

      {/* Desktop Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <NavLink to="/" end className={linkClass}>Home</NavLink>
        <NavLink to="/restaurants" className={linkClass}>Restaurants</NavLink>
        <NavLink to="/search" className={linkClass}>Search</NavLink>

        {isLoggedIn && (
          <NavLink to="/main" className={linkClass}>Browse</NavLink>
        )}
        {isLoggedIn && (
          <NavLink to="/orders" className={linkClass}>Orders</NavLink>
        )}
        {isOwner && (
          <NavLink to="/owner" className={linkClass} style={{ color: '#ff5c00' }}>
            Owner
          </NavLink>
        )}
        {isAdmin && (
          <NavLink to="/admin" className={linkClass} style={{ color: '#ff5c00' }}>
            Admin
          </NavLink>
        )}
      </div>

      {/* Auth / Cart */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
        {isLoggedIn ? (
          <>
            {/* Cart */}
            <NavLink
              to="/cart"
              style={{ position: 'relative', textDecoration: 'none' }}
            >
              <button
                style={{
                  background: 'transparent',
                  border: '1px solid #2a2a2a',
                  color: '#f0ede6',
                  padding: '6px 14px',
                  borderRadius: 50,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#ff5c00'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
              >
                🛒 Cart
                {totalCount > 0 && (
                  <span
                    style={{
                      background: '#ff5c00',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {totalCount}
                  </span>
                )}
              </button>
            </NavLink>

            {/* User greeting */}
            <span style={{ fontSize: 13, color: '#888' }}>
              Hi, {user?.name?.split(' ')[0]}
            </span>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid #2a2a2a',
                color: '#888',
                padding: '6px 14px',
                borderRadius: 50,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button
                style={{
                  background: 'transparent',
                  border: '1px solid #2a2a2a',
                  color: '#f0ede6',
                  padding: '6px 16px',
                  borderRadius: 50,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#ff5c00'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
              >
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button
                style={{
                  background: '#ff5c00',
                  border: 'none',
                  color: '#fff',
                  padding: '7px 16px',
                  borderRadius: 50,
                  fontSize: 13,
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#ff7a2b'}
                onMouseLeave={e => e.currentTarget.style.background = '#ff5c00'}
              >
                Sign up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
