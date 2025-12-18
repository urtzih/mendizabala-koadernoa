import AuthGate from '@/components/AuthGate'
import { I18nProvider } from '@/i18n'
import Dashboard from '@/pages/Dashboard'

export default function App() {
  return (
    <I18nProvider>
      <AuthGate>
        <Dashboard />
      </AuthGate>
    </I18nProvider>
  )
}
