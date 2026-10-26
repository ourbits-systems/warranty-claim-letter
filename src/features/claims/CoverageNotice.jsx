import { computeCoverage, formatDate } from '@holdmybill/claims'
import { Info, TriangleAlert } from 'lucide-react'
import { getLocale, t } from '@/i18n'
import { cn } from '@/lib/utils'

const WARN = ['expired', 'private-sale', 'incomplete']

// What the legal guarantee check found, and whether the rules were reviewed
export function CoverageNotice({ claim }) {
  const coverage = computeCoverage(claim)
  const { verdict, rule } = coverage
  const warn = WARN.includes(verdict)
  const Icon = warn ? TriangleAlert : Info
  return (
    <section
      aria-label={t(`coverage.${verdict}`)}
      className={cn(
        'space-y-1.5 rounded-lg border p-3 text-sm',
        warn
          ? 'border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100'
          : 'border-primary/20 bg-secondary'
      )}
    >
      <p className="flex items-center gap-2 font-medium">
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        {t(`coverage.${verdict}`)}
      </p>
      <p className="text-xs">
        {t(`coverage.${verdict}.text`, {
          date: formatDate(coverage.legalUntil, getLocale())
        })}
      </p>
      {!rule.reviewedAt && (
        <p className="text-xs opacity-80">{t('coverage.unreviewed')}</p>
      )}
      {rule.sources?.length > 0 && (
        <details className="text-xs">
          <summary className="cursor-pointer opacity-80">
            {t('coverage.sources')}
          </summary>
          <ul className="mt-1 space-y-0.5 ps-4">
            {rule.sources.map(source => (
              <li key={source.url} className="list-disc">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link underline underline-offset-2"
                >
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  )
}
