import { CreateGuestDto, GuestsService, UpdateGuestDto } from "@shared/api";
import { useEffect, useState } from "react";

type Guest = {
  id: number;
  name: string;
  allergies?: string;
  group?: string;
  confirmationStatus: CreateGuestDto.confirmationStatus;
  weddingId: number;
  primaryGuestId?: number;
};

export function useGuests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedGuests = await GuestsService.guestControllerGetGuestsByWedding(1);
      setGuests(fetchedGuests);
    } catch (err) {
      setError('Failed to fetch guests. Please try again.');
      console.error('Error fetching guests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addGuest = async (
    primaryGuestData: CreateGuestDto,
    accompanyingGuestsData: CreateGuestDto[]
  ) => {
    const createdPrimaryGuest = await GuestsService.guestControllerCreate(primaryGuestData);

    if (accompanyingGuestsData.length > 0) {
      for (const guestData of accompanyingGuestsData) {
        await GuestsService.guestControllerCreate({
          ...guestData,
          primaryGuestId: createdPrimaryGuest.id,
        });
      }
    }

    await fetchGuests();
    return createdPrimaryGuest;
  };

  const updateGuest = async (
    guestId: number,
    updateData: UpdateGuestDto,
    accompanyingGuestsData: CreateGuestDto[]
  ) => {
    await GuestsService.guestControllerUpdate(guestId, updateData);

    // Delete existing accompanying guests
    const existingAccompanyingGuests = guests.filter(g => g.primaryGuestId === guestId);
    for (const guest of existingAccompanyingGuests) {
      await GuestsService.guestControllerDelete(guest.id);
    }

    // Create new accompanying guests
    if (accompanyingGuestsData.length > 0) {
      for (const guestData of accompanyingGuestsData) {
        await GuestsService.guestControllerCreate({
          ...guestData,
          primaryGuestId: guestId,
        });
      }
    }

    await fetchGuests();
  };

  const deleteGuest = async (id: number) => {
    await GuestsService.guestControllerDelete(id);
    // Also delete any accompanying guests
    const accompanyingGuests = guests.filter(g => g.primaryGuestId === id);
    for (const guest of accompanyingGuests) {
      await GuestsService.guestControllerDelete(guest.id);
    }
    await fetchGuests();
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  return {
    guests,
    isLoading,
    error,
    setError,
    fetchGuests,
    addGuest,
    updateGuest,
    deleteGuest
  };
}