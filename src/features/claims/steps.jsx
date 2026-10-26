import {
  CATEGORIES,
  CLAIM_TYPES,
  COUNTRY_OPTIONS,
  getClaimType,
  outputLanguages,
  REMEDIES,
  SELLER_RESPONSES,
  todayIso
} from '@holdmybill/claims'
import { Checkbox, Field, Segmented } from '@/components/ui/field'
import { Input, Select, Textarea } from '@/components/ui/input'
import { defaultLetterLanguage } from '@/features/settings/defaults'
import { endonym, getLocale, t } from '@/i18n'
import { cn } from '@/lib/utils'

const options = (list, prefix) =>
  list.map(({ value }) => ({ value, label: t(`${prefix}.${value}`) }))

function TextField({
  label,
  hint,
  error,
  optional = true,
  value,
  onChange,
  ...props
}) {
  return (
    <Field label={label} hint={hint} error={error} optional={optional}>
      {aria => (
        <Input
          {...aria}
          {...props}
          value={value}
          onChange={event => onChange(event.target.value)}
        />
      )}
    </Field>
  )
}

function DateField(props) {
  return <TextField type="date" max={todayIso()} {...props} />
}

function AreaField({
  label,
  hint,
  error,
  optional = true,
  value,
  onChange,
  ...props
}) {
  return (
    <Field label={label} hint={hint} error={error} optional={optional}>
      {aria => (
        <Textarea
          {...aria}
          {...props}
          value={value}
          onChange={event => onChange(event.target.value)}
        />
      )}
    </Field>
  )
}

export function TypeStep({ claim, setClaim }) {
  const choose = type =>
    setClaim(prev => {
      const next = { ...prev, type }
      // Keep the seller history consistent with what the letter says
      if (type === 'rejection_response') next.sellerResponse = 'refused'
      if (type === 'follow_up' && prev.sellerResponse === 'not-contacted') {
        next.sellerResponse = 'no-reply'
      }
      const { remedy } = getClaimType(type)
      if (remedy) next.remedy = remedy
      return next
    })

  return (
    <fieldset className="space-y-2">
      <legend className="sr-only">{t('step.type.title')}</legend>
      {CLAIM_TYPES.map(({ value }) => (
        <label
          key={value}
          className={cn(
            'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
            claim.type === value
              ? 'border-primary bg-secondary'
              : 'border-border hover:bg-accent'
          )}
        >
          <input
            type="radio"
            name="claim-type"
            className="mt-1 size-4 accent-primary"
            checked={claim.type === value}
            onChange={() => choose(value)}
          />
          <span>
            <span className="block text-sm font-medium">
              {t(`claimType.${value}`)}
            </span>
            <span className="block text-xs text-muted-foreground">
              {t(`claimType.${value}.hint`)}
            </span>
          </span>
        </label>
      ))}
    </fieldset>
  )
}

