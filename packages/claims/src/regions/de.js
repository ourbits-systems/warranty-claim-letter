// Germany. Bump `version` on any change; set `reviewedAt` (YYYY-MM-DD) only
// after a lawyer has checked periods, citations and the local wording.
export default {
  version: 1,
  label: 'Germany',
  legalYears: 2,
  presumptionYears: 1,
  usedPresumptionYears: 1,
  usedMinYears: 1,
  law: 'German Civil Code (BGB), §§ 434, 437, 439 and 477',
  consumerBody: 'the Verbraucherzentrale',
  reviewedAt: null,
  // Letters can be written in the local language as well as English.
  // consumerBody is phrased to follow "an" ("mich an … wenden").
  local: {
    language: 'de',
    consumerBody: 'die Verbraucherzentrale',
    recipient: 'Verbraucherzentrale'
  },
  sources: [
    {
      title: 'Bürgerliches Gesetzbuch (BGB)',
      url: 'https://www.gesetze-im-internet.de/bgb/'
    },
    {
      title: 'Directive (EU) 2019/771',
      url: 'https://eur-lex.europa.eu/eli/dir/2019/771/oj'
    }
  ]
}
