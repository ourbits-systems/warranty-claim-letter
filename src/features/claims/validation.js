import { todayIso } from '@ourbits-systems/claims'
import { t } from '@/i18n'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Errors that block "Continue" on a step, keyed by field. Only the problem
// description is required; everything else is optional but must make sense.
export function stepErrors(step, claim, today = todayIso()) {
  const errors = {}
  const notFuture = (key, value) => {
    if (value && value > today) errors[key] = t('validation.future')
  }
  if (step === 'product') {
    notFuture('deliveredAt', claim.deliveredAt)
    const email = claim.seller.email.trim()
    if (email && !EMAIL.test(email)) errors.sellerEmail = t('validation.email')
  }
  if (step === 'issue') {
    const { fault, letter, rejection, deliveredAt } = claim
    if (!fault.description.trim()) {
      errors.description = t('validation.description')
    }
    notFuture('noticedAt', fault.noticedAt)
    if (!errors.noticedAt && fault.noticedAt && deliveredAt) {
      if (fault.noticedAt < deliveredAt) {
        errors.noticedAt = t('validation.beforeDelivery')
      }
    }
    notFuture('sentAt', letter.sentAt)
    notFuture('followupSentAt', letter.followupSentAt)
    notFuture('rejectionReceivedAt', rejection.receivedAt)
  }
  return errors
}
