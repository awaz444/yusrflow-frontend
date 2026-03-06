'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useShadowIT } from "@/lib/hooks/use-saas-discovery";
import { AlertTriangle } from "lucide-react";

export default function ShadowITReport() {
    const { data: shadowApps = [], isLoading: loading } = useShadowIT();

    if (loading) return null;
    if (shadowApps.length === 0) return null;

    return (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
            <CardHeader>
                <CardTitle className="flex items-center text-red-700 dark:text-red-400">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Shadow IT Detection
                </CardTitle>
                <CardDescription>
                    The following applications are not on the approved list but are being used.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {shadowApps.map(app => (
                        <div key={app.id} className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-lg border border-red-100 dark:border-red-900/50 shadow-sm">
                            <div>
                                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{app.name}</h4>
                                <p className="text-sm text-neutral-500">{app.vendor || 'Unknown Vendor'}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 px-2 py-1 rounded-full">High Risk</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
