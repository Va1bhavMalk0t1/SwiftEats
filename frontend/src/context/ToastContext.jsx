import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'error'),
    info: (msg) => showToast(msg, 'info'),
    warning: (msg) => showToast(msg, 'warning'),
  }

  const typeStyles = {
    success: { border: '#22c55e', icon: '✓' },
    error: { border: '#ef4444', icon: '✕' },
    info: { border: '#ff5c00', icon: 'i' },
    warning: { border: '#f59e0b', icon: '!' },
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => {
          const style = typeStyles[t.type] || typeStyles.info
          return (
            <div
              key={t.id}
              onClick={() => removeToast(t.id)}
              style={{
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderLeft: `3px solid ${style.border}`,
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '13px',
                color: '#f0ede6',
                fontFamily: "'DM Sans', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                animation: 'slideUp 0.3s ease',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                pointerEvents: 'all',
                cursor: 'pointer',
                maxWidth: '320px',
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: style.border,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {style.icon}
              </span>
              {t.message}
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
