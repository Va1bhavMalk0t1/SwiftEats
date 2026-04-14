export default function Spinner({ fullPage = false, size = 32 }) {
  const spinner = (
    <div
      style={{
        width: size,
        height: size,
        border: '3px solid #2a2a2a',
        borderTopColor: '#ff5c00',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  )

  if (fullPage) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d0d0d',
        }}
      >
        {spinner}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
      {spinner}
    </div>
  )
}
