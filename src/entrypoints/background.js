import { defineBackground } from 'wxt/utils/define-background'
import { setupPanelOpening } from '@/browser/panel'

// Chrome runs this as a service worker, Firefox as an event page. Keep it
// stateless: either can be stopped at any time and woken by an event.
export default defineBackground(() => {
  setupPanelOpening()
})
