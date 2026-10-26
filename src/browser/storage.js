import { storage } from 'wxt/utils/storage'

// storage.local items. Both browsers keep these across panel closes,
// browser restarts and extension updates. Bump `version` and add a
// migration when a value's shape changes.

// { [id]: draft } (see src/features/drafts/store.js)
export const draftsItem = storage.defineItem('local:drafts', {
  fallback: {},
  version: 1
})

// Which draft and screen to restore when the panel reopens
export const sessionItem = storage.defineItem('local:session', {
  fallback: { draftId: null, screen: 'claim' },
  version: 1
})

// '' means "follow the browser" (see features/settings/defaults.js)
export const SETTINGS_DEFAULTS = {
  appearance: 'system',
  uiLocale: '',
  country: ''
}

export const settingsItem = storage.defineItem('local:settings', {
  fallback: SETTINGS_DEFAULTS,
  version: 1
})

export async function clearAllData() {
  await Promise.all([
    draftsItem.removeValue(),
    sessionItem.removeValue(),
    settingsItem.removeValue()
  ])
}
