
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
      
      // Calculate the aspect ratio to fit the page
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add new page for each sheet (except the first one)
      if (i > 0) {
        pdf.addPage();
      }
      
      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
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
