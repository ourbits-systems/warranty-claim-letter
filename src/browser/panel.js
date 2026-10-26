import { browser } from 'wxt/browser'

// The toolbar button opens the assistant: Chrome's side panel or Firefox's
// sidebar. import.meta.env.BROWSER is replaced at build time, so each
// browser's bundle only contains its own branch. (Compare BROWSER rather than
// the FIREFOX flag: under Vitest the flags become strings, and "false" is
// truthy.)
export function setupPanelOpening() {
  if (import.meta.env.BROWSER === 'firefox') {
    // toggle() must run inside the click handler to count as a user action
    browser.action.onClicked.addListener(() => {
      browser.sidebarAction.toggle()
    })
    return
  }
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch(error => console.error('Could not enable the side panel', error))
}
