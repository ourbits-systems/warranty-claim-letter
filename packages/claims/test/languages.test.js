import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { createClaim } from '../src/claim.js'
import {
  buildLetter,
  buildLetterParts,
  composeLetter,
  legalMode,
  letterLanguage
} from '../src/letter.js'
import { LETTER_PACKS } from '../src/letters/index.js'
import { COUNTRIES, outputLanguages } from '../src/rules.js'
import { TODAY } from './golden/cases.js'

const KINDS = ['first', 'followup', 'rejection', 'complaint']
const VERIFIED = { verifiedOnly: true }
const LOCAL = { DE: 'de', FR: 'fr', ES: 'es', NL: 'nl' }

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
    sellerResponse: 'refused',
    remedy: 'refund',
    ...overrides,
    product: {
      ...base.product,
      name: 'Pixel 9 Pro',
      brand: 'Google',
      model: 'GA05',
      price: '899',
      ...overrides.product
    },
    seller: { name: 'Acme GmbH', email: '', orderRef: 'A-1042' },
    fault: {
      ...base.fault,
      description: 'Das Display flackert.',
      noticedAt: '2026-10-01',
      troubleshooting: 'Werksreset'
    },
    letter: { sentAt: '2026-10-02', followupSentAt: '2026-10-12' },
    rejection: { receivedAt: '2026-10-10', reason: 'Kein Mangel' },
    you: { name: 'Erika Mustermann' }
  }
}

function withReviewed(code, fn) {
  const previous = COUNTRIES[code].reviewedAt
  COUNTRIES[code].reviewedAt = '2026-10-01'
  try {
    return fn()
  } finally {
    COUNTRIES[code].reviewedAt = previous
  }
}

describe('output languages', () => {
  test('a region offers its own language and English', () => {
    expect(outputLanguages('DE')).toEqual(['de', 'en'])
    expect(outputLanguages('NL')).toEqual(['nl', 'en'])
    expect(outputLanguages('IE')).toEqual(['en'])
    expect(outputLanguages('OTHER')).toEqual(['en'])
    expect(outputLanguages('XX')).toEqual(['en'])
  })

  test('every language pack has the same shape as English', () => {
    const shape = value =>
      typeof value === 'object' && value
        ? Object.fromEntries(
            Object.keys(value)
              .sort()
              .map(key => [key, shape(value[key])])
          )
        : typeof value
    const { cite, ...english } = LETTER_PACKS.en
    for (const [code, pack] of Object.entries(LETTER_PACKS)) {
      if (code === 'en') continue
      expect(pack.legalReviewed, code).toBe(false)
      const { cite: _none, ...rest } = pack
      expect(shape({ ...rest, code: '', dateLocale: '' }), code).toEqual(
        shape({ ...english, code: '', dateLocale: '' })
      )
    }
  })

  test('a language the region does not offer falls back to English', () => {
    expect(letterLanguage(claim({ country: 'DE', language: 'de' }))).toBe('de')
    expect(letterLanguage(claim({ country: 'FR', language: 'de' }))).toBe('en')
    expect(letterLanguage(claim({ country: 'IE', language: 'fr' }))).toBe('en')
    expect(letterLanguage({ ...claim(), language: undefined })).toBe('en')
  })
})

describe('localized letters', () => {
  test('are written in the language with local dates and bodies', () => {
    const de = buildLetter(
      claim({ country: 'DE', language: 'de' }),
      'first',
      VERIFIED
    )
    expect(de).toContain('An: Acme GmbH')
    expect(de).toContain(
      'Betreff: Mängelanzeige: Pixel 9 Pro (Bestellnummer A-1042)'
    )
    expect(de).toContain('Sehr geehrte Damen und Herren,')
    expect(de).toContain(
      'am 1. März 2026 habe ich von Ihnen folgendes Produkt erhalten: Pixel 9 Pro (Google, Modell GA05, Bestellnummer A-1042).'
    )
    expect(de).toContain('an die Verbraucherzentrale wenden')
    expect(de).toContain('in Höhe von 899 €')
    expect(de).toMatch(/Mit freundlichen Grüßen\nErika Mustermann$/)

    const fr = buildLetter(
      claim({ country: 'FR', language: 'fr' }),
      'first',
      VERIFIED
    )
    expect(fr).toContain('Le 1 mars 2026, j’ai reçu de votre part')
    expect(fr).toContain('en saisissant un médiateur de la consommation')

    const es = buildLetter(
      claim({ country: 'ES', language: 'es' }),
      'first',
      VERIFIED
    )
    expect(es).toContain('El 1 de marzo de 2026 recibí de ustedes')

    const nl = buildLetter(
      claim({ country: 'NL', language: 'nl' }),
      'first',
      VERIFIED
    )
    expect(nl).toContain('Op 1 maart 2026 heb ik van u')
  })

  test('user facts stay untranslated', () => {
    const letter = buildLetter(
      claim({ country: 'FR', language: 'fr' }),
      'rejection',
      VERIFIED
    )
    expect(letter).toContain('Das Display flackert.')
    expect(letter).toContain('« Kein Mangel »')
    expect(letter).toContain('Werksreset')
  })

  test('never cite statutes, even when the region is reviewed', () => {
    for (const [country, language] of Object.entries(LOCAL)) {
      withReviewed(country, () => {
        const c = claim({ country, language })
        expect(legalMode(c, VERIFIED)).toBe('conservative')
        expect(legalMode(c)).toBe('conservative')
        for (const kind of KINDS) {
          const letter = buildLetter(c, kind, VERIFIED)
          expect(letter).not.toContain(COUNTRIES[country].law)
          expect(letter).not.toMatch(/Directive|Richtlinie|§|articles? L217/)
        }
        // English for the same reviewed region does cite
        expect(legalMode({ ...c, language: 'en' }, VERIFIED)).toBe('cite')
      })
    }
  })

  test('complaints go to the local consumer body', () => {
    const parts = buildLetterParts(
      claim({ country: 'ES', language: 'es', type: 'formal_complaint' }),
      'complaint',
      VERIFIED
    )
    expect(parts.to).toBe(
      'Oficina Municipal de Información al Consumidor (OMIC)'
    )
    expect(parts.language).toBe('es')
    expect(
      composeLetter(claim({ country: 'ES', language: 'es' }), parts)
    ).toMatch(
      /^Erika Mustermann\n26 de octubre de 2026\n\nPara: Oficina Municipal/
    )
  })

  test('snapshot of every letter kind in every local language', async () => {
    const out = []
    for (const [country, language] of Object.entries(LOCAL)) {
      for (const kind of KINDS) {
        for (const response of ['no-reply', 'refused']) {
          const c = claim({ country, language, sellerResponse: response })
          out.push(
            `######## ${language}/${kind}/${response}`,
            buildLetter(c, kind, VERIFIED),
            ''
          )
        }
      }
      const empty = { ...createClaim(), country, language }
      out.push(
        `######## ${language}/first/empty`,
        buildLetter(empty, 'first', VERIFIED),
        ''
      )
    }
    await expect(out.join('\n')).toMatchFileSnapshot(
      'fixtures/localized-letters.golden.txt'
    )
  })
})
