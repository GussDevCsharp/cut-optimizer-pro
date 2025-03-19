
import { Sheet, PlacedPiece, ScrapPiece } from '../../hooks/useSheetData';
import { generatePiece } from './piece-generator';

export const generateSheet = (
  sheet: Sheet, 
  pieces: PlacedPiece[], 
  scraps: ScrapPiece[] = [],
  sheetIndex: number
): string => {
  const sheetPieces = pieces.filter(p => p.sheetIndex === sheetIndex);
  const sheetScraps = scraps.filter(p => p.sheetIndex === sheetIndex);
  
  return `
    <div class="sheet-page">
      <div class="sheet-title">Chapa ${sheetIndex + 1}</div>
      <div class="sheet-container" style="width: ${sheet.width}px; height: ${sheet.height}px;">
        <div class="sheet-dimension-width">${sheet.width} mm</div>
        <div class="sheet-dimension-height">${sheet.height} mm</div>
        
        ${/* Render scraps first so regular pieces appear on top */
          sheetScraps.map(scrap => generatePiece(scrap)).join('')}
        
        ${sheetPieces.map(piece => generatePiece(piece)).join('')}
      </div>
    </div>
  `;
};
