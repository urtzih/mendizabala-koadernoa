import { useState } from 'react'
import { useI18n } from '@/i18n'
import LanguageSwitch from '@/components/LanguageSwitch'
import Contacts from '@/components/Contacts'
import Companies from '@/components/Companies'
import Kanban from '@/components/Kanban'
import { apiClient } from '@/lib/apiClient'

export default function Dashboard() {
  const { t } = useI18n()
  const [tab, setTab] = useState<'teachers' | 'companies' | 'kanban'>('kanban')

  function logout() {
    apiClient.clearToken()
    window.location.href = '/'
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="app-header">
        <div className="app-logo">
          <span>🎓</span>
          <span>{t('app.title')}</span>
        </div>
        <div className="app-nav">
          <LanguageSwitch />
          <button className="ghost" onClick={logout}>{t('logout')}</button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <button 
          className={`sidebar-item ${tab === 'kanban' ? 'active' : ''}`}
          onClick={() => setTab('kanban')}
          title={t('nav.kanban')}
        >
          <span className="sidebar-item-icon">📋</span>
          <span className="sidebar-item-label">{t('nav.kanban')}</span>
        </button>
        
        <button 
          className={`sidebar-item ${tab === 'companies' ? 'active' : ''}`}
          onClick={() => setTab('companies')}
          title={t('nav.companies')}
        >
          <span className="sidebar-item-icon">🏢</span>
          <span className="sidebar-item-label">{t('nav.companies')}</span>
        </button>
        
        <button 
          className={`sidebar-item ${tab === 'teachers' ? 'active' : ''}`}
          onClick={() => setTab('teachers')}
          title={t('nav.teachers')}
        >
          <span className="sidebar-item-icon">👨‍🏫</span>
          <span className="sidebar-item-label">{t('nav.teachers')}</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {tab === 'kanban' && <Kanban />}
        {tab === 'companies' && <Companies />}
        {tab === 'teachers' && <Contacts />}
      </main>
    </div>
  )
}
