import React, { useState, useEffect } from 'react'
import { apiClient } from '@/lib/apiClient'
import Login from '@/pages/Login'
import { RoleSelector } from './RoleSelector'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const [roles, setRoles] = useState<string[]>([])

  useEffect(() => {
    async function checkAuth() {
      try {
        // Intentar obtener datos del usuario actual
        const user = await apiClient.getMe()
        setAuthed(!!user)

        // Leer roles de localStorage (guardados tras login)
        const storedRoles = localStorage.getItem('user_roles')
        if (storedRoles) {
          const parsed = JSON.parse(storedRoles)
          setRoles(parsed)

          // Si ya hay un rol seleccionado, usarlo
          const selected = localStorage.getItem('active_role')
          if (selected && parsed.includes(selected)) {
            setRole(selected)
          } else if (parsed.length === 1) {
            // Si solo hay uno, seleccionarlo automáticamente
            setRole(parsed[0])
            localStorage.setItem('active_role', parsed[0])
          }
        }
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

  if (roles.length > 1 && !role) {
    return <RoleSelector roles={roles} onSelect={r => {
      setRole(r)
      localStorage.setItem('active_role', r)
    }} />
  }

  // Si hay roles pero no hemos seleccionado ninguno todavía (y no entró en el auto-select de useEffect)
  // o si estamos esperando a que el estado se actualice, mostramos cargando o nada transitoriamente
  if (roles.length > 0 && !role) return null

  return <>{children}</>;
}
