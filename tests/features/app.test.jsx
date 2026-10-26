// @vitest-environment happy-dom
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { fakeBrowser } from 'wxt/testing/fake-browser'
import { App } from '@/app/App'
import { listDrafts } from '@/features/drafts/store'
import ar from '@/i18n/ar.js'

beforeEach(() => {
  fakeBrowser.reset()
  window.matchMedia = () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {}
  })
})

afterEach(async () => {
  cleanup()
  // Let the unmount flush finish before the next test resets storage
  await new Promise(resolve => setTimeout(resolve, 0))
  vi.restoreAllMocks()
})

async function fillClaim(user) {
  await user.click(await screen.findByLabelText(/Refund request/))
  await user.click(screen.getByRole('button', { name: 'Continue' }))

  await user.type(screen.getByLabelText('Product'), 'Pixel 9 Pro')
  await user.type(
    screen.getByLabelText(/Retailer or seller/),
    'Acme Electronics'
  )
  await user.click(screen.getByRole('button', { name: 'Continue' }))

  // The description is required
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  expect((await screen.findByRole('alert')).textContent).toContain(
    'Describe the problem'
  )
  await user.type(
    screen.getByLabelText('Describe the problem'),
    'The screen flickers.'
  )
  await user.click(screen.getByRole('button', { name: 'Continue' }))

  await user.selectOptions(screen.getByLabelText('Country'), 'FR')
  await user.type(screen.getByLabelText(/Your name/), 'Jane Doe')
  await user.click(screen.getByRole('button', { name: 'Write my letter' }))
}

describe('claim assistant', () => {
  test('opens straight into the claim flow', async () => {
    render(<App />)
    expect(
      await screen.findByRole('heading', { name: 'What do you need to write?' })
    ).toBeTruthy()
  })

  test('writes, edits, copies and restores a letter without an account', async () => {
    const user = userEvent.setup()
    const writeText = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue()
    render(<App />)
    await fillClaim(user)

    const body = await screen.findByLabelText('Letter')
    expect(body.value).toContain('I received the Pixel 9 Pro from you')
    expect(body.value).toContain('I request that you repair or replace')
    expect(body.value).not.toContain('Code de la consommation')
    expect(screen.getByLabelText('Subject').value).toBe(
      'Lack of conformity: Pixel 9 Pro'
    )
    expect(screen.getByText(/have not been checked by a lawyer/)).toBeTruthy()

    await user.type(body, ' Thank you.')
    await user.click(screen.getByRole('button', { name: 'Copy' }))
    expect(writeText).toHaveBeenCalledOnce()
    expect(writeText.mock.calls[0][0]).toMatch(
      /^Jane Doe\n.*\n\nTo: Acme Electronics\nSubject: Lack of conformity: Pixel 9 Pro\n\nDear Acme Electronics,/
    )
    expect(writeText.mock.calls[0][0]).toMatch(/Jane Doe Thank you\.$/)

    const email = screen.getByRole('link', { name: 'Email' })
    expect(email.getAttribute('href')).toMatch(/^mailto:\?subject=/)

    await user.click(screen.getByRole('button', { name: /Save draft/ }))
    await waitFor(async () => expect(await listDrafts()).toHaveLength(1))

    // Closing and reopening the panel restores the edited letter
    cleanup()
    render(<App />)
    const restored = await screen.findByLabelText('Letter')
    expect(restored.value).toMatch(/Thank you\.$/)
  })

  test('drafts can be renamed, reopened and deleted', async () => {
    const user = userEvent.setup()
    render(<App />)
    await fillClaim(user)
    await screen.findByLabelText('Letter')

    await user.click(screen.getByRole('button', { name: 'Drafts' }))
    expect(await screen.findByText('Refund request: Pixel 9 Pro')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /Rename/ }))
    const name = screen.getByLabelText('Draft name')
    await user.clear(name)
    await user.type(name, 'Phone claim{Enter}')
    expect(await screen.findByText('Phone claim')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(await screen.findByLabelText('Letter')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Drafts' }))
    await user.click(await screen.findByRole('button', { name: /Delete/ }))
    await user.click(screen.getByRole('button', { name: 'Yes, delete' }))
    expect(await screen.findByText(/No drafts yet/)).toBeTruthy()
    expect(await listDrafts()).toEqual([])
  })

  test('switching the interface to Arabic turns the panel right-to-left', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(await screen.findByRole('button', { name: 'Settings' }))
    await user.selectOptions(screen.getByLabelText('Interface language'), 'ar')
    await waitFor(() => expect(document.documentElement.dir).toBe('rtl'))
    expect(document.documentElement.lang).toBe('ar')
    expect(
      screen.getByRole('button', { name: ar['nav.settings'] })
    ).toBeTruthy()

    await user.selectOptions(
      screen.getByLabelText(ar['settings.language']),
      'en'
    )
    await waitFor(() => expect(document.documentElement.dir).toBe('ltr'))
  })

  test('writes a German letter for a German purchase', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(await screen.findByLabelText(/Repair request/))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.type(screen.getByLabelText('Product'), 'Kaffeemaschine')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.type(
      screen.getByLabelText('Describe the problem'),
      'Sie heizt nicht mehr.'
    )
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    await user.selectOptions(screen.getByLabelText('Country'), 'DE')
    const language = screen.getByLabelText('Letter language')
    expect([...language.options].map(o => o.value)).toEqual(['de', 'en'])
    await user.selectOptions(language, 'de')
    await user.click(screen.getByRole('button', { name: 'Write my letter' }))

    const body = await screen.findByLabelText('Letter')
    expect(body.getAttribute('lang')).toBe('de')
    expect(body.value).toContain('Sehr geehrte Damen und Herren,')
    expect(body.value).toContain('Sie heizt nicht mehr.')
    expect(screen.getByLabelText('Subject').value).toBe(
      'Mängelanzeige: Kaffeemaschine'
    )
    expect(
      screen.getByText(/Letters in German have not yet been checked/)
    ).toBeTruthy()

    // Back in the form, picking Ireland falls back to English
    await user.click(screen.getByRole('button', { name: /Edit details/ }))
    for (let i = 0; i < 3; i++) {
      await user.click(screen.getByRole('button', { name: 'Continue' }))
    }
    await user.selectOptions(screen.getByLabelText('Country'), 'IE')
    expect(screen.getByLabelText('Letter language').value).toBe('en')
  })

  test('opening and closing the panel leaves no empty drafts', async () => {
    render(<App />)
    await screen.findByRole('heading', { name: 'What do you need to write?' })
    cleanup()
    expect(await listDrafts()).toEqual([])
  })
})
