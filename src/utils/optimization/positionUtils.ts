
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
  sheet: Sheet,
  orientationPreference: 'vertical' | 'horizontal' = 'horizontal'
): { x: number; y: number; rotated: boolean } | null => {
  // Set up orientations based on the preference
  let orientations = [];
  
  if (orientationPreference === 'horizontal') {
    // Try original orientation first (horizontal priority)
    orientations = [
      { width: piece.width, height: piece.height, rotated: false },
      { width: piece.height, height: piece.width, rotated: true && piece.canRotate } // Only rotate if allowed
    ].filter(o => !o.rotated || piece.canRotate); // Filter out rotated option if rotation not allowed
  } else {
    // Try rotated orientation first (vertical priority)
    orientations = [
      { width: piece.height, height: piece.width, rotated: true && piece.canRotate }, // Only rotate if allowed
      { width: piece.width, height: piece.height, rotated: false }
    ].filter(o => !o.rotated || (o.rotated && piece.canRotate)); // Filter out rotated option if rotation not allowed
  }
  
  let bestPosition = null;
  let lowestY = Number.MAX_SAFE_INTEGER;
  let lowestX = Number.MAX_SAFE_INTEGER;

  // Try every possible position on the sheet
  for (const orientation of orientations) {
    for (let y = 0; y <= sheet.height - orientation.height; y++) {
      for (let x = 0; x <= sheet.width - orientation.width; x++) {
        if (sheetGrid.isAreaAvailable(x, y, orientation.width, orientation.height, sheet.cutWidth)) {
          // We found a valid position - check if it's "better" than our current best
          // Better means closer to the top-left corner
          if (y < lowestY || (y === lowestY && x < lowestX)) {
            lowestY = y;
            lowestX = x;
            bestPosition = { x, y, rotated: orientation.rotated };
            
            // If we found a position at y=0, we can break early as this is already optimal
            if (y === 0) {
              break;
            }
          }
        }
      }
      
      // If we found a position at the current y, we can move to the next piece
      if (bestPosition && bestPosition.y === y) {
        break;
      }
    }
    
    // If we found a position in the first orientation, try the next orientation
    if (bestPosition) {
      break;
    }
  }

  return bestPosition;
};
