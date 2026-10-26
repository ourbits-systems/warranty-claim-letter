import ar from './ar.js'
import de from './de.js'
import en from './en.js'
import es from './es.js'
import fr from './fr.js'
import hi from './hi.js'

// Runtime UI catalogs, switchable without reloading (browser i18n APIs only
// follow the browser language). Missing keys fall back to English; unknown
// keys show the key itself so they are easy to spot.
const catalogs = { en, de, fr, es, hi, ar }

export const UI_LOCALES = Object.keys(catalogs)
const RTL = new Set(['ar'])

let locale = 'en'

export function setLocale(next) {
  locale = catalogs[next] ? next : 'en'
}

export function getLocale() {
  return locale
}

export function isRtl(code = locale) {
  return RTL.has(code)
}

export function t(key, vars) {
  const template = catalogs[locale][key] ?? en[key] ?? key
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match
  )
}

// First supported language in the browser's preference list, e.g.
// ['de-AT', 'en'] -> 'de'
export function detectLocale(languages = navigator.languages) {
  for (const tag of languages || []) {
    const base = tag.toLowerCase().split('-')[0]
    if (catalogs[base]) return base
  }
  return 'en'
}

// Name of a language in `inLocale` (default: the UI language), as used
// inside a sentence ("Briefe auf Französisch", "les lettres en français").
export function languageName(code, inLocale = locale) {
  try {
    return (
      new Intl.DisplayNames([inLocale], { type: 'language' }).of(code) || code
    )
  } catch {
    return code
  }
}

// A language's own name for pickers: "Deutsch", "Français", "हिन्दी"
export function endonym(code) {
  const name = languageName(code, code)
  return name.charAt(0).toLocaleUpperCase(code) + name.slice(1)
}
