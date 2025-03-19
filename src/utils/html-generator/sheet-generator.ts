
import { Sheet, PlacedPiece } from '../../hooks/useSheetData';
import { generateSheet } from './sheet-renderer';

export const generateSheets = (sheet: Sheet, placedPieces: PlacedPiece[], sheets: number[]): string => {
  return sheets.map(sheetIndex => generateSheet(sheet, placedPieces, sheetIndex)).join('');
};

// Re-export functions from piece-generator.ts for backward compatibility
export { generatePieceLabel } from './piece-generator';
