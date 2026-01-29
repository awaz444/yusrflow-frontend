import { Metadata } from "next";
import SaasAppsList from "@/components/admin/saas-discovery/SaasAppsList";
import UsageStatsChart from "@/components/admin/saas-discovery/UsageStatsChart";
import ShadowITReport from "@/components/admin/saas-discovery/ShadowITReport";

export const metadata: Metadata = {
    title: "SaaS Discovery | Admin Dashboard",
    description: "Overview of discovered SaaS applications and usage.",
};

export default function SaasDiscoveryPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">SaaS Discovery</h2>
                <div className="flex items-center space-x-2">
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats Cards could go here if implemented separately */}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 lg:col-span-7">
                    <ShadowITReport />
                </div>
                <div className="col-span-4">
                    <UsageStatsChart />
                </div>
                <div className="col-span-4 lg:col-span-3">
                    {/* Placeholder for breakdown chart or list */}
                    {/* For now we can make the list wider or stats full width */}
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                <SaasAppsList />
            </div>
        </div>
    );
}
