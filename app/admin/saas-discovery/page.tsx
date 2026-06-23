import { Metadata } from "next";
import SaasAppsList from "@/components/admin/saas-discovery/SaasAppsList";
import SaasDiscoveryStats from "@/components/admin/saas-discovery/SaasDiscoveryStats";
import SaasRiskDistribution from "@/components/admin/saas-discovery/SaasRiskDistribution";
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { AppWindow } from "lucide-react";

export const metadata: Metadata = {
    title: "SaaS Discovery | Admin Dashboard",
    description: "Overview of discovered SaaS applications and risk posture.",
};

export default function SaasDiscoveryPage() {
    return (
        <PageContainer>
            <div className="space-y-6">
                <PageHeader
                    title="SaaS Discovery"
                    description="Overview of discovered SaaS applications and security risk classification."
                    icon={AppWindow}
                />
                
                {/* Stats Cards */}
                <SaasDiscoveryStats />

                {/* Main Content Grid: Risk Posture & Applications List */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <SaasRiskDistribution />
                    </div>
                    <div className="lg:col-span-2">
                        <SaasAppsList />
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
