import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderAPI } from '../api'
import Spinner from '../components/Spinner'

const STATUS_STYLES = {
  Pending:    { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b',  border: 'rgba(245,158,11,0.25)',  label: 'Pending' },
  Confirmed:  { bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6',  border: 'rgba(59,130,246,0.25)',  label: 'Confirmed' },
  Preparing:  { bg: 'rgba(168,85,247,0.12)',  color: '#a855f7',  border: 'rgba(168,85,247,0.25)',  label: 'Preparing' },
  "Out for delivery" : { bg: 'rgba(255,92,0,0.12)',    color: '#ff5c00',  border: 'rgba(255,92,0,0.25)',    label: 'On the way' },
  Delivered:  { bg: 'rgba(34,197,94,0.12)',   color: '#22c55e',  border: 'rgba(34,197,94,0.25)',   label: 'Delivered' },
  Cancelled:  { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444',  border: 'rgba(239,68,68,0.25)',   label: 'Cancelled' },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Pending
  return (
    <span style={{
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      borderRadius: 50, padding: '3px 12px', fontSize: 12, fontWeight: 500,
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
      {s.label}
    </span>
  )
}

// ── Order Detail Modal ────────────────────────────────────────────────────────
function OrderModal({ orderId, onClose }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    orderAPI.getById(orderId)
      .then((res) => setOrder(res.data?.data))
      .catch(() => setError('Failed to load order details'))
      .finally(() => setLoading(false))
  }, [orderId])

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, animation: 'fadeIn 0.2s ease',
      }}
    >
      <div style={{
        background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 20,
        padding: 28, maxWidth: 500, width: '100%',
        maxHeight: '80vh', overflowY: 'auto',
        animation: 'slideUp 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
              Order #{orderId}
            </h3>
            {order && <StatusBadge status={order.status || 'pending'} />}
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1px solid #333', color: '#888',
            width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#888' }}>
            ✕
          </button>
        </div>

        {loading && <Spinner />}
        {error && <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>{error}</p>}

        {order && !loading && (
          <>
            {/* Delivery address */}
            {order.delivery_address && (
              <div style={{
                background: '#222', borderRadius: 10, padding: '12px 14px', marginBottom: 20,
                fontSize: 13, color: '#888', lineHeight: 1.5,
              }}>
                <span style={{ color: '#f0ede6', fontWeight: 500 }}>📍 Deliver to: </span>
                {order.delivery_address}
              </div>
            )}

            {/* Items */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Items
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#222', borderRadius: 12, overflow: 'hidden' }}>
                {(order.items || []).map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderBottom: idx < order.items.length - 1 ? '1px solid #2a2a2a' : 'none',
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#f0ede6', marginBottom: 2 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>₹{item.price} × {item.quantity}</div>
                    </div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#ff5c00', fontSize: 14 }}>
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 17,
              padding: '14px 0', borderTop: '1px solid #2a2a2a',
            }}>
              <span>Total Paid</span>
              <span style={{ color: '#ff5c00' }}>₹{Number(order.total_amount || 0).toFixed(0)}</span>
            </div>

            {order.created_at && (
              <p style={{ fontSize: 12, color: '#555', marginTop: 8, textAlign: 'right' }}>
                Placed on {new Date(order.created_at).toLocaleString()}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── Main Orders Page ──────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    orderAPI.getAll()
      .then((res) => setOrders(res.data?.data || []))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
            My Orders
          </h1>
          <p style={{ color: '#888', fontSize: 14 }}>
            {orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? 's' : ''}` : 'Your order history'}
          </p>
        </div>
        <button onClick={() => navigate('/main')} style={{
          background: '#ff5c00', color: '#fff', border: 'none',
          padding: '9px 20px', borderRadius: 50,
          fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#ff7a2b'}
        onMouseLeave={e => e.currentTarget.style.background = '#ff5c00'}>
          + New Order
        </button>
      </div>

      {loading && <Spinner />}

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          color: '#fca5a5', padding: '12px 16px', borderRadius: 10, fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {!loading && orders.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: '#f0ede6', marginBottom: 8 }}>
            No orders yet
          </h3>
          <p style={{ fontSize: 14, marginBottom: 24 }}>Your order history will appear here</p>
          <button onClick={() => navigate('/main')} style={{
            background: '#ff5c00', color: '#fff', border: 'none',
            padding: '11px 26px', borderRadius: 50,
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>
            Browse Food →
          </button>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrderId(order.id)}
              style={{
                background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 16,
                padding: '20px 22px', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff5c00'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                {/* Left: order info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15 }}>
                      Order #{order.id}
                    </span>
                    <StatusBadge status={order.status || 'Pending'} />
                  </div>

                  {order.delivery_address && (
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 8, maxWidth: 360 }}>
                      📍 {order.delivery_address}
                    </div>
                  )}

                  {/* Item names preview */}
                  {order.items && order.items.length > 0 && (
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {order.items.slice(0, 2).map(i => i.name).join(', ')}
                      {order.items.length > 2 && ` +${order.items.length - 2} more`}
                    </div>
                  )}
                </div>

                {/* Right: amount + date */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: '#ff5c00', marginBottom: 4 }}>
                    ₹{Number(order.total_amount || 0).toFixed(0)}
                  </div>
                  {order.created_at && (
                    <div style={{ fontSize: 11, color: '#555' }}>
                      {new Date(order.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: '#ff5c00', marginTop: 6 }}>View details →</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <OrderModal orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
      )}
    </div>
  )
}
