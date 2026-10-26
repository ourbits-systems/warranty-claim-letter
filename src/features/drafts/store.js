import { createClaim, normalizeClaim } from '@ourbits-systems/claims'
import { draftsItem } from '@/browser/storage'

// A draft is one claim in progress:
//   { id, name, claim, step, edits, createdAt, updatedAt }
// `claim` is a @ourbits-systems/claims record (normalized on every read, so old
// drafts upgrade with CLAIM_VERSION). `edits` holds the user's changes to the
// letter: { subject, body, basedOn } where basedOn is the generated text the
// edits started from, or null while the letter follows the form.

export const STEPS = ['type', 'product', 'issue', 'region', 'letter']

export function newDraft({ country = 'OTHER', language = 'en' } = {}) {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: '',
    claim: { ...createClaim(), country, language },
    step: 'type',
    edits: null,
    createdAt: now,
    updatedAt: now
  }
}

function normalizeDraft(raw) {
  if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string') {
    return null
  }
  const claim = normalizeClaim(raw.claim)
  if (!claim) return null
  return {
    id: raw.id,
    name: typeof raw.name === 'string' ? raw.name : '',
    claim,
    step: STEPS.includes(raw.step) ? raw.step : 'type',
    edits:
      raw.edits && typeof raw.edits.body === 'string'
        ? {
            subject: String(raw.edits.subject ?? ''),
            body: raw.edits.body,
            basedOn: String(raw.edits.basedOn ?? '')
          }
        : null,
    createdAt: raw.createdAt || '',
    updatedAt: raw.updatedAt || ''
  }
}

// Newest first; drafts that cannot be read (corrupt, newer version) are
// skipped rather than breaking the list
export async function listDrafts() {
  const all = await draftsItem.getValue()
  return Object.values(all)
    .map(normalizeDraft)
    .filter(Boolean)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function getDraft(id) {
  if (!id) return null
  const all = await draftsItem.getValue()
  return normalizeDraft(all[id])
}

export async function saveDraft(draft) {
  const all = await draftsItem.getValue()
  const saved = { ...draft, updatedAt: new Date().toISOString() }
  await draftsItem.setValue({ ...all, [draft.id]: saved })
  return saved
}

export async function renameDraft(id, name) {
  const all = await draftsItem.getValue()
  if (!all[id]) return
  await draftsItem.setValue({
    ...all,
    [id]: { ...all[id], name: name.trim() }
  })
}

export async function deleteDraft(id) {
  const { [id]: _removed, ...rest } = await draftsItem.getValue()
  await draftsItem.setValue(rest)
}

export async function deleteAllDrafts() {
  await draftsItem.removeValue()
}

// A draft is worth keeping once the user has typed or chosen something
export function isBlank(draft) {
  const blank = createClaim()
  const { claim } = draft
  return (
    claim.type === blank.type &&
    !claim.product.name &&
    !claim.product.brand &&
    !claim.seller.name &&
    !claim.fault.description &&
    !claim.deliveredAt &&
    draft.step === 'type'
  )
}
