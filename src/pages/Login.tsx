import { useState } from 'react'
import { apiClient } from '@/lib/apiClient'
import { useI18n } from '@/i18n'

export default function Login() {
  const { t } = useI18n()
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const allowedDomains = ((import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN as string) || 'mendizabala.eus').split(',').map(d => d.trim())

  async function handleRequestOTP() {
    setError(null)
    setLoading(true)

    try {
      const domain = email.split('@')[1]?.toLowerCase()
      if (!domain || !allowedDomains.includes(domain)) {
        setError(`Email debe ser de: ${allowedDomains.join(', ')}`)
        return
      }

      const result = await apiClient.requestOTP(email)
      setStep('otp')
      
      // En desarrollo, mostrar el OTP
      if (result.message?.includes('DEV:')) {
        setError(result.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar código')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOTP() {
    setError(null)
    setLoading(true)

    try {
      if (otp.length !== 6) {
        setError('El código debe tener 6 dígitos')
        return
      }

      await apiClient.verifyOTP(email, otp)
      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido')
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

        <div className="card-content">
          {step === 'email' ? (
            <>
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

              {error && <div className="alert alert-error">{error}</div>}

              <button
                className="primary block"
                onClick={handleRequestOTP}
                disabled={loading || !email.trim()}
                style={{ marginTop: 'var(--spacing-lg)' }}
              >
                {loading ? 'Enviando...' : t('login.button')}
              </button>

              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
                Solo emails del dominio <strong>{allowedDomains.join(', ')}</strong>
              </p>
            </>
          ) : (
            <>
              <p style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
                Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
              </p>

              <div className="form-group">
                <label className="label-required">Código de acceso</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  disabled={loading}
                  autoFocus
                  style={{ fontSize: '24px', letterSpacing: '8px', textAlign: 'center', fontWeight: 'bold' }}
                />
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <button
                  className="secondary block"
                  onClick={() => { setStep('email'); setOtp(''); }}
                  disabled={loading}
                >
                  Volver
                </button>
                <button
                  className="primary block"
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? 'Verificando...' : 'Continuar'}
                </button>
              </div>

              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
                El código caduca en 10 minutos
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
