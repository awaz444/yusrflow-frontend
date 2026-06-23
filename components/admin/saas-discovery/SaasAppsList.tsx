'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { RefreshCw, AppWindow, Search, Filter, ShieldCheck, ShieldAlert, Globe } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export default function SaasAppsList() {
    const { data: apps = [], isLoading: loading } = useSaasApps();
    const { mutate: triggerDiscovery, isPending: discovering } = useTriggerDiscovery();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTab, setFilterTab] = useState<"all" | "approved" | "shadow">("all");

    const handleDiscover = () => {
        triggerDiscovery(undefined, {
            onSuccess: () => toast.success("Discovery completed successfully"),
            onError: () => toast.error("Discovery failed"),
        });
    };

    const shadowCount = apps.filter(a => a.is_shadow_it).length;
    const approvedCount = apps.filter(a => !a.is_shadow_it).length;

    const filteredApps = apps.filter(app => {
        const matchesSearch = 
            app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (app.vendor && app.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (app.detected_via && app.detected_via.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filterTab === "approved") return matchesSearch && !app.is_shadow_it;
        if (filterTab === "shadow") return matchesSearch && app.is_shadow_it;
        return matchesSearch;
    });

    return (
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-md overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-md font-bold">
                            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                                <AppWindow className="h-4 w-4" />
                            </div>
                            Discovered SaaS Applications
                        </CardTitle>
                        <CardDescription>Applications currently detected operating inside tenant workspaces.</CardDescription>
                    </div>
                    <Button 
                        onClick={handleDiscover} 
                        disabled={discovering}
                        className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-4 shadow-md transition-all duration-200"
                    >
                        <RefreshCw className={cn("mr-2 h-4 w-4", discovering && "animate-spin")} />
                        {discovering ? 'Scanning Platform...' : 'Scan Now'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                {/* Search & Filters Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Search Field */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/75" />
                        <Input
                            placeholder="Filter by app name, publisher, source..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 bg-background/50 border-border/60 focus-visible:ring-primary/20"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-secondary/30 border border-border/30 rounded-xl max-w-fit">
                        <button
                            onClick={() => setFilterTab("all")}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                                filterTab === "all" 
                                    ? "bg-card text-foreground shadow-sm" 
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            All
                            <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full font-mono">{apps.length}</span>
                        </button>
                        <button
                            onClick={() => setFilterTab("approved")}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                                filterTab === "approved" 
                                    ? "bg-card text-emerald-500 shadow-sm border border-emerald-500/10" 
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Approved
                            <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full font-mono">{approvedCount}</span>
                        </button>
                        <button
                            onClick={() => setFilterTab("shadow")}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                                filterTab === "shadow" 
                                    ? "bg-card text-destructive shadow-sm border border-destructive/10" 
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Shadow IT
                            <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full font-mono">{shadowCount}</span>
                        </button>
                    </div>
                </div>

                {/* Table Data */}
                <div className="rounded-xl border border-border/50 bg-card/25 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-secondary/40">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Application Name</TableHead>
                                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Publisher</TableHead>
                                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Detected Via</TableHead>
                                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Status & Risk</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredApps.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-64 p-0">
                                        <EmptyState
                                            icon={AppWindow}
                                            title="No SaaS applications found"
                                            description={searchTerm ? "No apps match your search keywords." : "Run a discovery scan or link integrations to discover SaaS applications."}
                                            className="border-none min-h-[250px]"
                                        />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredApps.map((app) => (
                                    <TableRow key={app.id} className="group/row hover:bg-secondary/20 transition-colors">
                                        <TableCell className="font-semibold py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center border border-border/50 text-muted-foreground group-hover/row:border-primary/20 group-hover/row:text-primary transition-all duration-200">
                                                    <Globe className="h-4 w-4" />
                                                </div>
                                                <span className="text-sm font-bold text-foreground truncate max-w-[200px]">
                                                    {app.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-sm text-muted-foreground font-medium">
                                            {app.vendor || 'Unknown Publisher'}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] uppercase font-extrabold tracking-wider border shadow-sm",
                                                app.detected_via === 'oauth' 
                                                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20" 
                                                    : "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                            )}>
                                                {app.detected_via}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {app.is_shadow_it ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20 shadow-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                                                    Shadow IT (High Risk)
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Approved
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
