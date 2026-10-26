// French letter wording (vouvoiement, French business letter conventions).
// Written as native correspondence, not a word-for-word translation. NOT yet
// reviewed by a native speaker or lawyer: never cites statutes.

import { mergeParens } from './shared.js'

const CATEGORY = {
  phone: 'smartphone',
  laptop: 'ordinateur',
  tablet: 'tablette',
  tv: 'téléviseur ou écran',
  appliance: 'gros électroménager',
  'small-appliance': 'petit électroménager',
  audio: 'casque ou enceinte',
  wearable: 'montre connectée'
}

const quote = reason => `« ${reason} »`

export default {
  code: 'fr',
  dateLocale: 'fr-FR',
  legalReviewed: false,
  placeholder: {
    you: '[Votre nom]',
    seller: '[Nom du vendeur]',
    product: '[Produit]',
    delivered: '[date de livraison]',
    fault: '[Décrivez le défaut]',
    firstLetter: '[date du premier courrier]'
  },
  category: value => CATEGORY[value] || '',
  details: (brand, model) =>
    brand && model
      ? ` (${brand}, modèle ${model})`
      : brand
        ? ` (${brand})`
        : model
          ? ` (modèle ${model})`
          : '',
  orderRef: ref => (ref ? ` (commande ${ref})` : ''),
  header: { to: 'À :', subject: 'Objet :' },
  greeting: () => 'Madame, Monsieur,',
  complaintGreeting: 'Madame, Monsieur,',
  signoff:
    'Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.',
  attached: 'Pièces jointes :',
  attachment: {
    receipt: 'Preuve d’achat (ticket de caisse ou facture)',
    photos: 'Photos ou vidéo du défaut',
    firstLetter: date => `Copie de mon courrier du ${date}`,
    rejection: 'Copie de votre refus',
    correspondence: 'Copies de mes échanges avec le vendeur'
  },
  subject: {
    first: product => `Défaut de conformité : ${product}`,
    followup: product => `Dernière relance : défaut de conformité, ${product}`,
    rejection: product => `Contestation de votre refus : ${product}`,
    complaint: (seller, product) => `Réclamation contre ${seller} : ${product}`
  },
  recipient: body => body,

  received: ({ delivered, product, details, ref, noticed, fault }) =>
    `Le ${delivered}, j’ai reçu de votre part le produit suivant : ${product}${mergeParens(details, ref)}. ${noticed ? `Le ${noticed}, j’ai constaté le défaut suivant` : 'Il présente le défaut suivant'} : ${fault}`,

  background: {
    tried: text => `Démarches déjà effectuées : ${text}`,
    contact: (text, seller) =>
      `Échanges précédents ${seller ? 'avec vous' : 'avec le vendeur'} : ${text}`,
    repairs: text => `Réparations précédentes : ${text}`,
    warranty: date =>
      `La garantie commerciale du fabricant pour ce produit court jusqu’au ${date}.`
  },

  conservativeLegal: seller =>
    seller
      ? 'En tant que vendeur, vous êtes tenu, au titre du droit de la consommation, de livrer un bien conforme au contrat, et j’estime que ce défaut relève de cette obligation.'
      : 'J’estime que le vendeur est responsable de ce défaut au titre du droit de la consommation, qui oblige les vendeurs à livrer des biens conformes au contrat.',

  remedy: {
    refundFirst: () =>
      'Je vous demande de réparer ou de remplacer le produit gratuitement. Si cela n’est pas possible dans un délai raisonnable et sans inconvénient majeur pour moi, je demanderai la résolution du contrat et le remboursement intégral.',
    refund: ({ refused, price }) => {
      const reason = refused
        ? 'vous avez refusé de mettre le bien en conformité'
        : 'vous n’avez pas réparé ou remplacé le bien dans un délai raisonnable'
      const amount = price ? ` de ${price} €` : ''
      return `Comme ${reason}, je demande la résolution du contrat et le remboursement intégral${amount}. Je vous retournerai le produit dès que vous m’aurez indiqué les modalités de retour.`
    },
    fix: ({ replace }) =>
      `Je vous demande de ${replace ? 'remplacer' : 'réparer'} le produit gratuitement, dans un délai raisonnable et sans inconvénient majeur pour moi.`
  },

  first: {
    deadline: (deadline, body) =>
      `Je vous remercie de me confirmer par écrit, au plus tard le ${deadline}, la solution que vous proposez. À défaut de réponse dans ce délai, j’engagerai d’autres démarches, notamment en saisissant ${body}.`
  },

  followup: {
    opening: ({ sent, product, delivered, refused }) =>
      `Par courrier du ${sent}, je vous ai signalé un défaut du produit suivant : ${product}, livré le ${delivered}. ${refused ? 'Depuis, vous avez refusé de résoudre le problème.' : 'Je n’ai reçu aucune réponse depuis.'}`,
    final: ({ deadline, body }) =>
      `Il s’agit de ma dernière demande. Si le problème n’est pas résolu au plus tard le ${deadline}, je saisirai ${body} et j’envisagerai une action en justice.`
  },

  rejection: {
    opening: ({ sent, product, details, delivered, received, reason }) =>
      `${sent ? `Par courrier du ${sent}, je vous ai` : 'Je vous ai'} demandé de remédier à un défaut du produit suivant : ${product}${details}, livré le ${delivered}. ${received ? `Le ${received}, vous avez` : 'Vous avez'} rejeté ma réclamation${reason ? ` pour le motif suivant : ${quote(reason)}` : ''}.`,
    disagree: fault =>
      `Je conteste cette décision. Le défaut est le suivant : ${fault}`,
    reconsider: (deadline, body) =>
      `Je vous demande de reconsidérer votre décision et de me confirmer par écrit, au plus tard le ${deadline}, la solution que vous proposez. Si vous maintenez votre refus, j’engagerai d’autres démarches, notamment en saisissant ${body}.`
  },

  complaint: {
    opening: ({ seller, delivered, product, details, ref, noticed, fault }) =>
      `Je souhaite déposer une réclamation à l’encontre du vendeur suivant : ${seller}. Le ${delivered}, j’ai reçu de ce vendeur le produit suivant : ${product}${mergeParens(details, ref)}. ${noticed ? `Le ${noticed}, j’ai constaté le défaut suivant` : 'Il présente le défaut suivant'} : ${fault}`,
    asked: sent =>
      `${sent ? `Le ${sent}, j’ai` : 'J’ai'} demandé par écrit au vendeur de résoudre le problème.`,
    refused: reason =>
      `Le vendeur a refusé${reason ? `, pour le motif suivant : ${quote(reason)}` : ''}.`,
    noReply: 'Je n’ai reçu aucune réponse.',
    finalNotice: date =>
      `Le ${date}, j’ai envoyé une dernière relance, sans que le problème soit résolu.`,
    outcome: {
      repair: 'une réparation gratuite',
      replace: 'un remplacement gratuit',
      refund: 'un remboursement intégral'
    },
    request: outcome =>
      `Je demande ${outcome}. Je vous remercie d’examiner cette réclamation et de m’indiquer comment vous pouvez m’aider, ainsi que les démarches qui s’offrent à moi.`
  }
}
