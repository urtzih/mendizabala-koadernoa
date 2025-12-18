import { useEffect, useMemo, useState } from 'react'
import { apiClient } from '@/lib/apiClient'
import { Teacher } from '@/types'
import { useI18n } from '@/i18n'

export default function Contacts() {
  const { t } = useI18n()
  const [items, setItems] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      setLoading(true)
      const data = await apiClient.getTeachers()
      const mapped = (data || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        substituteName: r.substitute_name,
      }))
      setItems(mapped)
    } catch (err) {
      console.error('Error loading teachers:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addRow() {
    try {
      const newTeacher = await apiClient.createTeacher({ 
        name: '', 
        email: '', 
        substituteName: '' 
      })
      setItems([...items, { 
        id: newTeacher.id, 
        name: '', 
        email: '', 
        substituteName: '' 
      }])
    } catch (err) {
      console.error('Error creating teacher:', err)
    }
  }

  async function update(id: string, patch: Partial<Teacher>) {
    try {
      await apiClient.updateTeacher(id, patch)
      setItems(items.map(t => t.id === id ? { ...t, ...patch } : t))
    } catch (err) {
      console.error('Error updating teacher:', err)
    }
  }

  async function remove(id: string) {
    if (!confirm(t('teachers.deleteConfirm') || '¿Eliminar este profesor?')) return
    try {
      await apiClient.deleteTeacher(id)
      load()
    } catch (err) {
      console.error('Error deleting teacher:', err)
    }
  }

  useEffect(() => {
    load()
    // Polling cada 5 segundos (TODO: cambiar a WebSocket)
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  const rows = useMemo(() => items, [items])

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 className="page-title">👨‍🏫 {t('teachers.title')}</h1>
        <p className="page-subtitle">{t('teachers.subtitle') || 'Gestiona el equipo docente'}</p>
      </div>

      {/* Toolbar */}
      <div className="data-table-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <button className="primary" onClick={addRow}>
          ➕ {t('teachers.add')}
        </button>
      </div>

      {/* Teachers Table */}
      {loading ? (
        <div className="empty-state">
          <div className="spinner"></div>
          <p>{t('loading') || 'Cargando...'}</p>
        </div>
      ) : (
        <div className="data-table-wrapper">
          {rows.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-lg)' }}>👨‍🏫</div>
              <h3 style={{ color: 'var(--text-primary)' }}>{t('teachers.noTeachers') || 'No hay profesores'}</h3>
              <p>{t('teachers.addFirstTeacher') || 'Añade un profesor para empezar'}</p>
              <button className="primary" style={{ marginTop: 'var(--spacing-lg)' }} onClick={addRow}>
                ➕ {t('teachers.add')}
              </button>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>{t('teachers.name')}</th>
                  <th>{t('teachers.email')}</th>
                  <th>{t('teachers.substitute')}</th>
                  <th style={{ textAlign: 'right', width: '80px' }}>{t('actions') || 'Acciones'}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <input
                        type="text"
                        value={r.name || ''}
                        onChange={(e) => update(r.id, { name: e.target.value })}
                        placeholder={t('teachers.name')}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={r.email || ''}
                        onChange={(e) => update(r.id, { email: e.target.value })}
                        placeholder={t('teachers.email')}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={r.substituteName || ''}
                        onChange={(e) => update(r.id, { substituteName: e.target.value })}
                        placeholder={t('teachers.substitute')}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="small ghost" 
                        onClick={() => remove(r.id)}
                        title={t('companies.delete')}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}