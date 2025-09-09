import React from 'react'

export default function SimpleTest() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0e1a',
      color: '#e2e8f0',
      fontFamily: 'monospace',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{ color: '#2CE8A2', fontSize: '48px', marginBottom: '20px' }}>
        FunWords Test
      </h1>
      <p style={{ fontSize: '24px' }}>
        If you can see this, React is working!
      </p>
      <button 
        style={{
          marginTop: '30px',
          padding: '15px 30px',
          fontSize: '18px',
          backgroundColor: '#2CE8A2',
          color: '#0a0e1a',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'monospace'
        }}
        onClick={() => alert('Button clicked!')}
      >
        Test Button
      </button>
    </div>
  )
}