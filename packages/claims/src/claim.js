// Versioned claim record shared by the website claim letter tool, the browser
// extension and the future claims agent. Bump CLAIM_VERSION and migrate in
// normalizeClaim() when the shape changes; links and saved claims from older
// versions must still load.

import {
  FOLLOWUP_REPLY_DAYS,
  getCountryRule,
  REPAIR_EXTENSION_FROM,
  REPAIR_EXTENSION_MONTHS,
  REPLY_DAYS
} from './rules.js'

// v2 (2026-10): claim type, brand/model/warranty expiry, troubleshooting and
// history, rejection details. v1 records gain the new fields as defaults.
export const CLAIM_VERSION = 2
export const STORAGE_KEY = 'hmb.claim'

export const CATEGORIES = [
  { value: 'phone', label: 'Phone' },
  { value: 'laptop', label: 'Laptop or computer' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'tv', label: 'TV or monitor' },
  { value: 'appliance', label: 'Large appliance (washer, fridge)' },
  {
    value: 'small-appliance',
    label: 'Small appliance (coffee machine, vacuum)'
  },
  { value: 'audio', label: 'Headphones or speakers' },
  { value: 'wearable', label: 'Smartwatch or wearable' },
  { value: 'other', label: 'Something else' }
]

export const REMEDIES = [
  { value: 'repair', label: 'Repair' },
  { value: 'replace', label: 'Replacement' },
  { value: 'refund', label: 'Refund' }
]

// What the user wants to write. Each type maps to one letter kind (see
// letterKind() in letter.js); the request types also fix the remedy.
export const CLAIM_TYPES = [
  { value: 'warranty_claim', label: 'Warranty claim', kind: 'first' },
  {
    value: 'repair_request',
    label: 'Repair request',
    kind: 'first',
    remedy: 'repair'
  },
  {
    value: 'replacement_request',
    label: 'Replacement request',
    kind: 'first',
    remedy: 'replace'
  },
  {
    value: 'refund_request',
    label: 'Refund request',
    kind: 'first',
    remedy: 'refund'
  },
  { value: 'follow_up', label: 'Claim follow-up', kind: 'followup' },
  {
    value: 'rejection_response',
    label: 'Claim rejection response',
    kind: 'rejection'
  },
  { value: 'formal_complaint', label: 'Formal complaint', kind: 'complaint' }
]

export function getClaimType(value) {
  return CLAIM_TYPES.find(type => type.value === value) || CLAIM_TYPES[0]
}

// Remedy the letter asks for: fixed by request types, chosen otherwise
export function claimRemedy(claim) {
  return getClaimType(claim.type).remedy || claim.remedy
}

export const SELLER_RESPONSES = [
  { value: 'not-contacted', label: 'I have not contacted them yet' },
  { value: 'no-reply', label: 'I contacted them, no reply' },
  { value: 'refused', label: 'They refused or sent me to the manufacturer' }
]

export function createClaim() {
  return {
    v: CLAIM_VERSION,
    type: 'warranty_claim',
    country: 'DE',
    // Letter language, independent of the country and of the UI language.
    // Only the country's own language and English have templates.
    language: 'en',
    sellerType: 'business',
    condition: 'new',
    product: {
      category: 'phone',
      name: '',
      price: '',
      brand: '',
      model: '',
      // Manufacturer or commercial warranty end date, if the user knows it
      warrantyUntil: ''
    },
    seller: { name: '', email: '', orderRef: '' },
    deliveredAt: '',
    fault: {
      description: '',
      noticedAt: '',
      troubleshooting: '',
      priorContact: '',
      priorRepairs: ''
    },
    repairedAt: '',
    sellerResponse: 'not-contacted',
    remedy: 'repair',
    proof: { receipt: true, photos: false },
    letter: { sentAt: '', followupSentAt: '' },
    rejection: { receivedAt: '', reason: '' },
    // Personal details stay in this browser: never put in links or payloads
    you: { name: '' }
  }
}

function merge(base, value) {
  if (!value || typeof value !== 'object') return base
  const out = { ...base }
  for (const key of Object.keys(base)) {
    if (!(key in value)) continue
    const baseVal = base[key]
    out[key] =
      baseVal && typeof baseVal === 'object'
        ? merge(baseVal, value[key])
        : typeof value[key] === typeof baseVal
          ? value[key]
          : baseVal
  }
  return out
}

// v1 -> v2 needs no mapping: merge() fills the new fields with defaults
export function normalizeClaim(raw) {
  if (!raw || typeof raw !== 'object' || raw.v > CLAIM_VERSION) return null
  const claim = merge(createClaim(), raw)
  if (!CLAIM_TYPES.some(type => type.value === claim.type)) {
    claim.type = 'warranty_claim'
  }
  return { ...claim, v: CLAIM_VERSION }
}

// ---------- dates (YYYY-MM-DD strings, computed in UTC) ----------

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null
  const date = new Date(value + 'T00:00:00Z')
  return Number.isNaN(date.getTime()) ? null : date
}

function toIso(date) {
  return date.toISOString().slice(0, 10)
}

export function todayIso() {
  const now = new Date()
  return toIso(
    new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  )
}

