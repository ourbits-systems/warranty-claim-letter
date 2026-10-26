import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import {
  CLAIM_TYPES,
  claimRemedy,
  createClaim,
  normalizeClaim
} from '../src/claim.js'
import {
  buildEmail,
  buildLetter,
  legalMode,
  letterKind
} from '../src/letter.js'
import { COUNTRIES } from '../src/rules.js'
import { TODAY } from './golden/cases.js'

const KINDS = ['first', 'followup', 'rejection', 'complaint']
const VERIFIED = { verifiedOnly: true }

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(`${TODAY}T12:00:00Z`))
})

afterAll(() => {
  vi.useRealTimers()
})

function claim(overrides = {}) {
  const base = createClaim()
  return {
    ...base,
    deliveredAt: '2026-03-01',
    ...overrides,
    product: { ...base.product, name: 'Pixel 9 Pro', ...overrides.product },
    seller: {
      ...base.seller,
      name: 'Acme Electronics GmbH',
      email: 'support@acme.example',
      ...overrides.seller
    },
    fault: {
      ...base.fault,
      description: 'The screen flickers.',
      noticedAt: '2026-10-01',
      ...overrides.fault
    },
    you: { name: 'Jane Doe' }
  }
}

// Temporarily mark a region as legally reviewed
function withReviewed(code, fn) {
  const previous = COUNTRIES[code].reviewedAt
  COUNTRIES[code].reviewedAt = '2026-10-01'
  try {
    return fn()
  } finally {
    COUNTRIES[code].reviewedAt = previous
  }
}

describe('claim types', () => {
  test('every type maps to a letter kind', () => {
    for (const type of CLAIM_TYPES) {
      expect(KINDS).toContain(letterKind({ type: type.value }))
    }
    expect(letterKind({ type: 'follow_up' })).toBe('followup')
    expect(letterKind({ type: 'rejection_response' })).toBe('rejection')
    expect(letterKind({ type: 'formal_complaint' })).toBe('complaint')
    expect(letterKind({})).toBe('first')
  })

  test('request types fix the remedy, others use the chosen one', () => {
    const base = { ...createClaim(), remedy: 'refund' }
    expect(claimRemedy({ ...base, type: 'repair_request' })).toBe('repair')
    expect(claimRemedy({ ...base, type: 'replacement_request' })).toBe(
      'replace'
    )
    expect(claimRemedy({ ...base, type: 'warranty_claim' })).toBe('refund')
    expect(claimRemedy({ ...base, type: 'follow_up' })).toBe('refund')
  })

  test('a repair request asks for a repair even if remedy says refund', () => {
    const letter = buildLetter(
      claim({ type: 'repair_request', remedy: 'refund' }),
      'first'
    )
    expect(letter).toContain('I request that you repair the Pixel 9 Pro')
    expect(letter).not.toContain('refund')
  })
})

describe('normalizeClaim v1 -> v2', () => {
  test('v1 records keep their data and gain v2 defaults', () => {
    const v1 = {
      v: 1,
      country: 'FR',
      product: { category: 'tv', name: 'TV', price: '500' },
      fault: { description: 'Dead pixels', noticedAt: '2026-09-01' }
    }
    const v2 = normalizeClaim(v1)
    expect(v2.v).toBe(2)
    expect(v2.type).toBe('warranty_claim')
    expect(v2.product).toMatchObject({
      name: 'TV',
      price: '500',
      brand: '',
      model: '',
      warrantyUntil: ''
    })
    expect(v2.fault).toMatchObject({
      description: 'Dead pixels',
      troubleshooting: '',
      priorContact: '',
      priorRepairs: ''
    })
    expect(v2.rejection).toEqual({ receivedAt: '', reason: '' })
  })

  test('unknown claim types fall back to a warranty claim', () => {
    expect(normalizeClaim({ v: 2, type: 'lawsuit' }).type).toBe(
      'warranty_claim'
    )
    expect(normalizeClaim({ v: 2, type: 'formal_complaint' }).type).toBe(
      'formal_complaint'
    )
  })

  test('newer versions are rejected', () => {
    expect(normalizeClaim({ v: 3 })).toBeNull()
  })
})

describe('verifiedOnly legal wording', () => {
  test('unreviewed regions never cite statutes, periods or presumptions', () => {
    for (const code of Object.keys(COUNTRIES)) {
      for (const kind of KINDS) {
        const c = claim({ country: code, repairedAt: '2026-08-15' })
        const letter = buildLetter(c, kind, VERIFIED)
        expect(legalMode(c, VERIFIED)).toBe('conservative')
        expect(letter).not.toContain(COUNTRIES[code].law)
        expect(letter).not.toMatch(
          /Directive|of delivery\.|presumed|as the law requires|entitled|Small Claims/
        )
      }
    }
  })

  test('reviewed regions cite the rules, like the website', () => {
    withReviewed('DE', () => {
      const c = claim({ country: 'DE' })
      expect(legalMode(c, VERIFIED)).toBe('cite')
      expect(buildLetter(c, 'first', VERIFIED)).toBe(buildLetter(c, 'first'))
      expect(buildLetter(c, 'followup', VERIFIED)).toBe(
        buildLetter(c, 'followup')
      )
    })
  })

  test('expired or private sales make no legal guarantee claim', () => {
    const expired = claim({ deliveredAt: '2023-01-10' })
    const privateSale = claim({ sellerType: 'private' })
    for (const c of [expired, privateSale]) {
      expect(legalMode(c, VERIFIED)).toBe('none')
      for (const kind of KINDS) {
        expect(buildLetter(c, kind, VERIFIED)).not.toMatch(
          /consumer law|Directive|legal guarantee/
        )
      }
    }
  })

  test('a missing delivery date stays conservative even when reviewed', () => {
    withReviewed('DE', () => {
      expect(legalMode(claim({ deliveredAt: '' }), VERIFIED)).toBe(
        'conservative'
      )
    })
  })
})

