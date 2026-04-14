import { useState, useEffect, useCallback, useRef } from 'react'
import { adminAPI } from '../api'
import { useToast } from '../context/ToastContext'

// ─── Status config ────────────────────────────────────────────────────────────
// Matches actual DB enum: 'pending','confirmed','preparing','on_the_way','delivered','cancelled'
const VALID_STATUSES = {
  PENDING:    "Pending",
  CONFIRMED:  "Confirmed",
  PREPARING:  "Preparing",
  ON_THE_WAY: "Out for Delivery",
  DELIVERED:  "Delivered",
  CANCELLED:  "Cancelled",
}
const VALID_STATUS_VALUES = Object.values(VALID_STATUSES);
const STATUS_CONFIG = {
  [VALID_STATUSES.PENDING]: {
    bg: 'rgba(136,136,136,0.12)',
    color: '#888',
    border: 'rgba(136,136,136,0.25)',
    label: 'Pending'
  },
  [VALID_STATUSES.CONFIRMED]: {
    bg: 'rgba(168,85,247,0.12)',
    color: '#a855f7',
    border: 'rgba(168,85,247,0.25)',
    label: 'Confirmed'
  },
  [VALID_STATUSES.PREPARING]: {
    bg: 'rgba(255,92,0,0.12)',
    color: '#ff5c00',
    border: 'rgba(255,92,0,0.25)',
    label: 'Preparing'
  },
  [VALID_STATUSES.ON_THE_WAY]: {
    bg: 'rgba(59,130,246,0.12)',
    color: '#3b82f6',
    border: 'rgba(59,130,246,0.25)',
    label: 'Out for Delivery'
  },
  [VALID_STATUSES.DELIVERED]: {
    bg: 'rgba(34,197,94,0.12)',
    color: '#22c55e',
    border: 'rgba(34,197,94,0.25)',
    label: 'Delivered'
  },
  [VALID_STATUSES.CANCELLED]: {
    bg: 'rgba(239,68,68,0.12)',
    color: '#ef4444',
    border: 'rgba(239,68,68,0.25)',
    label: 'Cancelled'
  },
}

const NEXT_STATUSES = [
  { value: VALID_STATUSES.CONFIRMED,  label: '✅ Confirmed' },
  { value: VALID_STATUSES.PREPARING,  label: '🔥 Preparing' },
  { value: VALID_STATUSES.ON_THE_WAY, label: '🚴 On the Way' },
  { value: VALID_STATUSES.DELIVERED,  label: '📦 Delivered' },
  { value: VALID_STATUSES.CANCELLED,  label: '❌ Cancelled' },
]

function StatusBadge({ status }) {
  const currentStatus = status || VALID_STATUSES.PENDING
  const s = STATUS_CONFIG[currentStatus] || STATUS_CONFIG[VALID_STATUSES.PENDING]

  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 50, padding: '3px 12px', fontSize: 11, fontWeight: 500,
      display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
      {s.label}
    </span>
  )
}

