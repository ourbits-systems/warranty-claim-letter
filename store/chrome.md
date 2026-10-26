# Chrome Web Store submission

Answers for the Developer Dashboard. Listing text per language: `listing/<lang>.md`. Upload `.output/warranty-claim-assistant-<version>-chrome.zip`, which CI or `pnpm zip` builds.

## Store listing tab

| Field | Value |
| --- | --- |
| Name / summary | From `public/_locales/<lang>/messages.json` (taken from the package) |
| Description | `listing/<lang>.md` → "Detailed description", one per language |
| Category | Productivity → Tools (check the current category list in the dashboard) |
| Language | English (default), plus localized listings: de, fr, es, hi, ar |
| Store icon | `public/icons/128.png` (128×128). Design: Chrome wants about 96×96 of artwork with transparent padding; the current icon is the HoldMyBill app icon scaled down |
| Screenshots | See `screenshots.md` (1280×800, 1–5 per language) |
| Small promo tile | 440×280, optional (design) |
| Homepage URL | https://holdmybill.com/tools/warranty-claim-letter |
| Support URL | https://holdmybill.com/support |

## Privacy practices tab

**Single purpose**

> Helps people write warranty claims, repair, replacement and refund requests, follow-ups and consumer complaints about products they bought, in a side panel, without an account.

**Permission justifications**

| Permission | Justification |
| --- | --- |
| `storage` | Saves the user's claim drafts and settings (language, appearance, default country) locally in the browser, so a claim survives closing the side panel and restarting the browser. Nothing is synced or sent anywhere. |
| `sidePanel` | The assistant's interface is a side panel opened from the toolbar button, so users can write their letter next to the shop or email page they are looking at. |

Host permissions: none. The extension does not inject content scripts.

**Remote code:** No, I am not using remote code. All JavaScript is bundled in the package, and the CSP is `script-src 'self'`.

**Data usage:** tick none of the data categories (personally identifiable information, health, financial, authentication, personal communications, location, web history, user activity, website content). The extension stores what the user types in `storage.local` on their own device and transmits nothing.

Certify all three statements:
- I do not sell or transfer user data to third parties, outside of the approved use cases
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- I do not use or transfer user data to determine creditworthiness or for lending purposes

**Privacy policy URL:** https://holdmybill.com/legal/browser-extension-privacy (publish the website page before submitting)

## Distribution tab

- Visibility: Public (or Unlisted for a soft launch)
- Regions: all regions. The legal rules are EU-only, which the listing and the in-app country hint say.

## Before each submission

1. `package.json` version bumped (the manifest version comes from it)
2. CI green on the release tag; download the `chrome` zip artifact
3. Load the zip's contents unpacked in Chrome and smoke-test it: write, edit, copy, email and PDF a letter; reopen the panel and restart the browser to check drafts; switch to Arabic (RTL) and back
4. Upload, update the listing text if changed, submit for review
