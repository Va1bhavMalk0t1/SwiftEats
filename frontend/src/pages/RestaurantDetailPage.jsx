import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { restaurantAPI } from '../api'
import FoodCard from '../components/FoodCard'
import Spinner from '../components/Spinner'

export default function RestaurantDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([restaurantAPI.getById(id), restaurantAPI.getMenu(id)])
      .then(([rRes, mRes]) => {
        setRestaurant(rRes.data.data)
        setMenu(mRes.data.data || [])
      })
      .catch(() => setError('Failed to load restaurant details.'))
      .finally(() => setLoading(false))
  }, [id])

  // Group menu by category
  const grouped = menu.reduce((acc, item) => {
    const cat = item.category || 'Others'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  if (loading) return <Spinner fullPage />

  if (error || !restaurant) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: '#888' }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>😕</div>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, color: '#f0ede6', marginBottom: 8 }}>
          Restaurant not found
        </h3>
        <p style={{ marginBottom: 24, fontSize: 14 }}>{error}</p>
        <button
          onClick={() => navigate('/restaurants')}
          style={{
            background: '#ff5c00',
            color: '#fff',
            border: 'none',
            padding: '10px 24px',
            borderRadius: 50,
            fontFamily: 'Syne, sans-serif',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Back to Restaurants
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/restaurants')}
        style={{
          background: 'transparent',
          border: '1px solid #2a2a2a',
          color: '#888',
          padding: '7px 16px',
          borderRadius: 50,
          fontSize: 13,
          cursor: 'pointer',
          marginBottom: 24,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff5c00'; e.currentTarget.style.color = '#ff5c00' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888' }}
      >
        ← Back to Restaurants
      </button>

      {/* Restaurant Info Card */}
      <div
        style={{
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: 20,
          padding: '28px 28px',
          marginBottom: 36,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 'clamp(22px, 4vw, 30px)',
                fontWeight: 800,
                marginBottom: 8,
                color: '#f0ede6',
              }}
            >
              {restaurant.name}
            </h1>

            {restaurant.description && (
              <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6, marginBottom: 16, maxWidth: 600 }}>
                {restaurant.description}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13, color: '#888' }}>
              {restaurant.city && (
                <span>
                  📍 {[restaurant.address, restaurant.city, restaurant.state].filter(Boolean).join(', ')}
                </span>
              )}
              {restaurant.phone && <span>📞 {restaurant.phone}</span>}
              {restaurant.email && <span>✉️ {restaurant.email}</span>}
              {restaurant.opening_time && (
                <span>⏰ {restaurant.opening_time} – {restaurant.closing_time}</span>
              )}
            </div>
          </div>

          {/* Open/Closed status */}
          <div>
            <span
              style={{
                background: restaurant.is_open ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                color: restaurant.is_open ? '#22c55e' : '#ef4444',
                border: `1px solid ${restaurant.is_open ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                borderRadius: 50,
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: restaurant.is_open ? '#22c55e' : '#ef4444',
                }}
              />
              {restaurant.is_open ? 'Open Now' : 'Closed'}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 22,
            fontWeight: 700,
            color: '#f0ede6',
          }}
        >
          Menu
        </h2>
        <span style={{ fontSize: 13, color: '#888' }}>{menu.length} items</span>
      </div>

      {menu.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
          <p>No menu items available right now</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, foods]) => (
          <div key={category} style={{ marginBottom: 40 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 18,
                paddingBottom: 12,
                borderBottom: '1px solid #2a2a2a',
              }}
            >
              <h3
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: 17,
                  color: '#f0ede6',
                }}
              >
                {category}
              </h3>
              <span
                style={{
                  background: 'rgba(255,92,0,0.1)',
                  color: '#ff5c00',
                  borderRadius: 50,
                  padding: '2px 10px',
                  fontSize: 11,
                }}
              >
                {foods.length}
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 16,
              }}
            >
              {foods.map((food) => (
                <FoodCard key={food.id} item={food} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
