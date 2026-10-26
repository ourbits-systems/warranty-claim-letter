import { useId } from 'react'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

// Label + control + hint/error, wired for screen readers. `children` is a
// render function receiving the props the control needs.
export function Field({ label, hint, error, optional, className, children }) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {optional && (
          <span className="ms-1 font-normal text-muted-foreground">
            ({t('common.optional')})
          </span>
        )}
      </label>
      {children({
        id,
        'aria-describedby':
          [errorId, hintId].filter(Boolean).join(' ') || undefined,
        'aria-invalid': error ? true : undefined
      })}
      {error && (
        <p id={errorId} className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  )
}

// Segmented single choice (the website's Toggle), as a radio group
export function Segmented({ label, value, options, onChange }) {
  return (
    <fieldset className="space-y-1.5">
      <legend className="mb-1.5 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-1 rounded-md bg-secondary p-1">
        {options.map(option => (
          <label
            key={option.value}
            className={cn(
              'flex-1 cursor-pointer rounded-sm px-2 py-1.5 text-center text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
              value === option.value
                ? 'bg-background text-foreground shadow-sm ring-1 ring-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <input
              type="radio"
              className="sr-only"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-start gap-2 text-sm">
      <input
        type="checkbox"
        className="mt-0.5 size-4 accent-primary"
        checked={checked}
        onChange={event => onChange(event.target.checked)}
      />
      {label}
    </label>
  )
}
