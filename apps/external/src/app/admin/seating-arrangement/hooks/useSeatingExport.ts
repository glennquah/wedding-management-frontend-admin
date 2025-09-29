import { useState } from 'react';

import { ExportData, exportSeatingArrangementAsPDF } from '../utils/exportSeatingArrangement';
import { HallLayoutDto, SeatingResultDto } from '@shared/api';

interface UseSeatingExportProps {
  layout?: HallLayoutDto | null;
  seatingResult?: SeatingResultDto | null;
  weddingDetails?: {
    coupleName?: string;
    date?: string;
  };
}

export function useSeatingExport({ layout, seatingResult, weddingDetails }: UseSeatingExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportToPDF = async () => {
    if (!layout) {
      setExportError('No layout available for export');
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      const exportData: ExportData = {
        layout,
        seatingResult,
        weddingDetails,
      };

      await exportSeatingArrangementAsPDF(exportData);
    } catch (error) {
      console.error('Export failed:', error);
      setExportError('Failed to export seating arrangement. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const canExport = !!layout && !!seatingResult?.success;

  return {
    exportToPDF,
    isExporting,
    exportError,
    canExport,
  };
}