export function ProductStep({ claim, updateClaim, errors }) {
  const { product, seller } = claim
  return (
    <div className="space-y-4">
      <TextField
        label={t('field.productName')}
        placeholder={t('field.productName.placeholder')}
        value={product.name}
        onChange={v => updateClaim('product.name', v)}
        optional={false}
      />
      <Field label={t('field.category')} hint={t('field.category.hint')}>
        {aria => (
          <Select
            {...aria}
            value={product.category}
            onChange={e => updateClaim('product.category', e.target.value)}
          >
            {options(CATEGORIES, 'category').map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <div className="grid gap-4 min-[22rem]:grid-cols-2">
        <TextField
          label={t('field.brand')}
          value={product.brand}
          onChange={v => updateClaim('product.brand', v)}
        />
        <TextField
          label={t('field.model')}
          value={product.model}
          onChange={v => updateClaim('product.model', v)}
        />
      </div>
      <TextField
        label={t('field.sellerName')}
        value={seller.name}
        onChange={v => updateClaim('seller.name', v)}
      />
      <TextField
        type="email"
        label={t('field.sellerEmail')}
        hint={t('field.sellerEmail.hint')}
        error={errors.sellerEmail}
        value={seller.email}
        onChange={v => updateClaim('seller.email', v)}
      />
      <DateField
        label={t('field.deliveredAt')}
        hint={t('field.deliveredAt.hint')}
        error={errors.deliveredAt}
        value={claim.deliveredAt}
        onChange={v => updateClaim('deliveredAt', v)}
      />
      <TextField
        type="date"
        label={t('field.warrantyUntil')}
        hint={t('field.warrantyUntil.hint')}
        value={product.warrantyUntil}
        onChange={v => updateClaim('product.warrantyUntil', v)}
      />
      <div className="grid gap-4 min-[22rem]:grid-cols-2">
        <TextField
          label={t('field.orderRef')}
          value={seller.orderRef}
          onChange={v => updateClaim('seller.orderRef', v)}
        />
        <TextField
          inputMode="decimal"
          label={t('field.price')}
          value={product.price}
          onChange={v =>
            updateClaim('product.price', v.replace(/[^\d.,]/g, ''))
          }
        />
      </div>
    </div>
  )
}

export function IssueStep({ claim, updateClaim, errors }) {
  const { fault, type } = claim
  const fixedRemedy = Boolean(getClaimType(type).remedy)
  const responses =
    type === 'follow_up'
      ? SELLER_RESPONSES.filter(r => r.value !== 'not-contacted')
      : SELLER_RESPONSES
  const asksResponse = type !== 'rejection_response'
  const contacted =
    type === 'rejection_response' || claim.sellerResponse !== 'not-contacted'
  const showReason =
    type === 'rejection_response' ||
    (type === 'formal_complaint' && claim.sellerResponse === 'refused')

  return (
    <div className="space-y-4">
      <AreaField
        label={t('field.description')}
        placeholder={t('field.description.placeholder')}
        error={errors.description}
        optional={false}
        rows={4}
        value={fault.description}
        onChange={v => updateClaim('fault.description', v)}
      />
      <DateField
        label={t('field.noticedAt')}
        error={errors.noticedAt}
        value={fault.noticedAt}
        onChange={v => updateClaim('fault.noticedAt', v)}
      />
      {!fixedRemedy && (
        <Segmented
          label={t('field.remedy')}
          value={claim.remedy}
          options={options(REMEDIES, 'remedy')}
          onChange={v => updateClaim('remedy', v)}
        />
      )}
      {asksResponse && (
        <Segmented
          label={t('field.sellerResponse')}
          value={claim.sellerResponse}
          options={options(responses, 'sellerResponse')}
          onChange={v => updateClaim('sellerResponse', v)}
        />
      )}
      {contacted && (
        <DateField
          label={t('field.sentAt')}
          error={errors.sentAt}
          value={claim.letter.sentAt}
          onChange={v => updateClaim('letter.sentAt', v)}
        />
      )}
      {type === 'rejection_response' && (
        <DateField
          label={t('field.rejectionReceivedAt')}
          error={errors.rejectionReceivedAt}
          value={claim.rejection.receivedAt}
          onChange={v => updateClaim('rejection.receivedAt', v)}
        />
      )}
      {showReason && (
        <AreaField
          label={t('field.rejectionReason')}
          rows={2}
          value={claim.rejection.reason}
          onChange={v => updateClaim('rejection.reason', v)}
        />
      )}
      {type === 'formal_complaint' && contacted && (
        <DateField
          label={t('field.followupSentAt')}
          error={errors.followupSentAt}
          value={claim.letter.followupSentAt}
          onChange={v => updateClaim('letter.followupSentAt', v)}
        />
      )}
      <AreaField
        label={t('field.troubleshooting')}
        rows={2}
        value={fault.troubleshooting}
        onChange={v => updateClaim('fault.troubleshooting', v)}
      />
      <AreaField
        label={t('field.priorContact')}
        rows={2}
        value={fault.priorContact}
        onChange={v => updateClaim('fault.priorContact', v)}
      />
      <AreaField
        label={t('field.priorRepairs')}
        rows={2}
        value={fault.priorRepairs}
        onChange={v => updateClaim('fault.priorRepairs', v)}
      />
      <div className="space-y-2">
        <Checkbox
          label={t('field.receipt')}
          checked={claim.proof.receipt}
          onChange={v => updateClaim('proof.receipt', v)}
        />
        <Checkbox
          label={t('field.photos')}
          checked={claim.proof.photos}
          onChange={v => updateClaim('proof.photos', v)}
        />
      </div>
    </div>
  )
}

export function RegionStep({ claim, updateClaim, setClaim }) {
  // Country and letter language are separate choices; a country change only
  // resets the language if the new country does not offer it
  const changeCountry = country =>
    setClaim(prev => ({
      ...prev,
      country,
      language: outputLanguages(country).includes(prev.language)
        ? prev.language
        : defaultLetterLanguage(country, getLocale())
    }))

  return (
    <div className="space-y-4">
      <Field label={t('field.country')} hint={t('field.country.hint')}>
        {aria => (
          <Select
            {...aria}
            value={claim.country}
            onChange={e => changeCountry(e.target.value)}
          >
            {COUNTRY_OPTIONS.map(({ value }) => (
              <option key={value} value={value}>
                {t(`region.${value}`)}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field
        label={t('field.outputLanguage')}
        hint={t('field.outputLanguage.hint')}
      >
        {aria => (
          <Select
            {...aria}
            value={claim.language}
            onChange={e => updateClaim('language', e.target.value)}
          >
            {outputLanguages(claim.country).map(code => (
              <option key={code} value={code} lang={code}>
                {endonym(code)}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Segmented
        label={t('field.sellerType')}
        value={claim.sellerType}
        options={[
          { value: 'business', label: t('sellerType.business') },
          { value: 'private', label: t('sellerType.private') }
        ]}
        onChange={v => updateClaim('sellerType', v)}
      />
      <Segmented
        label={t('field.condition')}
        value={claim.condition}
        options={[
          { value: 'new', label: t('condition.new') },
          { value: 'used', label: t('condition.used') }
        ]}
        onChange={v => updateClaim('condition', v)}
      />
      <TextField
        label={t('field.yourName')}
        hint={t('field.yourName.hint')}
        autoComplete="name"
        value={claim.you.name}
        onChange={v => updateClaim('you.name', v)}
      />
    </div>
  )
}
