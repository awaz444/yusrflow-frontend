import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n/language-context';

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

function getScoreBgColor(score: number) {
  if (score >= 80) return 'from-green-500/20 to-green-500/0';
  if (score >= 60) return 'from-yellow-500/20 to-yellow-500/0';
  return 'from-red-500/20 to-red-500/0';
}

export function ComplianceScores({ scores }: { scores: any }) {
  const { t } = useLanguage();

  const regulations = [
    { key: 'pdpl', label: 'PDPL' },
    { key: 'ndmo', label: 'NDMO' },
    { key: 'sdaia', label: 'SDAIA' },
    { key: 'nca', label: 'NCA' },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">{t('dashboard.overview.complianceScores')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Score */}
          <div
            className={`rounded-lg border border-border/50 p-4 bg-gradient-to-r ${getScoreBgColor(
              scores.overall
            )}`}
          >
            <p className="text-sm text-muted-foreground mb-2">{t('dashboard.overview.overallScore')}</p>
            <div className="flex items-end gap-3">
              <div className={`text-4xl font-bold ${getScoreColor(scores.overall)}`}>
                {scores.overall}
              </div>
              <div className="text-sm text-green-400 font-semibold">
                ↑ {scores.trend}%
              </div>
            </div>
          </div>

          {/* Regulation Scores */}
          <div className="grid grid-cols-2 gap-2">
            {regulations.map((reg) => {
              const score = scores[
                reg.key as keyof typeof scores
              ] as number;
              return (
                <div
                  key={reg.key}
                  className="rounded-lg border border-border/50 bg-secondary/20 p-3"
                >
                  <p className="text-xs text-muted-foreground font-medium">
                    {reg.label}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${getScoreColor(score)}`}>
                    {score}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
