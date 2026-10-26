// Ireland. Bump `version` on any change; set `reviewedAt` (YYYY-MM-DD) only
// after a lawyer has checked periods and citations.
export default {
  version: 1,
  label: 'Ireland',
  // Claims can be brought up to 6 years after delivery
  legalYears: 6,
  presumptionYears: 1,
  usedPresumptionYears: 1,
  usedMinYears: null,
  law: 'Consumer Rights Act 2022, Part 3',
  consumerBody: 'the Competition and Consumer Protection Commission (CCPC)',
  reviewedAt: null,
  local: null,
  sources: [
    {
      title: 'Consumer Rights Act 2022',
      url: 'https://www.irishstatutebook.ie/eli/2022/act/37/enacted/en/html'
    },
    {
      title: 'Directive (EU) 2019/771',
      url: 'https://eur-lex.europa.eu/eli/dir/2019/771/oj'
    }
  ]
}
