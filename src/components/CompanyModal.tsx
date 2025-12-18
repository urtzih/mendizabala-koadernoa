import { useI18n } from '@/i18n'
import { useState } from 'react'

interface Props {
  onClose: () => void
  onSubmit: (values: Record<string, any>) => void
}

export default function CompanyModal({ onClose, onSubmit }: Props) {
  const { t } = useI18n()
  const [values, setValues] = useState<Record<string, any>>({})
  
  function setField(k: string, v: any) { 
    setValues((s) => ({ ...s, [k]: v })) 
  }

  function handleSubmit() {
    if (!values.name?.trim()) {
      alert(t('companies.nameRequired') || 'El nombre de la empresa es obligatorio')
      return
    }
    onSubmit(values)
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">➕ {t('companies.add')}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <form className="form" onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
            <div className="form-group">
              <label className="label-required">{t('companies.name')}</label>
              <input 
                type="text"
                onChange={(e) => setField('name', e.target.value)} 
                placeholder={t('companies.namePlaceholder') || 'Nombre de la empresa'}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>{t('companies.location')}</label>
              <input 
                type="text"
                onChange={(e) => setField('location', e.target.value)}
                placeholder={t('companies.locationPlaceholder') || 'Ciudad, País'} 
              />
            </div>

            <div className="form-group">
              <label>{t('companies.contact')}</label>
              <input 
                type="text"
                onChange={(e) => setField('contactPerson', e.target.value)}
                placeholder={t('companies.contactPlaceholder') || 'Nombre del contacto'} 
              />
            </div>

            <div className="form-group">
              <label>{t('companies.email')}</label>
              <input 
                type="email"
                onChange={(e) => setField('email', e.target.value)}
                placeholder="contacto@empresa.com"
              />
            </div>

            <div className="form-group">
              <label>{t('companies.phone')}</label>
              <input 
                type="tel"
                onChange={(e) => setField('phone', e.target.value)}
                placeholder="+34 123 456 789"
              />
            </div>

            <div className="form-group">
              <label>{t('companies.website')}</label>
              <input 
                type="url"
                onChange={(e) => setField('website', e.target.value)}
                placeholder="https://ejemplo.com"
              />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button className="secondary" onClick={onClose}>{t('cancel')}</button>
          <button className="primary" onClick={handleSubmit}>{t('confirm')}</button>
        </div>
      </div>
    </div>
  )
}
