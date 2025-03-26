
import { PlacedPiece, Sheet, SheetStats } from '../types/sheetTypes';

export const calculateSheetStats = (
  sheet: Sheet,
  placedPieces: PlacedPiece[],
  currentSheetIndex: number
): SheetStats => {
  const sheetCount = placedPieces.length > 0 
    ? Math.max(...placedPieces.map(p => p.sheetIndex)) + 1 
    : 0;

  const currentSheetPieces = placedPieces.filter(p => p.sheetIndex === currentSheetIndex);
  const totalSheetArea = sheet.width * sheet.height;
  const usedArea = currentSheetPieces.reduce((total, piece) => {
    return total + (piece.width * piece.height);
  }, 0);
  const wasteArea = totalSheetArea - usedArea;
  const efficiency = totalSheetArea > 0 ? (usedArea / totalSheetArea) * 100 : 0;

  return {
    usedArea,
    wasteArea,
    efficiency,
    sheetCount
  };
};
