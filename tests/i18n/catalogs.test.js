import { afterEach, describe, expect, test } from 'vitest'
import {
  defaultLetterLanguage,
  detectCountry
} from '@/features/settings/defaults'
import {
  detectLocale,
  endonym,
  isRtl,
  languageName,
  setLocale,
  t,
  UI_LOCALES
} from '@/i18n'
import ar from '@/i18n/ar.js'
import de from '@/i18n/de.js'
import en from '@/i18n/en.js'
import es from '@/i18n/es.js'
import fr from '@/i18n/fr.js'
import hi from '@/i18n/hi.js'

const CATALOGS = { de, fr, es, hi, ar }
const placeholders = text => (text.match(/\{\w+\}/g) || []).sort().join()

afterEach(() => setLocale('en'))

describe('UI catalogs', () => {
  test.each(Object.entries(CATALOGS))(
    '%s has every English key with the same placeholders',
    (code, catalog) => {
      expect(Object.keys(catalog)).toEqual(Object.keys(en))
      for (const [key, value] of Object.entries(en)) {
        expect(typeof catalog[key], `${code} ${key}`).toBe('string')
        expect(catalog[key].trim(), `${code} ${key}`).not.toBe('')
        expect(placeholders(catalog[key]), `${code} ${key}`).toBe(
          placeholders(value)
        )
      }
    }
  )

  test('every claim type, region and category has a label', () => {
    for (const key of Object.keys(en)) expect(t(key)).not.toBe(key)
  })
})

describe('t()', () => {
  test('switches catalogs at runtime and fills placeholders', () => {
    expect(t('nav.drafts')).toBe('Drafts')
    setLocale('de')
    expect(t('nav.drafts')).toBe(de['nav.drafts'])
    expect(t('flow.step', { current: 2, total: 4 })).toContain('2')
  })

  test('falls back to English, then to the key', () => {
    setLocale('xx')
    expect(t('nav.drafts')).toBe('Drafts')
    expect(t('missing.key')).toBe('missing.key')
  })
})

describe('locale detection', () => {
  test('picks the first supported browser language', () => {
    expect(detectLocale(['pt-BR', 'de-AT', 'en'])).toBe('de')
    expect(detectLocale(['ar-EG'])).toBe('ar')
    expect(detectLocale(['ja'])).toBe('en')
    expect(detectLocale([])).toBe('en')
    expect(UI_LOCALES).toEqual(['en', 'de', 'fr', 'es', 'hi', 'ar'])
  })

  test('only Arabic is right-to-left', () => {
    expect(UI_LOCALES.filter(code => isRtl(code))).toEqual(['ar'])
  })

  test('language names come from Intl', () => {
    expect(endonym('de')).toBe('Deutsch')
    expect(endonym('fr')).toBe('Français')
    expect(languageName('fr', 'de')).toBe('Französisch')
    expect(languageName('de', 'fr')).toBe('allemand')
  })
})

describe('country suggestion', () => {
  test('uses an explicit region, never the language alone', () => {
    expect(detectCountry(['de-DE'])).toBe('DE')
    expect(detectCountry(['fr-FR', 'de-DE'])).toBe('FR')
    expect(detectCountry(['de-AT'])).toBe('OTHER')
    expect(detectCountry(['de'])).toBe('OTHER')
    expect(detectCountry(['fr'])).toBe('OTHER')
    expect(detectCountry(['en-US', 'nl-NL'])).toBe('NL')
    expect(detectCountry(['en-IN'])).toBe('OTHER')
  })

  test('letter language prefers the UI language if the country offers it', () => {
    expect(defaultLetterLanguage('DE', 'de')).toBe('de')
    expect(defaultLetterLanguage('DE', 'en')).toBe('en')
    expect(defaultLetterLanguage('DE', 'ar')).toBe('de')
    expect(defaultLetterLanguage('IE', 'de')).toBe('en')
    expect(defaultLetterLanguage('NL', 'hi')).toBe('nl')
  })
})
