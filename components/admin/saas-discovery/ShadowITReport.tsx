'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useShadowIT } from "@/lib/hooks/use-saas-discovery";
import { AlertTriangle, ShieldAlert, ArrowUpRight, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShadowITReport() {
    const { data: shadowApps = [], isLoading: loading } = useShadowIT();

    if (loading) return null;
    if (shadowApps.length === 0) {
        return (
            <Card className="border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/5 dark:border-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.04)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center text-md font-bold text-emerald-500">
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mr-2">
                                <ShieldCheck className="h-4.5 w-4.5" />
                            </div>
                            Shadow IT Detection Center
                        </CardTitle>
                        <CardDescription className="text-emerald-500/80">
                            Monitoring OAuth connections and API integrations for unapproved access.
                        </CardDescription>
                    </div>
                    <span className="text-[10px] tracking-wider uppercase font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                        Secure
                    </span>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center p-6 bg-card/65 dark:bg-card/30 border border-border/40 rounded-xl min-h-[145px] text-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-2.5 relative">
                            <ShieldCheck className="h-5 w-5" />
                            <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: '3s' }} />
                        </div>
                        <h4 className="font-bold text-sm text-foreground">No Shadow IT Detected</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-[280px]">
                            All detected SaaS applications are currently matched with approved corporate credentials.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-destructive/30 bg-destructive/5 dark:bg-destructive/5 dark:border-destructive/20 shadow-[0_0_15px_rgba(239,68,68,0.04)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-destructive/10 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="space-y-1">
                    <CardTitle className="flex items-center text-md font-bold text-destructive">
                        <div className="p-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive mr-2 relative">
                            <ShieldAlert className="h-4.5 w-4.5" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full animate-ping" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full" />
                        </div>
                        Shadow IT Detection Center
                    </CardTitle>
                    <CardDescription className="text-destructive/80">
                        Unapproved third-party integrations detected operating inside tenant accounts.
                    </CardDescription>
                </div>
                <span className="text-[10px] tracking-wider uppercase font-extrabold px-2.5 py-0.5 rounded-full border border-destructive/20 bg-destructive/10 text-destructive animate-pulse">
                    Action Required
                </span>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                    {shadowApps.map(app => (
                        <div 
                            key={app.id} 
                            className="group/item flex items-center justify-between p-4 bg-card/75 dark:bg-card/40 hover:bg-card hover:-translate-y-0.5 border border-border/50 hover:border-destructive/30 rounded-xl transition-all duration-300 shadow-sm"
                        >
                            <div className="flex items-center gap-3.5 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center border border-border/60 text-muted-foreground group-hover/item:border-destructive/20 group-hover/item:text-destructive transition-colors shrink-0">
                                    <Globe className="h-4.5 w-4.5" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-sm text-foreground truncate max-w-[160px] group-hover/item:text-destructive transition-colors">
                                        {app.name}
                                    </h4>
                                    <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                                        {app.vendor || 'Unknown Vendor'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] font-bold text-destructive bg-destructive/10 border border-destructive/15 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    High Risk
                                </span>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
