// Mock data for Yusrflow dashboard

export const mockTenant = {
  id: '1',
  name: 'Acme Corporation',
  industry: 'Technology',
  employeeCount: 500,
  country: 'SA',
  subscriptionTier: 'enterprise',
};

export const mockComplianceScores = {
  overall: 78,
  pdpl: 82,
  sdaia: 76,
  nca: 72,
  citc: 80,
  trend: 5, // % increase
};

export const mockSaasApps = [
  {
    id: '1',
    name: 'Microsoft 365',
    category: 'Productivity',
    riskLevel: 'low',
    complianceScore: 95,
    monthlySpend: 5000,
    users: 450,
    status: 'compliant',
  },
  {
    id: '2',
    name: 'Slack',
    category: 'Communication',
    riskLevel: 'medium',
    complianceScore: 78,
    monthlySpend: 2500,
    users: 500,
    status: 'partial',
  },
  {
    id: '3',
    name: 'Salesforce',
    category: 'CRM',
    riskLevel: 'high',
    complianceScore: 65,
    monthlySpend: 8000,
    users: 120,
    status: 'non_compliant',
  },
  {
    id: '4',
    name: 'AWS',
    category: 'Cloud',
    riskLevel: 'low',
    complianceScore: 92,
    monthlySpend: 15000,
    users: 45,
    status: 'compliant',
  },
  {
    id: '5',
    name: 'Jira',
    category: 'Project Management',
    riskLevel: 'medium',
    complianceScore: 81,
    monthlySpend: 3500,
    users: 200,
    status: 'compliant',
  },
  {
    id: '6',
    name: 'Notion',
    category: 'Documentation',
    riskLevel: 'high',
    complianceScore: 58,
    monthlySpend: 1200,
    users: 380,
    status: 'non_compliant',
  },
];

export const mockAlerts = [
  {
    id: '1',
    title: 'Salesforce Compliance Gap',
    description: 'Data residency requirement not met for PDPL',
    severity: 'high',
    app: 'Salesforce',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Notion Data Exposure Risk',
    description: 'Unencrypted data transmission detected',
    severity: 'critical',
    app: 'Notion',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Slack License Renewal',
    description: 'Renewal date approaching in 15 days',
    severity: 'medium',
    app: 'Slack',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

export const mockSpendData = [
  { month: 'Jan', spend: 28000, budget: 35000 },
  { month: 'Feb', spend: 31000, budget: 35000 },
  { month: 'Mar', spend: 29500, budget: 35000 },
  { month: 'Apr', spend: 32500, budget: 35000 },
  { month: 'May', spend: 34000, budget: 35000 },
  { month: 'Jun', spend: 35500, budget: 35000 },
];

export const mockComplianceData = [
  { name: 'Compliant', value: 3, color: '#6d5cff' },
  { name: 'Partial', value: 2, color: '#8b7aff' },
  { name: 'Non-Compliant', value: 1, color: '#ff4444' },
];

export const mockComplianceScoresDetailed = [
  { regulation: 'PDPL', score: 82, trend: 5, status: 'compliant' as const },
  { regulation: 'SDAIA', score: 76, trend: 3, status: 'partial' as const },
  { regulation: 'NCA', score: 72, trend: -2, status: 'partial' as const },
  { regulation: 'CITC', score: 80, trend: 4, status: 'compliant' as const },
  { regulation: 'SOC2', score: 88, trend: 2, status: 'compliant' as const },
];

export const mockComplianceIssues = [
  {
    id: '1',
    title: 'Salesforce Data Residency Gap',
    description:
      'Salesforce does not store data in Saudi Arabia as required by PDPL. This creates a critical compliance gap.',
    regulation: 'PDPL',
    severity: 'critical' as const,
    status: 'open' as const,
    affectedApps: ['Salesforce'],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Notion Encryption Certificate Expiring',
    description: 'SSL certificate for Notion data transmission expires in 30 days. Renewal pending.',
    regulation: 'SDAIA',
    severity: 'high' as const,
    status: 'in-progress' as const,
    affectedApps: ['Notion'],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Slack Audit Logging Configuration',
    description: 'Slack needs to enable enhanced audit logging to meet SOC2 requirements.',
    regulation: 'SOC2',
    severity: 'medium' as const,
    status: 'in-progress' as const,
    affectedApps: ['Slack'],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    title: 'AWS Multi-Factor Authentication',
    description: 'Enable mandatory MFA for all AWS administrative accounts.',
    regulation: 'SOC2',
    severity: 'low' as const,
    status: 'open' as const,
    affectedApps: ['AWS'],
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
  },
];

export const mockTimelineEvents = [
  {
    id: '1',
    title: 'Jira Compliance Audit Passed',
    description: 'Annual compliance audit for Jira completed successfully.',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    type: 'success' as const,
  },
  {
    id: '2',
    title: 'Microsoft 365 Updated Security Policy',
    description: 'Security policy updated to align with PDPL requirements.',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    type: 'warning' as const,
  },
  {
    id: '3',
    title: 'Salesforce Risk Assessment Due',
    description: 'Annual risk assessment for Salesforce integration scheduled.',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    type: 'pending' as const,
  },
  {
    id: '4',
    title: 'Compliance Training Completed',
    description: 'All team members completed mandatory compliance training.',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    type: 'success' as const,
  },
];
