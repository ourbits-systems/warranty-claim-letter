import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { t } from '@/i18n'
import { LetterView } from './LetterView'
import { IssueStep, ProductStep, RegionStep, TypeStep } from './steps'
import { stepErrors } from './validation'

const FORM_STEPS = [
  { key: 'type', title: 'step.type.title', Component: TypeStep },
  { key: 'product', title: 'step.product.title', Component: ProductStep },
  { key: 'issue', title: 'step.issue.title', Component: IssueStep },
  { key: 'region', title: 'step.region.title', Component: RegionStep }
]

// Screen A: type -> product -> issue -> region, then Screen B (the letter)
export function ClaimFlow({ session }) {
  const { draft, setStep, updateClaim, setClaim } = session
  const [attempted, setAttempted] = useState(false)
  const headingRef = useRef(null)
  const index = FORM_STEPS.findIndex(s => s.key === draft.step)

  const shownStep = useRef(draft.step)

  // On a step change, move focus to the new heading so keyboard and screen
  // reader users land at the top of it (not on first render)
  useEffect(() => {
    if (shownStep.current === draft.step) return
    shownStep.current = draft.step
    setAttempted(false)
    headingRef.current?.focus()
  }, [draft.step])

  if (index === -1) return <LetterView session={session} />

  const { key, title, Component } = FORM_STEPS[index]
  const errors = stepErrors(key, draft.claim)
  const last = index === FORM_STEPS.length - 1

  const next = () => {
    if (Object.keys(errors).length) {
      setAttempted(true)
      return
    }
    setStep(last ? 'letter' : FORM_STEPS[index + 1].key)
  }

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={event => {
        event.preventDefault()
        next()
      }}
    >
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {t('flow.step', { current: index + 1, total: FORM_STEPS.length })}
        </p>
        <div
          className="h-1 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className="h-full bg-primary transition-[width]"
            style={{ width: `${((index + 1) / FORM_STEPS.length) * 100}%` }}
          />
        </div>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-serif text-xl font-medium outline-none"
        >
          {t(title)}
        </h2>
        {index === 0 && (
          <p className="text-xs text-muted-foreground">{t('flow.local')}</p>
        )}
      </div>

      <Component
        claim={draft.claim}
        updateClaim={updateClaim}
        setClaim={setClaim}
        errors={attempted ? errors : {}}
      />

      <div className="sticky bottom-0 -mx-4 flex gap-2 border-t border-border bg-background px-4 py-3">
        {index > 0 && (
          <Button
            variant="outline"
            onClick={() => setStep(FORM_STEPS[index - 1].key)}
          >
            {t('common.back')}
          </Button>
        )}
        <Button type="submit" className="flex-1">
          {last ? t('flow.generate') : t('common.continue')}
        </Button>
      </div>
    </form>
  )
}