function OrderCard({ order, onStatusUpdate, updatingId }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const isUpdating = updatingId === order.id
  // Fix: Track the dropdown container so outside clicks can close it
  const dropdownRef = useRef(null)

  // Fix: Close dropdown when user clicks outside of it
  useEffect(() => {
    if (!dropdownOpen) return

    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [dropdownOpen])

  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14,
      padding: '18px 20px', transition: 'border-color 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#f0ede6' }}>
              Order #{order.id}
            </span>
            <StatusBadge status={order.status} />
          </div>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, color: '#888' }}>
            <span>👤 User #{order.user_id}</span>
            <span style={{ color: '#ff5c00', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
              ₹{Number(order.total_amount || 0).toLocaleString()}
            </span>
            {order.delivery_address && (
              <span style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                📍 {order.delivery_address}
              </span>
            )}
            <span>🕐 {new Date(order.created_at).toLocaleString()}</span>
          </div>
        </div>

        {/* Fix: Attach ref to the dropdown wrapper for outside-click detection */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          {[VALID_STATUSES.DELIVERED, VALID_STATUSES.CANCELLED].includes(order.status) ? (
            <span style={{ fontSize: 12, color: order.status === VALID_STATUSES.DELIVERED ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
              {order.status === VALID_STATUSES.DELIVERED ? 'Completed' : 'Cancelled'}
            </span>
          ) : (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                disabled={isUpdating}
                style={{
                  background: 'transparent', border: '1px solid #333', color: '#f0ede6',
                  padding: '7px 14px', borderRadius: 50, fontSize: 12, cursor: 'pointer'
                }}
              >
                {isUpdating ? 'Updating...' : 'Update Status ▾'}
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '110%', background: '#1f1f1f',
                  border: '1px solid #333', borderRadius: 12, zIndex: 10, minWidth: 160, overflow: 'hidden'
                }}>
                  {NEXT_STATUSES.filter(s => s.value !== order.status && order.status !== VALID_STATUSES.CANCELLED).map((s) => (
                    <button
                      key={`${order.id}-${s.value}`}
                      onClick={() => { setDropdownOpen(false); onStatusUpdate(order.id, s.value) }}
                      style={{
                        display: 'block', width: '100%', padding: '10px', textAlign: 'left',
                        background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer'
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const toast = useToast()

  // Role State
  const [userId, setUserId] = useState('')
  const [roleLoading, setRoleLoading] = useState('')

  // Order State
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminAPI.getOrders()
      setOrders(res.data?.data || [])
    } catch (err) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchOrders() }, [fetchOrders])


  const updateOrderStatus = async (orderId, newStatus) => {
  console.log("🔥 Sending status:", newStatus);

  if (!VALID_STATUS_VALUES.includes(newStatus)) {
    toast.error("Invalid status sent: " + newStatus);
    return;
  }

  setUpdatingId(orderId);

  try {
    await adminAPI.updateOrder(orderId, { status: newStatus });

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );

    toast.success(`Order #${orderId} updated!`);
  } catch (err) {
    console.error("❌ FULL ERROR:", err);
    toast.error(err.response?.data?.message || 'Server error updating status');
  } finally {
    setUpdatingId(null);
  }
};

  // Fix: Validate userId is a real positive integer before hitting the API
  const getValidatedUserId = () => {
    const parsed = parseInt(userId, 10)
    if (isNaN(parsed) || parsed <= 0 || String(parsed) !== String(userId).trim()) {
      toast.error('Please enter a valid positive integer User ID')
      return null
    }
    return parsed
  }

  // Fix: Added confirmation dialog — role promotion is irreversible and shouldn't fire on a mistype
  const handleMakeAdmin = async () => {
    const id = getValidatedUserId()
    if (!id) return
    if (!window.confirm(`Are you sure you want to make User #${id} an Admin?`)) return

    setRoleLoading('admin')
    try {
      await adminAPI.makeAdmin(id)
      toast.success(`User #${id} is now Admin`)
      setUserId('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setRoleLoading('')
    }
  }

  // Fix: Same validation + confirmation for owner promotion
  const handleMakeOwner = async () => {
    const id = getValidatedUserId()
    if (!id) return
    if (!window.confirm(`Are you sure you want to make User #${id} an Owner?`)) return

    setRoleLoading('owner')
    try {
      await adminAPI.makeOwner(id)
      toast.success(`User #${id} is now Owner`)
      setUserId('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setRoleLoading('')
    }
  }

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(o => (o.status || VALID_STATUSES.PENDING) === statusFilter)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontFamily: 'Syne, sans-serif', color: '#fff', marginBottom: 20 }}>Admin Panel</h1>

      {/* Role Management Section */}
      <div style={{ background: '#1a1a1a', padding: 20, borderRadius: 14, marginBottom: 30, border: '1px solid #2a2a2a' }}>
        <h2 style={{ fontSize: 16, marginBottom: 15 }}>Manage User Roles</h2>
        <input
          type="number"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          placeholder="User ID"
          min="1"
          style={{ width: '100%', padding: '10px', marginBottom: 15, borderRadius: 8, background: '#000', border: '1px solid #333', color: '#fff' }}
        />
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleMakeAdmin}
            disabled={!userId || !!roleLoading}
            style={{ flex: 1, padding: '10px', background: '#ff5c00', border: 'none', color: '#fff', borderRadius: 8, cursor: 'pointer' }}
          >
            {roleLoading === 'admin' ? 'Updating...' : 'Make Admin'}
          </button>
          <button
            onClick={handleMakeOwner}
            disabled={!userId || !!roleLoading}
            style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #444', color: '#fff', borderRadius: 8, cursor: 'pointer' }}
          >
            {roleLoading === 'owner' ? 'Updating...' : 'Make Owner'}
          </button>
        </div>
      </div>

      {/* Order Management Section */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, overflowX: 'auto' }}>
        <button
          onClick={() => setStatusFilter('all')}
          style={{ padding: '5px 15px', borderRadius: 20, background: statusFilter === 'all' ? '#ff5c00' : '#222', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          All
        </button>
        {Object.values(VALID_STATUSES).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{ padding: '5px 15px', borderRadius: 20, background: statusFilter === s ? '#ff5c00' : '#222', color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#888' }}>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p style={{ color: '#888' }}>No orders found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} onStatusUpdate={updateOrderStatus} updatingId={updatingId} />
          ))}
        </div>
      )}
    </div>
  )
}
