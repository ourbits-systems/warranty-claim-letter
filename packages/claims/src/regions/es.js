// Spain. Bump `version` on any change; set `reviewedAt` (YYYY-MM-DD) only
// after a lawyer has checked periods, citations and the local wording.
export default {
  version: 1,
  label: 'Spain',
  legalYears: 3,
  presumptionYears: 2,
  usedPresumptionYears: 1,
  usedMinYears: 1,
  law: 'Royal Legislative Decree 1/2007 (TRLGDCU), articles 114 to 124',
  consumerBody:
    'your local consumer office (OMIC) or the Consumer Arbitration Board',
  reviewedAt: null,
  // consumerBody is phrased to follow "acudir a"
  local: {
    language: 'es',
    consumerBody:
      'la Oficina Municipal de Información al Consumidor (OMIC) o la Junta Arbitral de Consumo',
    recipient: 'Oficina Municipal de Información al Consumidor (OMIC)'
  },
  sources: [
    {
      title: 'Real Decreto Legislativo 1/2007 (TRLGDCU)',
      url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555'
    },
    {
      title: 'Directive (EU) 2019/771',
      url: 'https://eur-lex.europa.eu/eli/dir/2019/771/oj'
    }
  ]
}
