'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Input, PageHeader } from '@shared/components';
import { Card, CardContent } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Download, Loader2, Receipt, Search } from 'lucide-react';
import { PaymentsService, OpenAPI, AllVendorsPayoutResponseDto } from '@shared/api';

export default function SuperAdminRevenuePage() {
  const { data: session } = useSession();
  const [payouts, setPayouts] = useState<AllVendorsPayoutResponseDto[]>([]);
  const [filteredPayouts, setFilteredPayouts] = useState<AllVendorsPayoutResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (session?.user) {
      fetchRevenueData();
    }
  }, [session]);

  useEffect(() => {
    // Filter payouts based on search term
    if (searchTerm.trim() === '') {
      setFilteredPayouts(payouts);
    } else {
      const filtered = payouts.filter((payout) => {
        const vendorName = payout.vendor?.user?.name || '';
        const vendorEmail = payout.vendor?.user?.email || '';
        const payoutId = payout.id.toString();

        const searchLower = searchTerm.toLowerCase();
        return (
          vendorName.toLowerCase().includes(searchLower) ||
          vendorEmail.toLowerCase().includes(searchLower) ||
          payoutId.includes(searchLower)
        );
      });
      setFilteredPayouts(filtered);
    }
  }, [searchTerm, payouts]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);

      // Fetch all vendors payouts
      const payoutsData = await PaymentsService.paymentControllerGetAllVendorsPayout();

      setPayouts(payoutsData);
      setFilteredPayouts(payoutsData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (payoutId: number) => {
    try {
      // Get the token from OpenAPI config (it's a resolver function)
      const token =
        typeof OpenAPI.TOKEN === 'function'
          ? await OpenAPI.TOKEN({
              method: 'GET',
              url: '',
              path: {},
              cookies: {},
              errors: {},
              query: {},
              formData: {},
              body: undefined,
              mediaType: undefined,
              responseHeader: undefined,
            })
          : OpenAPI.TOKEN;

      const response = await fetch(`${OpenAPI.BASE}/payments/vendor-payouts/${payoutId}/invoice`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: OpenAPI.CREDENTIALS,
      });

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

  const EmptyState = ({ message }: { message: string }) => (
    <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
      <Receipt className="mb-4 h-16 w-16 text-gray-300" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:pt-6">
      <PageHeader
        title="Revenue & Payouts"
        description="View all vendor payouts and download statements"
      />

      {/* Search/Filter Bar */}
      <div className="mt-6 flex items-center gap-2">
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            type="text"
            placeholder="Search by vendor name, email, or payout ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="mt-6">
          {filteredPayouts.length === 0 ? (
            <EmptyState
              message={searchTerm ? 'No payouts match your search criteria' : 'No payouts yet'}
            />
          ) : (
            <div className="space-y-4">
              {filteredPayouts.map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors"
                >
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-semibold">Payout #{payout.id}</h3>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        {payout.vendor?.user?.name || `Vendor #${payout.vendorId}`}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Period: {new Date(payout.periodStart).toLocaleDateString()} -{' '}
                      {new Date(payout.periodEnd).toLocaleDateString()}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {payout.earningsCount} bookings • Paid on{' '}
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </p>
                    {payout.vendor?.user?.email && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        Vendor Email: {payout.vendor.user.email}
                      </p>
                    )}
                    {payout.status && (
                      <p className="mt-1 text-xs">
                        <span className="font-medium">Status:</span>{' '}
                        <span
                          className={
                            payout.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                          }
                        >
                          {payout.status}
                        </span>
                      </p>
                    )}
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
