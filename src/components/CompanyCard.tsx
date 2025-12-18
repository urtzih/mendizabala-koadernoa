import { Company } from '@/types'
import StatusBadge from './StatusBadge'

export default function CompanyCard({ c, onClick }: { c: Company; onClick?: () => void }) {
  const total = (c.demandDual1 || 0) + (c.demandDualGeneral || 0) + (c.demandDualIntensive || 0)
  
  return (
    <div 
      className="kanban-card" 
      role="button" 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'grab' }}
    >
      <div className="kanban-card-title">{c.name}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        <StatusBadge status={c.status} />
        {total > 0 && (
          <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>
            👥 {total}
          </span>
        )}
      </div>
    </div>
  )
}