describe('facts come only from the user', () => {
  test('optional details appear verbatim and only when given', () => {
    const bare = buildLetter(claim(), 'first', VERIFIED)
    expect(bare).not.toMatch(/Steps I have|Previous|warranty for this/)

    const full = buildLetter(
      claim({
        product: {
          brand: 'Google',
          model: 'GA05',
          warrantyUntil: '2027-03-01'
        },
        fault: {
          troubleshooting: 'Factory reset twice',
          priorContact: 'Phoned support on 3 October',
          priorRepairs: 'Screen replaced in May'
        }
      }),
      'first',
      VERIFIED
    )
    expect(full).toContain('the Pixel 9 Pro (Google, model GA05) from you')
    expect(full).toContain('Steps I have already taken: Factory reset twice')
    expect(full).toContain(
      'Previous contact with you: Phoned support on 3 October'
    )
    expect(full).toContain('Previous repairs: Screen replaced in May')
    expect(full).toContain(
      "The manufacturer's warranty for this product runs until 1 March 2027."
    )
  })

  test('an expired manufacturer warranty is not mentioned', () => {
    const letter = buildLetter(
      claim({ product: { warrantyUntil: '2026-01-01' } }),
      'first',
      VERIFIED
    )
    expect(letter).not.toContain("manufacturer's warranty")
  })

  test('missing facts become placeholders, never invented values', () => {
    const empty = {
      ...createClaim(),
      type: 'formal_complaint',
      sellerResponse: 'refused'
    }
    for (const kind of KINDS) {
      const letter = buildLetter(empty, kind, VERIFIED)
      expect(letter).toContain('[Your name]')
      // The follow-up refers back to the first letter instead
      if (kind !== 'followup') expect(letter).toContain('[Describe the fault]')
      // The only dates are today's and the computed reply deadline
      const dates = letter.match(/\d{1,2} \w+ \d{4}/g) || []
      for (const date of dates) {
        expect([
          '26 October 2026',
          '9 November 2026',
          '2 November 2026'
        ]).toContain(date)
      }
    }
  })
})

describe('rejection response', () => {
  test('quotes the rejection and asks the seller to reconsider', () => {
    const letter = buildLetter(
      claim({
        type: 'rejection_response',
        letter: { sentAt: '2026-10-02', followupSentAt: '' },
        rejection: {
          receivedAt: '2026-10-10',
          reason: 'Please contact the manufacturer'
        }
      }),
      'rejection',
      VERIFIED
    )
    expect(letter).toContain('Subject: Your rejection of my claim: Pixel 9 Pro')
    expect(letter).toContain(
      'On 2 October 2026 I asked you to resolve a fault in the Pixel 9 Pro, delivered on 1 March 2026. On 10 October 2026 you rejected my claim, giving this reason: "Please contact the manufacturer".'
    )
    expect(letter).toContain('Please reconsider your decision')
    expect(letter).toContain('- Copy of your rejection')
  })
})

describe('formal complaint', () => {
  test('is addressed to the consumer body, about the seller', () => {
    const c = claim({
      country: 'IE',
      type: 'formal_complaint',
      sellerResponse: 'no-reply',
      remedy: 'replace',
      letter: { sentAt: '2026-09-20', followupSentAt: '2026-10-10' }
    })
    const letter = buildLetter(c, 'complaint', VERIFIED)
    expect(letter).toContain(
      'To: The Competition and Consumer Protection Commission (CCPC)'
    )
    expect(letter).toContain('Subject: Complaint about Acme Electronics GmbH')
    expect(letter).toContain('Dear Sir or Madam,')
    expect(letter).toContain(
      'On 20 September 2026 I asked the seller in writing to resolve the problem. I have not received a reply. On 10 October 2026 I sent a final notice'
    )
    expect(letter).toContain('I am asking for a free replacement.')
    expect(letter).toContain('the seller is responsible')
    expect(letter).not.toMatch(/\byou as the seller\b/)
  })

  test('email leaves the recipient empty', () => {
    const c = claim({ type: 'formal_complaint' })
    expect(buildEmail(c, 'complaint', VERIFIED).to).toBe('')
    expect(buildEmail(c, 'first', VERIFIED).to).toBe('support@acme.example')
  })
})

describe('extension letters snapshot', () => {
  test('every claim type in verifiedOnly mode', async () => {
    const out = []
    for (const type of CLAIM_TYPES) {
      for (const scenario of ['fresh', 'answered', 'reviewed-DE']) {
        const c = claim({
          type: type.value,
          remedy: 'refund',
          sellerResponse: scenario === 'fresh' ? 'not-contacted' : 'refused',
          product: { brand: 'Google', model: 'GA05' },
          fault: { troubleshooting: 'Factory reset' },
          letter:
            scenario === 'fresh'
              ? { sentAt: '', followupSentAt: '' }
              : { sentAt: '2026-10-02', followupSentAt: '' },
          rejection:
            scenario === 'fresh'
              ? { receivedAt: '', reason: '' }
              : { receivedAt: '2026-10-10', reason: 'Not a defect' }
        })
        const render = () => buildLetter(c, letterKind(c), VERIFIED)
        const letter =
          scenario === 'reviewed-DE' ? withReviewed('DE', render) : render()
        out.push(`######## ${type.value}/${scenario}`, letter, '')
      }
    }
    await expect(out.join('\n')).toMatchFileSnapshot(
      'fixtures/extension-letters.golden.txt'
    )
  })
})
