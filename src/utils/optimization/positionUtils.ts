
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
  // Try both orientations
  const orientations = [
    { width: piece.width, height: piece.height, rotated: false },
    { width: piece.height, height: piece.width, rotated: true && piece.canRotate } // Only rotate if allowed
  ].filter(o => !o.rotated || piece.canRotate); // Filter out rotated option if rotation not allowed
  
  let bestPosition = null;
  let lowestY = Number.MAX_SAFE_INTEGER;
  let lowestX = Number.MAX_SAFE_INTEGER;
  let bestScore = Number.MAX_SAFE_INTEGER;

  // Get existing piece positions to check for alignment
  const existingCuts = sheetGrid.getExistingCuts();

  // Try every possible position on the sheet
  for (const orientation of orientations) {
    for (let y = 0; y <= sheet.height - orientation.height; y++) {
      for (let x = 0; x <= sheet.width - orientation.width; x++) {
        if (sheetGrid.isAreaAvailable(x, y, orientation.width, orientation.height, sheet.cutWidth)) {
          // Calculate score based on alignment with existing cuts
          // Lower score is better
          let score = y * 3 + x; // Base score favors top-left placement
          
          // Check if this position aligns with existing horizontal cuts (reducing longitudinal cuts)
          let alignsWithHorizontalCut = false;
          for (const cut of existingCuts.horizontalCuts) {
            // If the top or bottom edge of this piece aligns with an existing horizontal cut
            if (y === cut || y + orientation.height === cut) {
              alignsWithHorizontalCut = true;
              score -= 1000; // Heavily favor positions that align with existing horizontal cuts
              break;
            }
          }
          
          // Also check for vertical alignment, but with less priority
          for (const cut of existingCuts.verticalCuts) {
            if (x === cut || x + orientation.width === cut) {
              score -= 200; // Some preference for vertical alignment but not as much
              break;
            }
          }
          
          // Favor positions that minimize new longitudinal (vertical) cuts
          // by preferring pieces that span the full width of the sheet
          if (orientation.width === sheet.width) {
            score -= 500; // Strongly prefer full-width pieces
          }
          
          // Check if current position is better than the best so far
          if (score < bestScore || 
              (score === bestScore && (y < lowestY || (y === lowestY && x < lowestX)))) {
            bestScore = score;
            lowestY = y;
            lowestX = x;
            bestPosition = { x, y, rotated: orientation.rotated };
          }
        }
      }
    }
  }

  return bestPosition;
};
