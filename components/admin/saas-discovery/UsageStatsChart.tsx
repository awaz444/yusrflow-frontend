'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { saasDiscoveryService, AppUsageStats } from "@/lib/services/saas-discovery-service";

export default function UsageStatsChart() {
    const [data, setData] = useState<{ name: string; users: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stats = await saasDiscoveryService.getAppUsage(30);
                const chartData = Object.entries(stats).map(([name, users]) => ({
                    name,
                    users,
                }));
                setData(chartData);
            } catch (error) {
                console.error("Failed to fetch usage stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading chart...</div>;
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
