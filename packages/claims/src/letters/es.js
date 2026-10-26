// Spanish (Spain) letter wording, addressing the company as "ustedes".
// Written as native correspondence, not a word-for-word translation. NOT yet
// reviewed by a native speaker or lawyer: never cites statutes.

import { mergeParens } from './shared.js'

const CATEGORY = {
  phone: 'teléfono móvil',
  laptop: 'ordenador',
  tablet: 'tableta',
  tv: 'televisor o monitor',
  appliance: 'electrodoméstico grande',
  'small-appliance': 'pequeño electrodoméstico',
  audio: 'auriculares o altavoces',
  wearable: 'reloj inteligente'
}

const quote = reason => `«${reason}»`

export default {
  code: 'es',
  dateLocale: 'es-ES',
  legalReviewed: false,
  placeholder: {
    you: '[Su nombre]',
    seller: '[Nombre del vendedor]',
    product: '[Producto]',
    delivered: '[fecha de entrega]',
    fault: '[Describa el defecto]',
    firstLetter: '[fecha de la primera carta]'
  },
  category: value => CATEGORY[value] || '',
  details: (brand, model) =>
    brand && model
      ? ` (${brand}, modelo ${model})`
      : brand
        ? ` (${brand})`
        : model
          ? ` (modelo ${model})`
          : '',
  orderRef: ref => (ref ? ` (pedido ${ref})` : ''),
  header: { to: 'Para:', subject: 'Asunto:' },
  greeting: () => 'Estimados señores:',
  complaintGreeting: 'Estimados señores:',
  signoff: 'Atentamente,',
  attached: 'Documentos adjuntos:',
  attachment: {
    receipt: 'Justificante de compra (tique o factura)',
    photos: 'Fotos o vídeo del defecto',
    firstLetter: date => `Copia de mi carta del ${date}`,
    rejection: 'Copia de su rechazo',
    correspondence: 'Copias de mi correspondencia con el vendedor'
  },
  subject: {
    first: product => `Falta de conformidad: ${product}`,
    followup: product =>
      `Último requerimiento: falta de conformidad, ${product}`,
    rejection: product => `Su rechazo de mi reclamación: ${product}`,
    complaint: (seller, product) => `Reclamación contra ${seller}: ${product}`
  },
  recipient: body => body,

  received: ({ delivered, product, details, ref, noticed, fault }) =>
    `El ${delivered} recibí de ustedes el siguiente producto: ${product}${mergeParens(details, ref)}. ${noticed ? `El ${noticed} detecté el siguiente defecto` : 'Presenta el siguiente defecto'}: ${fault}`,

  background: {
    tried: text => `Medidas que ya he tomado: ${text}`,
    contact: (text, seller) =>
      `Contactos previos ${seller ? 'con ustedes' : 'con el vendedor'}: ${text}`,
    repairs: text => `Reparaciones previas: ${text}`,
    warranty: date =>
      `La garantía comercial del fabricante de este producto es válida hasta el ${date}.`
  },

  conservativeLegal: seller =>
    seller
      ? 'Como vendedores, ustedes son responsables, conforme a la normativa de consumo, de que el producto sea conforme con el contrato, y considero que este defecto entra en dicha responsabilidad.'
      : 'Considero que el vendedor es responsable de este defecto conforme a la normativa de consumo, que obliga a los vendedores a entregar productos conformes con el contrato.',

  remedy: {
    refundFirst: () =>
      'Les solicito que reparen o sustituyan el producto de forma gratuita. Si no es posible hacerlo en un plazo razonable y sin mayores inconvenientes para mí, solicitaré la resolución del contrato y el reembolso íntegro.',
    refund: ({ refused, price }) => {
      const reason = refused
        ? 'se han negado a poner el producto en conformidad'
        : 'no han reparado ni sustituido el producto en un plazo razonable'
      const amount = price ? ` de ${price} €` : ''
      return `Dado que ${reason}, solicito la resolución del contrato y el reembolso íntegro${amount}. Les devolveré el producto en cuanto me indiquen cómo hacerlo.`
    },
    fix: ({ replace }) =>
      `Les solicito que ${replace ? 'sustituyan' : 'reparen'} el producto de forma gratuita, en un plazo razonable y sin mayores inconvenientes para mí.`
  },

  first: {
    deadline: (deadline, body) =>
      `Les ruego que me confirmen por escrito, a más tardar el ${deadline}, cómo van a resolver esta situación. Si no recibo respuesta en ese plazo, tomaré otras medidas, entre ellas acudir a ${body}.`
  },

  followup: {
    opening: ({ sent, product, delivered, refused }) =>
      `Mediante carta del ${sent} les comuniqué un defecto en el siguiente producto: ${product}, entregado el ${delivered}. ${refused ? 'Desde entonces, se han negado a resolver el problema.' : 'Desde entonces, no he recibido respuesta.'}`,
    final: ({ deadline, body }) =>
      `Este es mi último requerimiento. Si el asunto no se resuelve a más tardar el ${deadline}, acudiré a ${body} y valoraré emprender acciones judiciales.`
  },

  rejection: {
    opening: ({ sent, product, details, delivered, received, reason }) =>
      `${sent ? `Mediante carta del ${sent} les` : 'Les'} solicité que resolvieran un defecto en el siguiente producto: ${product}${details}, entregado el ${delivered}. ${received ? `El ${received} rechazaron` : 'Rechazaron'} mi reclamación${reason ? ` con el siguiente motivo: ${quote(reason)}` : ''}.`,
    disagree: fault =>
      `No acepto esta decisión. El defecto es el siguiente: ${fault}`,
    reconsider: (deadline, body) =>
      `Les ruego que reconsideren su decisión y me confirmen por escrito, a más tardar el ${deadline}, cómo van a resolver esta situación. Si mantienen su rechazo, tomaré otras medidas, entre ellas acudir a ${body}.`
  },

  complaint: {
    opening: ({ seller, delivered, product, details, ref, noticed, fault }) =>
      `Deseo presentar una reclamación contra ${seller}. El ${delivered} recibí de esta empresa el siguiente producto: ${product}${mergeParens(details, ref)}. ${noticed ? `El ${noticed} detecté el siguiente defecto` : 'Presenta el siguiente defecto'}: ${fault}`,
    asked: sent =>
      `${sent ? `El ${sent} solicité` : 'Solicité'} por escrito al vendedor que resolviera el problema.`,
    refused: reason =>
      `El vendedor se negó${reason ? `, con el siguiente motivo: ${quote(reason)}` : ''}.`,
    noReply: 'No he recibido respuesta.',
    finalNotice: date =>
      `El ${date} envié un último requerimiento, sin que el asunto se resolviera.`,
    outcome: {
      repair: 'una reparación gratuita',
      replace: 'una sustitución gratuita',
      refund: 'el reembolso íntegro'
    },
    request: outcome =>
      `Solicito ${outcome}. Les ruego que examinen esta reclamación y me indiquen cómo pueden ayudarme, así como las opciones de que dispongo.`
  }
}
