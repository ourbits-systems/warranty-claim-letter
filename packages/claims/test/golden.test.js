// Golden tests: the package must produce exactly what the website's original
// lib/claims code produced. The fixtures were captured from that code with
//
//   CLAIMS_SRC=/path/to/ourbits_hmb_web/lib/claims pnpm test -u golden
//
// and must never be regenerated from the package itself unless a letter
// change is intended (then review the fixture diff line by line).

import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { buildCases, DATE_CASES, RAW_CLAIMS, TODAY } from './golden/cases.js'

const SRC = process.env.CLAIMS_SRC
  ? resolve(process.env.CLAIMS_SRC)
  : resolve(import.meta.dirname, '../src')

const load = name => import(/* @vite-ignore */ `${SRC}/${name}.js`)

let claimMod
let rulesMod
let letterMod

beforeAll(async () => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(`${TODAY}T12:00:00Z`))
  ;[claimMod, rulesMod, letterMod] = await Promise.all(
    ['claim', 'rules', 'letter'].map(load)
  )
})

afterAll(() => {
  vi.useRealTimers()
})

function renderCase({ id, claim }) {
  const L = letterMod
  const C = claimMod
  const coverage = C.computeCoverage(claim)
  const firstEmail = L.buildEmail(claim)
  const followEmail = L.buildEmail(claim, 'followup')
  const facts = {
    verdict: coverage.verdict,
    claimable: C.isClaimable(coverage),
    used: coverage.used,
    extended: coverage.extended,
    legalUntil: coverage.legalUntil,
    presumptionUntil: coverage.presumptionUntil,
    faultDate: coverage.faultDate ?? null,
    rule: coverage.rule.label,
    replyDeadline: C.replyDeadline(claim),
    followupDeadline: C.followupDeadline(claim),
    summary: C.claimSummary(claim, coverage)
  }
  // mailto links are long and only depend on the email, so keep a sample
  const mailto = MAILTO_CASES.test(id)
    ? [
        '-------- mailto: first',
        L.buildMailto(firstEmail),
        '-------- mailto: followup',
        L.buildMailto(followEmail)
      ]
    : []
  return [
    `######## ${id}`,
    JSON.stringify(facts),
    '-------- letter: first',
    L.buildLetter(claim),
    '-------- letter: followup',
    L.buildFollowupLetter(claim),
    '-------- email: first',
    L.emailAsText(firstEmail),
    '-------- email: followup',
    L.emailAsText(followEmail),
    ...mailto,
    ''
  ].join('\n')
}

const MAILTO_CASES = /^DE\/|\/empty-|^grid\/refund\//

describe('golden output', () => {
  test('letters, emails and coverage for every case', async () => {
    const cases = buildCases()
    for (const c of cases) {
      // buildLetter(claim) and buildLetter(claim, 'first') must agree
      expect(letterMod.buildLetter(c.claim, 'first')).toBe(
        letterMod.buildLetter(c.claim)
      )
    }
    const text = cases.map(renderCase).join('\n')
    await expect(text).toMatchFileSnapshot('fixtures/letters.golden.txt')
  })

  test('record helpers, dates and rules', async () => {
    const C = claimMod
    const R = rulesMod
    const values = {
      CLAIM_VERSION: C.CLAIM_VERSION,
      STORAGE_KEY: C.STORAGE_KEY,
      CATEGORIES: C.CATEGORIES,
      REMEDIES: C.REMEDIES,
      SELLER_RESPONSES: C.SELLER_RESPONSES,
      createClaim: C.createClaim(),
      normalizeClaim: Object.fromEntries(
        Object.entries(RAW_CLAIMS).map(([k, raw]) => [k, C.normalizeClaim(raw)])
      ),
      encodeClaim: C.encodeClaim(buildCases()[0].claim),
      decodeClaim: {
        roundTrip: C.decodeClaim(
          C.encodeClaim({
            ...buildCases()[0].claim,
            product: {
              category: 'tv',
              name: 'Télé 4K – “Ünïcode” 📺',
              price: ''
            }
          })
        ),
        garbage: C.decodeClaim('%%%'),
        notJson: C.decodeClaim('bm90IGpzb24'),
        empty: C.decodeClaim('')
      },
      todayIso: C.todayIso(),
      addMonths: DATE_CASES.addMonths.map(([d, n]) => C.addMonths(d, n)),
      addDays: DATE_CASES.addDays.map(([d, n]) => C.addDays(d, n)),
      daysBetween: DATE_CASES.daysBetween.map(([a, b]) => C.daysBetween(a, b)),
      formatDate: DATE_CASES.formatDate.map(d => C.formatDate(d)),
      rules: {
        REPAIR_EXTENSION_MONTHS: R.REPAIR_EXTENSION_MONTHS,
        REPAIR_EXTENSION_FROM: R.REPAIR_EXTENSION_FROM,
        REPLY_DAYS: R.REPLY_DAYS,
        FOLLOWUP_REPLY_DAYS: R.FOLLOWUP_REPLY_DAYS,
        COUNTRIES: R.COUNTRIES,
        COUNTRY_OPTIONS: R.COUNTRY_OPTIONS,
        rulesReviewedAt: R.rulesReviewedAt(),
        unknownCountry: R.getCountryRule('XX').label
      }
    }
    await expect(JSON.stringify(values, null, 2) + '\n').toMatchFileSnapshot(
      'fixtures/values.golden.json'
    )
  })

  test('calendar reminder', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.123456789)
    const ics = letterMod.buildIcs({
      date: '2026-11-09',
      title: 'Reply due: Acme, phone; claim',
      description: 'Line one\nLine two, with \\ backslash',
      url: 'https://holdmybill.com/tools/warranty-claim-letter'
    })
    vi.restoreAllMocks()
    await expect(ics).toMatchFileSnapshot('fixtures/ics.golden.txt')
  })
})
