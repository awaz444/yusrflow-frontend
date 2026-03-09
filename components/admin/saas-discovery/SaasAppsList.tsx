'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSaasApps, useTriggerDiscovery } from "@/lib/hooks/use-saas-discovery";
import { toast } from "sonner";
import { RefreshCw, AppWindow } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function SaasAppsList() {
    const { data: apps = [], isLoading: loading } = useSaasApps();
    const { mutate: triggerDiscovery, isPending: discovering } = useTriggerDiscovery();

    const handleDiscover = () => {
        triggerDiscovery(undefined, {
            onSuccess: () => toast.success("Discovery completed successfully"),
            onError: () => toast.error("Discovery failed"),
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="grid gap-2">
                    <CardTitle>Discovered SaaS Applications</CardTitle>
                    <CardDescription>Applications detected via OAuth connections.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleDiscover} disabled={discovering}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${discovering ? 'animate-spin' : ''}`} />
                    {discovering ? 'Discovering...' : 'Scan Now'}
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Application Name</TableHead>
                            <TableHead>Publisher</TableHead>
                            <TableHead>Detected Via</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                </TableRow>
                            ))
                        ) : apps.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-64 p-0">
                                    <EmptyState
                                        icon={AppWindow}
                                        title="No applications found"
                                        description="Run a discovery scan to detect SaaS applications."
                                        className="border-none min-h-[300px]"
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            apps.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.name}</TableCell>
                                    <TableCell>{app.vendor || 'Unknown'}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{app.detected_via}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {app.is_shadow_it ? (
                                            <Badge variant="destructive">Shadow IT</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
