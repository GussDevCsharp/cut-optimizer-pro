
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { removeTemporaryContainer } from './helpers/container';

/**
 * Renders HTML content into PDF pages
 */
export const renderPdfPages = async (container: HTMLDivElement): Promise<Blob> => {
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
      
      // Add new page for each sheet (except the first one)
      if (i > 0) {
        pdf.addPage();
      }
      
      // Render the page to canvas
      await renderPageToCanvas(page, pdf, pdfWidth, pdfHeight);
    }
    
    // Clean up
    removeTemporaryContainer(container);
    
    // Return as Blob for sharing
    return pdf.output('blob');
  } catch (error) {
    removeTemporaryContainer(container);
    throw error;
  }
};

/**
 * Renders a single HTML page element to a PDF canvas
 */
const renderPageToCanvas = async (
  page: HTMLElement,
  pdf: jsPDF,
  pdfWidth: number,
  pdfHeight: number
): Promise<void> => {
  // Use html2canvas to render each page
  const canvas = await html2canvas(page, {
    scale: 2, // Higher resolution
    logging: false,
    useCORS: true,
    allowTaint: true
  });
  
  // Calculate dimensions to maximize page usage while maintaining aspect ratio
  const { finalWidth, finalHeight, xPos, yPos } = calculateOptimalDimensions(
    canvas.width,
    canvas.height,
    pdfWidth,
    pdfHeight
  );
  
  // Add the image to the PDF, centered and maximized
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', xPos, yPos, finalWidth, finalHeight);
};

/**
 * Calculates the optimal dimensions for placing the canvas on the PDF page
 */
const calculateOptimalDimensions = (
  canvasWidth: number,
  canvasHeight: number,
  pdfWidth: number,
  pdfHeight: number,
  margin: number = 5 // 5mm margin
): { finalWidth: number; finalHeight: number; xPos: number; yPos: number } => {
  // Calculate the maximum dimensions that will fit on the page while maintaining aspect ratio
  // Use almost the full page width (with minimal margins)
  const imgWidth = pdfWidth - (margin * 2);
  const imgHeight = (canvasHeight * imgWidth) / canvasWidth;
  
  // If the height would overflow, calculate dimensions based on height instead
  let finalWidth = imgWidth;
  let finalHeight = imgHeight;
  
  if (imgHeight > pdfHeight - (margin * 2)) {
    finalHeight = pdfHeight - (margin * 2);
    finalWidth = (canvasWidth * finalHeight) / canvasHeight;
  }
  
  // Calculate centering position
  const xPos = (pdfWidth - finalWidth) / 2;
  const yPos = (pdfHeight - finalHeight) / 2;
  
  return { finalWidth, finalHeight, xPos, yPos };
};
