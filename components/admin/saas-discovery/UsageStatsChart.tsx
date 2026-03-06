'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useUsageStats } from "@/lib/hooks/use-saas-discovery";

export default function UsageStatsChart() {
    const { data: stats, isLoading: loading } = useUsageStats(30);

    const data = stats
        ? Object.entries(stats).map(([name, users]) => ({ name, users }))
        : [];

    if (loading) return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Application Usage (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <Skeleton className="h-[350px] w-full" />
            </CardContent>
        </Card>
    );
    if (data.length === 0) return <div>No usage data available</div>;

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Application Usage (Last 30 Days)</CardTitle>
                <CardDescription>Number of active users per application</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{ background: '#333', border: 'none', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="users" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
