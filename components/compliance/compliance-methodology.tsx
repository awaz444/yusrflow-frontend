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

export function ComplianceMethodology() {
    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="mb-10 pb-6 border-b">
                <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center gap-3">
                    <Scale className="h-8 w-8 text-primary" />
                    How Yusrflow Calculates Compliance Scores
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
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
                        <div className="bg-card border rounded-xl p-6 text-center shadow-sm">
                            <div className="text-lg font-mono flex flex-col items-center justify-center gap-2">
                                <span className="font-semibold text-primary whitespace-nowrap text-sm">Compliance Score =</span>
                                <div className="flex flex-col items-center justify-center">
                                    <span className="border-b border-primary/30 pb-1 w-full px-4 font-bold text-foreground">∑ (Rule Score × Weight)</span>
                                    <span className="pt-1 px-4 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Number of Applicable Rules</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Evidence Based Evaluation */}
            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Search className="h-6 w-6 text-indigo-500" />
                    Evidence-Based Evaluation
                </h2>
                <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-6">
                    <p className="text-base mb-6 text-indigo-950 dark:text-indigo-200">
                        Yusrflow does not rely solely on policy claims. Instead, the platform verifies compliance using multiple sources of evidence.
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
                </div>
            </div>

            {/* PDPL Calculation */}
            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-emerald-500" />
                    PDPL Compliance Calculation
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Globe className="h-5 w-5 text-blue-500" />
                                1. Data Residency
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            If infrastructure is located outside approved jurisdictions, the residency rule will fail regardless of policy statements.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Lock className="h-5 w-5 text-purple-500" />
                                2. Data Subject Rights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            Platforms that provide automated rights portals (access, deletion, etc.) receive higher compliance scores.
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-primary text-primary-foreground border-primary shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <ShieldCheck className="w-24 h-24" />
                    </div>
                    <CardHeader className="relative z-10 pb-2">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <ShieldAlert className="h-6 w-6" />
                            What a Score Means
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-4 text-primary-foreground/90 relative z-10">
                        <p>
                            A Yusrflow compliance score represents the <strong>percentage of regulatory obligations</strong> that a platform currently satisfies based on observable evidence.
                        </p>
                        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                            <div className="font-mono text-sm space-y-1">
                                <div className="flex justify-between border-b border-white/10 pb-1">
                                    <span>Rules Passed:</span>
                                    <span className="font-bold text-green-400">7</span>
                                </div>
                                <div className="flex justify-between text-lg pt-1">
                                    <span>Compliance Score:</span>
                                    <span className="font-bold text-white">70%</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Reliable Methodology</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>• <strong>Infrastructure Verification:</strong> Technical signals are treated as ground truth.</p>
                        <p>• <strong>Regulation-Mapped Rules:</strong> Every rule maps directly to a regulatory requirement.</p>
                        <p>• <strong>Explainable Decisions:</strong> Scoring decisions are accompanied by evidence.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
