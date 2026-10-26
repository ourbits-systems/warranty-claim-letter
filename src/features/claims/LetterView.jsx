import {
  Check,
  Copy,
  FileDown,
  Mail,
  Pencil,
  RotateCcw,
  Save
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { copyText } from '@/browser/clipboard'
import { openExtensionPage } from '@/browser/pages'
import { Button, buttonVariants } from '@/components/ui/button'
import { ConfirmButton } from '@/components/ui/confirm-button'
import { Input, Textarea } from '@/components/ui/input'
import { isRtl, languageName, t } from '@/i18n'
import { CoverageNotice } from './CoverageNotice'
import { draftLetter } from './letter'

// Screen B: the generated letter, editable, with copy/email/PDF/save
export function LetterView({ session }) {
  const { draft, setEdits, setStep, saveNow, savedAt } = session
  const letter = useMemo(() => draftLetter(draft), [draft])
  const [status, setStatus] = useState('')

  const edit = patch =>
    setEdits({
      subject: letter.subject,
      body: letter.body,
      basedOn: draft.edits?.basedOn ?? letter.generatedText,
      ...patch
    })

  const flash = message => {
    setStatus(message)
    setTimeout(() => setStatus(''), 2500)
  }

  const copy = async () => {
    flash(
      (await copyText(letter.text))
        ? t('letter.copied')
        : t('letter.copyFailed')
    )
  }

  const save = async () => {
    await saveNow()
    flash(t('letter.saved'))
  }

  const pdf = async () => {
    await saveNow()
    await openExtensionPage('/print.html', draft.id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-serif text-xl font-medium">{t('letter.title')}</h2>
        <Button variant="ghost" size="sm" onClick={() => setStep('type')}>
          <Pencil aria-hidden="true" />
          {t('letter.editClaim')}
        </Button>
      </div>

      <CoverageNotice claim={draft.claim} />

      {letter.language !== 'en' && (
        <p className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
          {t('letter.translationUnreviewed', {
            language: languageName(letter.language)
          })}
        </p>
      )}

      {letter.stale && (
        <p className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
          {t('letter.edited')}
        </p>
      )}

      <div className="space-y-1.5">
        <label htmlFor="letter-subject" className="text-sm font-medium">
          {t('letter.subject')}
        </label>
        <Input
          id="letter-subject"
          lang={letter.language}
          dir={isRtl(letter.language) ? 'rtl' : 'ltr'}
          value={letter.subject}
          onChange={e => edit({ subject: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="letter-body" className="text-sm font-medium">
          {t('letter.body')}
        </label>
        <Textarea
          id="letter-body"
          lang={letter.language}
          dir={isRtl(letter.language) ? 'rtl' : 'ltr'}
          rows={18}
          className="font-serif text-[0.9rem]"
          value={letter.body}
          onChange={e => edit({ body: e.target.value })}
        />
      </div>

      <div className="sticky bottom-0 -mx-4 space-y-2 border-t border-border bg-background px-4 py-3">
        <div className="grid grid-cols-3 gap-2 [&>*]:h-auto [&>*]:min-h-9 [&>*]:whitespace-normal [&>*]:py-1.5">
          <Button onClick={copy}>
            {status === t('letter.copied') ? (
              <Check aria-hidden="true" />
            ) : (
              <Copy aria-hidden="true" />
            )}
            {t('letter.copy')}
          </Button>
          <a
            href={letter.mailto}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: 'outline' })}
          >
            <Mail aria-hidden="true" />
            {t('letter.email')}
          </a>
          <Button variant="outline" onClick={pdf}>
            <FileDown aria-hidden="true" />
            {t('letter.pdf')}
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={save}>
            <Save aria-hidden="true" />
            {t('letter.save')}
          </Button>
          {letter.edited && (
            <ConfirmButton
              question={t('letter.regenerateConfirm')}
              confirmLabel={t('letter.regenerate')}
              onConfirm={() => setEdits(null)}
            >
              <RotateCcw aria-hidden="true" />
              {t('letter.regenerate')}
            </ConfirmButton>
          )}
        </div>
        <p className="min-h-4 text-xs text-muted-foreground" aria-live="polite">
          {status ||
            (letter.kind === 'complaint'
              ? t('letter.complaintEmailHint')
              : savedAt
                ? t('letter.saved')
                : t('letter.emailHint'))}
        </p>
      </div>
    </div>
  )
}
