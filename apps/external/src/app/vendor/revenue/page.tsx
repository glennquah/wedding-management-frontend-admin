'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { PageHeader } from '@shared/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Download, DollarSign, TrendingUp, Clock, CheckCircle, Loader2, Receipt } from 'lucide-react';
import { PaymentsService, OpenAPI } from '@shared/api';

interface VendorPayout {
  id: number;
  amount: number;
  currency: string;
  status: string;
  earningsCount: number;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  stripeTransferId: string;
}

export default function RevenuePage() {
  const { data: session } = useSession();
  const [payouts, setPayouts] = useState<VendorPayout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchRevenueData();
    }
  }, [session]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const vendorId = session?.user?.id;

      if (!vendorId) return;

      // Fetch payouts
      const [payoutsData] = await Promise.all([
        PaymentsService.paymentControllerGetVendorPayouts(vendorId),
      ]);
 
      setPayouts(payoutsData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (payoutId: number) => {
    try {
      // Get the token from OpenAPI config (it's a resolver function)
      const token = typeof OpenAPI.TOKEN === 'function'
        ? await OpenAPI.TOKEN({ method: 'GET', url: '', path: {}, cookies: {}, errors: {}, query: {}, formData: {}, body: undefined, mediaType: undefined, responseHeader: undefined })
        : OpenAPI.TOKEN;

      const response = await fetch(
        `${OpenAPI.BASE}/payments/vendor-payouts/${payoutId}/invoice`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: OpenAPI.CREDENTIALS,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to download invoice: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payout-${payoutId}-invoice.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-4 md:pt-6">
        <PageHeader title="Revenue & Payouts" description="Track your earnings and download payout statements" />
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-8 text-center mt-6">
      <Receipt className="w-16 h-16 text-gray-300 mb-4" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:pt-6">
      <PageHeader title="Revenue & Payouts" description="Track your earnings and download payout statements" />

      <Card className="mt-6">
        <CardContent className="mt-6">
          {payouts.length === 0 ? (
            <EmptyState message="No payouts yet. Complete bookings to start earning!" />
          ) : (
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between p-4 border rounded-lg transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">Payout #{payout.id}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Period: {new Date(payout.periodStart).toLocaleDateString()} -{' '}
                      {new Date(payout.periodEnd).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {payout.earningsCount} bookings • Paid on{' '}
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {payout.currency} {payout.amount.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="darkOutline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(payout.id)}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Invoice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
