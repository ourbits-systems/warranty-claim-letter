// German letter wording (Sie-Form, DIN 5008 conventions: no comma after the
// closing). Written as native business correspondence, not a word-for-word
// translation. NOT yet reviewed by a native speaker or lawyer: never cites
// statutes (legalReviewed: false).

import { mergeParens } from './shared.js'

const CATEGORY = {
  phone: 'Smartphone',
  laptop: 'Laptop/Computer',
  tablet: 'Tablet',
  tv: 'Fernseher/Monitor',
  appliance: 'Haushaltsgroßgerät',
  'small-appliance': 'Haushaltskleingerät',
  audio: 'Kopfhörer/Lautsprecher',
  wearable: 'Smartwatch/Wearable'
}

const quote = reason => `„${reason}“`

export default {
  code: 'de',
  dateLocale: 'de-DE',
  legalReviewed: false,
  placeholder: {
    you: '[Ihr Name]',
    seller: '[Name des Verkäufers]',
    product: '[Produkt]',
    delivered: '[Lieferdatum]',
    fault: '[Mangel beschreiben]',
    firstLetter: '[Datum des ersten Schreibens]'
  },
  category: value => CATEGORY[value] || '',
  details: (brand, model) =>
    brand && model
      ? ` (${brand}, Modell ${model})`
      : brand
        ? ` (${brand})`
        : model
          ? ` (Modell ${model})`
          : '',
  orderRef: ref => (ref ? ` (Bestellnummer ${ref})` : ''),
  header: { to: 'An:', subject: 'Betreff:' },
  greeting: () => 'Sehr geehrte Damen und Herren,',
  complaintGreeting: 'Sehr geehrte Damen und Herren,',
  signoff: 'Mit freundlichen Grüßen',
  attached: 'Anlagen:',
  attachment: {
    receipt: 'Kaufbeleg (Kassenbon oder Rechnung)',
    photos: 'Fotos oder Video des Mangels',
    firstLetter: date => `Kopie meines Schreibens vom ${date}`,
    rejection: 'Kopie Ihrer Ablehnung',
    correspondence: 'Kopien meines Schriftverkehrs mit dem Verkäufer'
  },
  subject: {
    first: product => `Mängelanzeige: ${product}`,
    followup: product =>
      `Letzte Aufforderung zur Mängelbeseitigung: ${product}`,
    rejection: product => `Ihre Ablehnung meiner Reklamation: ${product}`,
    complaint: (seller, product) => `Beschwerde über ${seller}: ${product}`
  },
  recipient: body => body,

  received: ({ delivered, product, details, ref, noticed, fault }) =>
    `am ${delivered} habe ich von Ihnen folgendes Produkt erhalten: ${product}${mergeParens(details, ref)}. ${noticed ? `Am ${noticed} habe ich folgenden Mangel festgestellt` : 'Das Produkt weist folgenden Mangel auf'}: ${fault}`,

  background: {
    tried: text => `Bisherige Lösungsversuche: ${text}`,
    contact: (text, seller) =>
      `Bisheriger Kontakt ${seller ? 'mit Ihnen' : 'mit dem Verkäufer'}: ${text}`,
    repairs: text => `Bisherige Reparaturen: ${text}`,
    warranty: date =>
      `Die Herstellergarantie für dieses Produkt läuft bis zum ${date}.`
  },

  conservativeLegal: seller =>
    seller
      ? 'Als Verkäufer sind Sie nach dem Verbraucherrecht dafür verantwortlich, dass die Ware dem Vertrag entspricht. Nach meiner Auffassung fällt dieser Mangel unter diese Verantwortung.'
      : 'Nach meiner Auffassung ist der Verkäufer für diesen Mangel verantwortlich, da Verkäufer nach dem Verbraucherrecht für die Vertragsmäßigkeit der Ware einstehen müssen.',

  remedy: {
    refundFirst: () =>
      'Ich bitte Sie, das Produkt kostenlos zu reparieren oder zu ersetzen. Sollte dies nicht innerhalb einer angemessenen Frist und ohne erhebliche Unannehmlichkeiten für mich möglich sein, werde ich vom Vertrag zurücktreten und den vollen Kaufpreis zurückverlangen.',
    refund: ({ refused, price }) => {
      const reason = refused
        ? 'Sie es abgelehnt haben, einen vertragsgemäßen Zustand herzustellen'
        : 'Sie das Produkt nicht innerhalb einer angemessenen Frist repariert oder ersetzt haben'
      const amount = price ? ` in Höhe von ${price} €` : ''
      return `Da ${reason}, möchte ich vom Vertrag zurücktreten und bitte um Erstattung des vollen Kaufpreises${amount}. Ich sende Ihnen das Produkt zurück, sobald Sie mir mitteilen, wie die Rücksendung erfolgen soll.`
    },
    fix: ({ replace }) =>
      `Ich bitte Sie, das Produkt innerhalb einer angemessenen Frist und ohne erhebliche Unannehmlichkeiten für mich kostenlos zu ${replace ? 'ersetzen' : 'reparieren'}.`
  },

  first: {
    deadline: (deadline, body) =>
      `Bitte teilen Sie mir bis zum ${deadline} schriftlich mit, wie Sie den Mangel beheben werden. Sollte ich bis dahin nichts von Ihnen hören, werde ich weitere Schritte einleiten und mich unter anderem an ${body} wenden.`
  },

  followup: {
    opening: ({ sent, product, delivered, refused }) =>
      `mit Schreiben vom ${sent} habe ich Ihnen einen Mangel an folgendem Produkt angezeigt: ${product}, geliefert am ${delivered}. ${refused ? 'Sie haben es seitdem abgelehnt, das Problem zu beheben.' : 'Seitdem habe ich keine Antwort von Ihnen erhalten.'}`,
    final: ({ deadline, body }) =>
      `Dies ist meine letzte Aufforderung. Sollte die Angelegenheit bis zum ${deadline} nicht geklärt sein, werde ich mich an ${body} wenden und gerichtliche Schritte prüfen.`
  },

  rejection: {
    opening: ({ sent, product, details, delivered, received, reason }) =>
      `${sent ? `mit Schreiben vom ${sent} habe ich` : 'ich habe'} Sie gebeten, einen Mangel an folgendem Produkt zu beheben: ${product}${details}, geliefert am ${delivered}. ${received ? `Am ${received} haben Sie` : 'Sie haben'} meine Reklamation abgelehnt${reason ? ` und dies wie folgt begründet: ${quote(reason)}` : ''}.`,
    disagree: fault =>
      `Mit dieser Entscheidung bin ich nicht einverstanden. Der Mangel besteht in Folgendem: ${fault}`,
    reconsider: (deadline, body) =>
      `Bitte überprüfen Sie Ihre Entscheidung und teilen Sie mir bis zum ${deadline} schriftlich mit, wie Sie den Mangel beheben werden. Sollten Sie an Ihrer Ablehnung festhalten, werde ich weitere Schritte einleiten und mich unter anderem an ${body} wenden.`
  },

  complaint: {
    opening: ({ seller, delivered, product, details, ref, noticed, fault }) =>
      `hiermit reiche ich eine Beschwerde gegen ${seller} ein. Am ${delivered} habe ich von diesem Unternehmen folgendes Produkt erhalten: ${product}${mergeParens(details, ref)}. ${noticed ? `Am ${noticed} habe ich folgenden Mangel festgestellt` : 'Das Produkt weist folgenden Mangel auf'}: ${fault}`,
    asked: sent =>
      `${sent ? `Am ${sent} habe ich` : 'Ich habe'} den Verkäufer schriftlich aufgefordert, das Problem zu beheben.`,
    refused: reason =>
      `Der Verkäufer hat dies abgelehnt${reason ? ` und wie folgt begründet: ${quote(reason)}` : ''}.`,
    noReply: 'Ich habe keine Antwort erhalten.',
    finalNotice: date =>
      `Am ${date} habe ich eine letzte Frist gesetzt, ohne dass die Angelegenheit geklärt wurde.`,
    outcome: {
      repair: 'eine kostenlose Reparatur',
      replace: 'einen kostenlosen Ersatz',
      refund: 'die Erstattung des vollen Kaufpreises'
    },
    request: outcome =>
      `Ich strebe ${outcome} an. Bitte prüfen Sie meine Beschwerde und teilen Sie mir mit, wie Sie mich unterstützen können und welche weiteren Schritte mir offenstehen.`
  }
}
