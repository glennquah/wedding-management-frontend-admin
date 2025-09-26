import { HallLayoutDto, SeatingResultDto } from '@shared/api';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface ExportData {
  layout: HallLayoutDto;
  seatingResult?: SeatingResultDto | null;
  weddingDetails?: {
    coupleName?: string;
    date?: string;
  };
}

// Function to add Knotly logo to bottom right of page
async function addKnotlyLogo(pdf: jsPDF): Promise<void> {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  try {
    // Load the Knotly logo image
    const logoImage = new Image();
    logoImage.crossOrigin = 'anonymous';

    await new Promise<void>((resolve, reject) => {
      logoImage.onload = () => resolve();
      logoImage.onerror = () => reject(new Error('Failed to load logo'));
      logoImage.src = '/images/logo.png';
    });

    // Add "Powered by" text
    pdf.setFontSize(8);
    pdf.setFont('normal');
    pdf.setTextColor(150, 150, 150);
    const poweredByText = 'Powered by';
    pdf.text(poweredByText, pageWidth - 30, pageHeight - 20);

    // Add logo image
    const logoWidth = 20;
    const logoHeight = (logoImage.height * logoWidth) / logoImage.width;
    pdf.addImage(logoImage, 'PNG', pageWidth - 30, pageHeight - 15, logoWidth, logoHeight);

    // Reset text color
    pdf.setTextColor(0, 0, 0);
  } catch (error) {
    console.warn('Could not load logo image, falling back to text:', error);
    // Fallback to text logo if image fails to load
    pdf.setFontSize(8);
    pdf.setFont('normal');
    pdf.setTextColor(150, 150, 150);
    const poweredByText = 'Powered by';
    const poweredByWidth = pdf.getTextWidth(poweredByText);
    pdf.text(poweredByText, pageWidth - 50, pageHeight - 20);

    pdf.setFontSize(12);
    pdf.setFont('bold');
    pdf.setTextColor(255, 102, 102);
    const knotlyText = 'Knotly';
    const knotlyWidth = pdf.getTextWidth(knotlyText);
    pdf.text(knotlyText, pageWidth - 50 + (poweredByWidth - knotlyWidth) / 2, pageHeight - 12);

    // Reset text color
    pdf.setTextColor(0, 0, 0);
  }
}

// Helper function to convert SVG to canvas with better compatibility
async function svgToCanvas(svgElement: SVGElement): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    try {
      // Create a new image element
      const img = new Image();

      // Clone the SVG to avoid modifying the original
      const svgClone = svgElement.cloneNode(true) as SVGElement;

      // Get SVG dimensions
      const svgRect = svgElement.getBoundingClientRect();
      const svgWidth = svgRect.width || 800;
      const svgHeight = svgRect.height || 600;

      // Set explicit dimensions if not present
      svgClone.setAttribute('width', svgWidth.toString());
      svgClone.setAttribute('height', svgHeight.toString());

      // Ensure all text and elements have proper styling
      const styles = window.getComputedStyle(svgElement);
      svgClone.style.cssText = styles.cssText;

      // Convert SVG to data URL
      const serializer = new XMLSerializer();
      const svgData = serializer.serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      img.onload = () => {
        try {
          // Create canvas with proper dimensions
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            throw new Error('Could not get canvas context');
          }

          // Set canvas dimensions with scale for better quality
          const scale = 2;
          canvas.width = svgWidth * scale;
          canvas.height = svgHeight * scale;

          // Scale context and set high quality rendering
          ctx.scale(scale, scale);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Fill with white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, svgWidth, svgHeight);

          // Draw the image
          ctx.drawImage(img, 0, 0, svgWidth, svgHeight);

          URL.revokeObjectURL(svgUrl);
          resolve(canvas);
        } catch (error) {
          URL.revokeObjectURL(svgUrl);
          reject(error);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(svgUrl);
        reject(new Error('Failed to load SVG image'));
      };

      img.src = svgUrl;
    } catch (error) {
      reject(error);
    }
  });
}

