import { useCallback, useEffect, useState } from 'react'
import { SETTINGS_DEFAULTS, settingsItem } from '@/browser/storage'

const DARK_QUERY = '(prefers-color-scheme: dark)'

export function useSettings() {
  const [settings, setSettings] = useState(SETTINGS_DEFAULTS)

  useEffect(() => {
    settingsItem
      .getValue()
      .then(value => setSettings({ ...SETTINGS_DEFAULTS, ...value }))
    return settingsItem.watch(value =>
      setSettings({ ...SETTINGS_DEFAULTS, ...value })
    )
  }, [])

  useEffect(() => applyAppearance(settings.appearance), [settings.appearance])

  const updateSettings = useCallback(async patch => {
    const next = { ...(await settingsItem.getValue()), ...patch }
    setSettings({ ...SETTINGS_DEFAULTS, ...next })
    await settingsItem.setValue(next)
  }, [])

  return [settings, updateSettings]
}

// Exactly one of .light/.dark on <html>; "system" follows the OS live
export function applyAppearance(appearance) {
  const media = window.matchMedia?.(DARK_QUERY)
  const apply = () => {
    const dark =
      appearance === 'dark' || (appearance === 'system' && media?.matches)
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.classList.toggle('light', !dark)
  }
  apply()
  if (appearance !== 'system' || !media) return undefined
  media.addEventListener('change', apply)
  return () => media.removeEventListener('change', apply)
}
