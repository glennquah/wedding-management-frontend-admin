'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  AdminsService,
  WeddingResponseDto,
  WeddingsService,
  UpdateWeddingDto,
  WeddingType,
  BudgetBucket,
  GuestCountBucket,
  WeddingStyle,
  WeddingService,
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
  paynowQR?: string;
}

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
    paynowQR: '',
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
      date: wedding.date || '',
      location: wedding.location || '',
      weddingType: wedding.weddingType,
      budgetBucket: wedding.budgetBucket,
      guestCountBucket: wedding.guestCountBucket,
      preferredStyle: wedding.preferredStyle,
      preferredServices: wedding.preferredServices || [],
      paynowQR: wedding.paynowQR || '',
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
    if (weddingFormData.date !== weddingData.date) updateData.date = weddingFormData.date;
    if (weddingFormData.location !== weddingData.location) updateData.location = weddingFormData.location;
    if (weddingFormData.weddingType !== weddingData.weddingType) updateData.weddingType = weddingFormData.weddingType;
    if (weddingFormData.budgetBucket !== weddingData.budgetBucket) updateData.budgetBucket = weddingFormData.budgetBucket;
    if (weddingFormData.guestCountBucket !== weddingData.guestCountBucket) updateData.guestCountBucket = weddingFormData.guestCountBucket;
    if (weddingFormData.preferredStyle !== weddingData.preferredStyle) updateData.preferredStyle = weddingFormData.preferredStyle;
    if (JSON.stringify(weddingFormData.preferredServices) !== JSON.stringify(weddingData.preferredServices)) {
      updateData.preferredServices = weddingFormData.preferredServices;
    }
    // Handle paynowQR comparison properly (comparing empty string with null/undefined)
    const currentPaynowQR = weddingData.paynowQR || '';
    const newPaynowQR = weddingFormData.paynowQR || '';
    if (newPaynowQR !== currentPaynowQR) {
      updateData.paynowQR = newPaynowQR || undefined;
    }

    console.log('Wedding Update Data:', updateData);

    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      const updatedWedding = await WeddingsService.weddingControllerUpdate(weddingData.id, updateData);
      setWeddingData(updatedWedding);
      populateWeddingFormData(updatedWedding);
      toast.success('Wedding details updated successfully');
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