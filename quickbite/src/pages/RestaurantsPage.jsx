import { useState, useEffect, useCallback } from 'react'
import { restaurantAPI } from '../api'
import RestaurantCard from '../components/RestaurantCard'
import Spinner from '../components/Spinner'

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [city, setCity] = useState('')
  const [isOpen, setIsOpen] = useState('')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 })

  const fetchRestaurants = useCallback(async (pageNum = 1) => {
    setLoading(true)
    setError('')
    try {
      const params = { page: pageNum }
      if (city.trim()) params.city = city.trim()
      if (isOpen !== '') params.is_open = isOpen
      const res = await restaurantAPI.getAll(params)
      setRestaurants(res.data.data || [])
      setMeta({ total: res.data.total || 0, totalPages: res.data.totalPages || 1 })
    } catch {
      setError('Failed to load restaurants. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [city, isOpen])

  useEffect(() => {
    fetchRestaurants(page)
  }, [page])

  const handleFilter = (e) => {
    e.preventDefault()
    setPage(1)
    fetchRestaurants(1)
  }

  const handleClearFilters = () => {
    setCity('')
    setIsOpen('')
    setPage(1)
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(22px, 4vw, 34px)',
              fontWeight: 800,
              marginBottom: 6,
            }}
          >
            Restaurants
          </h1>
          <p style={{ color: '#888', fontSize: 14 }}>
            {meta.total > 0 ? `${meta.total} places found` : 'Explore restaurants near you'}
          </p>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleFilter}
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}
        >
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Filter by city..."
            style={{ width: 160, padding: '9px 14px', fontSize: 13 }}
          />
          <select
            value={isOpen}
            onChange={(e) => setIsOpen(e.target.value)}
            style={{ width: 130, padding: '9px 14px', fontSize: 13 }}
          >
            <option value="">All Status</option>
            <option value="1">Open Now</option>
            <option value="0">Closed</option>
          </select>
          <button
            type="submit"
            style={{
              background: '#ff5c00',
              color: '#fff',
              border: 'none',
              padding: '9px 20px',
              borderRadius: 50,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#ff7a2b'}
            onMouseLeave={e => e.currentTarget.style.background = '#ff5c00'}
          >
            Filter
          </button>
          {(city || isOpen) && (
            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                background: 'transparent',
                color: '#888',
                border: '1px solid #2a2a2a',
                padding: '9px 16px',
                borderRadius: 50,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

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
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : restaurants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>🏪</div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, marginBottom: 8, color: '#f0ede6' }}>
            No restaurants found
          </h3>
          <p style={{ fontSize: 14 }}>Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 20,
              marginBottom: 36,
            }}
          >
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  background: 'transparent',
                  border: '1px solid #2a2a2a',
                  color: page === 1 ? '#444' : '#f0ede6',
                  padding: '8px 18px',
                  borderRadius: 50,
                  fontSize: 13,
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                ← Prev
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    style={{
                      background: page === pageNum ? '#ff5c00' : 'transparent',
                      border: page === pageNum ? 'none' : '1px solid #2a2a2a',
                      color: page === pageNum ? '#fff' : '#888',
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      fontSize: 13,
                      cursor: 'pointer',
                      fontFamily: page === pageNum ? 'Syne, sans-serif' : 'DM Sans, sans-serif',
                      fontWeight: page === pageNum ? 700 : 400,
                      transition: 'all 0.2s',
                    }}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                style={{
                  background: 'transparent',
                  border: '1px solid #2a2a2a',
                  color: page === meta.totalPages ? '#444' : '#f0ede6',
                  padding: '8px 18px',
                  borderRadius: 50,
                  fontSize: 13,
                  cursor: page === meta.totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
