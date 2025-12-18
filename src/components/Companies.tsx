import { useEffect, useMemo, useState } from 'react'
import { apiClient } from '@/lib/apiClient'
import { Company } from '@/types'
import { useI18n } from '@/i18n'
import CompanyModal from './CompanyModal'

export default function Companies() {
  const { t } = useI18n()
  const [items, setItems] = useState<Company[]>([])
  const [q, setQ] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      setLoading(true)
      const data = await apiClient.getCompanies()
      const mapped = (data || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        location: r.location,
        contactPerson: r.contact_person,
        email: r.email,
        phone: r.phone,
        website: r.website,
        assignedTeacherId: r.assigned_teacher_id,
        status: (r.status || 'orange') as any,
        demandDual1: r.demand_dual1,
        demandDualGeneral: r.demand_dual_general,
        demandDualIntensive: r.demand_dual_intensive,
      }))
      setItems(mapped)
    } catch (err) {
      console.error('Error loading companies:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // Polling cada 5 segundos (TODO: cambiar a WebSocket)
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  async function add(values: Record<string, any>) {
    try {
      await apiClient.createCompany(values)
      setShowModal(false)
      load()
    } catch (err) {
      console.error('Error creating company:', err)
    }
  }

  async function remove(id: string) {
    if (!confirm(t('companies.deleteConfirm') || '¿Estás seguro?')) return
    try {
      await apiClient.deleteCompany(id)
      load()
    } catch (err) {
      console.error('Error deleting company:', err)
    }
  }

  const filtered = useMemo(() => {
    const term = q.toLowerCase()
    return items.filter((c) =>
      [c.name, c.location, c.contactPerson, c.email, c.website].some((v) => (v || '').toLowerCase().includes(term))
    )
  }, [items, q])

  function openLink(url?: string | null) { if (url) window.open(url, '_blank') }
  function mailTo(email?: string | null) { if (email) window.location.href = `mailto:${email}` }

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 className="page-title">🏢 {t('companies.title')}</h1>
        <p className="page-subtitle">{t('companies.subtitle') || 'Gestiona el directorio de empresas colaboradoras'}</p>
      </div>

      {/* Toolbar */}
      <div className="data-table-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="data-table-toolbar" style={{ flex: 1 }}>
          <input 
            type="text"
            className="data-table-search" 
            placeholder={t('companies.search')} 
            value={q} 
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="primary" onClick={() => setShowModal(true)}>
            ➕ {t('companies.add')}
          </button>
        </div>
        <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          {filtered.length} {t('companies.results') || 'resultados'}
        </span>
      </div>

      {/* Companies List */}
      {loading ? (
        <div className="empty-state">
          <div className="spinner"></div>
          <p>{t('loading') || 'Cargando...'}</p>
        </div>
      ) : (
        <div className="list-view">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-lg)' }}>🔍</div>
              <h3 style={{ color: 'var(--text-primary)' }}>{t('companies.notFound') || 'No hay empresas'}</h3>
              <p>{t('companies.addFirst') || 'Añade una empresa para empezar'}</p>
            </div>
          ) : (
            filtered.map((c) => (
              <div key={c.id} className="list-item">
                <div className="list-item-content">
                  <div className="list-item-title">{c.name}</div>
                  <div className="list-item-meta">
                    {[c.location, c.contactPerson].filter(Boolean).join(' • ')}
                  </div>
                  {c.email && (
                    <div className="list-item-meta" style={{ marginTop: 'var(--spacing-xs)', fontSize: 'var(--font-size-xs)' }}>
                      📧 {c.email}
                    </div>
                  )}
                </div>
                <div className="list-item-actions">
                  <button className="small ghost" onClick={() => mailTo(c.email)} title="Enviar email">
                    ✉️
                  </button>
                  <button className="small ghost" onClick={() => openLink(c.website)} title="Abrir sitio web">
                    🌐
                  </button>
                  <button className="small ghost" onClick={() => remove(c.id)} title="Eliminar">
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Company Modal */}
      {showModal && <CompanyModal onClose={() => setShowModal(false)} onSubmit={add} />}
    </div>
  )
}
