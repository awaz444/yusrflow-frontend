import React from 'react';

interface ComplianceMeterProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ComplianceMeter({ score, maxScore = 100, size = 'md' }: ComplianceMeterProps) {
  const percentage = Math.min((score / maxScore) * 100, 100);
  
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
  };

  const getColor = () => {
    if (percentage >= 80) return 'rgb(16, 185, 129)'; // green
    if (percentage >= 60) return 'rgb(245, 158, 11)'; // yellow
    return 'rgb(239, 68, 68)'; // red
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  const sizeMap = {
    sm: { radius: 45, cx: 50, cy: 50, stroke: 2, textSize: 24 },
    md: { radius: 75, cx: 80, cy: 80, stroke: 3, textSize: 36 },
    lg: { radius: 100, cx: 110, cy: 110, stroke: 4, textSize: 48 },
  };

  const config = sizeMap[size];

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]}`}>
      <div className="relative w-full h-full">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx={config.cx}
            cy={config.cy}
            r={config.radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={config.stroke}
          />
          {/* Progress circle */}
          <circle
            cx={config.cx}
            cy={config.cy}
            r={config.radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">{score}%</span>
          <span className="text-xs text-muted-foreground">Compliance</span>
        </div>
      </div>
    </div>
  );
}
