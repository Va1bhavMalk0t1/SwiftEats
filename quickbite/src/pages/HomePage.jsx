import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const STATS = [
  { value: '500+', label: 'Restaurants' },
  { value: '20 min', label: 'Avg Delivery' },
  { value: '4.8 ★', label: 'User Rating' },
]

const FEATURES = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    desc: 'Real-time order tracking from kitchen to your door. Average delivery in 20 minutes.',
  },
  {
    icon: '🍽️',
    title: '500+ Restaurants',
    desc: 'Discover the best local restaurants, curated for quality and taste.',
  },
  {
    icon: '💳',
    title: 'Easy Payments',
    desc: 'Pay securely with cards, UPI, or cash on delivery. No hidden charges.',
  },
  {
    icon: '🎁',
    title: 'Exclusive Deals',
    desc: 'Get special discounts and free delivery on your first order.',
  },
]

export default function HomePage() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d' }}>
      {/* Hero */}
      <section
        style={{
          minHeight: 'calc(100vh - 60px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '60px 24px 40px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,92,0,0.08) 0%, transparent 70%)',
        }}
      >
        {/* Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,92,0,0.1)',
            border: '1px solid rgba(255,92,0,0.2)',
            borderRadius: 50,
            padding: '5px 16px',
            marginBottom: 28,
            fontSize: 13,
            color: '#ff5c00',
            animation: 'fadeIn 0.6s ease',
          }}
        >
          🍕 Free delivery on your first order
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(40px, 7vw, 90px)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-2px',
            marginBottom: 20,
            animation: 'slideUp 0.6s ease 0.1s both',
          }}
        >
          Food you love,
          <br />
          <span style={{ color: '#ff5c00' }}>delivered fast</span>
        </h1>

        <p
          style={{
            fontSize: 17,
            color: '#888',
            maxWidth: 520,
            lineHeight: 1.65,
            marginBottom: 36,
            animation: 'slideUp 0.6s ease 0.2s both',
          }}
        >
          Discover the best restaurants and dishes in your city.
          Order in minutes, eat in joy.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            justifyContent: 'center',
            animation: 'slideUp 0.6s ease 0.3s both',
          }}
        >
          <button
            onClick={() => navigate(isLoggedIn ? '/main' : '/signup')}
            style={{
              background: '#ff5c00',
              color: '#fff',
              border: 'none',
              padding: '14px 32px',
              borderRadius: 50,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 0 0 0 rgba(255,92,0,0.4)',
              animation: 'pulse-orange 2.5s infinite',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ff7a2b'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#ff5c00'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Order Now →
          </button>
          <button
            onClick={() => navigate('/restaurants')}
            style={{
              background: 'transparent',
              color: '#f0ede6',
              border: '1px solid #2a2a2a',
              padding: '14px 32px',
              borderRadius: 50,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff5c00'; e.currentTarget.style.color = '#ff5c00' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#f0ede6' }}
          >
            Browse Restaurants
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: 48,
            marginTop: 64,
            animation: 'slideUp 0.6s ease 0.4s both',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#f0ede6',
                  marginBottom: 4,
                }}
              >
                {value}
              </div>
              <div style={{ fontSize: 13, color: '#888' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            Why <span style={{ color: '#ff5c00' }}>QuickBite?</span>
          </h2>
          <p style={{ color: '#888', fontSize: 15 }}>Everything you need for a great meal, every time.</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 20,
          }}
        >
          {FEATURES.map(({ icon, title, desc }) => (
            <div
              key={title}
              style={{
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: 16,
                padding: 24,
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,92,0,0.4)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
              <div
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: 16,
                  marginBottom: 8,
                  color: '#f0ede6',
                }}
              >
                {title}
              </div>
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section
        style={{
          margin: '0 24px 80px',
          background: 'linear-gradient(135deg, rgba(255,92,0,0.15), rgba(255,92,0,0.05))',
          border: '1px solid rgba(255,92,0,0.2)',
          borderRadius: 24,
          padding: '48px 32px',
          textAlign: 'center',
          maxWidth: 1052,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <h2
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          Ready to order?
        </h2>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 14 }}>
          {isLoggedIn ? 'Pick your favourite food and we\'ll get it to you fast.' : 'Create your account and get 20% off your first order.'}
        </p>
        <button
          onClick={() => navigate(isLoggedIn ? '/main' : '/signup')}
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
          {isLoggedIn ? 'Browse Food →' : 'Get Started Free →'}
        </button>
      </section>
    </div>
  )
}
