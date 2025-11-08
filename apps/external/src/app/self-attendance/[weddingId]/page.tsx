'use client';

import {
  ConfirmationStatus,
  GuestResponseDto,
  GuestsService,
  SeatingArrangementResponseDto,
  SeatingArrangementsService,
} from '@shared/api';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shared/components';
import { CheckCircle2, Heart, PartyPopper, Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type NotificationProps = {
  message: string;
  type: 'error' | 'success' | '';
  onClose: () => void;
};

const Notification = ({ message, type, onClose }: NotificationProps) => {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div
      className={`my-4 rounded-lg p-4 ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-lg font-bold">
          &times;
        </button>
      </div>
    </div>
  );
};

export default function SelfAttendancePage() {
  const params = useParams();
  const weddingId = Number(
    Array.isArray(params?.weddingId) ? params?.weddingId[0] : params?.weddingId,
  );

  const [step, setStep] = useState('select'); // 'select', 'confirm', 'checkedIn'
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<Omit<NotificationProps, 'onClose'>>({
    message: '',
    type: '',
  });

  const [guests, setGuests] = useState<GuestResponseDto[]>([]);
  const [seatingArrangement, setSeatingArrangement] =
    useState<SeatingArrangementResponseDto | null>(null);

  const [selectedGuest, setSelectedGuest] = useState<GuestResponseDto | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [isPrimaryGuestCheckingIn, setIsPrimaryGuestCheckingIn] = useState(true);
  const [accompanyingGuestsToCheckIn, setAccompanyingGuestsToCheckIn] = useState<
    Record<number, boolean>
  >({});
  const [tableNumber, setTableNumber] = useState<number | 'N/A' | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [guestData, seatingData] = await Promise.all([
          GuestsService.guestControllerGetGuestsByWedding(weddingId),
          SeatingArrangementsService.seatingArrangementControllerFindOne(weddingId),
        ]);

        setGuests(guestData);
        setSeatingArrangement(seatingData);
      } catch (error) {
        console.error('Failed to fetch data', error);
        const errorMsg = 'Failed to load wedding data. Please try again.';
        setNotification({ message: errorMsg, type: 'error' });
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(weddingId)) {
      fetchData();
    } else {
      const errorMsg = 'Invalid Wedding ID.';
      setNotification({ message: errorMsg, type: 'error' });
      toast.error(errorMsg);
      setLoading(false);
    }
  }, [weddingId]);

  const filteredGuests = useMemo(() => {
    if (!guests) return [];

    // Only show primary guests
    const searchableGuests = guests.filter(
      (g) => !g.primaryGuestId && g.confirmationStatus === ConfirmationStatus.CONFIRMED,
    );

    if (!searchQuery) {
      return searchableGuests.sort((a, b) => a.name.localeCompare(b.name));
    }

    return searchableGuests
      .filter((guest) => guest.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [guests, searchQuery]);

  const totalCheckedIn = useMemo(() => {
    const accompanyingCount = Object.values(accompanyingGuestsToCheckIn).filter(
      (isChecked) => isChecked,
    ).length;

    const primaryCount = isPrimaryGuestCheckingIn ? 1 : 0;
    return primaryCount + accompanyingCount;
  }, [isPrimaryGuestCheckingIn, accompanyingGuestsToCheckIn]);

  const findTableNumber = (guestName: string) => {
    if (!seatingArrangement?.tables) return 'N/A';

    const normalizedGuestName = guestName.replace(/ \(.+\)$/, '').trim();

    for (let i = 0; i < seatingArrangement.tables.length; i++) {
      const table = seatingArrangement.tables[i];
      for (const seatedGuestName of table) {
        if (seatedGuestName === normalizedGuestName) {
          return i + 1;
        }
      }
    }

    for (let i = 0; i < seatingArrangement.tables.length; i++) {
      const table = seatingArrangement.tables[i];
      for (const seatedGuestName of table) {
        if (seatedGuestName.startsWith(normalizedGuestName)) {
          return i + 1;
        }
      }
    }

    return 'N/A';
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsPopoverOpen(value.length > 0);
    if (value !== selectedGuest?.name) {
      setSelectedGuest(null);
    }
  };

  const handleSelectGuest = (guest: GuestResponseDto) => {
    setSelectedGuest(guest);
    setSearchQuery(guest.name);
    setIsPopoverOpen(false);
    setNotification({ message: '', type: '' });
    setIsPrimaryGuestCheckingIn(guest.attendance || false);

    const accompanying: Record<number, boolean> = {};
    (guest.accompanyingGuests ?? [])
      .filter((ag) => ag.confirmationStatus === ConfirmationStatus.CONFIRMED)
      .forEach((ag) => {
        accompanying[ag.id] = ag.attendance || false;
      });
    setAccompanyingGuestsToCheckIn(accompanying);

    if (guest.attendance) {
      setTableNumber(findTableNumber(guest.name));
      setStep('checkedIn');
    } else {
      setStep('confirm');
    }
  };

  const handleToggleAccompanyingGuest = (guestId: number) => {
    setAccompanyingGuestsToCheckIn((prev) => ({
      ...prev,
      [guestId]: !prev[guestId],
    }));
  };

  const handleSubmitConfirmation = async () => {
    if (!selectedGuest) return;

    setIsSubmitting(true);
    setNotification({ message: '', type: '' });

    const guestIdsToToggle: number[] = [];

    const originalPrimaryStatus = selectedGuest.attendance;
    if (isPrimaryGuestCheckingIn !== originalPrimaryStatus) {
      guestIdsToToggle.push(selectedGuest.id);
    }

    (selectedGuest.accompanyingGuests ?? [])
      .filter((ag) => ag.confirmationStatus === ConfirmationStatus.CONFIRMED)
      .forEach((ag) => {
        const originalAccompanyingStatus = ag.attendance;
        const currentAccompanyingStatus = !!accompanyingGuestsToCheckIn[ag.id];

        if (currentAccompanyingStatus !== originalAccompanyingStatus) {
          guestIdsToToggle.push(ag.id);
        }
      });

    try {
      const checkInPromises = guestIdsToToggle.map((guestId) =>
        GuestsService.guestControllerMarkAttendance(guestId),
      );

      await Promise.all(checkInPromises);

      setGuests((prevGuests) => {
        const newGuestsList = prevGuests.map((g) =>
          guestIdsToToggle.includes(g.id)
            ? { ...g, attendance: !g.attendance, checkInTime: new Date().toISOString() }
            : g,
        );

        const updatedGuestMap = new Map(newGuestsList.map((g) => [g.id, g]));

        const finalGuestsState = newGuestsList.map((guest) => {
          if (!guest.accompanyingGuests || guest.accompanyingGuests.length === 0) {
            return guest;
          }

          const updatedAccompanyingGuests = guest.accompanyingGuests.map(
            (ag) => updatedGuestMap.get(ag.id) || ag,
          );

          return {
            ...guest,
            accompanyingGuests: updatedAccompanyingGuests,
          };
        });

        return finalGuestsState;
      });

      setTableNumber(findTableNumber(selectedGuest.name));
      setStep('checkedIn');
    } catch (error) {
      console.error('Failed to check in', error);
      toast.error('Update failed. Please try again or see an attendant.');
      setNotification({
        message: 'Update failed. Please try again or see an attendant.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartOver = () => {
    setStep('select');
    setSelectedGuest(null);
    setSearchQuery('');
    setTableNumber(null);
    setAccompanyingGuestsToCheckIn({});
    setNotification({ message: '', type: '' });
    setIsPrimaryGuestCheckingIn(true);
  };

  const cardClassName =
    'w-full max-w-md bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl';
  const iconWrapperClassName =
    'w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center mb-4 border-2 border-white/50 shadow-md';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4 font-sans">
        <Card className={`${cardClassName} text-center`}>
          <CardHeader>
            <CardTitle>Loading Wedding Details...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Please wait a moment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (guests.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4 font-sans">
        <Card className={`${cardClassName} text-center`}>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-700">No guests registered to the wedding yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderSelectStep = () => (
    <Card className={cardClassName}>
      <CardHeader className="items-center text-center">
        <div className={iconWrapperClassName}>
          <PartyPopper className="h-8 w-8 text-purple-600" />
        </div>
        <CardTitle className="text-3xl font-bold">Welcome to the Celebration!</CardTitle>
        <CardDescription>
          Find your name below, confirm your party and we&apos;ll show you to your table.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
        <div className="space-y-2">
          <Label htmlFor="guest-search" className="font-semibold">
            Your Name
          </Label>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  id="guest-search"
                  placeholder="Start typing your name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.length > 0 && setIsPopoverOpen(true)}
                />
              </div>
            </PopoverTrigger>

            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="max-h-[300px] overflow-y-auto">
                {filteredGuests.length === 0 ? (
                  <div className="text-muted-foreground py-6 text-center text-sm">
                    No guests found
                  </div>
                ) : (
                  <div className="py-1">
                    {filteredGuests.map((guest) => (
                      <button
                        key={guest.id}
                        type="button"
                        onClick={() => handleSelectGuest(guest)}
                        className="hover:bg-accent focus:bg-accent w-full px-4 py-2 text-left text-sm focus:outline-none"
                      >
                        {guest.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );

  const renderConfirmStep = () => {
    const confirmedAccompanyingGuests = (selectedGuest?.accompanyingGuests ?? []).filter(
      (ag) => ag.confirmationStatus === ConfirmationStatus.CONFIRMED,
    );
    return (
      <Card className={cardClassName}>
        <CardHeader className="items-center text-center">
          <div className={iconWrapperClassName}>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-3xl font-bold">Confirming Your Party</CardTitle>
          <CardDescription>Please select who is attending today.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ message: '', type: '' })}
          />

          <div className="flex items-center space-x-2 rounded-lg bg-indigo-50 p-3">
            <Checkbox
              id={`guest-${selectedGuest?.id}`}
              checked={isPrimaryGuestCheckingIn}
              onCheckedChange={() => setIsPrimaryGuestCheckingIn((prev) => !prev)}
              className="h-5 w-5 border-2 border-indigo-300 bg-white focus-visible:ring-indigo-500 data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600"
            />

            <Label
              htmlFor={`guest-${selectedGuest?.id}`}
              className="flex-1 font-semibold text-indigo-900 select-none"
            >
              {selectedGuest?.name}
            </Label>
          </div>

          {confirmedAccompanyingGuests.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Accompanying Guests:</p>

              <div className="space-y-2 border-l-2 border-indigo-200 pl-4">
                {confirmedAccompanyingGuests.map((guest) => (
                  <div key={guest.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`guest-${guest.id}`}
                      checked={!!accompanyingGuestsToCheckIn[guest.id]}
                      onCheckedChange={() => handleToggleAccompanyingGuest(guest.id)}
                      className="h-5 w-5 border-2 border-indigo-300 bg-white focus-visible:ring-indigo-500 data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600"
                    />

                    <Label
                      htmlFor={`guest-${guest.id}`}
                      className="flex-1 text-sm font-medium text-gray-800 select-none"
                    >
                      {guest.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleSubmitConfirmation}
              className="w-full"
              disabled={isSubmitting || totalCheckedIn === 0}
            >
              {isSubmitting
                ? 'Checking In...'
                : `Confirm Attendance (${totalCheckedIn} ${totalCheckedIn === 1 ? 'Person' : 'People'})`}
            </Button>

            <Button
              onClick={() => setStep('select')}
              variant="secondary"
              className="w-full"
              disabled={isSubmitting}
            >
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCheckedInStep = () => (
    <Card className={cardClassName}>
      <CardHeader className="items-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
          <CheckCircle2 className="h-12 w-12 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold">
          {isPrimaryGuestCheckingIn
            ? `Welcome, ${selectedGuest?.name.replace(/ \(.+\)$/, '').trim()}!`
            : "You're All Set!"}
        </CardTitle>
        <CardDescription>
          {isPrimaryGuestCheckingIn
            ? "We're so happy you're here to celebrate with us!"
            : `Your party, ${selectedGuest?.name.replace(/ \(.+\)$/, '').trim()}, has been updated. We're so glad you're here!`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-white p-8 text-gray-800 shadow-2xl transition-all duration-300 hover:scale-[1.01]">
          <Heart className="absolute -top-8 -right-8 h-32 w-32 rotate-12 text-pink-200 opacity-30" />{' '}
          <Heart className="absolute -bottom-12 -left-12 h-40 w-40 -rotate-45 text-purple-100 opacity-20" />{' '}
          <p className="relative z-10 mb-4 text-2xl font-semibold text-gray-700">
            Your Table Number is:
          </p>
          {tableNumber === 'N/A' ? (
            <div className="relative z-10 text-red-600">
              <p className="text-6xl leading-none font-extrabold">N/A</p>
              <p className="mt-4 text-xl font-semibold text-red-700">
                Please see an attendant for your assignment.
              </p>
              <p className="text-sm text-red-500">(We&apos;ll help you find your spot!)</p>
            </div>
          ) : (
            <p className="relative z-10 text-9xl leading-none font-extrabold text-pink-700 drop-shadow-lg">
              {tableNumber}
            </p>
          )}
        </div>
        <Button onClick={handleStartOver} variant="secondary" className="w-full">
          Check In Another Guest
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4 font-serif">
      {step === 'select' && renderSelectStep()}
      {step === 'confirm' && renderConfirmStep()}
      {step === 'checkedIn' && renderCheckedInStep()}
    </div>
  );
}
