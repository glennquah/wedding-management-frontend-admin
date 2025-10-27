'use client';

import { WeddingPublicResponseDto } from '@shared/api/models/WeddingPublicResponseDto';
import { WeddingsService } from '@shared/api/services/WeddingsService';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Input } from '@shared/components/ui/form/input';
import { Label } from '@shared/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/components/ui/popover';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function CashGiftPage() {
  const params = useParams();
  const router = useRouter();
  const weddingId = params ? parseInt(params.weddingId as string) : NaN;
  const micrositeSlug = params?.micrositeSlug as string;

  const [wedding, setWedding] = useState<WeddingPublicResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGuestId, setSelectedGuestId] = useState<string>('');
  const [selectedGuestName, setSelectedGuestName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const fetchWedding = async () => {
      try {
        const weddingData = await WeddingsService.weddingControllerFindPublic(weddingId);
        setWedding(weddingData);
      } catch (error) {
        router.push(`/microsite/${micrositeSlug}`);
        if (!toastShownRef.current) {
          toast.error('Cash gifting not available yet');
          toastShownRef.current = true;
        }
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(weddingId)) {
      fetchWedding();
    } else {
      router.push(`/microsite/${micrositeSlug}`);
      if (!toastShownRef.current) {
        toast.error('Cash gifting not available yet');
        toastShownRef.current = true;
      }
    }
  }, [weddingId, router, micrositeSlug]);

  // Filter and sort guests based on search query
  const filteredGuests = useMemo(() => {
    if (!wedding?.guests) return [];

    const guests = wedding.guests.filter((guest) =>
      guest.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return guests.sort((a, b) => a.name.localeCompare(b.name));
  }, [wedding?.guests, searchQuery]);

  // Auto-select if only one match
  useEffect(() => {
    if (filteredGuests.length === 1 && searchQuery.trim() !== '') {
      const guest = filteredGuests[0];
      setSelectedGuestId(guest.id.toString());
      setSelectedGuestName(guest.name);
      setIsPopoverOpen(false);
    }
  }, [filteredGuests, searchQuery]);

  const handleSelectGuest = (guestId: string, guestName: string) => {
    setSelectedGuestId(guestId);
    setSelectedGuestName(guestName);
    setSearchQuery(guestName);
    setIsPopoverOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsPopoverOpen(value.length > 0);

    // Clear selection if search doesn't match selected name
    if (value !== selectedGuestName) {
      setSelectedGuestId('');
      setSelectedGuestName('');
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point, max 2 decimal places
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedGuestId) {
      toast.error('Please select your name from the list');
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Navigate to QR page with guest and amount data
    if (!wedding) {
      toast.error('Wedding data not found');
      return;
    }

    const selectedGuest = wedding.guests?.find(g => g.id === parseInt(selectedGuestId));
    if (!selectedGuest) {
      toast.error('Selected guest not found');
      return;
    }

    // Store data in sessionStorage to pass to next page
    sessionStorage.setItem('cashGiftData', JSON.stringify({
      weddingId,
      guestId: selectedGuest.id,
      guestName: selectedGuest.name,
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      payLahQR: wedding.payLahQR,
    }));

    router.push(`/microsite/${micrositeSlug}/cashgift/${weddingId}/confirm`);
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

  if (!wedding) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Cash Gift for {wedding.name}</CardTitle>
          <CardDescription>
            Please select your name and enter the amount you would like to gift
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Guest Selection */}
            <div className="space-y-2">
              <Label htmlFor="guest-search">Your Name</Label>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Input
                      id="guest-search"
                      type="text"
                      placeholder="Start typing your name..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => searchQuery.length > 0 && setIsPopoverOpen(true)}
                      className={selectedGuestId ? 'border-green-500' : ''}
                    />
                    {selectedGuestId && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg
                          className="h-5 w-5 text-green-500"
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
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <div className="max-h-[300px] overflow-y-auto">
                    {filteredGuests.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No guests found
                      </div>
                    ) : (
                      <div className="py-1">
                        {filteredGuests.map((guest) => (
                          <button
                            key={guest.id}
                            type="button"
                            onClick={() => handleSelectGuest(guest.id.toString(), guest.name)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors focus:bg-accent focus:outline-none"
                          >
                            {guest.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              {selectedGuestId && (
                <p className="text-xs text-green-600">
                  Selected: {selectedGuestName}
                </p>
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (SGD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0.00"
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter amount up to 2 decimal places
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Continue to Payment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
