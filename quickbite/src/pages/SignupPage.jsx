import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function SignupPage() {
  const { signup } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', age: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) { setError('Name is required'); return }
    if (!form.age || Number(form.age) < 1) { setError('Please enter a valid age'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    try {
      await signup({ ...form, age: parseInt(form.age, 10) })
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,92,0,0.05) 0%, transparent 60%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 420, animation: 'slideUp 0.3s ease' }}>
        <div
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 22,
            color: '#ff5c00',
            marginBottom: 32,
            textAlign: 'center',
          }}
        >
          QuickBite
        </div>

        <h2
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 6,
            color: '#f0ede6',
          }}
        >
          Create your account
        </h2>
        <p style={{ color: '#888', marginBottom: 28, fontSize: 14 }}>
          Join thousands of food lovers today
        </p>

        {error && (
          <div
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 0 }}>
            <div style={{ gridColumn: '1 / -1', marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                style={{ width: '100%', padding: '10px 14px', fontSize: 14 }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Age</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="25"
                min="1"
                max="120"
                required
                style={{ width: '100%', padding: '10px 14px', fontSize: 14 }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={{ width: '100%', padding: '10px 14px', fontSize: 14 }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', marginBottom: 24 }}>
              <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                style={{ width: '100%', padding: '10px 14px', fontSize: 14 }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#333' : '#ff5c00',
              color: '#fff',
              border: 'none',
              borderRadius: 50,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#888', fontSize: 13, marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#ff5c00', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
