'use client';

import { useState } from 'react';
import { Input } from '@shared/components';
import { Card, CardContent } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Download, Receipt } from 'lucide-react';
import { AllDatingPartnerCommissionResponseDto, OpenAPI } from '@shared/api';

interface PartnerCommissionsListProps {
  commissions: AllDatingPartnerCommissionResponseDto[];
}

export function PartnerCommissionsList({ commissions }: PartnerCommissionsListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCommissions = commissions.filter((commission) => {
    if (searchTerm.trim() === '') return true;

    const partnerName = commission.admin?.user?.name || '';
    const partnerEmail = commission.admin?.user?.email || '';
    const commissionId = commission.id.toString();

    const searchLower = searchTerm.toLowerCase();
    return (
      partnerName.toLowerCase().includes(searchLower) ||
      partnerEmail.toLowerCase().includes(searchLower) ||
      commissionId.includes(searchLower)
    );
  });

  const handleDownloadInvoice = async (commissionId: number) => {
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

      const response = await fetch(
        `${OpenAPI.BASE}/payments/dating-partner-commissions/${commissionId}/invoice`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
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
      a.download = `commission-${commissionId}-invoice.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
      <Receipt className="mb-4 h-16 w-16 text-gray-300" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );

  return (
    <>
      {/* Search/Filter Bar */}
      <div className="mt-6 flex items-center gap-2">
        <div className="relative max-w-md flex-1">
          <Input
            type="text"
            placeholder="Search by partner name, email, or commission ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="mt-6">
          {filteredCommissions.length === 0 ? (
            <EmptyState
              message={
                searchTerm ? 'No commissions match your search criteria' : 'No commissions yet'
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredCommissions.map((commission) => (
                <div
                  key={commission.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors"
                >
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-semibold">Commission #{commission.id}</h3>
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                        {commission.admin?.user?.name || `Partner #${commission.adminId}`}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Order ID: {commission.orderId} • Listing ID: {commission.listingId}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Commission Rate: {(commission.commissionRate * 100).toFixed(1)}% • Processed
                      on {new Date(commission.createdAt).toLocaleDateString()}
                    </p>
                    {commission.admin?.user?.email && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        Partner Email: {commission.admin.user.email}
                      </p>
                    )}
                    {commission.status && (
                      <p className="mt-1 text-xs">
                        <span className="font-medium">Status:</span>{' '}
                        <span
                          className={
                            commission.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                          }
                        >
                          {commission.status}
                        </span>
                      </p>
                    )}
                    <p className="text-muted-foreground mt-1 text-xs">
                      Gross Amount: {commission.currency} {commission.grossAmount.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Commission</p>
                      <p className="text-2xl font-bold text-green-600">
                        {commission.currency} {commission.commissionAmount.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="darkOutline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(commission.id)}
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
    </>
  );
}
