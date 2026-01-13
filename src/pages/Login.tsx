
import { useState } from 'react'
import { apiClient } from '@/lib/apiClient'
import { useI18n } from '@/i18n'

export default function Login() {
  const { t } = useI18n()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const allowedDomains = ((import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN as string) || 'mendizabala.eus').split(',').map(d => d.trim())


  async function handleLogin(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const domain = email.split('@')[1]?.toLowerCase()
      if (!domain || !allowedDomains.includes(domain)) {
        setError(`Email debe ser de: ${allowedDomains.join(', ')}`)
        return
      }
      const result = await apiClient.login(email, password)
      // Si el usuario tiene varios roles, guardar roles en localStorage para el selector
      if (result.roles && result.roles.length > 1) {
        localStorage.setItem('user_roles', JSON.stringify(result.roles))
      } else {
        localStorage.removeItem('user_roles')
      }
      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ maxWidth: 420 }}>
        <div className="card-header" style={{ textAlign: 'center', paddingBottom: 'var(--spacing-xl)' }}>
          <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="/logo.png" alt="Mendizabala" style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }} />
          </div>
          <p className="card-description" style={{ fontSize: 'var(--font-size-lg)', marginTop: 'var(--spacing-md)' }}>
            {t('login.title')}
          </p>
        </div>
        <form className="card-content" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="label-required">{t('login.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`tu.email@${allowedDomains[0]}`}
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="label-required">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button
            className="primary block"
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            style={{ marginTop: 'var(--spacing-lg)' }}
          >
            {loading ? 'Entrando...' : t('login.button')}
          </button>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
            Solo emails del dominio <strong>{allowedDomains.join(', ')}</strong>
          </p>
        </form>
      </div>
    </div>
  )
}
