'use client';

import { useCallback, useState } from 'react';
import {
  AdminsService,
  BudgetBucket,
  GuestCountBucket,
  UpdateWeddingDto,
  WeddingResponseDto,
  WeddingService,
  WeddingsService,
  WeddingStyle,
  WeddingType,
} from '../api';

interface WeddingFormData {
  name: string;
  date: string;
  location: string;
  weddingType: WeddingType;
  budgetBucket: BudgetBucket;
  guestCountBucket: GuestCountBucket;
  preferredStyle: WeddingStyle;
  preferredServices: WeddingService[];
}

const formatDateForInput = (date?: string | null) => {
  if (!date) return '';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  // Adjust to local time, then keep only the date portion
  const adjusted = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000);

  return adjusted.toISOString().slice(0, 10);
};

const formatDateForApi = (date: string) => {
  if (!date) return undefined;

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString();
};

export const useWeddingProfile = () => {
  const [isLoadingWedding, setIsLoadingWedding] = useState(false);
  const [weddingData, setWeddingData] = useState<WeddingResponseDto | null>(null);
  const [weddingFormData, setWeddingFormData] = useState<WeddingFormData>({
    name: '',
    date: '',
    location: '',
    weddingType: WeddingType.WESTERN,
    budgetBucket: BudgetBucket.MEDIUM,
    guestCountBucket: GuestCountBucket.MEDIUM,
    preferredStyle: WeddingStyle.MODERN,
    preferredServices: [],
  });

  const fetchMainWedding = useCallback(async () => {
    try {
      setIsLoadingWedding(true);
      const mainWeddingResponse = await AdminsService.adminControllerGetMyMainWedding();

      if (mainWeddingResponse.mainWeddingId) {
        const mainWedding = await WeddingsService.weddingControllerFindOne(
          mainWeddingResponse.mainWeddingId
        );

        if (mainWedding) {
          setWeddingData(mainWedding);
          populateWeddingFormData(mainWedding);
        }
      }
    } catch (error) {
      console.error('Error fetching wedding data:', error);
    } finally {
      setIsLoadingWedding(false);
    }
  }, []);

  const populateWeddingFormData = useCallback((wedding: WeddingResponseDto) => {
    setWeddingFormData({
      name: wedding.name || '',
      date: formatDateForInput(wedding.date),
      location: wedding.location || '',
      weddingType: wedding.weddingType,
      budgetBucket: wedding.budgetBucket,
      guestCountBucket: wedding.guestCountBucket,
      preferredStyle: wedding.preferredStyle,
      preferredServices: wedding.preferredServices || [],
    });
  }, []);

  const handleWeddingInputChange = useCallback((field: string, value: any) => {
    setWeddingFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const updateWeddingProfile = useCallback(async () => {
    if (!weddingData) return;

    const updateData: UpdateWeddingDto = {};

    if (weddingFormData.name !== weddingData.name) updateData.name = weddingFormData.name;
    const apiDate = formatDateForApi(weddingFormData.date);
    if (apiDate && apiDate !== (weddingData.date || '')) {
      updateData.date = apiDate;
    } else if (!apiDate && weddingData.date) {
      updateData.date = null;
    }
    if (weddingFormData.location !== (weddingData.location || '')) updateData.location = weddingFormData.location;
    if (weddingFormData.weddingType !== weddingData.weddingType) updateData.weddingType = weddingFormData.weddingType;
    if (weddingFormData.budgetBucket !== weddingData.budgetBucket) updateData.budgetBucket = weddingFormData.budgetBucket;
    if (weddingFormData.guestCountBucket !== weddingData.guestCountBucket) updateData.guestCountBucket = weddingFormData.guestCountBucket;
    if (weddingFormData.preferredStyle !== weddingData.preferredStyle) updateData.preferredStyle = weddingFormData.preferredStyle;
    if (JSON.stringify(weddingFormData.preferredServices) !== JSON.stringify(weddingData.preferredServices || [])) {
      updateData.preferredServices = weddingFormData.preferredServices;
    }

    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      const updatedWedding = await WeddingsService.weddingControllerUpdate(weddingData.id, updateData);
      setWeddingData(updatedWedding);
      populateWeddingFormData(updatedWedding);
    }
  }, [weddingData, weddingFormData, populateWeddingFormData]);

  const resetWeddingForm = useCallback(() => {
    if (weddingData) populateWeddingFormData(weddingData);
  }, [weddingData, populateWeddingFormData]);

  return {
    // State
    isLoadingWedding,
    weddingData,
    weddingFormData,

    // Actions
    fetchMainWedding,
    handleWeddingInputChange,
    updateWeddingProfile,
    resetWeddingForm,
  };
};
