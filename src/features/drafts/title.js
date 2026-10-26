import { getLocale, t } from '@/i18n'

export function draftTitle(draft) {
  if (draft.name) return draft.name
  const { product, type } = draft.claim
  const what =
    product.name.trim() || product.brand.trim() || t('drafts.untitled')
  return `${t(`claimType.${type}`)}: ${what}`
}

export function formatTimestamp(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(getLocale(), {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}
