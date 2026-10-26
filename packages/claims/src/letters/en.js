// English letter wording: the source language and the only one that may
// cite statutes (cite mode). Website letters come from here unchanged, so
// the golden fixtures must not move when this file is edited by accident.

const CATEGORY = {
  phone: 'phone',
  laptop: 'laptop or computer',
  tablet: 'tablet',
  tv: 'tv or monitor',
  appliance: 'large appliance (washer, fridge)',
  'small-appliance': 'small appliance (coffee machine, vacuum)',
  audio: 'headphones or speakers',
  wearable: 'smartwatch or wearable'
}

const period = years => (years === 1 ? 'one year' : `${years} years`)
const quote = reason => `"${reason}"`

export default {
  code: 'en',
  dateLocale: 'en-GB',
  // Cite-mode wording exists only in English: other languages need a
  // reviewed legal translation first
  legalReviewed: true,
  placeholder: {
    you: '[Your name]',
    seller: '[Seller name]',
    product: '[Product]',
    delivered: '[delivery date]',
    fault: '[Describe the fault]',
    firstLetter: '[date of first letter]'
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
  orderRef: ref => (ref ? ` (order ${ref})` : ''),
  header: { to: 'To:', subject: 'Subject:' },
  greeting: seller => `Dear ${seller || 'Sir or Madam'},`,
  complaintGreeting: 'Dear Sir or Madam,',
  signoff: 'Kind regards,',
  attached: 'Attached:',
  attachment: {
    receipt: 'Proof of purchase (receipt or invoice)',
    photos: 'Photos or video of the fault',
    firstLetter: date => 'Copy of my letter of ' + date,
    rejection: 'Copy of your rejection',
    correspondence: 'Copies of my correspondence with the seller'
  },
  subject: {
    first: product => `Lack of conformity: ${product}`,
    followup: product => `Final notice: lack of conformity, ${product}`,
    rejection: product => `Your rejection of my claim: ${product}`,
    complaint: (seller, product) => `Complaint about ${seller}: ${product}`
  },
  // Recipient line for complaints when the region has no local wording
  recipient: body => body.charAt(0).toUpperCase() + body.slice(1),

  received: ({ delivered, product, details, ref, noticed, fault }) =>
    `On ${delivered} I received the ${product}${details} from you${ref}. ${noticed ? `On ${noticed} I noticed` : 'It has'} the following fault: ${fault}`,

  background: {
    tried: text => `Steps I have already taken: ${text}`,
    contact: (text, seller) =>
      `Previous contact with ${seller ? 'you' : 'the seller'}: ${text}`,
    repairs: text => `Previous repairs: ${text}`,
    warranty: date =>
      `The manufacturer's warranty for this product runs until ${date}.`
  },

  conservativeLegal: seller =>
    seller
      ? 'As the seller, you are responsible under consumer law for goods that do not conform to the contract, and I believe this fault falls under that responsibility.'
      : 'I believe the seller is responsible for this fault under consumer law, which makes sellers responsible for goods that do not conform to the contract.',

  cite: {
    scope: ({ law, seller, years }) => {
      const who = seller ? 'you as the seller are' : 'the seller is'
      return years
        ? `Under ${law}, which implements Directive (EU) 2019/771, ${who} responsible for any lack of conformity that becomes apparent within ${period(years)} of delivery.`
        : `Under ${law}, which implements Directive (EU) 2019/771, ${who} responsible for goods that do not last as long as can reasonably be expected for a product of this type and price.`
    },
    presumption: ({ years, seller }) =>
      `Because the fault became apparent within ${period(years)} of delivery, it is presumed to have existed at the time of delivery unless ${seller ? 'you' : 'the seller'} can prove otherwise.`,
    extended: ({ date, seller, months }) =>
      `The goods were repaired under the legal guarantee on ${date}, which extends ${seller ? 'your' : "the seller's"} liability by ${months} months under Directive (EU) 2024/1799.`,
    referral:
      'A referral to the manufacturer does not replace your own legal obligation as the seller.'
  },

  remedy: {
    refundFirst: product =>
      `I request that you repair or replace the ${product} free of charge. If you cannot do this within a reasonable time and without significant inconvenience to me, I will ask to end the contract and receive a full refund.`,
    refund: ({ refused, product, price, cite }) => {
      const reason = refused
        ? 'you have refused to bring the goods into conformity'
        : 'you have not repaired or replaced the goods within a reasonable time'
      const amount = price ? ` of €${price}` : ''
      return cite
        ? `Because ${reason}, I am entitled to end the contract. I request a full refund${amount}. I will return the ${product} at your expense once you confirm.`
        : `Because ${reason}, I ask to end the contract and receive a full refund${amount}. I will return the ${product} once you confirm how you would like it returned.`
    },
    fix: ({ replace, product, cite }) =>
      `I request that you ${replace ? 'replace' : 'repair'} the ${product} free of charge, within a reasonable time and without significant inconvenience to me${cite ? ', as the law requires' : ''}.`
  },

  first: {
    deadline: (deadline, body) =>
      `Please confirm in writing by ${deadline} how you will resolve this. If I do not hear from you by then, I will take further steps, including contacting ${body}.`
  },

  followup: {
    opening: ({ sent, product, delivered, refused }) =>
      `On ${sent} I wrote to you about a fault in the ${product}, delivered on ${delivered}. Since then, ${refused ? 'you have refused to resolve the problem' : 'I have not received a reply'}.`,
    final: ({ deadline, body, cite }) =>
      `This is my final request. If the matter is not resolved by ${deadline}, I will refer it to ${body} and ${cite ? 'consider a claim through the courts, including the European Small Claims Procedure where it applies' : 'consider taking the matter to court'}.`
  },

  rejection: {
    opening: ({ sent, product, details, delivered, received, reason }) =>
      `${sent ? `On ${sent} I` : 'I'} asked you to resolve a fault in the ${product}${details}, delivered on ${delivered}. ${received ? `On ${received} you` : 'You'} rejected my claim${reason ? `, giving this reason: ${quote(reason)}` : ''}.`,
    disagree: fault =>
      `I do not accept this decision. The fault is as follows: ${fault}`,
    reconsider: (deadline, body) =>
      `Please reconsider your decision and confirm in writing by ${deadline} how you will resolve this. If you maintain your rejection, I will take further steps, including contacting ${body}.`
  },

  complaint: {
    opening: ({ seller, delivered, product, details, ref, noticed, fault }) =>
      `I would like to make a formal complaint about ${seller}. On ${delivered} I received the ${product}${details} from them${ref}. ${noticed ? `On ${noticed} I noticed` : 'It has'} the following fault: ${fault}`,
    asked: sent =>
      `${sent ? `On ${sent} I` : 'I'} asked the seller in writing to resolve the problem.`,
    refused: reason =>
      `The seller refused${reason ? `, giving this reason: ${quote(reason)}` : ''}.`,
    noReply: 'I have not received a reply.',
    finalNotice: date =>
      `On ${date} I sent a final notice, which has not resolved the matter.`,
    outcome: {
      repair: 'a free repair',
      replace: 'a free replacement',
      refund: 'a full refund'
    },
    request: outcome =>
      `I am asking for ${outcome}. Please look into this complaint and let me know how you can help, including any next steps available to me.`
  }
}
