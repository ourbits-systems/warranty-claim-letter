import { COUNTRY_OPTIONS } from '@ourbits-systems/claims'
import { useState } from 'react'
import { extensionVersion } from '@/browser/pages'
import { clearAllData } from '@/browser/storage'
import { ConfirmButton } from '@/components/ui/confirm-button'
import { Field, Segmented } from '@/components/ui/field'
import { Select } from '@/components/ui/input'
import { detectLocale, endonym, t, UI_LOCALES } from '@/i18n'
import { resolveSettings } from './defaults'

const SITE = 'https://holdmybill.com'

function Section({ title, children }) {
  return (
    <section className="space-y-3 border-t border-border pt-4 first:border-0 first:pt-0">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </section>
  )
}

// Screen D: appearance, defaults, privacy controls and product information
export function SettingsScreen({ settings, updateSettings, session }) {
  const [cleared, setCleared] = useState(false)

  const deleteEverything = async () => {
    await clearAllData()
    await session.forgetDraft()
    await updateSettings({})
    setCleared(true)
  }

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-xl font-medium">{t('settings.title')}</h2>
      <Section title={t('settings.language')}>
        <Field
          label={t('settings.language')}
          hint={t('settings.language.hint')}
        >
          {aria => (
            <Select
              {...aria}
              value={settings.uiLocale}
              onChange={e => updateSettings({ uiLocale: e.target.value })}
            >
              <option value="">
                {t('settings.language.auto', {
                  language: endonym(detectLocale())
                })}
              </option>
              {UI_LOCALES.map(code => (
                <option key={code} value={code} lang={code}>
                  {endonym(code)}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </Section>

      <Section title={t('settings.appearance')}>
        <Segmented
          label={t('settings.appearance')}
          value={settings.appearance}
          options={['system', 'light', 'dark'].map(value => ({
            value,
            label: t(`settings.appearance.${value}`)
          }))}
          onChange={appearance => updateSettings({ appearance })}
        />
        <Field label={t('settings.defaultCountry')}>
          {aria => (
            <Select
              {...aria}
              value={resolveSettings(settings).country}
              onChange={e => updateSettings({ country: e.target.value })}
            >
              {COUNTRY_OPTIONS.map(({ value }) => (
                <option key={value} value={value}>
                  {t(`region.${value}`)}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </Section>

      <Section title={t('settings.privacy')}>
        <p className="text-sm text-muted-foreground">
          {t('settings.privacy.text')}
        </p>
        <a
          className="block text-sm text-link underline underline-offset-3"
          href={`${SITE}/legal/browser-extension-privacy`}
          target="_blank"
          rel="noreferrer"
        >
          {t('settings.privacy.policy')}
        </a>
        <ConfirmButton onConfirm={deleteEverything}>
          {t('settings.deleteData')}
        </ConfirmButton>
        {cleared && (
          <p className="text-xs text-muted-foreground" role="status">
            {t('settings.deleteData.done')}
          </p>
        )}
      </Section>

      <Section title={t('settings.about')}>
        <p className="text-sm text-muted-foreground">
          {t('app.title')} {t('app.by')} ·{' '}
          {t('settings.version', { version: extensionVersion() })}
        </p>
        <div className="flex flex-col gap-1 text-sm">
          <a
            className="text-link underline underline-offset-3"
            href={`${SITE}/support`}
            target="_blank"
            rel="noreferrer"
          >
            {t('settings.support')}
          </a>
          <a
            className="text-link underline underline-offset-3"
            href={`${SITE}/?src=extension`}
            target="_blank"
            rel="noreferrer"
          >
            {t('settings.website')}
          </a>
        </div>
      </Section>
    </div>
  )
}
