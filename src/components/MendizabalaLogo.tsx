/* Logo de Mendizabala LHII como SVG */
export default function MendizabalaLogo({ size = 40 }: { size?: number }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 'var(--spacing-sm)',
      fontWeight: 700,
      fontSize: `${size * 0.5}px`,
      color: 'var(--primary)'
    }}>
      <div style={{
        background: 'var(--primary)',
        color: 'white',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.6}px`,
        fontWeight: 800,
        letterSpacing: '-1px'
      }}>
        M
      </div>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        lineHeight: 1,
        gap: '2px'
      }}>
        <span style={{ 
          fontSize: `${size * 0.5}px`,
          fontWeight: 800,
          letterSpacing: '1px',
          color: 'var(--primary)'
        }}>
          MENDI
        </span>
        <span style={{ 
          fontSize: `${size * 0.45}px`,
          fontWeight: 600,
          color: 'var(--text-secondary)'
        }}>
          zabala
        </span>
      </div>
    </div>
  )
}
