import { CreateGuestDto, GuestResponseDto } from "@shared/api";

type Guest = GuestResponseDto & {
  accompanyingGuestNames?: string[];
};

export function useGuestForm() {
  const addAccompanyingGuestField = (
    guest: Partial<CreateGuestDto & { accompanyingGuestNames: string[] }> | Guest,
    setGuest: (guest: any) => void
  ) => {
    const currentNames = guest.accompanyingGuestNames || [];
    setGuest({
      ...guest,
      accompanyingGuestNames: [...currentNames, ""]
    });
  };

  const removeAccompanyingGuestField = (
    index: number,
    guest: Partial<CreateGuestDto & { accompanyingGuestNames: string[] }> | Guest,
    setGuest: (guest: any) => void
  ) => {
    const currentNames = guest.accompanyingGuestNames || [];
    if (currentNames.length > 1) {
      const newNames = currentNames.filter((_, i) => i !== index);
      setGuest({
        ...guest,
        accompanyingGuestNames: newNames
      });
    }
  };

  const updateAccompanyingGuestName = (
    index: number,
    value: string,
    guest: Partial<CreateGuestDto & { accompanyingGuestNames: string[] }> | Guest,
    setGuest: (guest: any) => void
  ) => {
    const currentNames = guest.accompanyingGuestNames || [];
    const newNames = [...currentNames];
    newNames[index] = value;
    setGuest({
      ...guest,
      accompanyingGuestNames: newNames
    });
  };

  return {
    addAccompanyingGuestField,
    removeAccompanyingGuestField,
    updateAccompanyingGuestName
  };
}