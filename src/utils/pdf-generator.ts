
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Sheet, PlacedPiece } from '../hooks/useSheetData';
import { generateCuttingPlanHtml } from './html-generator';

export const generatePdf = async (
  sheet: Sheet,
  placedPieces: PlacedPiece[],
  sheetCount: number,
  sheets: number[],
  projectName: string
): Promise<Blob> => {
  // Create a temporary container for the HTML content
  const container = document.createElement('div');
  container.innerHTML = generateCuttingPlanHtml(sheet, placedPieces, sheetCount, sheets, projectName);
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  document.body.appendChild(container);
  
  // Wait for images/fonts to load
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create PDF document with A4 size
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  try {
    // Get all sheet pages
    const sheetPages = container.querySelectorAll('.sheet-page');
    
    // Process each sheet page
    for (let i = 0; i < sheetPages.length; i++) {
      const page = sheetPages[i] as HTMLElement;
      
      // Use html2canvas to render each page
      const canvas = await html2canvas(page, {
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Add new page for each sheet (except the first one)
      if (i > 0) {
        pdf.addPage();
      }
      
      // Calculate the maximum dimensions that will fit on the page while maintaining aspect ratio
      // Use almost the full page width (with minimal margins)
      const imgWidth = pdfWidth - 10; // 5mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If the height would overflow, calculate dimensions based on height instead
      let finalWidth = imgWidth;
      let finalHeight = imgHeight;
      
      if (imgHeight > pdfHeight - 10) {
        finalHeight = pdfHeight - 10; // 5mm margin on top and bottom
        finalWidth = (canvas.width * finalHeight) / canvas.height;
      }
      
      // Calculate centering position
      const xPos = (pdfWidth - finalWidth) / 2;
      const yPos = (pdfHeight - finalHeight) / 2;
      
      // Add the image to the PDF, centered and maximized
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', xPos, yPos, finalWidth, finalHeight);
    }
    
    // Clean up
    document.body.removeChild(container);
    
    // Return as Blob for sharing
    return pdf.output('blob');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    document.body.removeChild(container);
    throw error;
  }
};
