import { Status } from '@/types'
import { useI18n } from '@/i18n'

export default function StatusBadge({ status }: { status: Status }) {
  const { t } = useI18n()
  const text =
    status === 'green' ? t('status.green') : status === 'orange' ? t('status.orange') : t('status.red')
  
  const badgeClass = status === 'green' ? 'badge-success' : status === 'orange' ? 'badge-warning' : 'badge-error'
  const icon = status === 'green' ? '✓' : status === 'orange' ? '⚠' : '✕'
  
  return (
    <span className={`badge ${badgeClass}`} aria-label={text} title={text}>
      <span>{icon}</span>
      <span>{text}</span>
    </span>
  )
}
