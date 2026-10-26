import { useCallback, useEffect, useRef, useState } from 'react'
import { sessionItem, settingsItem } from '@/browser/storage'
import { draftDefaults } from '@/features/settings/defaults'
import { getDraft, isBlank, newDraft, saveDraft } from './store'

const SAVE_DELAY = 300
const SCREENS = ['claim', 'drafts', 'settings']

// The claim being edited, autosaved to storage.local and restored when the
// panel reopens. Blank drafts are not saved, so opening the panel and
// closing it again leaves no clutter in Drafts.
export function useClaimSession() {
  const [draft, setDraft] = useState(null)
  const [screen, setScreenState] = useState('claim')
  const [savedAt, setSavedAt] = useState('')
  const latest = useRef(null)
  const dirty = useRef(false)
  const persisted = useRef(false)
  const timer = useRef(0)

  const persist = useCallback(async next => {
    clearTimeout(timer.current)
    dirty.current = false
    persisted.current = true
    const saved = await saveDraft(next)
    setSavedAt(saved.updatedAt)
  }, [])

  // Restore the last draft and screen, or start a fresh claim
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [session, settings] = await Promise.all([
        sessionItem.getValue(),
        settingsItem.getValue()
      ])
      const restored = await getDraft(session.draftId)
      if (cancelled) return
      persisted.current = Boolean(restored)
      setDraft(restored || newDraft(draftDefaults(settings)))
      if (SCREENS.includes(session.screen)) setScreenState(session.screen)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Debounced autosave
  useEffect(() => {
    latest.current = draft
    if (!draft || (!persisted.current && isBlank(draft))) return
    dirty.current = true
    clearTimeout(timer.current)
    timer.current = setTimeout(() => persist(draft), SAVE_DELAY)
  }, [draft, persist])

  // Closing the panel cancels timers: save what is pending right away
  useEffect(() => {
    const flush = () => {
      if (dirty.current && latest.current) persist(latest.current)
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVisibility)
      // Unmounting must not leave a timer that saves later
      flush()
    }
  }, [persist])

  const draftId = draft?.id
  useEffect(() => {
    if (draftId) sessionItem.setValue({ draftId, screen })
  }, [draftId, screen])

  const update = useCallback(fn => {
    setDraft(prev => (prev ? fn(prev) : prev))
  }, [])

  // path: 'type', 'product.name', ...
  const updateClaim = useCallback(
    (path, value) =>
      update(prev => {
        const [group, key] = path.split('.')
        const claim = key
          ? { ...prev.claim, [group]: { ...prev.claim[group], [key]: value } }
          : { ...prev.claim, [group]: value }
        return { ...prev, claim }
      }),
    [update]
  )

  const setClaim = useCallback(
    fn => update(prev => ({ ...prev, claim: fn(prev.claim) })),
    [update]
  )

  const setStep = useCallback(
    step => update(prev => ({ ...prev, step })),
    [update]
  )

  const setEdits = useCallback(
    edits => update(prev => ({ ...prev, edits })),
    [update]
  )

  const saveNow = useCallback(async () => {
    if (latest.current) await persist(latest.current)
  }, [persist])

  const flushPending = useCallback(async () => {
    if (dirty.current && latest.current) await persist(latest.current)
  }, [persist])

  const openDraft = useCallback(
    async id => {
      await flushPending()
      const next = await getDraft(id)
      if (!next) return
      persisted.current = true
      setDraft(next)
      setScreenState('claim')
    },
    [flushPending]
  )

  const startNew = useCallback(async () => {
    await flushPending()
    const settings = await settingsItem.getValue()
    persisted.current = false
    setSavedAt('')
    setDraft(newDraft(draftDefaults(settings)))
    setScreenState('claim')
  }, [flushPending])

  // After drafts were deleted elsewhere (Drafts or Settings screens)
  const forgetDraft = useCallback(async id => {
    if (latest.current && (!id || latest.current.id === id)) {
      clearTimeout(timer.current)
      dirty.current = false
      const settings = await settingsItem.getValue()
      persisted.current = false
      setSavedAt('')
      setDraft(newDraft(draftDefaults(settings)))
    }
  }, [])

  const setScreen = useCallback(
    async next => {
      await flushPending()
      setScreenState(next)
    },
    [flushPending]
  )

  return {
    draft,
    screen,
    savedAt,
    setScreen,
    updateClaim,
    setClaim,
    setStep,
    setEdits,
    saveNow,
    openDraft,
    startNew,
    forgetDraft
  }
}
