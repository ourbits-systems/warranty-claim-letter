// Legal guarantee rules per country, used by the warranty claim letter tool
// and (later) the claims agent. Keep this file framework-free.
//
// LEGAL REVIEW PENDING: every entry has `reviewedAt: null` until a lawyer has
// checked the periods and citations. Set it to the review date (YYYY-MM-DD)
// once checked; the page shows "Rules last checked" only when all are set.

// Directive (EU) 2024/1799 (Right to Repair) adds 12 months to the legal
// guarantee when the consumer chooses repair. Member states had to apply it
// from 31 July 2026.
import de from './regions/de.js'
import es from './regions/es.js'
import fr from './regions/fr.js'
import ie from './regions/ie.js'
import nl from './regions/nl.js'
import other from './regions/other.js'

export const REPAIR_EXTENSION_MONTHS = 12
export const REPAIR_EXTENSION_FROM = '2026-07-31'

export const REPLY_DAYS = 14
export const FOLLOWUP_REPLY_DAYS = 7

// One versioned file per region in ./regions (terminology, sources, review
// date, escalation body). Key order is the order shown to users.
export const COUNTRIES = {
  DE: de,
  FR: fr,
  NL: nl,
  ES: es,
  IE: ie,
  OTHER: other
}

export const COUNTRY_OPTIONS = Object.entries(COUNTRIES).map(
  ([value, rule]) => ({ value, label: rule.label })
)

export function getCountryRule(code) {
  return COUNTRIES[code] || COUNTRIES.OTHER
}

export function rulesReviewedAt() {
  const dates = Object.values(COUNTRIES).map(rule => rule.reviewedAt)
  if (dates.some(date => !date)) return null
  return dates.sort()[0]
}

// Letter languages for a region: its own language (if we have templates for
// it) and English. Other languages need the AI path (Phase 3).
export function outputLanguages(code) {
  const local = getCountryRule(code).local?.language
  return local ? [local, 'en'] : ['en']
}
