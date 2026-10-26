import { beforeEach, vi } from 'vitest'
import { fakeBrowser } from 'wxt/testing/fake-browser'

// WxtVitest registers this stub as a setup file, but inline Vitest projects
// do not inherit it. wxt/storage reads the global `browser`, so stub it here.
vi.stubGlobal('chrome', fakeBrowser)
vi.stubGlobal('browser', fakeBrowser)

// Not implemented by the fake browser; the Settings screen shows the version
beforeEach(() => {
  fakeBrowser.runtime.getManifest = () => ({ version: '0.1.0' })
})
