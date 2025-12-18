import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/apiClient'
import Login from '@/pages/Login'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      try {
        // Intentar obtener datos del usuario actual
        const user = await apiClient.getMe()
        setAuthed(!!user)
      } catch (err) {
        // No autenticado
        apiClient.clearToken()
        setAuthed(false)
      } finally {
        setReady(true)
      }
    }

    checkAuth()
  }, [])

  if (!ready) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!authed) return <Login />
  return <>{children}</>
}
