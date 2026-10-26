import { Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { draftLetter } from '@/features/claims/letter'
import { getDraft } from '@/features/drafts/store'
import { t } from '@/i18n'

// PDF export (open item O5): the letter as a print-styled page. The browser's
// "Save as PDF" keeps text selectable and shapes every script natively.
export function PrintPage({ draftId }) {
  const [letter, setLetter] = useState(undefined)

  useEffect(() => {
    getDraft(draftId).then(draft => {
      const next = draft ? draftLetter(draft) : null
      setLetter(next)
      if (!next) return
      document.documentElement.lang = next.language
      // The title becomes the suggested PDF file name
      document.title = next.subject
      document.fonts.ready.then(() => window.print())
    })
  }, [draftId])

  if (letter === undefined) return null

  return (
    <div className="min-h-screen bg-muted print:bg-white">
      <div className="mx-auto flex max-w-[210mm] items-center justify-between gap-4 px-6 py-4 print:hidden">
        <div>
          <h1 className="text-base font-medium">{t('print.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('print.hint')}</p>
        </div>
        {letter && (
          <Button onClick={() => window.print()}>
            <Printer aria-hidden="true" />
            {t('print.button')}
          </Button>
        )}
      </div>
      <article className="mx-auto max-w-[210mm] bg-white px-[20mm] py-[18mm] text-[11pt] leading-relaxed text-neutral-900 shadow-card print:p-0 print:shadow-none">
        {letter ? (
          <div
            lang={letter.language}
            dir="ltr"
            className="whitespace-pre-wrap break-words font-serif"
          >
            {letter.text}
          </div>
        ) : (
          <p>{t('print.missing')}</p>
        )}
      </article>
    </div>
  )
}
