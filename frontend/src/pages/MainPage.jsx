import { useState, useEffect } from 'react'
import { foodAPI } from '../api'
import FoodCard from '../components/FoodCard'
import Spinner from '../components/Spinner'

export default function MainPage() {
  const [grouped, setGrouped] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [catFoods, setCatFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [catLoading, setCatLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([foodAPI.getHome(), foodAPI.getCategories()])
      .then(([homeRes, catRes]) => {
        setGrouped(homeRes.data.data || [])
        setCategories(catRes.data.data || [])
      })
      .catch(() => setError('Failed to load foods. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const handleCategorySelect = async (cat) => {
    setActiveCategory(cat)
    if (cat === 'All') { setCatFoods([]); return }
    setCatLoading(true)
    try {
      const res = await foodAPI.getByCategory(cat)
      setCatFoods(res.data.data || [])
    } catch {
      setCatFoods([])
    } finally {
      setCatLoading(false)
    }
  }

  if (loading) return <Spinner fullPage />

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(24px, 4vw, 34px)',
            fontWeight: 800,
            marginBottom: 6,
          }}
        >
          What's on your mind? 🤔
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>
          Fresh picks, curated for you right now
        </p>
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

      {/* Category Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 32,
          paddingBottom: 16,
          borderBottom: '1px solid #2a2a2a',
        }}
      >
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            style={{
              padding: '7px 18px',
              borderRadius: 50,
              fontSize: 13,
              cursor: 'pointer',
              border: activeCategory === cat ? 'none' : '1px solid #2a2a2a',
              background: activeCategory === cat ? '#ff5c00' : 'transparent',
              color: activeCategory === cat ? '#fff' : '#888',
              fontFamily: activeCategory === cat ? 'Syne, sans-serif' : 'DM Sans, sans-serif',
              fontWeight: activeCategory === cat ? 600 : 400,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              if (activeCategory !== cat) {
                e.currentTarget.style.borderColor = '#ff5c00'
                e.currentTarget.style.color = '#ff5c00'
              }
            }}
            onMouseLeave={e => {
              if (activeCategory !== cat) {
                e.currentTarget.style.borderColor = '#2a2a2a'
                e.currentTarget.style.color = '#888'
              }
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Category filtered view */}
      {activeCategory !== 'All' && (
        <>
          {catLoading ? (
            <Spinner />
          ) : catFoods.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
              <p>No items available in this category</p>
            </div>
          ) : (
            <div>
              <h2
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: 20,
                  marginBottom: 20,
                  color: '#f0ede6',
                }}
              >
                {activeCategory}
                <span
                  style={{
                    marginLeft: 10,
                    fontSize: 13,
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 400,
                    color: '#888',
                  }}
                >
                  {catFoods.length} items
                </span>
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: 16,
                }}
              >
                {catFoods.map((food) => (
                  <FoodCard key={food.id} item={food} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* All foods grouped */}
      {activeCategory === 'All' && (
        <>
          {grouped.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
              <p>No food available right now</p>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.category} style={{ marginBottom: 48 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 700,
                      fontSize: 20,
                      color: '#f0ede6',
                    }}
                  >
                    {group.category}
                  </h2>
                  <button
                    onClick={() => handleCategorySelect(group.category)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #2a2a2a',
                      color: '#888',
                      padding: '5px 14px',
                      borderRadius: 50,
                      fontSize: 12,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff5c00'; e.currentTarget.style.color = '#ff5c00' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888' }}
                  >
                    See all →
                  </button>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: 16,
                  }}
                >
                  {(group.foods || []).map((food) => (
                    <FoodCard key={food.id} item={food} />
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  )
}
