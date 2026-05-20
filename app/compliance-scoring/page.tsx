'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ShieldCheck,
    Scale,
    FileText,
    Database,
    ShieldAlert,
    CheckCircle2,
    Info,
    Activity,
    Globe,
    Lock,
    Search
} from "lucide-react";
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageContainer } from '@/components/layout/page-container';

export default function ComplianceScoringMethodology() {
    return (
        <AuthGuard>
            <PageContainer className="max-w-5xl py-8">
                {/* Header */}
                <div className="mb-10 pb-6 border-b">
                    <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
                        <Scale className="h-10 w-10 text-primary" />
                        How Yusrflow Calculates Compliance Scores
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Yusrflow provides automated regulatory compliance analysis by evaluating digital services against structured legal and technical requirements. Each platform scanned by Yusrflow receives a compliance score that reflects how closely it aligns with regulatory frameworks such as PDPL, NDMO, and related data governance standards.
                    </p>
                    <div className="mt-6 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        Our scoring model is designed to be transparent, evidence-based, and auditable.
                    </div>
                </div>

                {/* Overview & Formula */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <FileText className="h-6 w-6 text-blue-500" />
                                Compliance Scoring Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>Every compliance framework in Yusrflow is built using a rule-based evaluation matrix.</p>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                <li>Each regulation is broken down into individual compliance rules.</li>
                                <li>These rules represent specific legal or operational obligations defined by the regulation.</li>
                            </ul>
                            <div className="bg-muted p-4 rounded-lg mt-4">
                                <h4 className="font-semibold mb-3">Examples include:</h4>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="bg-background">Data residency requirements</Badge>
                                    <Badge variant="outline" className="bg-background">Privacy policy transparency</Badge>
                                    <Badge variant="outline" className="bg-background">Data subject rights mechanisms</Badge>
                                    <Badge variant="outline" className="bg-background">Consent collection practices</Badge>
                                    <Badge variant="outline" className="bg-background">Data minimization standards</Badge>
                                </div>
                            </div>
                            <p className="font-medium text-sm mt-4 text-foreground/80">
                                Each rule is evaluated independently and assigned a score based on the evidence discovered during analysis.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Activity className="h-6 w-6 text-primary" />
                                The Compliance Formula
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p>Yusrflow calculates compliance using a weighted average of applicable regulatory rules.</p>

                            <div className="bg-card border rounded-xl p-6 text-center shadow-sm my-6">
                                <div className="text-lg font-mono flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <span className="font-semibold text-primary whitespace-nowrap">Compliance Score =</span>
                                    <div className="flex flex-col items-center justify-center">
                                        <span className="border-b-2 border-primary/30 pb-2 w-full px-4 font-bold text-foreground">∑ (Rule Score × Weight)</span>
                                        <span className="pt-2 px-4 text-sm text-muted-foreground font-medium">Number of Applicable Rules</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm bg-card p-5 rounded-lg border">
                                <h4 className="font-semibold text-base mb-2">Rule Score & Weight</h4>
                                <div className="grid grid-cols-[1fr_2fr] gap-y-3 gap-x-2">
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">100%</span>
                                    <span className="text-muted-foreground">Requirement fully satisfied</span>
                                    <span className="font-bold text-amber-600 dark:text-amber-400">50%</span>
                                    <span className="text-muted-foreground">Partial compliance or insufficient evidence</span>
                                    <span className="font-bold text-red-600 dark:text-red-400">0%</span>
                                    <span className="text-muted-foreground">Requirement not satisfied</span>
                                </div>
                                <div className="pt-4 mt-2 border-t">
                                    <p className="text-muted-foreground">
                                        <strong className="text-foreground">Applicable Rules:</strong> Some rules may not apply to certain services (e.g., a platform that does not collect personal data). If a rule is not relevant, it is excluded from the calculation. This ensures scores reflect only actual obligations.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Evidence Based Evaluation */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <Search className="h-8 w-8 text-indigo-500" />
                        Evidence-Based Evaluation
                    </h2>
                    <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-6 md:p-8">
                        <p className="text-lg mb-6 text-indigo-950 dark:text-indigo-200">
                            Yusrflow does not rely solely on policy claims. Instead, the platform verifies compliance using multiple sources of evidence, including:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {[
                                'Privacy policies and legal documentation',
                                'Website and application behavior',
                                'Data collection forms',
                                'Public infrastructure signals',
                                'Domain architecture and subdomains',
                                'Automated rights management portals'
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm">
                                    <CheckCircle2 className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm font-medium leading-tight">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-start gap-3 bg-white/60 dark:bg-slate-900/60 p-4 rounded-lg">
                            <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                            <p className="font-medium text-sm text-indigo-900 dark:text-indigo-200">
                                Each compliance rule includes a reasoning record explaining why the system passed or failed that requirement. This allows organizations and auditors to understand the exact basis for every compliance decision.
                            </p>
                        </div>
                    </div>
                </div>

                {/* PDPL Calculation */}
                <div className="mb-16">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                            <ShieldCheck className="h-8 w-8 text-emerald-500" />
                            PDPL Compliance Calculation
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-3xl">
                            The Saudi Personal Data Protection Law (PDPL) compliance score measures how well an organization aligns with key obligations defined by the regulation. Yusrflow evaluates PDPL compliance across several operational categories:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Globe className="h-6 w-6 text-blue-500" />
                                    1. Data Residency
                                </CardTitle>
                                <CardDescription className="text-base mt-2">PDPL places strict requirements on where personal data may be stored or processed.</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm space-y-4">
                                <div>
                                    <p className="font-semibold mb-2">Yusrflow verifies:</p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li>Hosting infrastructure location</li>
                                        <li>Cloud region metadata</li>
                                        <li>IP-based server analysis</li>
                                    </ul>
                                </div>
                                <div className="bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 p-3 rounded-md border border-red-100 dark:border-red-900/50 text-xs font-medium">
                                    If infrastructure is located outside approved jurisdictions, the residency rule will fail regardless of policy statements.
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <FileText className="h-6 w-6 text-emerald-500" />
                                    2. Privacy Transparency
                                </CardTitle>
                                <CardDescription className="text-base mt-2">Organizations must clearly disclose how personal data is collected and processed.</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm space-y-4">
                                <div>
                                    <p className="font-semibold mb-2">Yusrflow checks whether the service provides:</p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li>A publicly accessible privacy policy</li>
                                        <li>Clear descriptions of data collection purposes</li>
                                        <li>Disclosure of data sharing practices</li>
                                    </ul>
                                </div>
                                <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 p-3 rounded-md border border-amber-100 dark:border-amber-900/50 text-xs font-medium">
                                    Incomplete or vague disclosures reduce the transparency score.
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Lock className="h-6 w-6 text-purple-500" />
                                    3. Data Subject Rights
                                </CardTitle>
                                <CardDescription className="text-base mt-2">PDPL requires organizations to provide mechanisms for users to exercise their rights.</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm space-y-4">
                                <div>
                                    <p className="font-semibold mb-2">Yusrflow looks for:</p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li>Data access request portals</li>
                                        <li>Account deletion workflows</li>
                                        <li>Dedicated privacy request endpoints</li>
                                        <li>Trust or privacy management subdomains</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200 p-3 rounded-md border border-green-100 dark:border-green-900/50 text-xs font-medium">
                                    Platforms that provide automated rights portals receive higher compliance scores.
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <CheckCircle2 className="h-6 w-6 text-orange-500" />
                                    4. Consent Mechanisms
                                </CardTitle>
                                <CardDescription className="text-base mt-2">Valid consent must be explicit and clearly separated from other agreements.</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm space-y-4">
                                <div>
                                    <p className="font-semibold mb-2">Yusrflow evaluates whether:</p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li>Consent is clearly distinguishable from general terms</li>
                                        <li>Users can opt in rather than being automatically enrolled</li>
                                        <li>Consent is collected before personal data processing begins</li>
                                    </ul>
                                </div>
                                <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 p-3 rounded-md border border-amber-100 dark:border-amber-900/50 text-xs font-medium">
                                    Bundled or ambiguous consent mechanisms reduce the compliance score.
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2 hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Database className="h-6 w-6 text-cyan-500" />
                                    5. Data Minimization
                                </CardTitle>
                                <CardDescription className="text-base mt-2">PDPL requires organizations to collect only the personal data necessary for the service provided.</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm">
                                <div className="grid md:grid-cols-2 gap-6 items-center">
                                    <div>
                                        <p className="font-semibold mb-3">Yusrflow analyzes:</p>
                                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                            <li>Registration forms used on the platform</li>
                                            <li>Application onboarding flows</li>
                                            <li>Documented data fields collected from users</li>
                                        </ul>
                                    </div>
                                    <div className="bg-cyan-50 dark:bg-cyan-950/20 p-5 rounded-xl border border-cyan-100 dark:border-cyan-900/30 flex items-center justify-center text-center h-full">
                                        <p className="text-cyan-800 dark:text-cyan-300 font-medium">
                                            If a platform requests personal data unrelated to its core function, the rule may be flagged as excessive collection, negatively impacting the score.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Conclusion / Summary */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Reliable Methodology</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-4">
                            <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border shadow-sm">
                                <strong className="text-foreground block mb-1">Infrastructure Verification</strong>
                                Technical signals such as hosting location are treated as ground truth rather than relying only on policy claims.
                            </div>
                            <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border shadow-sm">
                                <strong className="text-foreground block mb-1">Regulation-Mapped Rules</strong>
                                Every rule directly maps to a specific requirement within the regulatory framework.
                            </div>
                            <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border shadow-sm">
                                <strong className="text-foreground block mb-1">Explainable Decisions</strong>
                                All scoring decisions are accompanied by machine-generated reasoning and supporting evidence.
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Transparent Audit Trail</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            <p className="mb-4">Every score generated by Yusrflow includes a detailed reasoning layer. For each rule, the system records:</p>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li>Evidence used in evaluation</li>
                                <li>Detected signals or infrastructure data</li>
                                <li>Explanation for pass, partial, or fail outcomes</li>
                            </ul>
                            <div className="bg-primary/10 text-primary p-4 rounded-lg font-medium text-xs leading-relaxed border border-primary/20">
                                This reasoning layer allows compliance teams, regulators, and auditors to fully review the basis of each assessment.
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary text-primary-foreground border-primary lg:row-span-2 flex flex-col shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <ShieldCheck className="w-32 h-32" />
                        </div>

                        <CardHeader className="relative z-10 pb-2">
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <ShieldAlert className="h-7 w-7" />
                                What a Score Means
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-[15px] space-y-5 text-primary-foreground/90 relative z-10 flex-col flex flex-1">
                            <p className="leading-relaxed">
                                A Yusrflow compliance score represents the <strong>percentage of regulatory obligations</strong> that a platform currently satisfies based on observable evidence.
                            </p>
                            <p className="leading-relaxed">
                                Higher scores indicate stronger alignment with regulatory requirements, while lower scores highlight areas that may require remediation.
                            </p>
                            <p className="text-sm font-medium opacity-80 leading-relaxed italic">
                                The score should be interpreted as a compliance readiness indicator, helping organizations identify and address regulatory gaps.
                            </p>

                            <div className="mt-auto pt-6">
                                <div className="bg-black/20 dark:bg-black/40 backdrop-blur-sm p-5 rounded-xl border border-white/10">
                                    <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-base">
                                        <CheckCircle2 className="h-5 w-5 text-green-400" /> ✅ Example Evaluation
                                    </h4>
                                    <div className="font-mono text-sm space-y-2 mb-4">
                                        <div className="flex justify-between border-b border-white/10 pb-1">
                                            <span>Rules Passed:</span>
                                            <span className="font-bold text-green-400">7</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/10 pb-1">
                                            <span>Rules Failed:</span>
                                            <span className="font-bold text-red-400">3</span>
                                        </div>
                                        <div className="flex justify-between text-lg pt-2">
                                            <span>Compliance Score:</span>
                                            <span className="font-bold text-white">70%</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-primary-foreground/70 leading-relaxed bg-black/20 p-3 rounded-lg">
                                        This means the platform currently satisfies 70% of applicable regulatory requirements evaluated by Yusrflow.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </PageContainer>
        </AuthGuard>
    );
}
