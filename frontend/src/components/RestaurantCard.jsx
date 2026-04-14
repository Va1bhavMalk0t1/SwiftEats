import { useNavigate } from 'react-router-dom'

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
      style={{
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#555' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#2a2a2a' }}
    >
      {/* Image placeholder */}
      <div
        style={{
          width: '100%',
          height: 180,
          background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 52,
          position: 'relative',
        }}
      >
        🍽️
        {/* Open/Closed badge */}
        <span
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: restaurant.is_open ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
            color: restaurant.is_open ? '#22c55e' : '#ef4444',
            border: `1px solid ${restaurant.is_open ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: 50,
            padding: '3px 10px',
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          {restaurant.is_open ? 'Open' : 'Closed'}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: 16 }}>
        <div
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 16,
            marginBottom: 6,
            color: '#f0ede6',
          }}
        >
          {restaurant.name}
        </div>

        {restaurant.description && (
          <p
            className="line-clamp-2"
            style={{ fontSize: 12, color: '#888', marginBottom: 10, lineHeight: 1.5 }}
          >
            {restaurant.description}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 12, color: '#888' }}>
          {restaurant.city && (
            <span>📍 {restaurant.address ? `${restaurant.address}, ` : ''}{restaurant.city}</span>
          )}
          {restaurant.opening_time && restaurant.closing_time && (
            <span>⏰ {restaurant.opening_time} – {restaurant.closing_time}</span>
          )}
          {restaurant.phone && <span>📞 {restaurant.phone}</span>}
        </div>
      </div>
    </div>
  )
}
