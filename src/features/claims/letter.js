import {
  buildLetterParts,
  buildMailto,
  composeLetter,
  letterKind
} from '@holdmybill/claims'

// The extension only cites legal rules that have a legal review date
export const LETTER_OPTIONS = { verifiedOnly: true }

// Everything the letter screen and the print page need from a draft: the
// generated letter, the user's edits on top of it, and the final text
export function draftLetter(draft) {
  const { claim, edits } = draft
  const kind = letterKind(claim)
  const generated = buildLetterParts(claim, kind, LETTER_OPTIONS)
  const generatedText = `${generated.subject}\n${generated.body}`
  const subject = edits ? edits.subject : generated.subject
  const body = edits ? edits.body : generated.body
  const to = kind === 'complaint' ? '' : claim.seller.email.trim()
  return {
    kind,
    language: generated.language,
    generatedText,
    subject,
    body,
    edited: Boolean(edits),
    // The form changed after the user started editing the letter
    stale: Boolean(edits) && edits.basedOn !== generatedText,
    text: composeLetter(claim, { ...generated, subject, body }),
    mailto: buildMailto({ to, subject, body })
  }
}
