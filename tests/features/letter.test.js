import { describe, expect, test } from 'vitest'
import { draftLetter } from '@/features/claims/letter'
import { stepErrors } from '@/features/claims/validation'
import { newDraft } from '@/features/drafts/store'

function draftWith(claimPatch = {}, extra = {}) {
  const draft = newDraft()
  const claim = { ...draft.claim, ...claimPatch }
  return { ...draft, claim, ...extra }
}

describe('draftLetter', () => {
  test('follows the form until the user edits', () => {
    const draft = draftWith({
      product: { ...newDraft().claim.product, name: 'Kettle' }
    })
    const letter = draftLetter(draft)
    expect(letter.edited).toBe(false)
    expect(letter.subject).toBe('Lack of conformity: Kettle')
    expect(letter.text).toContain('Subject: Lack of conformity: Kettle')
    expect(letter.mailto).toMatch(/^mailto:\?subject=Lack%20of%20conformity/)
  })

  test('keeps edits and flags them as stale when the form changes', () => {
    const base = draftWith()
    const generated = draftLetter(base)
    const edits = {
      subject: 'My subject',
      body: 'My body',
      basedOn: generated.generatedText
    }
    const edited = draftLetter({ ...base, edits })
    expect(edited).toMatchObject({
      subject: 'My subject',
      body: 'My body',
      edited: true,
      stale: false
    })
    expect(edited.text).toContain('Subject: My subject\n\nMy body')

    const changed = {
      ...base,
      edits,
      claim: { ...base.claim, remedy: 'refund' }
    }
    expect(draftLetter(changed).stale).toBe(true)
  })

  test('complaint emails leave the recipient for the user', () => {
    const draft = draftWith({
      type: 'formal_complaint',
      seller: { name: 'Acme', email: 'shop@acme.example', orderRef: '' }
    })
    expect(draftLetter(draft).mailto).toMatch(/^mailto:\?/)
    const first = draftWith({
      seller: { name: 'Acme', email: 'shop@acme.example', orderRef: '' }
    })
    expect(draftLetter(first).mailto).toMatch(/^mailto:shop@acme\.example\?/)
  })
})

describe('stepErrors', () => {
  const today = '2026-10-26'
  const claim = newDraft().claim

  test('only the problem description is required', () => {
    expect(stepErrors('issue', claim, today)).toHaveProperty('description')
    const described = {
      ...claim,
      fault: { ...claim.fault, description: 'Broken' }
    }
    expect(stepErrors('issue', described, today)).toEqual({})
    expect(stepErrors('product', claim, today)).toEqual({})
    expect(stepErrors('type', claim, today)).toEqual({})
  })

  test('rejects future dates, faults before delivery and bad emails', () => {
    const bad = {
      ...claim,
      deliveredAt: '2026-10-10',
      seller: { ...claim.seller, email: 'not-an-email' },
      fault: { ...claim.fault, description: 'x', noticedAt: '2026-10-01' },
      letter: { sentAt: '2026-12-01', followupSentAt: '' }
    }
    expect(Object.keys(stepErrors('product', bad, today))).toEqual([
      'sellerEmail'
    ])
    expect(Object.keys(stepErrors('issue', bad, today)).sort()).toEqual([
      'noticedAt',
      'sentAt'
    ])
    expect(
      stepErrors('product', { ...bad, deliveredAt: '2027-01-01' }, today)
    ).toHaveProperty('deliveredAt')
  })
})
