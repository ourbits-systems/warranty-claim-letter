import { Pencil, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmButton } from '@/components/ui/confirm-button'
import { Input } from '@/components/ui/input'
import { t } from '@/i18n'
import { deleteAllDrafts, deleteDraft, listDrafts, renameDraft } from './store'
import { draftTitle, formatTimestamp } from './title'

// Screen C: drafts saved on this device
export function DraftsScreen({ session }) {
  const [drafts, setDrafts] = useState(null)
  const [renaming, setRenaming] = useState(null)
  // Deleting removes the focused row; keyboard focus goes to the heading
  const headingRef = useRef(null)
  const currentId = session.draft?.id

  const refresh = useCallback(() => listDrafts().then(setDrafts), [])
  useEffect(() => {
    refresh()
  }, [refresh])

  const remove = async id => {
    await deleteDraft(id)
    await session.forgetDraft(id)
    await refresh()
    headingRef.current?.focus()
  }

  const removeAll = async () => {
    await deleteAllDrafts()
    await session.forgetDraft()
    await refresh()
    headingRef.current?.focus()
  }

  const rename = async (id, name) => {
    await renameDraft(id, name)
    setRenaming(null)
    refresh()
  }

  if (!drafts) return null

  return (
    <div className="space-y-4">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-serif text-xl font-medium outline-none"
      >
        {t('drafts.title')}
      </h2>
      {drafts.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('drafts.empty')}</p>
      )}
      <ul className="space-y-2">
        {drafts.map(draft => (
          <li
            key={draft.id}
            className="space-y-2 rounded-lg border border-border p-3"
          >
            {renaming === draft.id ? (
              <RenameForm
                initial={draftTitle(draft)}
                onSave={name => rename(draft.id, name)}
                onCancel={() => setRenaming(null)}
              />
            ) : (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {draftTitle(draft)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {draft.id === currentId
                    ? t('drafts.current')
                    : t('drafts.updated', {
                        date: formatTimestamp(draft.updatedAt)
                      })}
                </p>
              </div>
            )}
            {renaming !== draft.id && (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => session.openDraft(draft.id)}>
                  {t('drafts.resume')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setRenaming(draft.id)}
                >
                  <Pencil aria-hidden="true" />
                  {t('drafts.rename')}
                </Button>
                <ConfirmButton
                  variant="ghost"
                  onConfirm={() => remove(draft.id)}
                >
                  <Trash2 aria-hidden="true" />
                  {t('common.delete')}
                </ConfirmButton>
              </div>
            )}
          </li>
        ))}
      </ul>
      {drafts.length > 1 && (
        <ConfirmButton onConfirm={removeAll}>
          {t('drafts.deleteAll')}
        </ConfirmButton>
      )}
    </div>
  )
}

function RenameForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial)
  return (
    <form
      className="flex flex-wrap gap-2"
      onSubmit={event => {
        event.preventDefault()
        onSave(name)
      }}
    >
      <Input
        aria-label={t('drafts.renameLabel')}
        className="min-w-40 flex-1"
        value={name}
        maxLength={120}
        autoFocus
        onChange={event => setName(event.target.value)}
        onKeyDown={event => event.key === 'Escape' && onCancel()}
      />
      <Button type="submit" size="sm">
        {t('common.save')}
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel}>
        {t('common.cancel')}
      </Button>
    </form>
  )
}