export function addMonths(iso, months) {
  const date = parseDate(iso)
  if (!date) return ''
  const day = date.getUTCDate()
  date.setUTCDate(1)
  date.setUTCMonth(date.getUTCMonth() + months)
  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)
  ).getUTCDate()
  date.setUTCDate(Math.min(day, lastDay))
  return toIso(date)
}

export function addDays(iso, days) {
  const date = parseDate(iso)
  if (!date) return ''
  date.setUTCDate(date.getUTCDate() + days)
  return toIso(date)
}

export function daysBetween(fromIso, toIso_) {
  const from = parseDate(fromIso)
  const to = parseDate(toIso_)
  if (!from || !to) return null
  return Math.round((to - from) / 86400000)
}

// Long date in the given locale; en-GB ("26 October 2026") by default
export function formatDate(iso, locale = 'en-GB') {
  const date = parseDate(iso)
  if (!date) return ''
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  })
}

// ---------- coverage ----------

// Verdicts, strongest first:
//   seller-must-prove  fault appeared inside the presumption window
//   covered            inside the legal guarantee, buyer must show the
//                      fault existed at delivery
//   lifespan           no fixed period (NL): depends on expected lifespan
//   expired            legal guarantee has ended
//   private-sale       no legal guarantee between private individuals
//   incomplete         delivery date missing or invalid
export function computeCoverage(claim, today = todayIso()) {
  const rule = getCountryRule(claim.country)
  const used = claim.condition === 'used'
  const base = {
    rule,
    used,
    legalUntil: '',
    presumptionUntil: '',
    extended: false
  }

  if (claim.sellerType === 'private')
    return { ...base, verdict: 'private-sale' }

  const delivered = parseDate(claim.deliveredAt)
  if (!delivered || claim.deliveredAt > today) {
    return { ...base, verdict: 'incomplete' }
  }

  const faultDate =
    parseDate(claim.fault.noticedAt) &&
    claim.fault.noticedAt >= claim.deliveredAt
      ? claim.fault.noticedAt
      : today

  const presumptionYears = used
    ? rule.usedPresumptionYears
    : rule.presumptionYears
  const presumptionUntil = addMonths(claim.deliveredAt, presumptionYears * 12)

  const extended =
    !!parseDate(claim.repairedAt) &&
    claim.repairedAt >= REPAIR_EXTENSION_FROM &&
    claim.repairedAt >= claim.deliveredAt

  let legalUntil = ''
  if (rule.legalYears) {
    legalUntil = addMonths(claim.deliveredAt, rule.legalYears * 12)
    if (extended) legalUntil = addMonths(legalUntil, REPAIR_EXTENSION_MONTHS)
  }

  const result = { ...base, presumptionUntil, legalUntil, extended, faultDate }

  if (faultDate <= presumptionUntil) {
    return { ...result, verdict: 'seller-must-prove' }
  }
  if (!rule.legalYears) return { ...result, verdict: 'lifespan' }
  if (faultDate <= legalUntil) return { ...result, verdict: 'covered' }
  return { ...result, verdict: 'expired' }
}

export function isClaimable(coverage) {
  return ['seller-must-prove', 'covered', 'lifespan'].includes(coverage.verdict)
}

export function replyDeadline(claim, today = todayIso()) {
  return addDays(claim.letter.sentAt || today, REPLY_DAYS)
}

export function followupDeadline(claim, today = todayIso()) {
  return addDays(claim.letter.followupSentAt || today, FOLLOWUP_REPLY_DAYS)
}

// ---------- links + storage ----------

function toBase64Url(text) {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

// Payload for links and the claims agent hand-off; drops personal details
export function encodeClaim(claim) {
  const { you, ...shareable } = claim
  return toBase64Url(JSON.stringify(shareable))
}

export function decodeClaim(value) {
  try {
    return normalizeClaim(JSON.parse(fromBase64Url(value)))
  } catch {
    return null
  }
}

// Single-claim store over a Web Storage-like object (getItem/setItem/
// removeItem). `getStorage` is called on every access so a host can pass
// () => window.localStorage, whose getter itself throws when storage is
// blocked. Async stores (extension storage.local) use parseStoredClaim.
export function createClaimStorage(getStorage, key = STORAGE_KEY) {
  return {
    load() {
      try {
        return parseStoredClaim(getStorage().getItem(key))
      } catch {
        return null
      }
    },
    store(claim) {
      try {
        getStorage().setItem(key, JSON.stringify(claim))
      } catch {
        // Storage blocked (private mode): the tool still works without it
      }
    },
    clear() {
      try {
        getStorage().removeItem(key)
      } catch {}
    }
  }
}

export function parseStoredClaim(raw) {
  if (!raw) return null
  try {
    return normalizeClaim(typeof raw === 'string' ? JSON.parse(raw) : raw)
  } catch {
    return null
  }
}

// Coarse, non-personal summary for analytics and waitlist tagging
export function claimSummary(claim, coverage) {
  return {
    country: claim.country,
    category: claim.product.category,
    condition: claim.condition,
    remedy: claim.remedy,
    seller_response: claim.sellerResponse,
    verdict: coverage.verdict
  }
}
