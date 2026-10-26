import { COUNTRIES, outputLanguages } from '@ourbits-systems/claims'
import { detectLocale } from '@/i18n'

const EU = new Set(
  'AT BE BG CY CZ DE DK EE ES FI FR GR HR HU IE IT LT LU LV MT NL PL PT RO SE SI SK'.split(
    ' '
  )
)

// Country suggestion from an explicit region in the browser's languages
// ("de-AT" -> AT -> Other EU). The language alone never decides it: "de"
// without a region gives no hint, and we fall back to "Other EU country".
export function detectCountry(languages = navigator.languages) {
  for (const tag of languages || []) {
    let region
    try {
      region = new Intl.Locale(tag).region
    } catch {
      continue
    }
    if (!region) continue
    if (COUNTRIES[region]) return region
    if (EU.has(region)) return 'OTHER'
  }
  return 'OTHER'
}

// Settings with "follow the browser" values resolved
export function resolveSettings(settings) {
  return {
    ...settings,
    uiLocale: settings.uiLocale || detectLocale(),
    country: settings.country || detectCountry()
  }
}

// Letter language for a new claim: the UI language when the region offers
// it, otherwise the region's own language (what the seller reads)
export function defaultLetterLanguage(country, uiLocale) {
  const offered = outputLanguages(country)
  return offered.includes(uiLocale) ? uiLocale : offered[0]
}

// Country and letter language for a new draft
export function draftDefaults(settings) {
  const { country, uiLocale } = resolveSettings(settings)
  return { country, language: defaultLetterLanguage(country, uiLocale) }
}
