'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CashGiftsService } from '@shared/api/services/CashGiftsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { toast } from 'sonner';
import Image from 'next/image';

interface CashGiftData {
  weddingId: number;
  guestId: number;
  guestName: string;
  amount: number;
  paynowQR: string;
}

export default function ConfirmCashGiftPage() {
  const params = useParams();
  const router = useRouter();
  const weddingId = params ? parseInt(params.weddingId as string) : null;

  const [cashGiftData, setCashGiftData] = useState<CashGiftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    // Check if weddingId is valid
    if (!weddingId) {
      toast.error('Invalid wedding ID');
      router.push('/not-found');
      return;
    }

    // Retrieve data from sessionStorage
    const dataString = sessionStorage.getItem('cashGiftData');

    if (!dataString) {
      toast.error('No cash gift data found. Please start over.');
      router.push(`/cashgift/${weddingId}`);
      return;
    }

    try {
      const data: CashGiftData = JSON.parse(dataString);

      // Validate data
      if (data.weddingId !== weddingId) {
        toast.error('Invalid wedding ID');
        router.push('/not-found');
        return;
      }

      setCashGiftData(data);
    } catch (error) {
      console.error('Error parsing cash gift data:', error);
      toast.error('Invalid data. Please start over.');
      router.push(`/cashgift/${weddingId}`);
    } finally {
      setLoading(false);
    }
  }, [weddingId, router]);

  const handleConfirmPayment = async () => {
    if (!cashGiftData) return;

    setIsSubmitting(true);
    try {
      // Create the cash gift record
      await CashGiftsService.cashGiftControllerCreate({
        weddingId: cashGiftData.weddingId,
        guestId: cashGiftData.guestId,
        amount: cashGiftData.amount,
      });

      toast.success('Cash gift recorded successfully!');
      setHasSubmitted(true);

      // Clear session storage
      sessionStorage.removeItem('cashGiftData');
    } catch (error) {
      console.error('Error creating cash gift:', error);
      toast.error('Failed to record cash gift. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToForm = () => {
    router.push(`/cashgift/${weddingId}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!cashGiftData) {
    return null;
  }

  if (hasSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Thank You!</CardTitle>
            <CardDescription className="text-center">
              Your cash gift has been recorded successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <div className="mb-2 flex justify-center">
                <svg
                  className="h-12 w-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-green-900">
                ${cashGiftData.amount.toFixed(2)} Gift Recorded
              </p>
              <p className="text-sm text-green-700">From: {cashGiftData.guestName}</p>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              The couple appreciates your generous gift
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">PayNow QR Code</CardTitle>
          <CardDescription className="text-center">
            Please scan to PayNow ${cashGiftData.amount.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="relative h-64 w-64 overflow-hidden rounded-lg border-2 border-primary/20 bg-white p-4 shadow-lg">
              <Image
                src={cashGiftData.paynowQR}
                alt="PayNow QR Code"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Amount Display */}
          <div className="rounded-lg bg-primary/5 p-4 text-center">
            <p className="text-sm text-muted-foreground">Amount to transfer</p>
            <p className="text-3xl font-bold text-primary">
              ${cashGiftData.amount.toFixed(2)}
            </p>
          </div>

          {/* Guest Info */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Gift from</p>
            <p className="font-semibold">{cashGiftData.guestName}</p>
          </div>

          {/* Instructions */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-center text-sm text-muted-foreground">
              After completing the PayNow transfer, please click the button below to confirm
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleConfirmPayment}
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Confirming...' : 'I have completed the payment'}
            </Button>
            <Button
              onClick={handleBackToForm}
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
            >
              Back to Form
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
