import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchAPI } from '../api'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/Spinner'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { addItem } = useCart()
  const toast = useToast()

  const handleSearch = async (e) => {
    e?.preventDefault()
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setError('')
    try {
      const res = await searchAPI.search({ search: q, limit: 10 })
      setResults(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const restaurants = results?.filter((r) => r.type === 'restaurant') || []
  const foods = results?.filter((r) => r.type === 'food') || []

  const handleAddFood = (food) => {
    addItem({ ...food, restaurant_id: food.restaurant_id })
    toast.success(`${food.name} added to cart`)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(26px, 5vw, 40px)',
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          Find your craving 🔍
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>
          Search across all restaurants and dishes
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 40,
          maxWidth: 640,
          margin: '0 auto 40px',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Pizza, Biryani, McDonald's..."
          style={{
            flex: 1,
            padding: '13px 18px',
            fontSize: 15,
            borderRadius: 50,
          }}
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          style={{
            background: query.trim() ? '#ff5c00' : '#2a2a2a',
            color: '#fff',
            border: 'none',
            padding: '13px 26px',
            borderRadius: 50,
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 14,
            cursor: query.trim() ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { if (query.trim()) e.currentTarget.style.background = '#ff7a2b' }}
          onMouseLeave={e => { if (query.trim()) e.currentTarget.style.background = '#ff5c00' }}
        >
          Search
        </button>
      </form>

      {error && (
        <div
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5',
            padding: '12px 16px',
            borderRadius: 10,
            fontSize: 13,
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}

      {loading && <Spinner />}

      {/* Results */}
      {!loading && results !== null && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <p style={{ color: '#888', fontSize: 13, marginBottom: 28, textAlign: 'center' }}>
            {results.length === 0
              ? `No results for "${query}"`
              : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
          </p>

          {/* Restaurants */}
          {restaurants.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <h2
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 16,
                  color: '#f0ede6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                Restaurants
                <span
                  style={{
                    background: 'rgba(255,92,0,0.1)',
                    color: '#ff5c00',
                    borderRadius: 50,
                    padding: '2px 10px',
                    fontSize: 12,
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 400,
                  }}
                >
                  {restaurants.length}
                </span>
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 14,
                }}
              >
                {restaurants.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => navigate(`/restaurants/${r.id}`)}
                    style={{
                      background: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: 14,
                      padding: 16,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff5c00'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 10,
                        background: 'rgba(255,92,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        flexShrink: 0,
                      }}
                    >
                      🏪
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: 'Syne, sans-serif',
                          fontWeight: 600,
                          fontSize: 14,
                          color: '#f0ede6',
                          marginBottom: 3,
                        }}
                      >
                        {r.name}
                      </div>
                      {r.city && <div style={{ fontSize: 12, color: '#888' }}>📍 {r.city}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Food Items */}
          {foods.length > 0 && (
            <div>
              <h2
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 16,
                  color: '#f0ede6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                Food Items
                <span
                  style={{
                    background: 'rgba(255,92,0,0.1)',
                    color: '#ff5c00',
                    borderRadius: 50,
                    padding: '2px 10px',
                    fontSize: 12,
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 400,
                  }}
                >
                  {foods.length}
                </span>
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 14,
                }}
              >
                {foods.map((f) => (
                  <div
                    key={f.id}
                    style={{
                      background: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: 14,
                      padding: 16,
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#444'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          background: '#222',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 20,
                          flexShrink: 0,
                        }}
                      >
                        🍽️
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: 'Syne, sans-serif',
                            fontWeight: 600,
                            fontSize: 14,
                            color: '#f0ede6',
                            marginBottom: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {f.name}
                        </div>
                        {f.restaurant_name && (
                          <div
                            style={{ fontSize: 11, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          >
                            at {f.restaurant_name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {f.price && (
                        <span
                          style={{
                            fontFamily: 'Syne, sans-serif',
                            fontWeight: 700,
                            color: '#ff5c00',
                            fontSize: 15,
                          }}
                        >
                          ₹{f.price}
                        </span>
                      )}
                      <button
                        onClick={() => handleAddFood(f)}
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {results.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>🔍</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, color: '#f0ede6', marginBottom: 8 }}>
                No results found
              </h3>
              <p style={{ fontSize: 14 }}>Try searching with different keywords</p>
            </div>
          )}
        </div>
      )}

      {/* Suggestions (before first search) */}
      {results === null && !loading && (
        <div style={{ textAlign: 'center', color: '#888', paddingTop: 20 }}>
          <p style={{ fontSize: 14, marginBottom: 20 }}>Try searching for:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {['Pizza', 'Biryani', 'Burger', 'Sushi', 'Pasta', 'Dessert', 'Coffee'].map((s) => (
              <button
                key={s}
                onClick={() => { setQuery(s); setTimeout(() => handleSearch(), 0) }}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  color: '#888',
                  padding: '7px 16px',
                  borderRadius: 50,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff5c00'; e.currentTarget.style.color = '#ff5c00' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
