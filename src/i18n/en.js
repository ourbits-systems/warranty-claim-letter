// English UI strings: the source catalog. Every user-facing string in the
// extension lives here; other catalogs use the same keys and fall back to
// English for anything missing. {name} placeholders are filled by t().

export default {
  'app.title': 'Warranty Claim Assistant',
  'app.by': 'by HoldMyBill',
  'nav.claim': 'New claim',
  'nav.current': 'Claim',
  'nav.drafts': 'Drafts',
  'nav.settings': 'Settings',
  'nav.label': 'Main',

  'common.back': 'Back',
  'common.continue': 'Continue',
  'common.cancel': 'Cancel',
  'common.optional': 'optional',
  'common.save': 'Save',
  'common.delete': 'Delete',
  'common.confirmDelete': 'Yes, delete',
  'common.areYouSure': 'Are you sure?',

  'flow.step': 'Step {current} of {total}',
  'flow.local': 'Everything you type stays on this device.',
  'flow.generate': 'Write my letter',

  'step.type.title': 'What do you need to write?',
  'step.product.title': 'What did you buy?',
  'step.issue.title': 'What went wrong?',
  'step.region.title': 'Where did you buy it?',

  'claimType.warranty_claim': 'Warranty claim',
  'claimType.warranty_claim.hint': 'Ask the seller to fix a faulty product',
  'claimType.repair_request': 'Repair request',
  'claimType.repair_request.hint': 'Ask for a free repair',
  'claimType.replacement_request': 'Replacement request',
  'claimType.replacement_request.hint': 'Ask for a new one',
  'claimType.refund_request': 'Refund request',
  'claimType.refund_request.hint': 'Ask for your money back',
  'claimType.follow_up': 'Claim follow-up',
  'claimType.follow_up.hint': 'The seller has not solved it yet',
  'claimType.rejection_response': 'Claim rejection response',
  'claimType.rejection_response.hint': 'The seller said no',
  'claimType.formal_complaint': 'Formal complaint',
  'claimType.formal_complaint.hint': 'Escalate to a consumer body',

  'field.productName': 'Product',
  'field.productName.placeholder': 'e.g. Pixel 9 Pro',
  'field.category': 'Type of product',
  'field.category.hint': 'Used in the letter if you leave the product empty',
  'field.brand': 'Brand or manufacturer',
  'field.model': 'Model',
  'field.sellerName': 'Retailer or seller',
  'field.sellerEmail': 'Seller email',
  'field.sellerEmail.hint': 'Fills in the recipient when you open an email',
  'field.deliveredAt': 'Purchase or delivery date',
  'field.deliveredAt.hint':
    'The legal guarantee counts from the day you received it',
  'field.warrantyUntil': 'Warranty expiry date',
  'field.warrantyUntil.hint': "Only if you know the manufacturer's warranty",
  'field.orderRef': 'Order or invoice number',
  'field.price': 'Price paid (€)',
  'field.description': 'Describe the problem',
  'field.description.placeholder':
    'e.g. The screen flickers and goes black after a few minutes.',
  'field.noticedAt': 'When did it start?',
  'field.troubleshooting': 'What have you already tried?',
  'field.priorContact': 'Previous contact with the seller',
  'field.priorRepairs': 'Previous repair attempts',
  'field.remedy': 'What do you want?',
  'field.sellerResponse': 'Have you contacted the seller?',
  'field.sentAt': 'Date of your first letter',
  'field.followupSentAt': 'Date of your final notice',
  'field.rejectionReceivedAt': 'When did they reject it?',
  'field.rejectionReason': 'What reason did they give?',
  'field.photos': 'I have photos or a video of the fault',
  'field.receipt': 'I have the receipt or invoice',
  'field.country': 'Country',
  'field.country.hint':
    'Where you bought it decides which consumer rules apply. We never guess it from your language.',
  'field.sellerType': 'Who sold it to you?',
  'field.condition': 'Condition',
  'field.yourName': 'Your name',
  'field.yourName.hint': 'Signs the letter. Stays on this device.',
  'field.outputLanguage': 'Letter language',
  'field.outputLanguage.hint':
    'The language the seller will read. You can write in the language of the country or in English.',

  'remedy.repair': 'Repair',
  'remedy.replace': 'Replacement',
  'remedy.refund': 'Refund',
  'sellerResponse.not-contacted': 'Not yet',
  'sellerResponse.no-reply': 'Yes, no reply',
  'sellerResponse.refused': 'Yes, they refused',
  'sellerType.business': 'A shop or business',
  'sellerType.private': 'A private person',
  'condition.new': 'New',
  'condition.used': 'Used / refurbished',

  'category.phone': 'Phone',
  'category.laptop': 'Laptop or computer',
  'category.tablet': 'Tablet',
  'category.tv': 'TV or monitor',
  'category.appliance': 'Large appliance (washer, fridge)',
  'category.small-appliance': 'Small appliance (coffee machine, vacuum)',
  'category.audio': 'Headphones or speakers',
  'category.wearable': 'Smartwatch or wearable',
  'category.other': 'Something else',

  'region.DE': 'Germany',
  'region.FR': 'France',
  'region.NL': 'Netherlands',
  'region.ES': 'Spain',
  'region.IE': 'Ireland',
  'region.OTHER': 'Other EU country',

  'validation.description':
    'Describe the problem so the seller knows what to fix.',
  'validation.future': 'This date is in the future.',
  'validation.beforeDelivery': 'This is before the delivery date.',
  'validation.email': 'This does not look like an email address.',

  'letter.title': 'Your letter',
  'letter.subject': 'Subject',
  'letter.body': 'Letter',
  'letter.copy': 'Copy',
  'letter.copied': 'Copied',
  'letter.copyFailed': 'Could not copy. Select the text and copy it by hand.',
  'letter.email': 'Email',
  'letter.pdf': 'PDF',
  'letter.save': 'Save draft',
  'letter.saved': 'Saved on this device',
  'letter.regenerate': 'Regenerate',
  'letter.editClaim': 'Edit details',
  'letter.edited':
    'You edited this letter. Regenerate to apply changes from the form; your edits will be replaced.',
  'letter.regenerateConfirm': 'Replace your edits?',
  'letter.emailHint':
    'Your email app opens with the letter. Attach the receipt and photos yourself.',
  'letter.translationUnreviewed':
    'Letters in {language} have not yet been checked by a native speaker. Read it through before you send it.',
  'letter.complaintEmailHint':
    "Add the consumer body's address yourself: complaints often go through a web form.",

  'coverage.seller-must-prove': 'Fault appeared early',
  'coverage.seller-must-prove.text':
    'The fault appeared soon after delivery. In this period the seller usually has to fix it unless they can show you caused it.',
  'coverage.covered': 'Within the legal guarantee',
  'coverage.covered.text':
    'You are still within the legal guarantee. The seller may ask you to show the fault was there at delivery, for example with a repair report.',
  'coverage.lifespan': 'Depends on expected lifespan',
  'coverage.lifespan.text':
    'This country has no fixed period: a product must last as long as can reasonably be expected for its type and price.',
  'coverage.expired': 'Legal guarantee may have ended',
  'coverage.expired.text':
    "By our reading the legal guarantee ended on {date}, so the letter does not rely on it. A manufacturer's warranty or extended plan may still cover you.",
  'coverage.private-sale': 'No legal guarantee',
  'coverage.private-sale.text':
    'The legal guarantee only applies when you buy from a business, so the letter does not rely on it.',
  'coverage.incomplete': 'Delivery date missing',
  'coverage.incomplete.text':
    'Add the purchase or delivery date to check whether the legal guarantee still applies.',
  'coverage.sources': 'Legal sources',
  'coverage.unreviewed':
    'These consumer rules have not been checked by a lawyer yet, so the letter describes your rights in general terms and does not cite laws.',

  'drafts.title': 'Saved drafts',
  'drafts.empty':
    'No drafts yet. Claims you start are saved here automatically.',
  'drafts.untitled': 'Untitled claim',
  'drafts.updated': 'Updated {date}',
  'drafts.resume': 'Open',
  'drafts.rename': 'Rename',
  'drafts.renameLabel': 'Draft name',
  'drafts.deleteAll': 'Delete all drafts',
  'drafts.current': 'Open now',

  'settings.title': 'Settings',
  'settings.appearance': 'Appearance',
  'settings.appearance.system': 'System',
  'settings.appearance.light': 'Light',
  'settings.appearance.dark': 'Dark',
  'settings.defaultCountry': 'Default country for new claims',
  'settings.language': 'Interface language',
  'settings.language.auto': 'Browser language ({language})',
  'settings.language.hint':
    'Changes the language of this panel only. Each letter has its own language.',
  'settings.privacy': 'Privacy',
  'settings.privacy.text':
    'Your claims and drafts are stored only in this browser. Nothing is sent to HoldMyBill or anyone else.',
  'settings.privacy.policy': 'Privacy policy',
  'settings.deleteData': 'Delete all data on this device',
  'settings.deleteData.done': 'All drafts and settings were deleted.',
  'settings.about': 'About',
  'settings.version': 'Version {version}',
  'settings.support': 'Help and support',
  'settings.website': 'HoldMyBill website',

  'print.title': 'Print or save as PDF',
  'print.hint': 'Choose "Save as PDF" as the printer to get a PDF file.',
  'print.missing': 'This draft no longer exists.',
  'print.button': 'Print'
}
