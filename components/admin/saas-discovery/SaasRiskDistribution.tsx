'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSaasApps } from "@/lib/hooks/use-saas-discovery";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, ShieldAlert, Shield, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SaasRiskDistribution() {
    const { data: apps = [], isLoading: loading } = useSaasApps();

    const highRisk = apps.filter(a => a.risk_level === 'high' || a.is_shadow_it).length;
    const mediumRisk = apps.filter(a => a.risk_level === 'medium').length;
    const lowRisk = apps.filter(a => a.risk_level === 'low' || (!a.is_shadow_it && a.risk_level !== 'high' && a.risk_level !== 'medium')).length;

    const total = apps.length || 1;
    const highPercentage = Math.round((highRisk / total) * 100);
    const mediumPercentage = Math.round((mediumRisk / total) * 100);
    const lowPercentage = Math.round((lowRisk / total) * 100);

    if (loading) {
        return (
            <Card className="col-span-4 lg:col-span-3 border-border/50 bg-card/60 backdrop-blur-sm shadow-md">
                <CardHeader>
                    <CardTitle className="text-md">Risk Posture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-4 lg:col-span-3 border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform" />
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-md font-bold text-foreground">
                    <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                        <Shield className="h-4 w-4" />
                    </div>
                    Security Risk Posture
                </CardTitle>
                <CardDescription>Overall compliance and risk profile distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                {/* High Risk Item */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-bold text-destructive">
                            <ShieldX className="h-3.5 w-3.5" />
                            High Risk / Shadow IT
                        </span>
                        <span className="font-semibold text-foreground">
                            {highRisk} app{highRisk !== 1 ? 's' : ''} ({highPercentage}%)
                        </span>
                    </div>
                    <div className="h-2 w-full bg-secondary/60 rounded-full overflow-hidden border border-border/40">
                        <div 
                            className="h-full rounded-full bg-gradient-to-r from-destructive to-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                            style={{ width: `${highPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Medium Risk Item */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-bold text-amber-500">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Medium Risk
                        </span>
                        <span className="font-semibold text-foreground">
                            {mediumRisk} app{mediumRisk !== 1 ? 's' : ''} ({mediumPercentage}%)
                        </span>
                    </div>
                    <div className="h-2 w-full bg-secondary/60 rounded-full overflow-hidden border border-border/40">
                        <div 
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                            style={{ width: `${mediumPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Low Risk Item */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-bold text-emerald-500">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Low Risk / Whitelisted
                        </span>
                        <span className="font-semibold text-foreground">
                            {lowRisk} app{lowRisk !== 1 ? 's' : ''} ({lowPercentage}%)
                        </span>
                    </div>
                    <div className="h-2 w-full bg-secondary/60 rounded-full overflow-hidden border border-border/40">
                        <div 
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                            style={{ width: `${lowPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Summary Scorecard */}
                <div className={cn(
                    "rounded-xl border p-3.5 text-center flex flex-col gap-0.5 items-center",
                    highRisk > 0 
                        ? "bg-destructive/5 border-destructive/20 text-destructive"
                        : "bg-emerald-500/5 border-emerald-500/20 text-emerald-500"
                )}>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-90">Overall Risk Rating</p>
                    <p className="text-xl font-black">
                        {highRisk > 0 ? "CRITICAL RISK EXPOSURE" : "SECURE PLATFORM"}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
