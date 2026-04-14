import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(80px, 15vw, 140px)',
          fontWeight: 800,
          color: '#1a1a1a',
          lineHeight: 1,
          marginBottom: 8,
          userSelect: 'none',
        }}
      >
        404
      </div>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🍽️</div>
      <h2
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 10,
          color: '#f0ede6',
        }}
      >
        Page not found
      </h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 32, maxWidth: 320 }}>
        Looks like this page went out for delivery and never came back.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/">
          <button
            style={{
              background: '#ff5c00',
              color: '#fff',
              border: 'none',
              padding: '11px 26px',
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
            Go Home
          </button>
        </Link>
        <Link to="/main">
          <button
            style={{
              background: 'transparent',
              color: '#f0ede6',
              border: '1px solid #2a2a2a',
              padding: '11px 26px',
              borderRadius: 50,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff5c00'; e.currentTarget.style.color = '#ff5c00' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#f0ede6' }}
          >
            Browse Food
          </button>
        </Link>
      </div>
    </div>
  )
}