export async function exportSeatingArrangementAsPDF(data: ExportData): Promise<void> {
  try {
    // Create new PDF document
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    // PDF Title and Header
    pdf.setFontSize(20);
    pdf.setFont('bold');
    const title = `Wedding Seating Arrangement${data.weddingDetails?.coupleName ? ` - ${data.weddingDetails.coupleName}` : ''}`;
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, 20);

    // Reset text color for content
    pdf.setTextColor(0, 0, 0);

    // Capture the seating visualization SVG with improved method
    const svgElement = document.querySelector('.seating-visualization-svg') as SVGElement;
    if (svgElement) {
      try {
        console.log('Attempting to capture SVG...');

        // Try the improved SVG conversion method first
        let canvas: HTMLCanvasElement;
        try {
          canvas = await svgToCanvas(svgElement);
          console.log('SVG converted successfully using svgToCanvas');
        } catch (svgError) {
          console.warn('svgToCanvas failed, falling back to html2canvas:', svgError);
          // Fallback to html2canvas with improved settings
          canvas = await html2canvas(svgElement as unknown as HTMLElement, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            foreignObjectRendering: false,
            imageTimeout: 15000,
            removeContainer: true,
          });
        }

        const imgData = canvas.toDataURL('image/png', 0.95);
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Calculate available space for image (leaving space for text)
        const availableHeight = pageHeight - 85; // More conservative spacing
        const finalHeight = Math.min(imgHeight, availableHeight);

        // Add the seating chart image
        pdf.addImage(imgData, 'PNG', margin, 45, imgWidth, finalHeight);
        console.log('SVG image added to PDF successfully');
      } catch (error) {
        console.error('Could not capture SVG:', error);
        // Add a note that the visual layout couldn't be included
        pdf.setFontSize(12);
        pdf.setFont('italic');
        pdf.setTextColor(150, 150, 150);
        pdf.text('(Visual layout could not be exported - see table assignments below)', margin, 60);
        pdf.setTextColor(0, 0, 0);
      }
    }

    // Add logo to first page
    await addKnotlyLogo(pdf);

    // Add table assignments on new page
    pdf.addPage();
    await addKnotlyLogo(pdf);

    // Table assignments header
    pdf.setFontSize(16);
    pdf.setFont('bold');
    pdf.text('Table Assignments', margin, 20);

    if (data.seatingResult?.seating_arrangement) {
      let yPosition = 35;
      const tables = data.layout.layout.tables.sort((a, b) => a.id - b.id);
      const lineHeight = 6;
      const maxYPosition = pageHeight - 30;

      pdf.setFontSize(12);

      for (const table of tables) {
        const guests = data.seatingResult.seating_arrangement[table.id] || [];

        // Calculate space needed for this table
        const spaceNeeded = 8 + (guests.length > 0 ? guests.length * lineHeight : lineHeight) + 8;

        // Check if we need a new page
        if (yPosition + spaceNeeded > maxYPosition) {
          pdf.addPage();
          await addKnotlyLogo(pdf);
          yPosition = 20;
          // Reset font size for table content
          pdf.setFontSize(12);
        }

        // Table header
        pdf.setFont('bold');
        pdf.text(`Table ${table.id} (Capacity: ${table.capacity})`, margin, yPosition);
        yPosition += 8;

        if (guests.length === 0) {
          pdf.setFont('italic');
          pdf.setTextColor(150, 150, 150);
          pdf.text('No guests assigned', margin + 10, yPosition);
          pdf.setTextColor(0, 0, 0);
          yPosition += lineHeight;
        } else {
          pdf.setFont('normal');
          for (let index = 0; index < guests.length; index++) {
            const guest = guests[index];
            // Check if we need a new page for this guest
            if (yPosition > maxYPosition) {
              pdf.addPage();
              await addKnotlyLogo(pdf);
              yPosition = 20;
              // Reset font size and repeat table header on new page
              pdf.setFontSize(12);
              pdf.setFont('bold');
              pdf.text(`Table ${table.id} (continued)`, margin, yPosition);
              yPosition += 8;
              pdf.setFont('normal');
            }

            const guestText = `${index + 1}. ${guest}`;
            pdf.text(guestText, margin + 10, yPosition);
            yPosition += lineHeight;
          }
        }

        yPosition += 8; // Extra space between tables
      }

      // Add summary statistics
      if (yPosition > maxYPosition - 60) {
        pdf.addPage();
        await addKnotlyLogo(pdf);
        yPosition = 20;
      }

      yPosition += 10;
      pdf.setFontSize(14);
      pdf.setFont('bold');
      pdf.text('Summary', margin, yPosition);
      yPosition += 10;

      const totalGuests = Object.values(data.seatingResult.seating_arrangement).reduce(
        (sum, guests) => sum + guests.length,
        0,
      );
      const totalTables = tables.length;
      const occupiedTables = Object.values(data.seatingResult.seating_arrangement).filter(
        (guests) => guests.length > 0,
      ).length;

      pdf.setFontSize(11);
      pdf.setFont('normal');
      pdf.text(`Total Guests: ${totalGuests}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Total Tables: ${totalTables}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Occupied Tables: ${occupiedTables}`, margin, yPosition);
      yPosition += 6;
      pdf.text(
        `Available Seats: ${tables.reduce((sum, t) => sum + t.capacity, 0)}`,
        margin,
        yPosition,
      );

      // Add constraint violations if any
      if (
        data.seatingResult.violated_constraints &&
        data.seatingResult.violated_constraints.length > 0
      ) {
        if (yPosition > maxYPosition - 40) {
          pdf.addPage();
          await addKnotlyLogo(pdf);
          yPosition = 20;
        }

        yPosition += 15;
        pdf.setFontSize(14);
        pdf.setFont('bold');
        pdf.setTextColor(200, 50, 50);
        pdf.text('Seating Constraints', margin, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        pdf.setFont('normal');
        pdf.setTextColor(150, 0, 0);

        for (const violation of data.seatingResult.violated_constraints) {
          if (yPosition > maxYPosition - 15) {
            pdf.addPage();
            await addKnotlyLogo(pdf);
            yPosition = 20;
            // Reset font size for constraint violations
            pdf.setFontSize(10);
            pdf.setFont('normal');
            pdf.setTextColor(150, 0, 0);
          }
          pdf.text(`• ${violation}`, margin, yPosition);
          yPosition += 5;
        }
      }
    }

    // Save the PDF
    const fileName = `seating-arrangement${data.weddingDetails?.coupleName ? `-${data.weddingDetails.coupleName.replace(/\s+/g, '-')}` : ''}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF export');
  }
}
