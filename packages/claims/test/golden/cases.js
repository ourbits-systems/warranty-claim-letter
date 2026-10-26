// Claim records covering every letter variant, region and coverage verdict.
// Dates are relative to TODAY, which the golden test pins as the clock.

export const TODAY = '2026-10-26'

const COUNTRIES = ['DE', 'FR', 'NL', 'ES', 'IE', 'OTHER', 'XX']

const REMEDIES = ['repair', 'replace', 'refund']
const RESPONSES = ['not-contacted', 'no-reply', 'refused']

function claim(overrides = {}) {
  const base = {
    v: 1,
    country: 'DE',
    sellerType: 'business',
    condition: 'new',
    product: { category: 'phone', name: 'Pixel 9 Pro', price: '899' },
    seller: {
      name: 'Acme Electronics GmbH',
      email: 'support@acme.example',
      orderRef: 'A-1042'
    },
    deliveredAt: '2026-03-01',
    fault: {
      description: 'The screen flickers and goes black after a few minutes.',
      noticedAt: '2026-10-01'
    },
    repairedAt: '',
    sellerResponse: 'not-contacted',
    remedy: 'repair',
    proof: { receipt: true, photos: true },
    letter: { sentAt: '', followupSentAt: '' },
    you: { name: 'Jane Doe' }
  }
  return deepMerge(base, overrides)
}

function deepMerge(base, overrides) {
  const out = { ...base }
  for (const [key, value] of Object.entries(overrides)) {
    out[key] =
      value && typeof value === 'object' && !Array.isArray(value)
        ? deepMerge(base[key] || {}, value)
        : value
  }
  return out
}

// Each scenario lands on a different verdict depending on the country rules
const SCENARIOS = {
  'recent-fault': {},
  'second-year': { deliveredAt: '2025-03-01' },
  'old-purchase': { deliveredAt: '2023-01-10' },
  'used-second-year': {
    condition: 'used',
    deliveredAt: '2025-06-01',
    fault: { noticedAt: '2026-09-01' }
  },
  'repair-extended': {
    deliveredAt: '2024-06-01',
    repairedAt: '2026-08-15'
  },
  'repair-before-extension': {
    deliveredAt: '2024-06-01',
    repairedAt: '2026-05-01'
  },
  'private-sale': { sellerType: 'private' },
  'no-delivery-date': { deliveredAt: '' },
  'future-delivery': { deliveredAt: '2027-01-01' },
  'noticed-before-delivery': {
    deliveredAt: '2025-03-01',
    fault: { noticedAt: '2024-12-01' }
  },
  'no-noticed-date': { fault: { noticedAt: '' } },
  'letters-sent': {
    letter: { sentAt: '2026-10-01', followupSentAt: '2026-10-20' }
  }
}

const PLACEHOLDERS = {
  'empty-details': {
    product: { category: 'laptop', name: '', price: '' },
    seller: { name: '', email: '', orderRef: '' },
    fault: { description: '', noticedAt: '' },
    proof: { receipt: false, photos: false },
    you: { name: '' }
  },
  'empty-other-category': {
    product: { category: 'other', name: '   ', price: '' },
    seller: { name: '  ', email: ' odd <x>@mail.example ', orderRef: '  ' },
    you: { name: '  ' }
  },
  'unknown-category': {
    product: { category: 'drone', name: '' }
  }
}

export function buildCases() {
  const cases = []
  let i = 0
  for (const country of COUNTRIES) {
    for (const [scenario, overrides] of Object.entries(SCENARIOS)) {
      // Rotate remedy and seller response so every pair shows up per country
      const remedy = REMEDIES[i % 3]
      const sellerResponse = RESPONSES[Math.floor(i / 3) % 3]
      i++
      cases.push({
        id: `${country}/${scenario}/${remedy}/${sellerResponse}`,
        claim: claim({ ...overrides, country, remedy, sellerResponse })
      })
    }
    for (const [variant, overrides] of Object.entries(PLACEHOLDERS)) {
      cases.push({
        id: `${country}/${variant}`,
        claim: claim({ ...overrides, country })
      })
    }
  }
  // Full remedy x seller response grid, with and without a price
  for (const remedy of REMEDIES) {
    for (const sellerResponse of RESPONSES) {
      for (const price of ['899', '']) {
        cases.push({
          id: `grid/${remedy}/${sellerResponse}/${price ? 'price' : 'no-price'}`,
          claim: claim({
            deliveredAt: '2025-03-01',
            remedy,
            sellerResponse,
            product: { price }
          })
        })
      }
    }
  }
  return cases
}

// Raw inputs for normalizeClaim/decodeClaim: old, partial, hostile shapes
export const RAW_CLAIMS = {
  null: null,
  string: 'claim',
  number: 42,
  empty: {},
  'future-version': { v: 2, country: 'FR' },
  'no-version': { country: 'FR' },
  partial: { v: 1, country: 'ES', product: { name: 'Kettle' } },
  'wrong-types': {
    v: 1,
    country: 7,
    product: 'phone',
    proof: { receipt: 'yes', photos: true },
    letter: null
  },
  'extra-keys': { v: 1, extra: true, product: { name: 'TV', serial: 'X1' } },
  'full-v1': claim()
}

export const DATE_CASES = {
  addMonths: [
    ['2026-01-31', 1],
    ['2024-02-29', 12],
    ['2024-02-29', 48],
    ['2026-12-15', 1],
    ['2026-03-31', -1],
    ['2026-13-01', 1],
    ['', 3],
    ['not-a-date', 3]
  ],
  addDays: [
    ['2026-10-26', 14],
    ['2026-12-25', 7],
    ['2024-02-28', 1],
    ['2026-03-01', -1],
    ['', 1]
  ],
  daysBetween: [
    ['2026-01-01', '2026-12-31'],
    ['2026-03-28', '2026-03-30'],
    ['2026-10-26', '2026-10-01'],
    ['', '2026-10-01']
  ],
  formatDate: ['2026-10-26', '2026-01-01', '2024-02-29', '', '2026-1-1', 'x']
}
