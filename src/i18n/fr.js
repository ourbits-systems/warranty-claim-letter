// French UI strings, translated from en.js.
// Needs review by a native speaker before release.

export default {
  'app.title': 'Assistant de réclamation de garantie',
  'app.by': 'par HoldMyBill',
  'nav.claim': 'Nouvelle réclamation',
  'nav.current': 'Réclamation',
  'nav.drafts': 'Brouillons',
  'nav.settings': 'Paramètres',
  'nav.label': 'Principal',

  'common.back': 'Retour',
  'common.continue': 'Continuer',
  'common.cancel': 'Annuler',
  'common.optional': 'facultatif',
  'common.save': 'Enregistrer',
  'common.delete': 'Supprimer',
  'common.confirmDelete': 'Oui, supprimer',
  'common.areYouSure': 'Êtes-vous sûr ?',

  'flow.step': 'Étape {current} sur {total}',
  'flow.local': 'Tout ce que vous saisissez reste sur cet appareil.',
  'flow.generate': 'Rédiger ma lettre',

  'step.type.title': 'Que souhaitez-vous écrire ?',
  'step.product.title': 'Qu’avez-vous acheté ?',
  'step.issue.title': 'Quel est le problème ?',
  'step.region.title': 'Où l’avez-vous acheté ?',

  'claimType.warranty_claim': 'Réclamation de garantie',
  'claimType.warranty_claim.hint':
    'Demander au vendeur de régler un produit défectueux',
  'claimType.repair_request': 'Demande de réparation',
  'claimType.repair_request.hint': 'Demander une réparation sans frais',
  'claimType.replacement_request': 'Demande de remplacement',
  'claimType.replacement_request.hint': 'Demander un produit neuf',
  'claimType.refund_request': 'Demande de remboursement',
  'claimType.refund_request.hint': 'Demander à être remboursé',
  'claimType.follow_up': 'Relance de réclamation',
  'claimType.follow_up.hint': 'Le vendeur n’a pas encore réglé le problème',
  'claimType.rejection_response': 'Réponse à un refus',
  'claimType.rejection_response.hint': 'Le vendeur a refusé',
  'claimType.formal_complaint': 'Plainte officielle',
  'claimType.formal_complaint.hint':
    'Saisir un organisme de défense des consommateurs',

  'field.productName': 'Produit',
  'field.productName.placeholder': 'ex. Pixel 9 Pro',
  'field.category': 'Type de produit',
  'field.category.hint':
    'Utilisé dans la lettre si vous ne précisez pas le produit',
  'field.brand': 'Marque ou fabricant',
  'field.model': 'Modèle',
  'field.sellerName': 'Magasin ou vendeur',
  'field.sellerEmail': 'E-mail du vendeur',
  'field.sellerEmail.hint':
    'Rempli comme destinataire quand vous ouvrez un e-mail',
  'field.deliveredAt': 'Date d’achat ou de livraison',
  'field.deliveredAt.hint':
    'La garantie légale court à partir du jour où vous l’avez reçu',
  'field.warrantyUntil': 'Date de fin de garantie',
  'field.warrantyUntil.hint':
    'Seulement si vous connaissez la garantie du fabricant',
  'field.orderRef': 'Numéro de commande ou de facture',
  'field.price': 'Prix payé (€)',
  'field.description': 'Décrivez le problème',
  'field.description.placeholder':
    'ex. L’écran clignote et devient noir après quelques minutes.',
  'field.noticedAt': 'Depuis quand ?',
  'field.troubleshooting': 'Qu’avez-vous déjà essayé ?',
  'field.priorContact': 'Contacts précédents avec le vendeur',
  'field.priorRepairs': 'Tentatives de réparation précédentes',
  'field.remedy': 'Que souhaitez-vous ?',
  'field.sellerResponse': 'Avez-vous contacté le vendeur ?',
  'field.sentAt': 'Date de votre première lettre',
  'field.followupSentAt': 'Date de votre mise en demeure',
  'field.rejectionReceivedAt': 'Quand a-t-il refusé ?',
  'field.rejectionReason': 'Quel motif a-t-il donné ?',
  'field.photos': 'J’ai des photos ou une vidéo du défaut',
  'field.receipt': 'J’ai le ticket de caisse ou la facture',
  'field.country': 'Pays',
  'field.country.hint':
    'Le pays d’achat détermine les règles de consommation applicables. Nous ne le devinons jamais d’après votre langue.',
  'field.sellerType': 'Qui vous l’a vendu ?',
  'field.condition': 'État',
  'field.yourName': 'Votre nom',
  'field.yourName.hint': 'Pour signer la lettre. Reste sur cet appareil.',
  'field.outputLanguage': 'Langue de la lettre',
  'field.outputLanguage.hint':
    'La langue que lira le vendeur. Vous pouvez écrire dans la langue du pays ou en anglais.',

  'remedy.repair': 'Réparation',
  'remedy.replace': 'Remplacement',
  'remedy.refund': 'Remboursement',
  'sellerResponse.not-contacted': 'Pas encore',
  'sellerResponse.no-reply': 'Oui, sans réponse',
  'sellerResponse.refused': 'Oui, il a refusé',
  'sellerType.business': 'Un magasin ou une entreprise',
  'sellerType.private': 'Un particulier',
  'condition.new': 'Neuf',
  'condition.used': 'Occasion / reconditionné',

  'category.phone': 'Téléphone',
  'category.laptop': 'Ordinateur portable ou de bureau',
  'category.tablet': 'Tablette',
  'category.tv': 'Téléviseur ou écran',
  'category.appliance': 'Gros électroménager (lave-linge, réfrigérateur)',
  'category.small-appliance':
    'Petit électroménager (machine à café, aspirateur)',
  'category.audio': 'Casque ou enceintes',
  'category.wearable': 'Montre connectée ou objet connecté',
  'category.other': 'Autre chose',

  'region.DE': 'Allemagne',
  'region.FR': 'France',
  'region.NL': 'Pays-Bas',
  'region.ES': 'Espagne',
  'region.IE': 'Irlande',
  'region.OTHER': 'Autre pays de l’UE',

  'validation.description':
    'Décrivez le problème pour que le vendeur sache quoi réparer.',
  'validation.future': 'Cette date est dans le futur.',
  'validation.beforeDelivery': 'Cette date est antérieure à la livraison.',
  'validation.email': 'Cette adresse e-mail ne semble pas valide.',

  'letter.title': 'Votre lettre',
  'letter.subject': 'Objet',
  'letter.body': 'Lettre',
  'letter.copy': 'Copier',
  'letter.copied': 'Copié',
  'letter.copyFailed':
    'Copie impossible. Sélectionnez le texte et copiez-le manuellement.',
  'letter.email': 'E-mail',
  'letter.pdf': 'PDF',
  'letter.save': 'Enregistrer le brouillon',
  'letter.saved': 'Enregistré sur cet appareil',
  'letter.regenerate': 'Régénérer',
  'letter.editClaim': 'Modifier les infos',
  'letter.edited':
    'Vous avez modifié cette lettre. Régénérez-la pour appliquer les changements du formulaire ; vos modifications seront remplacées.',
  'letter.regenerateConfirm': 'Remplacer vos modifications ?',
  'letter.emailHint':
    'Votre messagerie s’ouvre avec la lettre. Joignez vous-même le ticket de caisse et les photos.',
  'letter.translationUnreviewed':
    'Les lettres en {language} n’ont pas encore été vérifiées par un locuteur natif. Relisez votre lettre avant de l’envoyer.',
  'letter.complaintEmailHint':
    'Ajoutez vous-même l’adresse de l’organisme de consommateurs : les plaintes passent souvent par un formulaire en ligne.',

  'coverage.seller-must-prove': 'Défaut apparu rapidement',
  'coverage.seller-must-prove.text':
    'Le défaut est apparu peu après la livraison. Pendant cette période, le vendeur doit en général y remédier, sauf s’il peut montrer que vous l’avez causé.',
  'coverage.covered': 'Couvert par la garantie légale',
  'coverage.covered.text':
    'Vous êtes encore couvert par la garantie légale de conformité. Le vendeur peut vous demander de montrer que le défaut existait à la livraison, par exemple avec un rapport de réparation.',
  'coverage.lifespan': 'Selon la durée de vie attendue',
  'coverage.lifespan.text':
    'Ce pays n’a pas de durée fixe : un produit doit durer aussi longtemps qu’on peut raisonnablement l’attendre pour son type et son prix.',
  'coverage.expired': 'Garantie légale peut-être expirée',
  'coverage.expired.text':
    'D’après notre lecture, la garantie légale a pris fin le {date} ; la lettre ne s’appuie donc pas sur elle. Une garantie du fabricant ou une extension de garantie peut encore vous couvrir.',
  'coverage.private-sale': 'Pas de garantie légale',
  'coverage.private-sale.text':
    'La garantie légale ne s’applique que si vous achetez auprès d’un professionnel ; la lettre ne s’appuie donc pas sur elle.',
  'coverage.incomplete': 'Date de livraison manquante',
  'coverage.incomplete.text':
    'Ajoutez la date d’achat ou de livraison pour vérifier si la garantie légale s’applique encore.',
  'coverage.sources': 'Sources juridiques',
  'coverage.unreviewed':
    'Ces règles de consommation n’ont pas encore été vérifiées par un juriste : la lettre décrit donc vos droits en termes généraux et ne cite pas de textes de loi.',

  'drafts.title': 'Brouillons enregistrés',
  'drafts.empty':
    'Aucun brouillon pour l’instant. Les réclamations que vous commencez sont enregistrées ici automatiquement.',
  'drafts.untitled': 'Réclamation sans titre',
  'drafts.updated': 'Modifié le {date}',
  'drafts.resume': 'Ouvrir',
  'drafts.rename': 'Renommer',
  'drafts.renameLabel': 'Nom du brouillon',
  'drafts.deleteAll': 'Supprimer tous les brouillons',
  'drafts.current': 'Ouvert',

  'settings.title': 'Paramètres',
  'settings.appearance': 'Apparence',
  'settings.appearance.system': 'Système',
  'settings.appearance.light': 'Clair',
  'settings.appearance.dark': 'Sombre',
  'settings.defaultCountry': 'Pays par défaut des nouvelles réclamations',
  'settings.language': 'Langue de l’interface',
  'settings.language.auto': 'Langue du navigateur ({language})',
  'settings.language.hint':
    'Change uniquement la langue de ce panneau. Chaque lettre a sa propre langue.',
  'settings.privacy': 'Confidentialité',
  'settings.privacy.text':
    'Vos réclamations et brouillons sont stockés uniquement dans ce navigateur. Rien n’est envoyé à HoldMyBill ni à personne d’autre.',
  'settings.privacy.policy': 'Politique de confidentialité',
  'settings.deleteData': 'Supprimer toutes les données de cet appareil',
  'settings.deleteData.done':
    'Tous les brouillons et paramètres ont été supprimés.',
  'settings.about': 'À propos',
  'settings.version': 'Version {version}',
  'settings.support': 'Aide et assistance',
  'settings.website': 'Site web de HoldMyBill',

  'print.title': 'Imprimer ou enregistrer en PDF',
  'print.hint':
    'Choisissez « Enregistrer au format PDF » comme imprimante pour obtenir un fichier PDF.',
  'print.missing': 'Ce brouillon n’existe plus.',
  'print.button': 'Imprimer'
}
