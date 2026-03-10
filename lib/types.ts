export interface App {
    id: string;
    name: string;
    category: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    complianceScore: number;
    users: number;
    status: 'compliant' | 'partial' | 'non_compliant';
    costPerUser?: number;
    manualMonthlyCost?: number;
    monthlySpend?: number;
    billingCycle?: 'monthly' | 'annual';
    renewalDate?: string | Date;
    detailedScores?: Array<{
        id: string;
        rule_code: string;
        category: string;
        score: number;
        status: string;
        reason?: string;
    }>;
}
