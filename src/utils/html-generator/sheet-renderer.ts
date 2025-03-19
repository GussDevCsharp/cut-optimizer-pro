
import { Sheet, PlacedPiece } from '../../hooks/useSheetData';
import { generatePiece } from './piece-generator';

export const generateSheet = (sheet: Sheet, pieces: PlacedPiece[], sheetIndex: number): string => {
  const sheetPieces = pieces.filter(p => p.sheetIndex === sheetIndex);
  
  return `
    <div class="sheet-page">
      <div class="sheet-title">Chapa ${sheetIndex + 1}</div>
      <div class="sheet-container">
        <div class="sheet-dimension-width">${sheet.width}</div>
        <div class="sheet-dimension-height">${sheet.height}</div>
        
        ${sheetPieces.map(piece => generatePiece(piece)).join('')}
      </div>
    </div>
  `;
};
