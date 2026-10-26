// @vitest-environment happy-dom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import { ConfirmButton } from '@/components/ui/confirm-button'

afterEach(cleanup)

test('keyboard focus follows the confirmation and comes back on cancel', async () => {
  const user = userEvent.setup()
  const onConfirm = vi.fn()
  render(<ConfirmButton onConfirm={onConfirm}>Delete</ConfirmButton>)

  await user.click(screen.getByRole('button', { name: 'Delete' }))
  expect(document.activeElement).toBe(
    screen.getByRole('button', { name: 'Yes, delete' })
  )

  await user.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(document.activeElement).toBe(
    screen.getByRole('button', { name: 'Delete' })
  )
  expect(onConfirm).not.toHaveBeenCalled()

  await user.keyboard('{Enter}')
  await user.keyboard('{Enter}')
  expect(onConfirm).toHaveBeenCalledOnce()
})
