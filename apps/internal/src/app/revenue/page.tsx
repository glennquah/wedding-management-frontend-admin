'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { PageHeader } from '@shared/components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@shared/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import {
  PaymentsService,
  AllVendorsPayoutResponseDto,
  AllDatingPartnerCommissionResponseDto,
} from '@shared/api';
import { VendorPayoutsList } from './components/VendorPayoutsList';
import { PartnerCommissionsList } from './components/PartnerCommissionsList';

type PayoutType = 'vendor' | 'partner';

export default function SuperAdminRevenuePage() {
  const { data: session } = useSession();
  const [payouts, setPayouts] = useState<AllVendorsPayoutResponseDto[]>([]);
  const [commissions, setCommissions] = useState<AllDatingPartnerCommissionResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PayoutType>('vendor');

  useEffect(() => {
    if (session?.user) {
      fetchRevenueData();
    }
  }, [session]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);

      // Fetch all vendors payouts and partner commissions
      const [payoutsData, commissionsData] = await Promise.all([
        PaymentsService.paymentControllerGetAllVendorsPayout(),
        PaymentsService.paymentControllerGetAllDatingPartnerPayout(),
      ]);

      setPayouts(payoutsData);
      setCommissions(commissionsData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-4 md:pt-6">
        <PageHeader
          title="Revenue & Payouts"
          description="View all vendor payouts and download statements"
        />
        <div className="flex items-center justify-center py-8">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:pt-6">
      <PageHeader
        title="Revenue & Payouts"
        description="View all vendor payouts and partner commissions"
      />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PayoutType)}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="vendor">Vendor Payouts</TabsTrigger>
          <TabsTrigger value="partner">Partner Commission</TabsTrigger>
        </TabsList>

        <TabsContent value="vendor">
          <VendorPayoutsList payouts={payouts} />
        </TabsContent>

        <TabsContent value="partner">
          <PartnerCommissionsList commissions={commissions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
