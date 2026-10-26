// Any other EU country: the directive's minimum rules. Bump `version` on any
// change; set `reviewedAt` (YYYY-MM-DD) only after a legal review.
export default {
  version: 1,
  label: 'Other EU country',
  legalYears: 2,
  presumptionYears: 1,
  usedPresumptionYears: 1,
  usedMinYears: 1,
  law: 'Directive (EU) 2019/771 on the sale of goods, as implemented in national law',
  consumerBody: 'the European Consumer Centre (ECC-Net) in your country',
  reviewedAt: null,
  local: null,
  sources: [
    {
      title: 'Directive (EU) 2019/771',
      url: 'https://eur-lex.europa.eu/eli/dir/2019/771/oj'
    },
    {
      title: 'Directive (EU) 2024/1799 (right to repair)',
      url: 'https://eur-lex.europa.eu/eli/dir/2024/1799/oj'
    }
  ]
}
