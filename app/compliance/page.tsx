'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RuleCard } from '@/components/compliance/rule-card';
import { ComplianceMeter } from '@/components/dashboard/compliance-meter';
import { Download, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { mockComplianceScoresDetailed } from '@/lib/mockData';

const regulations = [
  { name: 'PDPL', score: 78 },
  { name: 'SDAIA', score: 72 },
  { name: 'NCA', score: 65 },
  { name: 'CITC', score: 80 },
  { name: 'SOC2', score: 88 },
];

const rules = [
  {
    title: 'PDPL Article 29 - Data Localization',
    description: 'Personal data must be stored within Saudi Arabia.',
    status: 'non-compliant' as const,
    affectedApps: ['Slack', 'Trello', 'Asana'],
    remediation: 'Migrate data to GCC-compliant servers or switch to alternative providers with KSA data centers.',
  },
  {
    title: 'SDAIA Article 5 - Data Security',
    description: 'Ensure encryption in transit and at rest.',
    status: 'partial' as const,
    affectedApps: ['Notion', 'Google Drive'],
    remediation: 'Verify SSL/TLS encryption for all data transmission and enable encryption at rest.',
  },
  {
    title: 'NCA Cybersecurity Requirements',
    description: 'Multi-factor authentication for all users.',
    status: 'compliant' as const,
    affectedApps: [],
    remediation: 'N/A - Already compliant',
  },
];

const violations = [
  {
    id: '1',
    app: 'Salesforce',
    rule: 'Data Localization',
    severity: 'critical' as const,
    details: 'Data stored in US data centers, violating PDPL requirements.',
    dueDate: '2024-02-15',
  },
  {
    id: '2',
    app: 'Slack',
    rule: 'Data Residency',
    severity: 'critical' as const,
    details: 'Messages stored outside GCC region.',
    dueDate: '2024-02-20',
  },
  {
    id: '3',
    app: 'Notion',
    rule: 'Encryption Certificate',
    severity: 'high' as const,
    details: 'SSL certificate expires in 30 days.',
    dueDate: '2024-03-10',
  },
];

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex-1 overflow-y-auto">
      <main className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Compliance Center
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage regulatory compliance across your SaaS portfolio
          </p>
        </div>

        {/* Overall Compliance Score */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-8 col-span-1">
            <h2 className="text-lg font-semibold text-foreground mb-6 text-center">
              Overall Compliance
            </h2>
            <div className="flex justify-center">
              <ComplianceMeter score={76} size="md" />
            </div>
          </Card>

          {/* Regulation Breakdown */}
          {regulations.map((reg) => (
            <Card key={reg.name} className="p-6">
              <h3 className="font-semibold text-foreground mb-4">{reg.name}</h3>
              <div className="flex items-center justify-center mb-4">
                <div className="w-32 h-32">
                  <ComplianceMeter score={reg.score} size="sm" />
                </div>
              </div>
              <div className="text-center">
                {reg.score >= 80 ? (
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                ) : reg.score >= 60 ? (
                  <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">Non-Compliant</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">All Rules</TabsTrigger>
            <TabsTrigger value="violations">Violations</TabsTrigger>
            <TabsTrigger value="remediation">Remediation</TabsTrigger>
          </TabsList>

          {/* All Rules Tab */}
          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="space-y-4">
              {rules.map((rule, index) => (
                <RuleCard
                  key={index}
                  title={rule.title}
                  description={rule.description}
                  status={rule.status}
                  affectedApps={rule.affectedApps}
                  remediation={rule.remediation}
                />
              ))}
            </div>
          </TabsContent>

          {/* Violations Tab */}
          <TabsContent value="violations" className="mt-6">
            <div className="space-y-4">
              {violations.map((violation) => (
                <Card key={violation.id} className="p-6 border-l-4 border-red-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <h3 className="font-semibold text-foreground text-lg">{violation.app}</h3>
                        <Badge className="bg-red-100 text-red-800">
                          {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{violation.rule}</p>
                      <p className="text-sm text-foreground mb-3">{violation.details}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(violation.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" className="text-orange-600 bg-transparent">
                      Fix
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Remediation Tab */}
          <TabsContent value="remediation" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {rules
                .filter((r) => r.status !== 'compliant')
                .map((rule, index) => (
                  <Card key={index} className="p-6">
                    <h3 className="font-semibold text-foreground mb-3">{rule.title}</h3>
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Step-by-Step Fix:</h4>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Identify all affected applications</li>
                        <li>Review current compliance status</li>
                        <li>Implement required changes</li>
                        <li>Verify compliance with new configuration</li>
                        <li>Document changes for audit trail</li>
                      </ol>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{rule.remediation}</p>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download Fix Guide
                    </Button>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Generate Report */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Generate Compliance Report</h3>
              <p className="text-sm text-muted-foreground">
                Create a comprehensive PDF report for auditors and stakeholders
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Download className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
