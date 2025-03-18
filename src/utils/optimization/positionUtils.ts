
import { Piece, Sheet } from '../../hooks/useSheetData';
import { SheetGrid } from './SheetGrid';

// Sort pieces by area (largest first) to improve packing efficiency
export const sortPiecesByArea = (pieces: Piece[]): Piece[] => {
  return [...pieces].sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });
};

// Try all possible positions for a piece on a specific sheet grid
export const findBestPosition = (
  piece: Piece,
  sheetGrid: SheetGrid,
  sheet: Sheet
): { x: number; y: number; rotated: boolean } | null => {
  // Try both orientations - start with non-rotated
  const orientations = [
    { width: piece.width, height: piece.height, rotated: false },
    { width: piece.height, height: piece.width, rotated: true }
  ].filter(o => !o.rotated || piece.canRotate); // Only use rotated option if allowed
  
  let bestPosition = null;
  let bestScore = Number.MAX_SAFE_INTEGER;

  // Try every possible position on the sheet
  for (const orientation of orientations) {
    for (let y = 0; y <= sheet.height - orientation.height; y += 1) {
      for (let x = 0; x <= sheet.width - orientation.width; x += 1) {
        if (sheetGrid.isAreaAvailable(x, y, orientation.width, orientation.height, sheet.cutWidth)) {
          // Calculate score - prefer positions closer to top-left
          // And add preference for orientation that fits better
          const score = y * 1000 + x + (orientation.rotated ? 0.5 : 0);
          
          if (score < bestScore) {
            bestScore = score;
            bestPosition = { x, y, rotated: orientation.rotated };
          }
          
          // If we found a position at y=0, x=0, we can break early as this is already optimal
          if (y === 0 && x === 0 && !orientation.rotated) {
            return bestPosition;
          }
        }
      }
    }
  }

  return bestPosition;
};
