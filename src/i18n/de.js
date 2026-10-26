// German UI strings, translated from en.js. Needs review by a native speaker
// before release.

export default {
  'app.title': 'Gewährleistungs-Assistent',
  'app.by': 'von HoldMyBill',
  'nav.claim': 'Neue Reklamation',
  'nav.current': 'Reklamation',
  'nav.drafts': 'Entwürfe',
  'nav.settings': 'Einstellungen',
  'nav.label': 'Hauptmenü',

  'common.back': 'Zurück',
  'common.continue': 'Weiter',
  'common.cancel': 'Abbrechen',
  'common.optional': 'optional',
  'common.save': 'Speichern',
  'common.delete': 'Löschen',
  'common.confirmDelete': 'Ja, löschen',
  'common.areYouSure': 'Sind Sie sicher?',

  'flow.step': 'Schritt {current} von {total}',
  'flow.local': 'Alle Eingaben bleiben auf diesem Gerät.',
  'flow.generate': 'Brief erstellen',

  'step.type.title': 'Was möchten Sie schreiben?',
  'step.product.title': 'Was haben Sie gekauft?',
  'step.issue.title': 'Was ist das Problem?',
  'step.region.title': 'Wo haben Sie es gekauft?',

  'claimType.warranty_claim': 'Gewährleistungsanspruch',
  'claimType.warranty_claim.hint':
    'Den Verkäufer bitten, ein mangelhaftes Produkt in Ordnung zu bringen',
  'claimType.repair_request': 'Reparaturanfrage',
  'claimType.repair_request.hint': 'Um eine kostenlose Reparatur bitten',
  'claimType.replacement_request': 'Ersatzanfrage',
  'claimType.replacement_request.hint': 'Um ein neues Gerät bitten',
  'claimType.refund_request': 'Erstattungsanfrage',
  'claimType.refund_request.hint': 'Ihr Geld zurückverlangen',
  'claimType.follow_up': 'Nachfassen',
  'claimType.follow_up.hint': 'Der Verkäufer hat das Problem noch nicht gelöst',
  'claimType.rejection_response': 'Antwort auf Ablehnung',
  'claimType.rejection_response.hint': 'Der Verkäufer hat abgelehnt',
  'claimType.formal_complaint': 'Förmliche Beschwerde',
  'claimType.formal_complaint.hint': 'An eine Verbraucherstelle wenden',

  'field.productName': 'Produkt',
  'field.productName.placeholder': 'z. B. Pixel 9 Pro',
  'field.category': 'Produktart',
  'field.category.hint':
    'Wird im Brief verwendet, wenn Sie das Produkt leer lassen',
  'field.brand': 'Marke oder Hersteller',
  'field.model': 'Modell',
  'field.sellerName': 'Händler oder Verkäufer',
  'field.sellerEmail': 'E-Mail des Verkäufers',
  'field.sellerEmail.hint':
    'Wird als Empfänger eingesetzt, wenn Sie eine E-Mail öffnen',
  'field.deliveredAt': 'Kauf- oder Lieferdatum',
  'field.deliveredAt.hint':
    'Die gesetzliche Gewährleistung beginnt mit dem Tag, an dem Sie die Ware erhalten haben',
  'field.warrantyUntil': 'Garantie gültig bis',
  'field.warrantyUntil.hint': 'Nur wenn Sie die Herstellergarantie kennen',
  'field.orderRef': 'Bestell- oder Rechnungsnummer',
  'field.price': 'Kaufpreis (€)',
  'field.description': 'Beschreiben Sie das Problem',
  'field.description.placeholder':
    'z. B. Der Bildschirm flackert und wird nach ein paar Minuten schwarz.',
  'field.noticedAt': 'Seit wann besteht das Problem?',
  'field.troubleshooting': 'Was haben Sie schon versucht?',
  'field.priorContact': 'Bisheriger Kontakt mit dem Verkäufer',
  'field.priorRepairs': 'Bisherige Reparaturversuche',
  'field.remedy': 'Was möchten Sie?',
  'field.sellerResponse': 'Haben Sie den Verkäufer kontaktiert?',
  'field.sentAt': 'Datum Ihres ersten Schreibens',
  'field.followupSentAt': 'Datum Ihrer letzten Mahnung',
  'field.rejectionReceivedAt': 'Wann wurde abgelehnt?',
  'field.rejectionReason': 'Welcher Grund wurde genannt?',
  'field.photos': 'Ich habe Fotos oder ein Video vom Mangel',
  'field.receipt': 'Ich habe den Kassenbon oder die Rechnung',
  'field.country': 'Land',
  'field.country.hint':
    'Das Land, in dem Sie gekauft haben, bestimmt, welche Verbraucherregeln gelten. Wir leiten es nie aus Ihrer Sprache ab.',
  'field.sellerType': 'Wer hat es Ihnen verkauft?',
  'field.condition': 'Zustand',
  'field.yourName': 'Ihr Name',
  'field.yourName.hint':
    'Für die Unterschrift im Brief. Bleibt auf diesem Gerät.',
  'field.outputLanguage': 'Sprache des Briefs',
  'field.outputLanguage.hint':
    'Die Sprache, die der Verkäufer liest. Sie können in der Landessprache oder auf Englisch schreiben.',

  'remedy.repair': 'Reparatur',
  'remedy.replace': 'Ersatz',
  'remedy.refund': 'Erstattung',
  'sellerResponse.not-contacted': 'Noch nicht',
  'sellerResponse.no-reply': 'Ja, keine Antwort',
  'sellerResponse.refused': 'Ja, abgelehnt',
  'sellerType.business': 'Ein Geschäft oder Unternehmen',
  'sellerType.private': 'Eine Privatperson',
  'condition.new': 'Neu',
  'condition.used': 'Gebraucht / generalüberholt',

  'category.phone': 'Smartphone',
  'category.laptop': 'Laptop oder Computer',
  'category.tablet': 'Tablet',
  'category.tv': 'Fernseher oder Monitor',
  'category.appliance': 'Großgerät (Waschmaschine, Kühlschrank)',
  'category.small-appliance': 'Kleingerät (Kaffeemaschine, Staubsauger)',
  'category.audio': 'Kopfhörer oder Lautsprecher',
  'category.wearable': 'Smartwatch oder Wearable',
  'category.other': 'Etwas anderes',

  'region.DE': 'Deutschland',
  'region.FR': 'Frankreich',
  'region.NL': 'Niederlande',
  'region.ES': 'Spanien',
  'region.IE': 'Irland',
  'region.OTHER': 'Anderes EU-Land',

  'validation.description':
    'Beschreiben Sie das Problem, damit der Verkäufer weiß, was zu beheben ist.',
  'validation.future': 'Dieses Datum liegt in der Zukunft.',
  'validation.beforeDelivery': 'Dieses Datum liegt vor dem Lieferdatum.',
  'validation.email': 'Das sieht nicht wie eine E-Mail-Adresse aus.',

  'letter.title': 'Ihr Brief',
  'letter.subject': 'Betreff',
  'letter.body': 'Brief',
  'letter.copy': 'Kopieren',
  'letter.copied': 'Kopiert',
  'letter.copyFailed':
    'Kopieren fehlgeschlagen. Markieren Sie den Text und kopieren Sie ihn von Hand.',
  'letter.email': 'E-Mail',
  'letter.pdf': 'PDF',
  'letter.save': 'Entwurf speichern',
  'letter.saved': 'Auf diesem Gerät gespeichert',
  'letter.regenerate': 'Neu erstellen',
  'letter.editClaim': 'Angaben bearbeiten',
  'letter.edited':
    'Sie haben diesen Brief bearbeitet. Wenn Sie ihn neu erstellen, werden die Angaben aus dem Formular übernommen und Ihre Änderungen ersetzt.',
  'letter.regenerateConfirm': 'Ihre Änderungen ersetzen?',
  'letter.emailHint':
    'Ihr E-Mail-Programm öffnet sich mit dem Brief. Hängen Sie Kassenbon und Fotos selbst an.',
  'letter.translationUnreviewed':
    'Briefe auf {language} wurden noch nicht von Muttersprachlern geprüft. Lesen Sie den Brief vor dem Absenden durch.',
  'letter.complaintEmailHint':
    'Tragen Sie die Adresse der Verbraucherstelle selbst ein: Beschwerden laufen oft über ein Webformular.',

  'coverage.seller-must-prove': 'Mangel trat früh auf',
  'coverage.seller-must-prove.text':
    'Der Mangel ist kurz nach der Lieferung aufgetreten. In diesem Zeitraum muss der Verkäufer ihn in der Regel beheben, es sei denn, er kann nachweisen, dass Sie ihn verursacht haben.',
  'coverage.covered': 'Innerhalb der gesetzlichen Gewährleistung',
  'coverage.covered.text':
    'Die gesetzliche Gewährleistung gilt noch. Der Verkäufer kann von Ihnen verlangen nachzuweisen, dass der Mangel schon bei der Lieferung vorlag, zum Beispiel mit einem Reparaturbericht.',
  'coverage.lifespan': 'Hängt von der erwarteten Lebensdauer ab',
  'coverage.lifespan.text':
    'In diesem Land gibt es keine feste Frist: Ein Produkt muss so lange halten, wie es für seine Art und seinen Preis vernünftigerweise erwartet werden kann.',
  'coverage.expired': 'Gesetzliche Gewährleistung möglicherweise abgelaufen',
  'coverage.expired.text':
    'Nach unserer Einschätzung ist die gesetzliche Gewährleistung am {date} abgelaufen, daher stützt sich der Brief nicht darauf. Eine Herstellergarantie oder Garantieverlängerung kann aber noch greifen.',
  'coverage.private-sale': 'Keine gesetzliche Gewährleistung',
  'coverage.private-sale.text':
    'Die gesetzliche Gewährleistung gilt nur beim Kauf von einem Unternehmen, daher stützt sich der Brief nicht darauf.',
  'coverage.incomplete': 'Lieferdatum fehlt',
  'coverage.incomplete.text':
    'Geben Sie das Kauf- oder Lieferdatum an, um zu prüfen, ob die gesetzliche Gewährleistung noch gilt.',
  'coverage.sources': 'Rechtsquellen',
  'coverage.unreviewed':
    'Diese Verbraucherregeln wurden noch nicht juristisch geprüft. Der Brief beschreibt Ihre Rechte daher allgemein und nennt keine Gesetze.',

  'drafts.title': 'Gespeicherte Entwürfe',
  'drafts.empty':
    'Noch keine Entwürfe. Begonnene Reklamationen werden hier automatisch gespeichert.',
  'drafts.untitled': 'Reklamation ohne Titel',
  'drafts.updated': 'Aktualisiert am {date}',
  'drafts.resume': 'Öffnen',
  'drafts.rename': 'Umbenennen',
  'drafts.renameLabel': 'Name des Entwurfs',
  'drafts.deleteAll': 'Alle Entwürfe löschen',
  'drafts.current': 'Gerade geöffnet',

  'settings.title': 'Einstellungen',
  'settings.appearance': 'Darstellung',
  'settings.appearance.system': 'System',
  'settings.appearance.light': 'Hell',
  'settings.appearance.dark': 'Dunkel',
  'settings.defaultCountry': 'Standardland für neue Reklamationen',
  'settings.language': 'Sprache der Oberfläche',
  'settings.language.auto': 'Browsersprache ({language})',
  'settings.language.hint':
    'Ändert nur die Sprache dieses Bereichs. Jeder Brief hat seine eigene Sprache.',
  'settings.privacy': 'Datenschutz',
  'settings.privacy.text':
    'Ihre Reklamationen und Entwürfe werden nur in diesem Browser gespeichert. Nichts wird an HoldMyBill oder andere gesendet.',
  'settings.privacy.policy': 'Datenschutzerklärung',
  'settings.deleteData': 'Alle Daten auf diesem Gerät löschen',
  'settings.deleteData.done':
    'Alle Entwürfe und Einstellungen wurden gelöscht.',
  'settings.about': 'Über',
  'settings.version': 'Version {version}',
  'settings.support': 'Hilfe und Support',
  'settings.website': 'HoldMyBill-Website',

  'print.title': 'Drucken oder als PDF speichern',
  'print.hint':
    'Wählen Sie „Als PDF speichern“ als Drucker, um eine PDF-Datei zu erhalten.',
  'print.missing': 'Dieser Entwurf existiert nicht mehr.',
  'print.button': 'Drucken'
}
