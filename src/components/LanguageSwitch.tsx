import { useI18n } from '@/i18n'

export default function LanguageSwitch() {
  const { lang, setLang } = useI18n()
  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
      <button 
        className={`small ${lang === 'eu' ? 'primary' : 'secondary'}`}
        onClick={() => setLang('eu')}
        title="Euskera"
      >
        🇪🇺 EU
      </button>
      <button 
        className={`small ${lang === 'es' ? 'primary' : 'secondary'}`}
        onClick={() => setLang('es')}
        title="Castellano"
      >
        🇪🇸 ES
      </button>
    </div>
  )
}
