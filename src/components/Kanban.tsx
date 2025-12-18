import { useEffect, useMemo, useState } from 'react'
import { apiClient } from '@/lib/apiClient'
import { Company, Teacher } from '@/types'
import { useI18n } from '@/i18n'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CompanyCard from './CompanyCard'

function SortableCard({ c }: { c: Company }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: c.id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CompanyCard c={c} />
    </div>
  )
}

export default function Kanban() {
  const { t } = useI18n()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [selected, setSelected] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const [teachersData, companiesData] = await Promise.all([
        apiClient.getTeachers(),
        apiClient.getCompanies(),
      ])

      setTeachers(teachersData.map((r: any) => ({ 
        id: r.id, 
        name: r.name, 
        email: r.email || '',
        substituteName: r.substitute_name 
      })))

      setCompanies(companiesData.map((r: any) => ({
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
      } as Company)))
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // TODO: Implementar polling o WebSocket para actualización en tiempo real
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  const pool = useMemo(() => companies.filter((c) => !c.assignedTeacherId), [companies])
  const byTeacher = useMemo(() => {
    const map: Record<string, Company[]> = {}
    for (const t of teachers) map[t.id] = []
    for (const c of companies) if (c.assignedTeacherId) (map[c.assignedTeacherId] ||= []).push(c)
    return map
  }, [companies, teachers])

  async function onDragEnd(evt: DragEndEvent) {
    const companyId = evt.active?.id as string
    const teacherId = evt.over?.id as string | undefined
    if (!companyId) return

    try {
      await apiClient.updateCompany(companyId, { assignedTeacherId: teacherId || null })
      load()
    } catch (err) {
      console.error('Error updating company:', err)
    }
  }

  async function updateCompany(id: string, patch: Partial<Company>) {
    try {
      await apiClient.updateCompany(id, patch)
      load()
    } catch (err) {
      console.error('Error updating company:', err)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📋 {t('nav.kanban')}</h1>
        <p className="page-subtitle">{t('kanban.description') || 'Arrastra empresas entre profesores para asignarlas'}</p>
      </div>

      <div className="kanban-container">
        {/* Unassigned Pool */}
        <div className="kanban-column">
          <div className="kanban-column-header">
            <h3 className="kanban-column-title">⏳ {t('kanban.unassigned')}</h3>
            <div className="kanban-column-count">{pool.length}</div>
          </div>
          <DndContext onDragEnd={onDragEnd}>
            <SortableContext items={pool.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <div className="kanban-cards">
                {pool.length === 0 ? (
                  <div className="empty-state">
                    <div style={{ fontSize: '32px', marginBottom: 'var(--spacing-lg)' }}>✓</div>
                    <p>{t('kanban.noUnassigned') || 'Todas las empresas están asignadas'}</p>
                  </div>
                ) : (
                  pool.map((c) => (
                    <SortableCard key={c.id} c={c} />
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Teacher Columns */}
        <DndContext onDragEnd={onDragEnd}>
          {teachers.map((teacher) => (
            <div key={teacher.id} className="kanban-column">
              <div className="kanban-column-header">
                <h3 className="kanban-column-title">
                  👨‍🏫 {teacher.substituteName?.trim() ? teacher.substituteName : teacher.name}
                </h3>
                <div className="kanban-column-count">{(byTeacher[teacher.id] || []).length}</div>
              </div>
              <SortableContext items={(byTeacher[teacher.id] || []).map((c) => c.id)} strategy={verticalListSortingStrategy}>
                <div className="kanban-cards">
                  {(byTeacher[teacher.id] || []).length === 0 ? (
                    <div className="empty-state" style={{ paddingTop: 'var(--spacing-xl)' }}>
                      <p style={{ fontSize: 'var(--font-size-sm)' }}>{t('kanban.noCompanies') || 'Sin empresas'}</p>
                    </div>
                  ) : (
                    (byTeacher[teacher.id] || []).map((c) => (
                      <SortableCard key={c.id} c={c} />
                    ))
                  )}
                </div>
              </SortableContext>
            </div>
          ))}
        </DndContext>
      </div>

      {/* Company Details Panel */}
      {selected && (
        <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
          <div className="card-header">
            <h2 className="card-title">{selected.name}</h2>
            <button className="ghost" onClick={() => setSelected(null)}>✕</button>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="label-required">{t('status.label') || 'Estado'}</label>
              <select
                value={selected.status}
                onChange={(e) => {
                  updateCompany(selected.id, { status: e.target.value as any })
                  setSelected({ ...selected, status: e.target.value as any })
                }}
              >
                <option value="green">🟢 {t('status.green')}</option>
                <option value="orange">🟠 {t('status.orange')}</option>
                <option value="red">🔴 {t('status.red')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('demand.dual1')}</label>
              <input
                type="number"
                value={selected.demandDual1 || 0}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  updateCompany(selected.id, { demandDual1: val })
                  setSelected({ ...selected, demandDual1: val })
                }}
              />
            </div>

            <div className="form-group">
              <label>{t('demand.general')}</label>
              <input
                type="number"
                value={selected.demandDualGeneral || 0}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  updateCompany(selected.id, { demandDualGeneral: val })
                  setSelected({ ...selected, demandDualGeneral: val })
                }}
              />
            </div>

            <div className="form-group">
              <label>{t('demand.intensive')}</label>
              <input
                type="number"
                value={selected.demandDualIntensive || 0}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  updateCompany(selected.id, { demandDualIntensive: val })
                  setSelected({ ...selected, demandDualIntensive: val })
                }}
              />
            </div>
          </div>

          <div className="form-actions">
            <button onClick={() => setSelected(null)} className="secondary">{t('cancel') || 'Cancelar'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
