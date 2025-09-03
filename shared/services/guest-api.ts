import { GuestsService, CreateGuestDto, GuestResponseDto, UpdateGuestDto } from '@shared/api';

// Extended types to match our frontend interface
export interface ExtendedGuestResponseDto extends Omit<GuestResponseDto, 'confirmed'> {
  confirmationStatus: 'pending' | 'confirmed' | 'rejected';
}

export interface ExtendedCreateGuestDto extends Omit<CreateGuestDto, 'confirmed'> {
  confirmationStatus?: 'pending' | 'confirmed' | 'rejected';
}

export interface ExtendedUpdateGuestDto extends Omit<UpdateGuestDto, 'confirmed'> {
  confirmationStatus?: 'pending' | 'confirmed' | 'rejected';
}

export class GuestApiService {
  /**
   * Get all guests for a specific wedding
   */
  static async getGuestsByWedding(weddingId: number): Promise<ExtendedGuestResponseDto[]> {
    try {
      const response = await GuestsService.guestControllerGetGuestsByWedding(weddingId);
      // Backend now returns confirmationStatus directly
      return response.map(guest => ({
        ...guest,
        confirmationStatus: guest.confirmationStatus || 'pending'
      }));
    } catch (error) {
      console.error('Error fetching guests:', error);
      throw error;
    }
  }

  /**
   * Create a new guest
   */
  static async createGuest(guestData: ExtendedCreateGuestDto): Promise<ExtendedGuestResponseDto> {
    try {
      // Backend now uses confirmationStatus directly
      const backendData: CreateGuestDto = {
        ...guestData,
        confirmationStatus: guestData.confirmationStatus || 'pending',
      };

      const response = await GuestsService.guestControllerCreate(backendData);
      
      // Backend now returns confirmationStatus directly
      return {
        ...response,
        confirmationStatus: response.confirmationStatus || 'pending'
      };
    } catch (error) {
      console.error('Error creating guest:', error);
      throw error;
    }
  }

  /**
   * Create multiple guests at once
   */
  static async createMultipleGuests(guestsData: ExtendedCreateGuestDto[]): Promise<ExtendedGuestResponseDto[]> {
    try {
      // Backend now uses confirmationStatus directly
      const backendData: CreateGuestDto[] = guestsData.map(guest => ({
        ...guest,
        confirmationStatus: guest.confirmationStatus || 'pending',
      }));

      // For now, let's create guests one by one since the bulk endpoint seems to have wrong typing
      const responses = [];
      for (const guestData of backendData) {
        const response = await GuestsService.guestControllerCreate(guestData);
        responses.push(response);
      }
      
      // Backend now returns confirmationStatus directly
      return responses.map(guest => ({
        ...guest,
        confirmationStatus: guest.confirmationStatus || 'pending'
      }));
    } catch (error) {
      console.error('Error creating guests:', error);
      throw error;
    }
  }

  /**
   * Update a guest
   */
  static async updateGuest(id: number, guestData: ExtendedUpdateGuestDto): Promise<ExtendedGuestResponseDto> {
    try {
      // Backend now uses confirmationStatus directly
      const backendData: UpdateGuestDto = {
        ...guestData,
        confirmationStatus: guestData.confirmationStatus,
      };

      const response = await GuestsService.guestControllerUpdate(id, backendData);
      
      // Backend now returns confirmationStatus directly
      return {
        ...response,
        confirmationStatus: response.confirmationStatus || 'pending'
      };
    } catch (error) {
      console.error('Error updating guest:', error);
      throw error;
    }
  }

  /**
   * Delete a guest
   */
  static async deleteGuest(id: number): Promise<void> {
    try {
      await GuestsService.guestControllerDelete(id);
    } catch (error) {
      console.error('Error deleting guest:', error);
      throw error;
    }
  }

  /**
   * Confirm guest attendance
   */
  static async confirmGuest(id: number): Promise<ExtendedGuestResponseDto> {
    try {
      const response = await GuestsService.guestControllerConfirmGuest(id);
      return {
        ...response,
        confirmationStatus: 'confirmed'
      };
    } catch (error) {
      console.error('Error confirming guest:', error);
      throw error;
    }
  }

  /**
   * Get a single guest by ID
   */
  static async getGuest(id: number): Promise<ExtendedGuestResponseDto> {
    try {
      const response = await GuestsService.guestControllerGetGuest(id);
      return {
        ...response,
        confirmationStatus: response.confirmationStatus || 'pending'
      };
    } catch (error) {
      console.error('Error fetching guest:', error);
      throw error;
    }
  }
}