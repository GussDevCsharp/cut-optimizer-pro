
import { Sheet, PlacedPiece } from '../../hooks/useSheetData';
import { generateCuttingPlanHtml } from '../html-generator';
import { createTemporaryContainer } from './helpers/container';
import { renderPdfPages } from './render-pages';

export const generatePdf = async (
  sheet: Sheet,
  placedPieces: PlacedPiece[],
  sheetCount: number,
  sheets: number[],
  projectName: string
): Promise<Blob> => {
  // Create a temporary container for the HTML content
  const container = createTemporaryContainer(
    generateCuttingPlanHtml(sheet, placedPieces, sheetCount, sheets, projectName)
  );
  
  try {
    // Wait for images/fonts to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Render PDF pages and return the blob
    return await renderPdfPages(container);
  } catch (error) {
    console.error('Error generating PDF:', error);
    document.body.removeChild(container);
    throw error;
  }
};
