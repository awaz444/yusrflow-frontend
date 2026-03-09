import { Metadata } from "next";
import SaasAppsList from "@/components/admin/saas-discovery/SaasAppsList";
import UsageStatsChart from "@/components/admin/saas-discovery/UsageStatsChart";
import ShadowITReport from "@/components/admin/saas-discovery/ShadowITReport";
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { AppWindow } from "lucide-react";

export const metadata: Metadata = {
    title: "SaaS Discovery | Admin Dashboard",
    description: "Overview of discovered SaaS applications and usage.",
};

export default function SaasDiscoveryPage() {
    return (
        <PageContainer>
            <PageHeader
                title="SaaS Discovery"
                description="Overview of discovered SaaS applications and shadow IT analysis."
                icon={AppWindow}
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats Cards could go here if implemented separately */}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-4">
                <div className="col-span-4 lg:col-span-7">
                    <ShadowITReport />
                </div>
                <div className="col-span-4">
                    <UsageStatsChart />
                </div>
                <div className="col-span-4 lg:col-span-3">
                    {/* Placeholder for breakdown chart or list */}
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                <SaasAppsList />
            </div>
        </PageContainer>
    );
}
