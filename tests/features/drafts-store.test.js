import { beforeEach, describe, expect, test } from 'vitest'
import { fakeBrowser } from 'wxt/testing/fake-browser'
import { draftsItem } from '@/browser/storage'
import {
  deleteAllDrafts,
  deleteDraft,
  getDraft,
  isBlank,
  listDrafts,
  newDraft,
  renameDraft,
  saveDraft
} from '@/features/drafts/store'

beforeEach(() => {
  fakeBrowser.reset()
})

describe('draft store', () => {
  test('saves, lists newest first, renames and deletes', async () => {
    const first = await saveDraft(newDraft())
    await new Promise(resolve => setTimeout(resolve, 2))
    const second = await saveDraft(newDraft({ country: 'FR' }))

    expect((await listDrafts()).map(d => d.id)).toEqual([second.id, first.id])
    expect((await getDraft(second.id)).claim.country).toBe('FR')

    await renameDraft(first.id, '  Broken kettle  ')
    expect((await getDraft(first.id)).name).toBe('Broken kettle')

    await deleteDraft(second.id)
    expect((await listDrafts()).map(d => d.id)).toEqual([first.id])

    await deleteAllDrafts()
    expect(await listDrafts()).toEqual([])
  })

  test('drops unreadable drafts and upgrades old claim records', async () => {
    await draftsItem.setValue({
      broken: { id: 'broken', claim: { v: 99 } },
      junk: 'nope',
      old: {
        id: 'old',
        step: 'nowhere',
        claim: { v: 1, country: 'ES', product: { name: 'Kettle' } },
        updatedAt: '2026-01-01T00:00:00.000Z'
      }
    })
    const drafts = await listDrafts()
    expect(drafts).toHaveLength(1)
    expect(drafts[0]).toMatchObject({ id: 'old', step: 'type', edits: null })
    expect(drafts[0].claim).toMatchObject({
      v: 2,
      type: 'warranty_claim',
      country: 'ES'
    })
    expect(drafts[0].claim.product.name).toBe('Kettle')
  })

  test('getDraft returns null for missing ids', async () => {
    expect(await getDraft(null)).toBeNull()
    expect(await getDraft('missing')).toBeNull()
  })

  test('a fresh draft counts as blank until the user does something', () => {
    const draft = newDraft()
    expect(isBlank(draft)).toBe(true)
    expect(isBlank({ ...draft, step: 'product' })).toBe(false)
    expect(
      isBlank({ ...draft, claim: { ...draft.claim, type: 'follow_up' } })
    ).toBe(false)
  })
})
