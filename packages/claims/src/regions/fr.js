// France. Bump `version` on any change; set `reviewedAt` (YYYY-MM-DD) only
// after a lawyer has checked periods, citations and the local wording.
export default {
  version: 1,
  label: 'France',
  legalYears: 2,
  presumptionYears: 2,
  usedPresumptionYears: 1,
  usedMinYears: null,
  law: 'French Consumer Code (Code de la consommation), articles L217-3 to L217-20',
  consumerBody: 'a consumer mediator (médiateur de la consommation)',
  reviewedAt: null,
  // consumerBody is phrased to follow "saisir" ("en saisissant …")
  local: {
    language: 'fr',
    consumerBody: 'un médiateur de la consommation',
    recipient: 'Médiateur de la consommation'
  },
  sources: [
    {
      title: 'Code de la consommation, articles L217-3 à L217-20',
      url: 'https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565'
    },
    {
      title: 'Directive (EU) 2019/771',
      url: 'https://eur-lex.europa.eu/eli/dir/2019/771/oj'
    }
  ]
}
