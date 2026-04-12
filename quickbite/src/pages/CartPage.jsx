import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function CartPage() {
  const { items, addItem, removeItem, deleteItem, clearCart, totalPrice, totalCount } = useCart()
  const toast = useToast()
  const [ordered, setOrdered] = useState(false)
  const [placing, setPlacing] = useState(false)

  const handleCheckout = async () => {
    setPlacing(true)
    // Simulate order placement delay
    await new Promise((res) => setTimeout(res, 1200))
    clearCart()
    setOrdered(true)
    setPlacing(false)
    toast.success('Order placed successfully! 🎉')
  }

  // Order success screen
  if (ordered) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 60px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
          animation: 'slideUp 0.4s ease',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
        <h2
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          Order Placed!
        </h2>
        <p style={{ color: '#888', fontSize: 15, maxWidth: 360, lineHeight: 1.6, marginBottom: 32 }}>
          Your food is being prepared with love. Estimated delivery: 20–30 minutes.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setOrdered(false)}
            style={{
              background: '#ff5c00',
              color: '#fff',
              border: 'none',
              padding: '12px 28px',
              borderRadius: 50,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#ff7a2b'}
            onMouseLeave={e => e.currentTarget.style.background = '#ff5c00'}
          >
            Order More
          </button>
          <Link to="/main">
            <button
              style={{
                background: 'transparent',
                color: '#f0ede6',
                border: '1px solid #2a2a2a',
                padding: '12px 28px',
                borderRadius: 50,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff5c00'; e.currentTarget.style.color = '#ff5c00' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#f0ede6' }}
            >
              Browse More Food
            </button>
          </Link>
        </div>
      </div>
    )
  }

  // Empty cart
  if (totalCount === 0) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 60px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 16 }}>🛒</div>
        <h2
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Your cart is empty
        </h2>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 28 }}>
          Add some delicious items to get started
        </p>
        <Link to="/main">
          <button
            style={{
              background: '#ff5c00',
              color: '#fff',
              border: 'none',
              padding: '12px 28px',
              borderRadius: 50,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Browse Food →
          </button>
        </Link>
      </div>
    )
  }

  const deliveryFee = 0
  const taxes = Math.round(totalPrice * 0.05)
  const grandTotal = totalPrice + taxes + deliveryFee

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}
      >
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 28,
            fontWeight: 800,
          }}
        >
          Your Cart
          <span style={{ fontSize: 18, color: '#888', fontFamily: 'DM Sans, sans-serif', fontWeight: 400, marginLeft: 10 }}>
            ({totalCount} item{totalCount !== 1 ? 's' : ''})
          </span>
        </h1>
        <button
          onClick={() => { clearCart(); toast.info('Cart cleared') }}
          style={{
            background: 'transparent',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444',
            padding: '6px 14px',
            borderRadius: 50,
            fontSize: 12,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          Clear all
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) 300px',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* Cart Items */}
        <div
          style={{
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          {items.map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 20px',
                borderBottom: idx < items.length - 1 ? '1px solid #222' : 'none',
              }}
            >
              {/* Food icon */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  background: '#222',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '🍽️'}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#f0ede6',
                    marginBottom: 3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.name}
                </div>
                <div style={{ fontSize: 12, color: '#888' }}>₹{item.price} each</div>
              </div>

              {/* Qty Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    background: '#222',
                    border: '1px solid #333',
                    color: '#f0ede6',
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#ff5c00'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
                >
                  −
                </button>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    minWidth: 24,
                    textAlign: 'center',
                    fontFamily: 'Syne, sans-serif',
                  }}
                >
                  {item.qty}
                </span>
                <button
                  onClick={() => addItem(item)}
                  style={{
                    background: '#222',
                    border: '1px solid #333',
                    color: '#f0ede6',
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#ff5c00'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
                >
                  +
                </button>
              </div>

              {/* Line total */}
              <div
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  color: '#ff5c00',
                  fontSize: 15,
                  minWidth: 60,
                  textAlign: 'right',
                }}
              >
                ₹{(item.price * item.qty).toFixed(0)}
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteItem(item.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#555',
                  cursor: 'pointer',
                  fontSize: 16,
                  padding: 4,
                  transition: 'color 0.2s',
                  lineHeight: 1,
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = '#555'}
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div
          style={{
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: 16,
            padding: 24,
            position: 'sticky',
            top: 80,
          }}
        >
          <h3
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              marginBottom: 20,
              color: '#f0ede6',
            }}
          >
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888' }}>
              <span>Subtotal ({totalCount} items)</span>
              <span>₹{totalPrice.toFixed(0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888' }}>
              <span>Delivery fee</span>
              <span style={{ color: '#22c55e' }}>Free</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888' }}>
              <span>Taxes (5%)</span>
              <span>₹{taxes}</span>
            </div>
          </div>

          <div
            style={{
              height: 1,
              background: '#2a2a2a',
              margin: '16px 0',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 18,
              marginBottom: 20,
            }}
          >
            <span>Total</span>
            <span style={{ color: '#ff5c00' }}>₹{grandTotal.toFixed(0)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={placing}
            style={{
              width: '100%',
              padding: '14px',
              background: placing ? '#333' : '#ff5c00',
              color: '#fff',
              border: 'none',
              borderRadius: 50,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 15,
              cursor: placing ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onMouseEnter={e => { if (!placing) e.currentTarget.style.background = '#ff7a2b' }}
            onMouseLeave={e => { if (!placing) e.currentTarget.style.background = '#ff5c00' }}
          >
            {placing ? (
              <>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block',
                  }}
                />
                Placing Order...
              </>
            ) : (
              'Place Order →'
            )}
          </button>

          <p style={{ fontSize: 11, color: '#555', textAlign: 'center', marginTop: 12 }}>
            This is a simulated checkout for demo purposes
          </p>
        </div>
      </div>
    </div>
  )
}
