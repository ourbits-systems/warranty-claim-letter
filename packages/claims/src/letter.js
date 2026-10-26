// Plain-text letters built from a claim record. No React, so the claims
// agent backend can reuse the same wording. This file decides what a letter
// says; the language packs in ./letters decide how it is worded.

import {
  addDays,
  claimRemedy,
  computeCoverage,
  followupDeadline,
  formatDate,
  getClaimType,
  replyDeadline,
  todayIso
} from './claim.js'
import { LETTER_PACKS } from './letters/index.js'
import {
  outputLanguages,
  REPAIR_EXTENSION_MONTHS,
  REPLY_DAYS
} from './rules.js'

// Fields added in claim v2 may be missing on records built by older code
function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

// The claim's letter language if the region offers it, otherwise English
export function letterLanguage(claim) {
  const wanted = text(claim.language) || 'en'
  return LETTER_PACKS[wanted] && outputLanguages(claim.country).includes(wanted)
    ? wanted
    : 'en'
}

// How much legal reasoning a letter may state:
//   cite          statute, periods and presumption from the region rules
//   conservative  consumer rights in general terms: no citations or periods
//   none          no legal guarantee claim at all (expired, private sale)
// The website always cites: it only shows letters for claimable verdicts.
// The extension passes { verifiedOnly: true }, so rules without a legal
// review date (reviewedAt) are never cited. Only English has cite wording:
// translated legal paragraphs need a human legal translation first.
export function legalMode(claim, options = {}) {
  return modeFor(
    computeCoverage(claim),
    options,
    LETTER_PACKS[letterLanguage(claim)]
  )
}

function modeFor(coverage, options, L) {
  if (!options.verifiedOnly) return L.legalReviewed ? 'cite' : 'conservative'
  if (['expired', 'private-sale'].includes(coverage.verdict)) return 'none'
  if (
    coverage.rule.reviewedAt &&
    coverage.verdict !== 'incomplete' &&
    L.legalReviewed
  ) {
    return 'cite'
  }
  return 'conservative'
}

function productLabel({ claim, L }) {
  if (claim.product.name.trim()) return claim.product.name.trim()
  return (
    (claim.product.category !== 'other' &&
      L.category(claim.product.category)) ||
    L.placeholder.product
  )
}

// " (Brand, model X)" after the product name, only when the user gave them
function productDetails({ claim, L }) {
  return L.details(text(claim.product.brand), text(claim.product.model))
}

// Escalation body in the letter's language
function consumerBody({ coverage, L }) {
  const { rule } = coverage
  return rule.local?.language === L.code
    ? rule.local.consumerBody
    : rule.consumerBody
}

function remedyRequest(ctx, response = ctx.claim.sellerResponse) {
  const { claim, remedy, mode, L } = ctx
  const product = productLabel(ctx)
  const cite = mode === 'cite'
  if (remedy === 'refund') {
    if (response === 'not-contacted') return L.remedy.refundFirst(product)
    return L.remedy.refund({
      refused: response === 'refused',
      product,
      price: claim.product.price,
      cite
    })
  }
  return L.remedy.fix({ replace: remedy === 'replace', product, cite })
}

// voice 'seller' addresses the seller; 'third' talks about them (complaints)
function legalParagraph(ctx, voice = 'seller') {
  const { claim, coverage, mode, L } = ctx
  if (mode === 'none') return ''
  const seller = voice === 'seller'
  if (mode === 'conservative') return L.conservativeLegal(seller)
  const { rule } = coverage
  const lines = [
    L.cite.scope({ law: rule.law, seller, years: rule.legalYears })
  ]
  if (coverage.verdict === 'seller-must-prove') {
    lines.push(
      L.cite.presumption({
        years: coverage.used
          ? rule.usedPresumptionYears
          : rule.presumptionYears,
        seller
      })
    )
  }
  if (coverage.extended) {
    lines.push(
      L.cite.extended({
        date: ctx.date(claim.repairedAt),
        seller,
        months: REPAIR_EXTENSION_MONTHS
      })
    )
  }
  return lines.join(' ')
}

// What the user already did, in their own words. Empty for website claims.
function backgroundParagraph(ctx, voice = 'seller') {
  const { claim, L } = ctx
  const lines = []
  const tried = text(claim.fault.troubleshooting)
  const contact = text(claim.fault.priorContact)
  const repairs = text(claim.fault.priorRepairs)
  const warrantyUntil = text(claim.product.warrantyUntil)
  if (tried) lines.push(L.background.tried(tried))
  if (contact) lines.push(L.background.contact(contact, voice === 'seller'))
  if (repairs) lines.push(L.background.repairs(repairs))
  if (warrantyUntil && warrantyUntil >= todayIso() && ctx.date(warrantyUntil)) {
    lines.push(L.background.warranty(ctx.date(warrantyUntil)))
  }
  return lines.join('\n')
}

