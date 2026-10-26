import { browser } from 'wxt/browser'

// Opens one of the extension's own pages (e.g. the print view) in a new tab.
// tabs.create needs no permission for extension URLs.
export function openExtensionPage(path, hash = '') {
  const url = browser.runtime.getURL(path) + (hash ? `#${hash}` : '')
  return browser.tabs.create({ url })
}

export function extensionVersion() {
  return browser.runtime.getManifest().version
}
