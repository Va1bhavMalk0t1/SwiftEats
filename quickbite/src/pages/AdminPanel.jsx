import { useState } from 'react'
import { adminAPI } from '../api'
import { useToast } from '../context/ToastContext'

export default function AdminPanel() {
  const toast = useToast()
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState('')
  const [lastAction, setLastAction] = useState(null)

  const handleMakeAdmin = async () => {
    if (!userId.trim()) return
    setLoading('admin')
    try {
      await adminAPI.makeAdmin(userId)
      toast.success(`User #${userId} is now an Admin`)
      setLastAction({ userId, role: 'admin', time: new Date().toLocaleTimeString() })
      setUserId('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role')
    } finally {
      setLoading('')
    }
  }

  const handleMakeOwner = async () => {
    if (!userId.trim()) return
    setLoading('owner')
    try {
      await adminAPI.makeOwner(userId)
      toast.success(`User #${userId} is now an Owner`)
      setLastAction({ userId, role: 'owner', time: new Date().toLocaleTimeString() })
      setUserId('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role')
    } finally {
      setLoading('')
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span
            style={{
              background: 'rgba(255,92,0,0.1)',
              color: '#ff5c00',
              borderRadius: 50,
              padding: '3px 12px',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Admin
          </span>
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
          Admin Panel
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>Manage user roles and permissions</p>
      </div>

      {/* Role Manager Card */}
      <div
        style={{
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: 20,
          padding: 28,
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
          Assign Role
        </h2>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 24, lineHeight: 1.5 }}>
          Enter a user ID to upgrade their role. Admin has full platform access.
          Owner can manage restaurants and food items.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>
            User ID
          </label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g. 42"
            min="1"
            style={{ width: '100%', padding: '11px 14px', fontSize: 15 }}
            onKeyDown={(e) => e.key === 'Enter' && userId && handleMakeAdmin()}
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleMakeAdmin}
            disabled={!userId || !!loading}
            style={{
              flex: 1,
              padding: '12px',
              background: !userId || loading ? '#2a2a2a' : '#ff5c00',
              color: !userId || loading ? '#555' : '#fff',
              border: 'none',
              borderRadius: 50,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 13,
              cursor: !userId || loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { if (userId && !loading) e.currentTarget.style.background = '#ff7a2b' }}
            onMouseLeave={e => { if (userId && !loading) e.currentTarget.style.background = '#ff5c00' }}
          >
            {loading === 'admin' ? 'Updating...' : '⬆ Make Admin'}
          </button>

          <button
            onClick={handleMakeOwner}
            disabled={!userId || !!loading}
            style={{
              flex: 1,
              padding: '12px',
              background: 'transparent',
              color: !userId || loading ? '#555' : '#f0ede6',
              border: `1px solid ${!userId || loading ? '#2a2a2a' : '#444'}`,
              borderRadius: 50,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 600,
              fontSize: 13,
              cursor: !userId || loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (userId && !loading) { e.currentTarget.style.borderColor = '#ff5c00'; e.currentTarget.style.color = '#ff5c00' } }}
            onMouseLeave={e => { if (userId && !loading) { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#f0ede6' } }}
          >
            {loading === 'owner' ? 'Updating...' : '🏪 Make Owner'}
          </button>
        </div>
      </div>

      {/* Last action */}
      {lastAction && (
        <div
          style={{
            background: 'rgba(34,197,94,0.07)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 14,
            padding: '14px 18px',
            fontSize: 13,
            color: '#86efac',
            animation: 'fadeIn 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 16 }}>✓</span>
          User #{lastAction.userId} assigned <strong>{lastAction.role}</strong> role at {lastAction.time}
        </div>
      )}

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 28 }}>
        {[
          {
            role: 'Admin',
            icon: '⚡',
            perms: ['Full platform access', 'Manage all users', 'View all data', 'Assign roles'],
          },
          {
            role: 'Owner',
            icon: '🏪',
            perms: ['Create restaurants', 'Add food items', 'Update menu', 'Manage own data'],
          },
        ].map(({ role, icon, perms }) => (
          <div
            key={role}
            style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 14,
              padding: 18,
            }}
          >
            <div
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: 14,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {icon} {role}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {perms.map((p) => (
                <li key={p} style={{ fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#ff5c00', fontSize: 10 }}>●</span> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