// Paragraphs joined by blank lines, skipping empty ones
function paragraphs(...items) {
  return items.filter(Boolean).join('\n\n')
}

function attachments({ claim, L }) {
  const items = [L.attachment.receipt]
  if (claim.proof.photos) items.push(L.attachment.photos)
  return items.map(item => `- ${item}`).join('\n')
}

function subjectLine({ claim, L }, subject) {
  return subject + L.orderRef(claim.seller.orderRef.trim())
}

function signature({ claim, L }) {
  return [L.signoff, claim.you.name.trim() || L.placeholder.you].join('\n')
}

function sellerName({ claim }) {
  return claim.seller.name.trim()
}

function firstLetterParts(ctx) {
  const { claim, L } = ctx
  const background = backgroundParagraph(ctx)
  const legal = legalParagraph(ctx)
  const product = productLabel(ctx)

  return {
    subject: subjectLine(ctx, L.subject.first(product)),
    date: claim.letter.sentAt || todayIso(),
    body: [
      L.greeting(sellerName(ctx)),
      '',
      L.received({
        delivered: ctx.date(claim.deliveredAt) || L.placeholder.delivered,
        product,
        details: productDetails(ctx),
        ref: L.orderRef(claim.seller.orderRef.trim()),
        noticed: ctx.date(claim.fault.noticedAt),
        fault: claim.fault.description.trim() || L.placeholder.fault
      }),
      '',
      ...(background ? [background, ''] : []),
      ...(legal ? [legal, ''] : []),
      remedyRequest(ctx),
      '',
      L.first.deadline(ctx.date(replyDeadline(claim)), consumerBody(ctx)),
      '',
      L.attached,
      attachments(ctx),
      '',
      signature(ctx)
    ].join('\n')
  }
}

function followupParts(ctx) {
  const { claim, mode, L } = ctx
  const product = productLabel(ctx)
  const sent = ctx.date(claim.letter.sentAt) || L.placeholder.firstLetter
  const cite = mode === 'cite'
  // The website's wording, kept byte-identical when citing
  const legal = cite
    ? [legalParagraph(ctx), L.cite.referral].join('\n')
    : legalParagraph(ctx)

  return {
    subject: subjectLine(ctx, L.subject.followup(product)),
    date: claim.letter.followupSentAt || todayIso(),
    body: [
      L.greeting(sellerName(ctx)),
      '',
      L.followup.opening({
        sent,
        product,
        delivered: ctx.date(claim.deliveredAt) || L.placeholder.delivered,
        refused: claim.sellerResponse === 'refused'
      }),
      '',
      ...(legal ? [legal, ''] : []),
      remedyRequest(ctx),
      '',
      L.followup.final({
        deadline: ctx.date(followupDeadline(claim)),
        body: consumerBody(ctx),
        cite
      }),
      '',
      L.attached,
      `- ${L.attachment.firstLetter(sent)}`,
      attachments(ctx),
      '',
      signature(ctx)
    ].join('\n')
  }
}

function rejectionParts(ctx) {
  const { claim, mode, L } = ctx
  const product = productLabel(ctx)
  const received = ctx.date(text(claim.rejection?.receivedAt))
  const reason = text(claim.rejection?.reason)
  const legal =
    mode === 'cite'
      ? `${legalParagraph(ctx)} ${L.cite.referral}`
      : legalParagraph(ctx)

  return {
    subject: subjectLine(ctx, L.subject.rejection(product)),
    date: todayIso(),
    body: [
      L.greeting(sellerName(ctx)),
      '',
      paragraphs(
        L.rejection.opening({
          sent: ctx.date(claim.letter.sentAt),
          product,
          details: productDetails(ctx),
          delivered: ctx.date(claim.deliveredAt) || L.placeholder.delivered,
          received,
          reason
        }),
        L.rejection.disagree(
          claim.fault.description.trim() || L.placeholder.fault
        ),
        backgroundParagraph(ctx),
        legal,
        remedyRequest(ctx, 'refused'),
        L.rejection.reconsider(
          ctx.date(addDays(todayIso(), REPLY_DAYS)),
          consumerBody(ctx)
        ),
        [
          L.attached,
          ...(received || reason ? [`- ${L.attachment.rejection}`] : []),
          attachments(ctx)
        ].join('\n'),
        signature(ctx)
      )
    ].join('\n')
  }
}

