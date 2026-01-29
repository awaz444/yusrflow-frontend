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
import { useEffect, useState } from "react";
import { saasDiscoveryService, SaasApp } from "@/lib/services/saas-discovery-service";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export default function SaasAppsList() {
    const [apps, setApps] = useState<SaasApp[]>([]);
    const [loading, setLoading] = useState(true);
    const [discovering, setDiscovering] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Since we don't have a direct "list" endpoint yet properly exposed or documented to return JUST list without trigger,
            // we will use the discover endpoint which returns the list.
            // Ideally should separate list from trigger, but for now this works as "Refresh/List".
            const data = await saasDiscoveryService.triggerDiscovery();
            setApps(data);
        } catch (error) {
            console.error("Failed to fetch apps", error);
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDiscover = async () => {
        setDiscovering(true);
        try {
            const data = await saasDiscoveryService.triggerDiscovery();
            setApps(data);
            toast.success("Discovery completed successfully");
        } catch (error) {
            toast.error("Discovery failed");
        } finally {
            setDiscovering(false);
        }
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
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">Loading...</TableCell>
                            </TableRow>
                        ) : apps.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">No applications found.</TableCell>
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
