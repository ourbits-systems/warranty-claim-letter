# Warranty Claim Assistant by HoldMyBill

A Chrome and Firefox (Manifest V3) extension that writes warranty claims, repair, replacement and refund requests, and follow-up letters. It opens in Chrome's side panel and Firefox's sidebar. It works offline and without an account; everything stays in the browser.

- Store listings and submission notes: [`store/`](store/)

## Layout

```text
packages/claims/        @ourbits-systems/claims: framework-free claim engine
  src/                    claim record, legal rules, letter structure
    letters/              letter wording per language (en, de, fr, es, nl)
    regions/              one versioned config per country
  test/                   golden tests (fixtures captured from the website)
src/
  entrypoints/            WXT entrypoints: background, sidepanel, print
  app/App.jsx             panel shell: header, tabs, screens
  features/claims/        Screen A (step flow) and B (letter editor)
  features/drafts/        Screen C, draft store, autosave session hook
  features/settings/      Screen D, appearance + defaults
  features/export/        print page used for "Save as PDF"
  components/ui/          shadcn-style primitives (button, inputs, fields)
  i18n/                   t(), locale detection, UI catalogs
                          (en, de, fr, es, hi, ar)
  browser/                Chrome/Firefox adapter: panel, storage, clipboard,
                          extension pages
  assets/styles.css       Tailwind 4 theme (tokens copied from the website)
tests/                  extension tests (WXT fake browser, happy-dom UI tests)
scripts/sync-web.mjs    vendors the claim engine into the website repo
public/icons/           extension icons
public/_locales/        localized manifest name and description
store/                  store listings (6 languages), Chrome/AMO form answers,
                        screenshot plan
.github/workflows/      CI: lint, test, zip, Firefox lint, reproducibility
```

## Requirements

- Node 22 or newer
- pnpm 12 (`corepack enable` picks up the version from `packageManager`)

## Commands

| Command | What it does |
| --- | --- |
| `pnpm install` | Install dependencies and generate WXT types (`.wxt/`) |
| `pnpm dev` / `pnpm dev:firefox` | Dev build with hot reload. WXT opens a browser with the extension loaded. |
| `pnpm build` | Production builds for both browsers into `.output/chrome-mv3` and `.output/firefox-mv3` |
| `pnpm build:chrome` / `pnpm build:firefox` | Build one browser |
| `pnpm zip` | Store-ready zips for both browsers in `.output/` (Firefox also gets a sources zip) |
| `pnpm test` | All tests: the claims package (`claims`) and the extension (`extension`) |
| `pnpm check` / `pnpm format` | Biome lint + format check, or apply the fixes |
| `pnpm lint:firefox` | Mozilla `addons-linter` on the Firefox build (run `pnpm build:firefox` first) |
| `pnpm sync:web` | Copy the claim engine into `../ourbits_hmb_web/lib/claims/core/` |
| `pnpm sync:web:check` | Fail if the website's vendored copy is out of date |

Set `HMB_WEB_DIR` or pass `--web <path>` to the sync scripts when the website repo is not at `../ourbits_hmb_web`.

## Loading the unpacked extension

- **Chrome:** open `chrome://extensions`, turn on Developer mode, click **Load unpacked** and pick `.output/chrome-mv3`. Clicking the toolbar icon opens the side panel.
- **Firefox (140+):** open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on…** and pick `.output/firefox-mv3/manifest.json`. Clicking the toolbar icon toggles the sidebar.

## Changing the claim engine

The website's `/tools/warranty-claim-letter` runs the same code, so changes to `packages/claims` reach both products.

1. Change `packages/claims/src`.
2. Run `pnpm test`. If letter wording changed **on purpose**, update the fixtures with `pnpm --filter @ourbits-systems/claims exec vitest run -u`. Then review the diff in `packages/claims/test/fixtures/letters.golden.txt` line by line.
3. Run `pnpm sync:web`, then `npm run build` in the website repo, and commit both repos.

The fixtures were captured from the website's original code. To check that another copy of the engine still matches them, point the golden test at that copy:

```sh
cd packages/claims
CLAIMS_SRC=../../../ourbits_hmb_web/lib/claims pnpm exec vitest run test/golden.test.js
```

## Adding a language

- **Interface:** copy `src/i18n/en.js` to `src/i18n/<code>.js`, translate it, and register it in `src/i18n/index.js`. If the language is right-to-left, add it to `RTL`. Add `public/_locales/<code>/messages.json`. `tests/i18n/catalogs.test.js` checks keys and placeholders.
- **Letters:** add `packages/claims/src/letters/<code>.js` with the same shape as `en.js` and `legalReviewed: false`. Register it in `letters/index.js`, and set `local` in the region file whose language it is. `test/languages.test.js` checks the shape.