function complaintParts(ctx) {
  const { claim, coverage, remedy, L } = ctx
  const product = productLabel(ctx)
  const seller = sellerName(ctx) || L.placeholder.seller
  const followup = ctx.date(claim.letter.followupSentAt)
  const { local } = coverage.rule

  const history = []
  if (claim.sellerResponse !== 'not-contacted') {
    history.push(L.complaint.asked(ctx.date(claim.letter.sentAt)))
    history.push(
      claim.sellerResponse === 'refused'
        ? L.complaint.refused(text(claim.rejection?.reason))
        : L.complaint.noReply
    )
  }
  if (followup) history.push(L.complaint.finalNotice(followup))

  return {
    to:
      local?.language === L.code
        ? local.recipient
        : L.recipient(coverage.rule.consumerBody),
    subject: subjectLine(ctx, L.subject.complaint(seller, product)),
    date: todayIso(),
    body: [
      L.complaintGreeting,
      '',
      paragraphs(
        L.complaint.opening({
          seller,
          delivered: ctx.date(claim.deliveredAt) || L.placeholder.delivered,
          product,
          details: productDetails(ctx),
          ref: L.orderRef(claim.seller.orderRef.trim()),
          noticed: ctx.date(claim.fault.noticedAt),
          fault: claim.fault.description.trim() || L.placeholder.fault
        }),
        backgroundParagraph(ctx, 'third'),
        history.join(' '),
        legalParagraph(ctx, 'third'),
        L.complaint.request(
          L.complaint.outcome[remedy] || L.complaint.outcome.repair
        ),
        [
          L.attached,
          attachments(ctx),
          ...(history.length ? [`- ${L.attachment.correspondence}`] : [])
        ].join('\n'),
        signature(ctx)
      )
    ].join('\n')
  }
}

const PARTS = {
  first: firstLetterParts,
  followup: followupParts,
  rejection: rejectionParts,
  complaint: complaintParts
}

// Letter kind for the claim's type: first, followup, rejection, complaint
export function letterKind(claim) {
  return getClaimType(claim.type).kind
}

function letterParts(claim, kind, options) {
  const coverage = computeCoverage(claim)
  const L = LETTER_PACKS[letterLanguage(claim)]
  const ctx = {
    claim,
    coverage,
    L,
    remedy: claimRemedy(claim),
    mode: modeFor(coverage, options, L),
    date: iso => formatDate(iso, L.dateLocale)
  }
  return { ...(PARTS[kind] || PARTS.first)(ctx), language: L.code }
}

// Letter pieces for editors: { to, subject, date, body, language }. `to` is
// only set when the letter is not addressed to the seller (complaints).
export function buildLetterParts(claim, kind = 'first', options = {}) {
  return letterParts(claim, kind, options)
}

// Sender, date, recipient and subject header above the (possibly edited) body
export function composeLetter(claim, { subject, date, body, to, language }) {
  const L = LETTER_PACKS[language] || LETTER_PACKS[letterLanguage(claim)]
  return [
    claim.you.name.trim() || L.placeholder.you,
    formatDate(date, L.dateLocale),
    '',
    `${L.header.to} ${to || claim.seller.name.trim() || L.placeholder.seller}`,
    `${L.header.subject} ${subject}`,
    '',
    body
  ].join('\n')
}

// Printable letter with sender, date, recipient and subject header.
// options.verifiedOnly: only cite legal rules that have been reviewed.
export function buildLetter(claim, kind = 'first', options = {}) {
  return composeLetter(claim, letterParts(claim, kind, options))
}

export function buildFollowupLetter(claim) {
  return buildLetter(claim, 'followup')
}

// Same letter as an email: the subject moves to the subject line
// Complaints go to the consumer body, whose address the user adds
export function buildEmail(claim, kind = 'first', options = {}) {
  const { subject, body } = letterParts(claim, kind, options)
  const to = kind === 'complaint' ? '' : claim.seller.email.trim()
  return { to, subject, body }
}

export function emailAsText({ to, subject, body }) {
  return [to ? `To: ${to}` : '', `Subject: ${subject}`, '', body]
    .filter((line, i) => line || i > 0)
    .join('\n')
}

// mailto: cannot attach files, so the user still adds the receipt by hand
export function buildMailto({ to, subject, body }) {
  const params = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\n/g, '\r\n'))}`
  const address = (to || '').replace(/[^\w.+@-]/g, '')
  return `mailto:${address}?${params}`
}

function icsEscape(text) {
  return text.replace(/[\\;,]/g, m => '\\' + m).replace(/\n/g, '\\n')
}

// All-day calendar reminder on the reply deadline, linking back to the tool
export function buildIcs({ date, title, description, url }) {
  const day = date.replace(/-/g, '')
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HoldMyBill//Claim Letter//EN',
    'BEGIN:VEVENT',
    `UID:${day}-${Math.random().toString(36).slice(2)}@holdmybill.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${day}`,
    `SUMMARY:${icsEscape(title)}`,
    `DESCRIPTION:${icsEscape(description)}`,
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
}
