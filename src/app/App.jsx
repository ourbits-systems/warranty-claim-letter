import { FilePlus2 } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ClaimFlow } from '@/features/claims/ClaimFlow'
import { DraftsScreen } from '@/features/drafts/DraftsScreen'
import { useClaimSession } from '@/features/drafts/useClaimSession'
import { resolveSettings } from '@/features/settings/defaults'
import { SettingsScreen } from '@/features/settings/SettingsScreen'
import { useSettings } from '@/features/settings/useSettings'
import { isRtl, setLocale, t } from '@/i18n'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'claim', label: 'nav.current' },
  { key: 'drafts', label: 'nav.drafts' },
  { key: 'settings', label: 'nav.settings' }
]

// Opens straight into the claim flow: no onboarding (spec §6)
export function App() {
  const [settings, updateSettings] = useSettings()
  const session = useClaimSession()
  const { uiLocale } = resolveSettings(settings)
  // t() reads the module-level locale, so set it before rendering children;
  // the keyed wrapper below re-renders everything when it changes
  setLocale(uiLocale)

  useEffect(() => {
    const root = document.documentElement
    root.lang = uiLocale
    root.dir = isRtl(uiLocale) ? 'rtl' : 'ltr'
    document.title = t('app.title')
  }, [uiLocale])

  return (
    <div key={uiLocale} className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 pt-3 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate font-serif text-base font-medium text-primary">
            {t('app.title')}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={session.startNew}
            title={t('nav.claim')}
          >
            <FilePlus2 aria-hidden="true" />
            {t('nav.claim')}
          </Button>
        </div>
        <nav
          aria-label={t('nav.label')}
          className="-mb-px flex gap-4 overflow-x-auto"
        >
          {TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              aria-current={session.screen === tab.key ? 'page' : undefined}
              onClick={() => session.setScreen(tab.key)}
              className={cn(
                'shrink-0 whitespace-nowrap border-b-2 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring',
                session.screen === tab.key
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {t(tab.label)}
            </button>
          ))}
        </nav>
      </header>
      <main className="flex-1 px-4 pt-4">
        {!session.draft ? null : session.screen === 'drafts' ? (
          <DraftsScreen session={session} />
        ) : session.screen === 'settings' ? (
          <SettingsScreen
            settings={settings}
            updateSettings={updateSettings}
            session={session}
          />
        ) : (
          <ClaimFlow key={session.draft.id} session={session} />
        )}
      </main>
    </div>
  )
}
