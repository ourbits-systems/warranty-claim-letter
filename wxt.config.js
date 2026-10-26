import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

const ICONS = {
  16: 'icons/16.png',
  32: 'icons/32.png',
  48: 'icons/48.png',
  96: 'icons/96.png',
  128: 'icons/128.png'
}

// One codebase, two targets: `wxt build` (Chrome, service worker + side_panel)
// and `wxt build -b firefox` (event page + sidebar_action). WXT derives the
// browser-specific background and panel keys from the same entrypoints.
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  // WXT defaults Firefox to MV2; the spec requires MV3 everywhere
  manifestVersion: 3,
  // Explicit imports only: easier to follow than auto-imported globals
  imports: false,
  zip: {
    // Sources ZIP for Mozilla's reviewers: everything needed to rebuild,
    // nothing internal
    excludeSources: [
      '_coder/**',
      'docs/**',
      'store/**',
      '.github/**',
      'coverage/**'
    ],
    // Hidden files are skipped by default (good: no .env). Add the Node
    // version pin by name so reviewers build with the same Node.
    includeSources: ['**/*', '.nvmrc']
  },
  vite: () => ({
    plugins: [tailwindcss()]
  }),
  manifest: ({ browser }) => ({
    // Localized from public/_locales/<lang>/messages.json
    default_locale: 'en',
    name: '__MSG_extName__',
    short_name: '__MSG_extShortName__',
    description: '__MSG_extDescription__',
    homepage_url: 'https://holdmybill.com/tools/warranty-claim-letter',
    // Drafts and settings in storage.local. WXT adds sidePanel for Chrome.
    // No host permissions: the extension never reads pages or calls servers.
    permissions: ['storage'],
    // Stricter than the MV3 default: no WebAssembly, no <base> rewriting,
    // nothing loaded from outside the package
    content_security_policy: {
      extension_pages:
        "script-src 'self'; object-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
    },
    icons: ICONS,
    action: {
      default_title: '__MSG_actionTitle__',
      default_icon: ICONS
    },
    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: {
          id: 'warranty-claim-assistant@holdmybill.com',
          // Provisional floor (open item O6): 140 is the first ESR that
          // understands data_collection_permissions
          strict_min_version: '140.0',
          data_collection_permissions: { required: ['none'] }
        }
      }
    })
  })
})
