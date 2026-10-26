// Netherlands. Bump `version` on any change; set `reviewedAt` (YYYY-MM-DD)
// only after a lawyer has checked periods, citations and the local wording.
export default {
  version: 1,
  label: 'Netherlands',
  // No fixed period: the product must last as long as can reasonably be
  // expected for its type and price
  legalYears: null,
  presumptionYears: 1,
  usedPresumptionYears: 1,
  usedMinYears: null,
  law: 'Dutch Civil Code (BW), Book 7, articles 7:17 to 7:24',
  consumerBody: 'De Geschillencommissie',
  reviewedAt: null,
  // consumerBody is phrased to follow "wenden tot" / "voorleggen aan"
  local: {
    language: 'nl',
    consumerBody: 'De Geschillencommissie',
    recipient: 'De Geschillencommissie'
  },
  sources: [
    {
      title: 'Burgerlijk Wetboek Boek 7',
      url: 'https://wetten.overheid.nl/BWBR0005290/'
    },
    {
      title: 'Directive (EU) 2019/771',
      url: 'https://eur-lex.europa.eu/eli/dir/2019/771/oj'
    }
  ]
}
