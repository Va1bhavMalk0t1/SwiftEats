import { useState } from 'react'
import { foodAPI, restaurantAPI } from '../api'
import { useToast } from '../context/ToastContext'

const TAB_FOOD = 'food'
const TAB_RESTAURANT = 'restaurant'

const inputStyle = { width: '100%', padding: '10px 14px', fontSize: 14 }
const labelStyle = { fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }

export default function OwnerPanel() {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState(TAB_FOOD)

  // Food form
  const [foodForm, setFoodForm] = useState({
    name: '', description: '', price: '', category: '', restaurant_id: '', image_url: '',
  })
  const [foodLoading, setFoodLoading] = useState(false)
  const [foodError, setFoodError] = useState('')

  // Restaurant form
  const [restForm, setRestForm] = useState({
    name: '', description: '', address: '', city: '', state: '',
    pincode: '', phone: '', email: '', opening_time: '', closing_time: '', image_url: '',
  })
  const [restLoading, setRestLoading] = useState(false)
  const [restError, setRestError] = useState('')

  const handleFoodChange = (e) => setFoodForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  const handleRestChange = (e) => setRestForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleAddFood = async (e) => {
    e.preventDefault()
    setFoodError('')
    setFoodLoading(true)
    try {
      await foodAPI.create({
        ...foodForm,
        price: parseFloat(foodForm.price),
        restaurant_id: parseInt(foodForm.restaurant_id, 10),
      })
      toast.success('Food item added successfully!')
      setFoodForm({ name: '', description: '', price: '', category: '', restaurant_id: '', image_url: '' })
    } catch (err) {
      setFoodError(err.response?.data?.message || 'Failed to add food item')
    } finally {
      setFoodLoading(false)
    }
  }

  const handleCreateRestaurant = async (e) => {
    e.preventDefault()
    setRestError('')
    setRestLoading(true)
    try {
      await restaurantAPI.create(restForm)
      toast.success('Restaurant created successfully!')
      setRestForm({ name: '', description: '', address: '', city: '', state: '', pincode: '', phone: '', email: '', opening_time: '', closing_time: '', image_url: '' })
    } catch (err) {
      setRestError(err.response?.data?.message || 'Failed to create restaurant')
    } finally {
      setRestLoading(false)
    }
  }

  const Tab = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        padding: '9px 22px',
        borderRadius: 50,
        fontSize: 13,
        cursor: 'pointer',
        border: activeTab === id ? 'none' : '1px solid #2a2a2a',
        background: activeTab === id ? '#ff5c00' : 'transparent',
        color: activeTab === id ? '#fff' : '#888',
        fontFamily: activeTab === id ? 'Syne, sans-serif' : 'DM Sans, sans-serif',
        fontWeight: activeTab === id ? 600 : 400,
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>
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
            Owner
          </span>
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
          Owner Panel
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>Manage your restaurants and menu items</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        <Tab id={TAB_FOOD} label="➕ Add Food Item" />
        <Tab id={TAB_RESTAURANT} label="🏪 Create Restaurant" />
      </div>

      {/* Add Food Form */}
      {activeTab === TAB_FOOD && (
        <div
          style={{
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: 20,
            padding: 28,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 24 }}>
            Add Food Item
          </h2>

          {foodError && (
            <div
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
                padding: '10px 14px',
                borderRadius: 10,
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              {foodError}
            </div>
          )}

          <form onSubmit={handleAddFood}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1', marginBottom: 4 }}>
                <label style={labelStyle}>Food Name *</label>
                <input name="name" value={foodForm.name} onChange={handleFoodChange} placeholder="e.g. Butter Chicken" required style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Price (₹) *</label>
                <input name="price" type="number" value={foodForm.price} onChange={handleFoodChange} placeholder="299" min="1" required style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Restaurant ID *</label>
                <input name="restaurant_id" type="number" value={foodForm.restaurant_id} onChange={handleFoodChange} placeholder="1" min="1" required style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Category</label>
                <input name="category" value={foodForm.category} onChange={handleFoodChange} placeholder="e.g. Biryani" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Image URL</label>
                <input name="image_url" value={foodForm.image_url} onChange={handleFoodChange} placeholder="https://..." style={inputStyle} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  name="description"
                  value={foodForm.description}
                  onChange={handleFoodChange}
                  placeholder="Describe the dish..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <button
                type="submit"
                disabled={foodLoading}
                style={{
                  background: foodLoading ? '#333' : '#ff5c00',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: 50,
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: foodLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { if (!foodLoading) e.currentTarget.style.background = '#ff7a2b' }}
                onMouseLeave={e => { if (!foodLoading) e.currentTarget.style.background = '#ff5c00' }}
              >
                {foodLoading ? 'Adding...' : 'Add Food Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Restaurant Form */}
      {activeTab === TAB_RESTAURANT && (
        <div
          style={{
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: 20,
            padding: 28,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 24 }}>
            Create Restaurant
          </h2>

          {restError && (
            <div
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
                padding: '10px 14px',
                borderRadius: 10,
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              {restError}
            </div>
          )}

          <form onSubmit={handleCreateRestaurant}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Restaurant Name *</label>
                <input name="name" value={restForm.name} onChange={handleRestChange} placeholder="e.g. Spice Garden" required style={inputStyle} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Address *</label>
                <input name="address" value={restForm.address} onChange={handleRestChange} placeholder="123 MG Road" required style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>City *</label>
                <input name="city" value={restForm.city} onChange={handleRestChange} placeholder="Mumbai" required style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>State</label>
                <input name="state" value={restForm.state} onChange={handleRestChange} placeholder="Maharashtra" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Pincode</label>
                <input name="pincode" value={restForm.pincode} onChange={handleRestChange} placeholder="400001" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Phone</label>
                <input name="phone" value={restForm.phone} onChange={handleRestChange} placeholder="+91 98765 43210" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input name="email" type="email" value={restForm.email} onChange={handleRestChange} placeholder="info@restaurant.com" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Image URL</label>
                <input name="image_url" value={restForm.image_url} onChange={handleRestChange} placeholder="https://..." style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Opening Time</label>
                <input name="opening_time" type="time" value={restForm.opening_time} onChange={handleRestChange} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Closing Time</label>
                <input name="closing_time" type="time" value={restForm.closing_time} onChange={handleRestChange} style={inputStyle} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  name="description"
                  value={restForm.description}
                  onChange={handleRestChange}
                  placeholder="Tell customers about your restaurant..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <button
                type="submit"
                disabled={restLoading}
                style={{
                  background: restLoading ? '#333' : '#ff5c00',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: 50,
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: restLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { if (!restLoading) e.currentTarget.style.background = '#ff7a2b' }}
                onMouseLeave={e => { if (!restLoading) e.currentTarget.style.background = '#ff5c00' }}
              >
                {restLoading ? 'Creating...' : 'Create Restaurant'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
