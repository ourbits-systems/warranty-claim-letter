# Firefox Add-ons (AMO) submission

Upload `.output/warranty-claim-assistant-<version>-firefox.zip` and, when asked for source code, `.output/warranty-claim-assistant-<version>-sources.zip`. Both come from CI or `pnpm zip`.

## Listing

| Field | Value |
| --- | --- |
| Add-on ID | `warranty-claim-assistant@holdmybill.com` (fixed in `wxt.config.js`; never change it after the first upload) |
| Name / summary | From `public/_locales/<lang>/messages.json` |
| Description | `listing/<lang>.md` → "Detailed description" |
| Categories (Firefox) | Shopping; Other |
| Platforms | **Firefox for desktop only.** Untick Android: the sidebar does not exist there. |
| Support site | https://holdmybill.com/support |
| Support email | support@holdmybill.com |
| Homepage | https://holdmybill.com/tools/warranty-claim-letter |
| Privacy policy | https://holdmybill.com/legal/browser-extension-privacy |
| License | All Rights Reserved, unless the company decides otherwise |
| Minimum version | Firefox 140 (`strict_min_version`, ESR; still to be confirmed) |

## Data collection

The manifest declares `data_collection_permissions: { required: ["none"] }`, so AMO shows that the add-on collects no data. Change it only together with the privacy policy, if a feature ever sends data.

## Notes to reviewer (paste into "Notes to Reviewer")

> Build from the attached source archive:
>
> 1. Node.js 24.15.0 (see `.nvmrc`) and pnpm 12.15.0 (`corepack enable` picks it up from `packageManager` in package.json)
> 2. `pnpm install --frozen-lockfile`
> 3. `pnpm build:firefox`
> 4. The add-on is in `.output/firefox-mv3/`. Builds are reproducible: two clean builds produce byte-identical files.
>
> The code is plain JavaScript/JSX bundled with WXT (Vite). Third-party libraries come from npm through the lockfile: React 19, lucide-react (icons), clsx, tailwind-merge, class-variance-authority, and @fontsource-variable fonts (bundled locally). `packages/claims` is our own letter engine (a pnpm workspace package).
>
> The add-on makes no network requests, has no host permissions and no content scripts, and only uses `storage.local`. The two `innerHTML` linter warnings come from react-dom internals, not from our code. User text is only ever rendered as text.

## Signing from the command line (optional)

You can submit a listed version with API credentials from https://addons.mozilla.org/developers/addon/api/key/:

```sh
pnpm zip
pnpm exec web-ext sign --channel listed \
  --source-dir .output/firefox-mv3 \
  --upload-source-code .output/warranty-claim-assistant-<version>-sources.zip \
  --api-key "$AMO_JWT_ISSUER" --api-secret "$AMO_JWT_SECRET"
```

Run `pnpm exec web-ext sign --help` to confirm the flags of the installed web-ext version. Do not commit the credentials. The CI workflow does not sign.
