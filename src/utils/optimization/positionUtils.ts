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
  // Always try both orientations, prioritizing the one that fits better
  const orientations = [
    { width: piece.width, height: piece.height, rotated: false },
    { width: piece.height, height: piece.width, rotated: true }
  ].filter(o => !o.rotated || piece.canRotate); // Filter out rotated option if rotation not allowed
  
  let bestPosition = null;
  let lowestY = Number.MAX_SAFE_INTEGER;
  let lowestX = Number.MAX_SAFE_INTEGER;
  let bestFit = Number.MAX_SAFE_INTEGER; // Measure of wasted space

  // Try every possible position on the sheet, for each orientation
  for (const orientation of orientations) {
    // Skip orientation if it doesn't fit in the sheet dimensions
    if (orientation.width > sheet.width || orientation.height > sheet.height) {
      continue;
    }
    
    for (let y = 0; y <= sheet.height - orientation.height; y += 1) {
      for (let x = 0; x <= sheet.width - orientation.width; x += 1) {
        if (sheetGrid.isAreaAvailable(x, y, orientation.width, orientation.height, sheet.cutWidth)) {
          // Calculate a "fit score" - lower is better
          // This prioritizes positions that are closer to the top-left and use space efficiently
          const fitScore = y * 1000 + x; // Prioritize top positions, then left positions
          
          // Check if this position is better than our current best
          if (bestPosition === null || fitScore < bestFit) {
            lowestY = y;
            lowestX = x;
            bestPosition = { x, y, rotated: orientation.rotated };
            bestFit = fitScore;
            
            // If we found a position at y=0, this is already good
            // but keep searching for potentially better x positions
            if (y === 0 && x === 0) {
              break; // Perfect top-left corner position
            }
          }
        }
      }
      
      // If we found a good position at the current y level, we can move on
      // to try the next orientation
      if (bestPosition && bestPosition.y === y && bestFit < 100) {
        break;
      }
    }
  }

  return bestPosition;
};
