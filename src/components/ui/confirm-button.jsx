import { useEffect, useRef, useState } from 'react'
import { t } from '@/i18n'
import { Button } from './button'

// Two-step destructive action. window.confirm() is not available in
// Firefox's sidebar, so the confirmation is inline. Focus moves to the
// confirm button when asking and back to the trigger on cancel, so keyboard
// users never lose their place.
export function ConfirmButton({
  children,
  onConfirm,
  confirmLabel = t('common.confirmDelete'),
  question = t('common.areYouSure'),
  variant = 'outline',
  size = 'sm',
  className
}) {
  const [asking, setAsking] = useState(false)
  const triggerRef = useRef(null)
  const confirmRef = useRef(null)
  const returnFocus = useRef(false)

  useEffect(() => {
    if (asking) confirmRef.current?.focus()
    else if (returnFocus.current) {
      returnFocus.current = false
      triggerRef.current?.focus()
    }
  }, [asking])

  if (!asking) {
    return (
      <Button
        ref={triggerRef}
        variant={variant}
        size={size}
        className={className}
        onClick={() => setAsking(true)}
      >
        {children}
      </Button>
    )
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="text-sm">{question}</span>
      <Button
        ref={confirmRef}
        variant="destructive"
        size={size}
        onClick={() => {
          setAsking(false)
          onConfirm()
        }}
      >
        {confirmLabel}
      </Button>
      <Button
        variant="ghost"
        size={size}
        onClick={() => {
          returnFocus.current = true
          setAsking(false)
        }}
      >
        {t('common.cancel')}
      </Button>
    </span>
  )
}
