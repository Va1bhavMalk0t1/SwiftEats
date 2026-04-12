import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const FOOD_EMOJIS = {
  pizza: '🍕', burger: '🍔', biryani: '🍛', dessert: '🍰',
  cake: '🎂', drinks: '🥤', coffee: '☕', sushi: '🍣',
  pasta: '🍝', salad: '🥗', sandwich: '🥪', noodles: '🍜',
  chicken: '🍗', fish: '🐟', rice: '🍚', soup: '🍲',
  default: '🍽️',
}

function getCategoryEmoji(category) {
  if (!category) return FOOD_EMOJIS.default
  const key = Object.keys(FOOD_EMOJIS).find((k) =>
    category.toLowerCase().includes(k)
  )
  return FOOD_EMOJIS[key] || FOOD_EMOJIS.default
}

export default function FoodCard({ item }) {
  const { addItem, removeItem, getItemQty } = useCart()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)
  const qty = getItemQty(item.id)
  const emoji = getCategoryEmoji(item.category)

  const handleAdd = () => {
    if (!isLoggedIn) { navigate('/login'); return }
    addItem(item)
  }

  return (
    <div
      style={{
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'transform 0.2s, border-color 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#444' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#2a2a2a' }}
    >
      {/* Image / Placeholder */}
      {item.image_url && !imgError ? (
        <img
          src={item.image_url}
          alt={item.name}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: 160, objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: 160,
            background: 'linear-gradient(135deg, #1f1f1f, #2a2a2a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
          }}
        >
          {emoji}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 600,
            fontSize: 15,
            marginBottom: 4,
            color: '#f0ede6',
          }}
        >
          {item.name}
        </div>

        {item.category && (
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(255,92,0,0.1)',
              color: '#ff5c00',
              borderRadius: 50,
              padding: '2px 10px',
              fontSize: 11,
              marginBottom: 8,
              width: 'fit-content',
            }}
          >
            {item.category}
          </span>
        )}

        {item.description && (
          <p
            className="line-clamp-2"
            style={{ fontSize: 12, color: '#888', marginBottom: 12, lineHeight: 1.5, flex: 1 }}
          >
            {item.description}
          </p>
        )}

        {/* Price + Add to Cart */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              color: '#ff5c00',
              fontSize: 16,
            }}
          >
            ₹{item.price}
          </span>

          {qty === 0 ? (
            <button
              onClick={handleAdd}
              style={{
                background: '#ff5c00',
                color: '#fff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 50,
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#ff7a2b'}
              onMouseLeave={e => e.currentTarget.style.background = '#ff5c00'}
            >
              Add +
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  background: '#222',
                  border: '1px solid #333',
                  color: '#f0ede6',
                  width: 28,
                  height: 28,
                  borderRadius: 6,
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
              <span style={{ fontSize: 14, fontWeight: 500, minWidth: 20, textAlign: 'center' }}>{qty}</span>
              <button
                onClick={() => addItem(item)}
                style={{
                  background: '#222',
                  border: '1px solid #333',
                  color: '#f0ede6',
                  width: 28,
                  height: 28,
                  borderRadius: 6,
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
          )}
        </div>
      </div>
    </div>
  )
}
