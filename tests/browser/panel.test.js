import { afterEach, describe, expect, test, vi } from 'vitest'
import { fakeBrowser } from 'wxt/testing/fake-browser'
import { setupPanelOpening } from '@/browser/panel'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
  fakeBrowser.reset()
})

describe('setupPanelOpening', () => {
  // Tests build for Chrome by default (import.meta.env.BROWSER is 'chrome')
  test('Chrome opens the side panel from the toolbar button', () => {
    const setPanelBehavior = vi
      .spyOn(fakeBrowser.sidePanel, 'setPanelBehavior')
      .mockResolvedValue()

    setupPanelOpening()

    expect(setPanelBehavior).toHaveBeenCalledWith({
      openPanelOnActionClick: true
    })
  })

  test('Firefox toggles the sidebar when the toolbar button is clicked', async () => {
    vi.stubEnv('BROWSER', 'firefox')
    fakeBrowser.sidebarAction = { toggle: vi.fn() }

    setupPanelOpening()
    await fakeBrowser.action.onClicked.trigger({ id: 1 })

    expect(fakeBrowser.sidebarAction.toggle).toHaveBeenCalledOnce()
  })
})
