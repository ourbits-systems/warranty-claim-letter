// Dutch letter wording (u-vorm). Written as native correspondence, not a
// word-for-word translation. NOT yet reviewed by a native speaker or lawyer:
// never cites statutes.

import { mergeParens } from './shared.js'

const CATEGORY = {
  phone: 'telefoon',
  laptop: 'laptop of computer',
  tablet: 'tablet',
  tv: 'tv of monitor',
  appliance: 'groot huishoudelijk apparaat',
  'small-appliance': 'klein huishoudelijk apparaat',
  audio: 'koptelefoon of speaker',
  wearable: 'smartwatch of wearable'
}

const quote = reason => `"${reason}"`

export default {
  code: 'nl',
  dateLocale: 'nl-NL',
  legalReviewed: false,
  placeholder: {
    you: '[Uw naam]',
    seller: '[Naam verkoper]',
    product: '[Product]',
    delivered: '[leverdatum]',
    fault: '[Beschrijf het gebrek]',
    firstLetter: '[datum eerste brief]'
  },
  category: value => CATEGORY[value] || '',
  details: (brand, model) =>
    brand && model
      ? ` (${brand}, model ${model})`
      : brand
        ? ` (${brand})`
        : model
          ? ` (model ${model})`
          : '',
  orderRef: ref => (ref ? ` (bestelnummer ${ref})` : ''),
  header: { to: 'Aan:', subject: 'Onderwerp:' },
  greeting: () => 'Geachte heer, mevrouw,',
  complaintGreeting: 'Geachte heer, mevrouw,',
  signoff: 'Met vriendelijke groet,',
  attached: 'Bijlagen:',
  attachment: {
    receipt: 'Aankoopbewijs (kassabon of factuur)',
    photos: "Foto's of video van het gebrek",
    firstLetter: date => `Kopie van mijn brief van ${date}`,
    rejection: 'Kopie van uw afwijzing',
    correspondence: 'Kopieën van mijn correspondentie met de verkoper'
  },
  subject: {
    first: product => `Defect product: ${product}`,
    followup: product => `Laatste herinnering: defect product, ${product}`,
    rejection: product => `Uw afwijzing van mijn klacht: ${product}`,
    complaint: (seller, product) => `Klacht over ${seller}: ${product}`
  },
  recipient: body => body,

  received: ({ delivered, product, details, ref, noticed, fault }) =>
    `Op ${delivered} heb ik van u het volgende product ontvangen: ${product}${mergeParens(details, ref)}. ${noticed ? `Op ${noticed} heb ik het volgende gebrek geconstateerd` : 'Het product vertoont het volgende gebrek'}: ${fault}`,

  background: {
    tried: text => `Wat ik al heb geprobeerd: ${text}`,
    contact: (text, seller) =>
      `Eerder contact ${seller ? 'met u' : 'met de verkoper'}: ${text}`,
    repairs: text => `Eerdere reparaties: ${text}`,
    warranty: date => `De fabrieksgarantie op dit product loopt tot ${date}.`
  },

  conservativeLegal: seller =>
    seller
      ? 'Als verkoper bent u op grond van het consumentenrecht verantwoordelijk voor een product dat aan de overeenkomst beantwoordt, en naar mijn mening valt dit gebrek daaronder.'
      : 'Naar mijn mening is de verkoper verantwoordelijk voor dit gebrek op grond van het consumentenrecht, dat verkopers verplicht producten te leveren die aan de overeenkomst beantwoorden.',

  remedy: {
    refundFirst: () =>
      'Ik verzoek u het product kosteloos te repareren of te vervangen. Als dat niet binnen een redelijke termijn en zonder ernstige overlast voor mij mogelijk is, zal ik de overeenkomst ontbinden en het volledige aankoopbedrag terugvragen.',
    refund: ({ refused, price }) => {
      const reason = refused
        ? 'u heeft geweigerd het product in overeenstemming met de overeenkomst te brengen'
        : 'u het product niet binnen een redelijke termijn heeft gerepareerd of vervangen'
      const amount = price ? ` van € ${price}` : ''
      return `Omdat ${reason}, wil ik de overeenkomst ontbinden en verzoek ik om terugbetaling van het volledige aankoopbedrag${amount}. Ik stuur het product terug zodra u mij laat weten hoe ik dat moet doen.`
    },
    fix: ({ replace }) =>
      `Ik verzoek u het product binnen een redelijke termijn en zonder ernstige overlast voor mij kosteloos te ${replace ? 'vervangen' : 'repareren'}.`
  },

  first: {
    deadline: (deadline, body) =>
      `Graag ontvang ik uiterlijk ${deadline} uw schriftelijke bevestiging van hoe u dit oplost. Als ik dan niets van u heb gehoord, zal ik verdere stappen zetten en mij onder meer wenden tot ${body}.`
  },

  followup: {
    opening: ({ sent, product, delivered, refused }) =>
      `Bij brief van ${sent} heb ik u gewezen op een defect aan het volgende product: ${product}, geleverd op ${delivered}. ${refused ? 'Sindsdien heeft u geweigerd het probleem op te lossen.' : 'Sindsdien heb ik geen reactie ontvangen.'}`,
    final: ({ deadline, body }) =>
      `Dit is mijn laatste verzoek. Als de kwestie uiterlijk ${deadline} niet is opgelost, leg ik deze voor aan ${body} en overweeg ik juridische stappen.`
  },

  rejection: {
    opening: ({ sent, product, details, delivered, received, reason }) =>
      `${sent ? `Bij brief van ${sent} heb ik` : 'Ik heb'} u gevraagd een defect te verhelpen aan het volgende product: ${product}${details}, geleverd op ${delivered}. ${received ? `Op ${received} heeft u` : 'U heeft'} mijn klacht afgewezen${reason ? `, met de volgende reden: ${quote(reason)}` : ''}.`,
    disagree: fault =>
      `Ik ga niet akkoord met deze beslissing. Het gebrek is als volgt: ${fault}`,
    reconsider: (deadline, body) =>
      `Ik verzoek u uw beslissing te heroverwegen en mij uiterlijk ${deadline} schriftelijk te laten weten hoe u dit oplost. Als u bij uw afwijzing blijft, zal ik verdere stappen zetten en mij onder meer wenden tot ${body}.`
  },

  complaint: {
    opening: ({ seller, delivered, product, details, ref, noticed, fault }) =>
      `Hierbij dien ik een klacht in over ${seller}. Op ${delivered} heb ik van dit bedrijf het volgende product ontvangen: ${product}${mergeParens(details, ref)}. ${noticed ? `Op ${noticed} heb ik het volgende gebrek geconstateerd` : 'Het product vertoont het volgende gebrek'}: ${fault}`,
    asked: sent =>
      `${sent ? `Op ${sent} heb ik` : 'Ik heb'} de verkoper schriftelijk gevraagd het probleem op te lossen.`,
    refused: reason =>
      `De verkoper heeft dit geweigerd${reason ? `, met de volgende reden: ${quote(reason)}` : ''}.`,
    noReply: 'Ik heb geen reactie ontvangen.',
    finalNotice: date =>
      `Op ${date} heb ik een laatste herinnering gestuurd, zonder dat de kwestie is opgelost.`,
    outcome: {
      repair: 'kosteloze reparatie',
      replace: 'kosteloze vervanging',
      refund: 'volledige terugbetaling'
    },
    request: outcome =>
      `Ik vraag om ${outcome}. Wilt u deze klacht in behandeling nemen en mij laten weten hoe u mij kunt helpen en welke vervolgstappen ik kan zetten?`
  }
}
