'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSaasApps } from '@/lib/hooks/use-saas-discovery';
import { AppWindow, ShieldCheck, ShieldAlert, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SaasDiscoveryStats() {
    const { data: apps = [], isLoading: loading } = useSaasApps();

    const totalApps = apps.length;
    const shadowApps = apps.filter(app => app.is_shadow_it).length;
    const approvedApps = apps.filter(app => !app.is_shadow_it).length;
    const totalPublishers = new Set(apps.map(app => app.vendor).filter(Boolean)).size;

    const stats = [
        {
            title: "Total SaaS Apps",
            value: totalApps,
            desc: "Active cloud integrations",
            icon: AppWindow,
            glowColor: "from-violet-500 to-indigo-500 bg-violet-500/10 text-violet-500 border-violet-500/20 shadow-violet-500/10",
            trend: "OAuth scanned"
        },
        {
            title: "Approved Applications",
            value: approvedApps,
            desc: "On organization whitelist",
            icon: ShieldCheck,
            glowColor: "from-emerald-500 to-teal-500 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10",
            trend: `${totalApps ? Math.round((approvedApps / totalApps) * 100) : 0}% compliance`
        },
        {
            title: "Shadow IT Detected",
            value: shadowApps,
            desc: "Requires security review",
            icon: ShieldAlert,
            glowColor: shadowApps > 0 
                ? "from-destructive to-rose-500 bg-destructive/10 text-destructive border-destructive/25 shadow-destructive/10"
                : "from-muted-foreground to-neutral-500 bg-secondary text-muted-foreground border-border/40",
            trend: shadowApps > 0 ? "Immediate Action Required" : "System Safe",
            pulse: shadowApps > 0
        },
        {
            title: "Total Publishers",
            value: totalPublishers,
            desc: "Unique software vendors",
            icon: Layers,
            glowColor: "from-amber-500 to-orange-500 bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/10",
            trend: "Vendor risk analyzed"
        }
    ];

    if (loading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="border-border/50 relative overflow-hidden bg-card/60 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
            {stats.map((metric, i) => {
                const Icon = metric.icon;
                return (
                    <Card 
                        key={i} 
                        className={cn(
                            "group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/30 relative overflow-hidden",
                            metric.pulse && "border-destructive/30 shadow-[0_0_15px_rgba(239,68,68,0.05)] hover:border-destructive/50"
                        )}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{metric.title}</CardTitle>
                            <div className={cn(
                                "p-2 rounded-xl border shadow-sm transition-all duration-300 group-hover:scale-110 relative", 
                                metric.glowColor
                            )}>
                                <Icon className="h-4.5 w-4.5" />
                                {metric.pulse && (
                                    <>
                                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-destructive rounded-full animate-ping" />
                                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-destructive rounded-full" />
                                    </>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-1.5">
                            <div className={cn(
                                "text-3xl font-extrabold tracking-tight",
                                metric.pulse ? "text-destructive" : "text-foreground"
                            )}>
                                {metric.value}
                            </div>
                            <div className="flex items-center justify-between gap-2 text-xs">
                                <span className="text-muted-foreground truncate max-w-[140px]">{metric.desc}</span>
                                <span className={cn(
                                    "font-semibold text-[10px] px-2 py-0.5 rounded-full border shrink-0",
                                    metric.pulse 
                                        ? "bg-destructive/10 text-destructive border-destructive/25 font-bold" 
                                        : "bg-secondary/80 text-foreground border-border/40"
                                )}>
                                    {metric.trend}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
