import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { settingsItem } from '@/browser/storage'
import { PrintPage } from '@/features/export/PrintPage'
import { resolveSettings } from '@/features/settings/defaults'
import { isRtl, setLocale } from '@/i18n'
import '@/assets/styles.css'

// The toolbar follows the UI language; the letter keeps its own language
settingsItem.getValue().then(settings => {
  const { uiLocale } = resolveSettings(settings)
  setLocale(uiLocale)
  document.documentElement.dir = isRtl(uiLocale) ? 'rtl' : 'ltr'
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <PrintPage draftId={decodeURIComponent(location.hash.slice(1))} />
    </StrictMode>
  )
})
