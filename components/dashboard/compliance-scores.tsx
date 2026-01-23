import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockComplianceScores } from '@/lib/mockData';

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

export function ComplianceScores() {
  const regulations = [
    { key: 'pdpl', label: 'PDPL' },
    { key: 'sdaia', label: 'SDAIA' },
    { key: 'nca', label: 'NCA' },
    { key: 'citc', label: 'CITC' },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Compliance Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Score */}
          <div
            className={`rounded-lg border border-border/50 p-4 bg-gradient-to-r ${getScoreBgColor(
              mockComplianceScores.overall
            )}`}
          >
            <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
            <div className="flex items-end gap-3">
              <div className={`text-4xl font-bold ${getScoreColor(mockComplianceScores.overall)}`}>
                {mockComplianceScores.overall}
              </div>
              <div className="text-sm text-green-400 font-semibold">
                ↑ {mockComplianceScores.trend}%
              </div>
            </div>
          </div>

          {/* Regulation Scores */}
          <div className="grid grid-cols-2 gap-2">
            {regulations.map((reg) => {
              const score = mockComplianceScores[
                reg.key as keyof typeof mockComplianceScores
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
