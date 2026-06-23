'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useUsageStats } from "@/lib/hooks/use-saas-discovery";
import { Activity } from "lucide-react";

export default function UsageStatsChart() {
    const { data: stats, isLoading: loading } = useUsageStats(30);

    const data = stats
        ? Object.entries(stats).map(([name, users]) => ({ name, users }))
        : [];

    // Custom Tooltip component for a glassmorphic look
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card/95 backdrop-blur-md border border-border/60 p-3.5 rounded-xl shadow-xl flex flex-col gap-1 min-w-[140px] animate-in fade-in zoom-in-95 duration-150">
                    <p className="text-xs font-bold text-foreground truncate max-w-[180px]">{label}</p>
                    <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-border/40">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <p className="text-[11px] text-muted-foreground">
                            Active Users: <span className="font-semibold text-foreground text-xs">{payload[0].value}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (loading) return (
        <Card className="col-span-4 border-border/50 bg-card/60 backdrop-blur-sm shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-md">
                    <Activity className="h-4.5 w-4.5 text-primary" />
                    Application Usage (Last 30 Days)
                </CardTitle>
                <CardDescription>Loading usage statistics...</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
                <Skeleton className="h-[300px] w-full rounded-xl" />
            </CardContent>
        </Card>
    );

    // if (data.length === 0) return (
    //     <Card className="col-span-4 border-border/50 bg-card/60 backdrop-blur-sm shadow-md flex flex-col items-center justify-center p-8 min-h-[350px]">
    //         <Activity className="h-8 w-8 text-muted-foreground/60 mb-2 animate-pulse" />
    //         <p className="text-sm font-semibold text-muted-foreground">No usage logs available for this period</p>
    //         <p className="text-xs text-muted-foreground/80 mt-1">Connect M365 or run a scan to ingest activity.</p>
    //     </Card>
    // );

    return (
        <></>
    );
}
