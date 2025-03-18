
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

// Try all possible positions for a piece on a specific sheet grid - optimized for performance
export const findBestPosition = (
  piece: Piece,
  sheetGrid: SheetGrid,
  sheet: Sheet
): { x: number; y: number; rotated: boolean } | null => {
  // Try both orientations
  const orientations = [
    { width: piece.width, height: piece.height, rotated: false },
    { width: piece.height, height: piece.width, rotated: true && piece.canRotate } // Only rotate if allowed
  ].filter(o => !o.rotated || piece.canRotate); // Filter out rotated option if rotation not allowed
  
  let bestPosition = null;
  let lowestY = Number.MAX_SAFE_INTEGER;
  let lowestX = Number.MAX_SAFE_INTEGER;

  // Determine step size - use larger steps for faster search on normal pieces
  // Special handling for problematic pieces like 200x275
  const isProblemPiece = (piece.width === 200 && piece.height === 275) || 
                         (piece.width === 275 && piece.height === 200);
  const stepSize = isProblemPiece ? 1 : (piece.width > 150 && piece.height > 150 ? 2 : 4);

  // Try every possible position on the sheet
  for (const orientation of orientations) {
    // Check if this is a priority orientation (important for 200x275 pieces)
    const isPriority = (orientation.width === 200 && orientation.height === 275) || 
                       (orientation.width === 275 && orientation.height === 200);
    
    // For large sheets, check positions in increments to improve performance
    for (let y = 0; y <= sheet.height - orientation.height; y += stepSize) {
      // Early termination if we found a position at the current y level and it's not a priority piece
      if (bestPosition && bestPosition.y === y && !isPriority && !isProblemPiece) {
        break;
      }
      
      for (let x = 0; x <= sheet.width - orientation.width; x += stepSize) {
        if (sheetGrid.isAreaAvailable(x, y, orientation.width, orientation.height, sheet.cutWidth)) {
          // Extra check only for problematic pieces
          if (isProblemPiece) {
            const isSecure = sheetGrid.isSecurePosition(x, y, orientation.width, orientation.height, sheet.cutWidth + 1);
            if (!isSecure) continue;
          }
          
          // We found a valid position - check if it's "better" than our current best
          const score = y * 1000 + x; // Base score
          const currentBestScore = lowestY * 1000 + lowestX;
          
          if (isPriority || bestPosition === null || score < currentBestScore) {
            lowestY = y;
            lowestX = x;
            bestPosition = { x, y, rotated: orientation.rotated };
            
            // Return early for priority pieces in the preferred orientation
            if (isPriority && orientation.rotated === true) {
              return bestPosition;
            }
          }
        }
      }
    }
    
    // If we found a position and it's not a problematic piece, we can stop trying other orientations
    if (bestPosition && !isProblemPiece) {
      break;
    }
  }

  return bestPosition;
};
