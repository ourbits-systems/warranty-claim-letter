// Spanish (Spain) UI strings, translated from en.js.
// Needs review by a native speaker before release.

export default {
  'app.title': 'Asistente de reclamaciones de garantía',
  'app.by': 'de HoldMyBill',
  'nav.claim': 'Nueva reclamación',
  'nav.current': 'Reclamación',
  'nav.drafts': 'Borradores',
  'nav.settings': 'Ajustes',
  'nav.label': 'Principal',

  'common.back': 'Atrás',
  'common.continue': 'Continuar',
  'common.cancel': 'Cancelar',
  'common.optional': 'opcional',
  'common.save': 'Guardar',
  'common.delete': 'Eliminar',
  'common.confirmDelete': 'Sí, eliminar',
  'common.areYouSure': '¿Está seguro?',

  'flow.step': 'Paso {current} de {total}',
  'flow.local': 'Todo lo que escriba se queda en este dispositivo.',
  'flow.generate': 'Redactar mi carta',

  'step.type.title': '¿Qué necesita redactar?',
  'step.product.title': '¿Qué compró?',
  'step.issue.title': '¿Qué ha fallado?',
  'step.region.title': '¿Dónde lo compró?',

  'claimType.warranty_claim': 'Reclamación de garantía',
  'claimType.warranty_claim.hint':
    'Pida al vendedor que solucione un producto defectuoso',
  'claimType.repair_request': 'Solicitud de reparación',
  'claimType.repair_request.hint': 'Pida una reparación gratuita',
  'claimType.replacement_request': 'Solicitud de sustitución',
  'claimType.replacement_request.hint': 'Pida uno nuevo',
  'claimType.refund_request': 'Solicitud de reembolso',
  'claimType.refund_request.hint': 'Pida que le devuelvan el dinero',
  'claimType.follow_up': 'Seguimiento de reclamación',
  'claimType.follow_up.hint': 'El vendedor aún no lo ha resuelto',
  'claimType.rejection_response': 'Respuesta a un rechazo',
  'claimType.rejection_response.hint': 'El vendedor la ha rechazado',
  'claimType.formal_complaint': 'Reclamación formal',
  'claimType.formal_complaint.hint': 'Acuda a un organismo de consumo',

  'field.productName': 'Producto',
  'field.productName.placeholder': 'p. ej., Pixel 9 Pro',
  'field.category': 'Tipo de producto',
  'field.category.hint': 'Se usa en la carta si deja vacío el producto',
  'field.brand': 'Marca o fabricante',
  'field.model': 'Modelo',
  'field.sellerName': 'Tienda o vendedor',
  'field.sellerEmail': 'Correo electrónico del vendedor',
  'field.sellerEmail.hint': 'Rellena el destinatario al abrir un correo',
  'field.deliveredAt': 'Fecha de compra o entrega',
  'field.deliveredAt.hint':
    'La garantía legal empieza a contar el día en que lo recibió',
  'field.warrantyUntil': 'Fecha de fin de la garantía',
  'field.warrantyUntil.hint': 'Solo si conoce la garantía del fabricante',
  'field.orderRef': 'Número de pedido o factura',
  'field.price': 'Precio pagado (€)',
  'field.description': 'Describa el problema',
  'field.description.placeholder':
    'p. ej., La pantalla parpadea y se queda en negro a los pocos minutos.',
  'field.noticedAt': '¿Cuándo empezó?',
  'field.troubleshooting': '¿Qué ha probado ya?',
  'field.priorContact': 'Contacto previo con el vendedor',
  'field.priorRepairs': 'Intentos de reparación previos',
  'field.remedy': '¿Qué solicita?',
  'field.sellerResponse': '¿Ha contactado con el vendedor?',
  'field.sentAt': 'Fecha de su primera carta',
  'field.followupSentAt': 'Fecha de su último aviso',
  'field.rejectionReceivedAt': '¿Cuándo la rechazaron?',
  'field.rejectionReason': '¿Qué motivo le dieron?',
  'field.photos': 'Tengo fotos o un vídeo del defecto',
  'field.receipt': 'Tengo el tique o la factura',
  'field.country': 'País',
  'field.country.hint':
    'El lugar de compra determina qué normas de consumo se aplican. Nunca lo deducimos de su idioma.',
  'field.sellerType': '¿Quién se lo vendió?',
  'field.condition': 'Estado',
  'field.yourName': 'Su nombre',
  'field.yourName.hint': 'Firma la carta. Se queda en este dispositivo.',
  'field.outputLanguage': 'Idioma de la carta',
  'field.outputLanguage.hint':
    'El idioma que leerá el vendedor. Puede escribir en el idioma del país o en inglés.',

  'remedy.repair': 'Reparación',
  'remedy.replace': 'Sustitución',
  'remedy.refund': 'Reembolso',
  'sellerResponse.not-contacted': 'Todavía no',
  'sellerResponse.no-reply': 'Sí, sin respuesta',
  'sellerResponse.refused': 'Sí, se negaron',
  'sellerType.business': 'Una tienda o empresa',
  'sellerType.private': 'Un particular',
  'condition.new': 'Nuevo',
  'condition.used': 'Usado / reacondicionado',

  'category.phone': 'Teléfono móvil',
  'category.laptop': 'Portátil u ordenador',
  'category.tablet': 'Tableta',
  'category.tv': 'Televisor o monitor',
  'category.appliance': 'Electrodoméstico grande (lavadora, frigorífico)',
  'category.small-appliance': 'Pequeño electrodoméstico (cafetera, aspiradora)',
  'category.audio': 'Auriculares o altavoces',
  'category.wearable': 'Reloj inteligente o wearable',
  'category.other': 'Otro',

  'region.DE': 'Alemania',
  'region.FR': 'Francia',
  'region.NL': 'Países Bajos',
  'region.ES': 'España',
  'region.IE': 'Irlanda',
  'region.OTHER': 'Otro país de la UE',

  'validation.description':
    'Describa el problema para que el vendedor sepa qué debe solucionar.',
  'validation.future': 'Esta fecha es posterior a hoy.',
  'validation.beforeDelivery': 'Esta fecha es anterior a la de entrega.',
  'validation.email': 'Esto no parece una dirección de correo electrónico.',

  'letter.title': 'Su carta',
  'letter.subject': 'Asunto',
  'letter.body': 'Carta',
  'letter.copy': 'Copiar',
  'letter.copied': 'Copiado',
  'letter.copyFailed':
    'No se ha podido copiar. Seleccione el texto y cópielo manualmente.',
  'letter.email': 'Correo',
  'letter.pdf': 'PDF',
  'letter.save': 'Guardar borrador',
  'letter.saved': 'Guardado en este dispositivo',
  'letter.regenerate': 'Volver a generar',
  'letter.editClaim': 'Editar datos',
  'letter.edited':
    'Ha editado esta carta. Vuelva a generarla para aplicar los cambios del formulario; sus ediciones se sustituirán.',
  'letter.regenerateConfirm': '¿Sustituir sus ediciones?',
  'letter.emailHint':
    'Su aplicación de correo se abrirá con la carta. Adjunte usted el tique y las fotos.',
  'letter.translationUnreviewed':
    'Las cartas en {language} aún no las ha revisado un hablante nativo. Léala con atención antes de enviarla.',
  'letter.complaintEmailHint':
    'Añada usted la dirección del organismo de consumo: las reclamaciones suelen presentarse mediante un formulario web.',

  'coverage.seller-must-prove': 'El defecto apareció pronto',
  'coverage.seller-must-prove.text':
    'El defecto apareció poco después de la entrega. En este periodo, el vendedor normalmente debe solucionarlo, salvo que demuestre que lo causó usted.',
  'coverage.covered': 'Dentro de la garantía legal',
  'coverage.covered.text':
    'Aún está dentro de la garantía legal. El vendedor puede pedirle que demuestre que el defecto ya existía en la entrega, por ejemplo con un informe de reparación.',
  'coverage.lifespan': 'Depende de la vida útil esperada',
  'coverage.lifespan.text':
    'Este país no tiene un plazo fijo: un producto debe durar lo que cabe esperar razonablemente según su tipo y precio.',
  'coverage.expired': 'La garantía legal puede haber terminado',
  'coverage.expired.text':
    'Según nuestros cálculos, la garantía legal terminó el {date}, así que la carta no se basa en ella. Puede que aún le cubra la garantía del fabricante o una garantía ampliada.',
  'coverage.private-sale': 'Sin garantía legal',
  'coverage.private-sale.text':
    'La garantía legal solo se aplica cuando compra a una empresa, así que la carta no se basa en ella.',
  'coverage.incomplete': 'Falta la fecha de entrega',
  'coverage.incomplete.text':
    'Añada la fecha de compra o entrega para comprobar si la garantía legal sigue vigente.',
  'coverage.sources': 'Fuentes legales',
  'coverage.unreviewed':
    'Un abogado aún no ha revisado estas normas de consumo, así que la carta describe sus derechos en términos generales y no cita leyes.',

  'drafts.title': 'Borradores guardados',
  'drafts.empty':
    'Aún no hay borradores. Las reclamaciones que empiece se guardan aquí automáticamente.',
  'drafts.untitled': 'Reclamación sin título',
  'drafts.updated': 'Actualizado el {date}',
  'drafts.resume': 'Abrir',
  'drafts.rename': 'Cambiar nombre',
  'drafts.renameLabel': 'Nombre del borrador',
  'drafts.deleteAll': 'Eliminar todos los borradores',
  'drafts.current': 'Abierto ahora',

  'settings.title': 'Ajustes',
  'settings.appearance': 'Apariencia',
  'settings.appearance.system': 'Sistema',
  'settings.appearance.light': 'Claro',
  'settings.appearance.dark': 'Oscuro',
  'settings.defaultCountry': 'País predeterminado para nuevas reclamaciones',
  'settings.language': 'Idioma de la interfaz',
  'settings.language.auto': 'Idioma del navegador ({language})',
  'settings.language.hint':
    'Cambia solo el idioma de este panel. Cada carta tiene su propio idioma.',
  'settings.privacy': 'Privacidad',
  'settings.privacy.text':
    'Sus reclamaciones y borradores se guardan solo en este navegador. No se envía nada a HoldMyBill ni a nadie más.',
  'settings.privacy.policy': 'Política de privacidad',
  'settings.deleteData': 'Eliminar todos los datos de este dispositivo',
  'settings.deleteData.done':
    'Se han eliminado todos los borradores y ajustes.',
  'settings.about': 'Acerca de',
  'settings.version': 'Versión {version}',
  'settings.support': 'Ayuda y soporte',
  'settings.website': 'Sitio web de HoldMyBill',

  'print.title': 'Imprimir o guardar como PDF',
  'print.hint':
    'Elija «Guardar como PDF» como impresora para obtener un archivo PDF.',
  'print.missing': 'Este borrador ya no existe.',
  'print.button': 'Imprimir'
}
