
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
  let bestScore = Number.MAX_SAFE_INTEGER;

  // Try every possible position on the sheet
  for (const orientation of orientations) {
    for (let y = 0; y <= sheet.height - orientation.height; y++) {
      for (let x = 0; x <= sheet.width - orientation.width; x++) {
        if (sheetGrid.isAreaAvailable(x, y, orientation.width, orientation.height, sheet.cutWidth)) {
          // Calculate score based on position (prioritize top-left and minimize gaps)
          // Lower score is better - we prioritize positions that:
          // 1. Are higher up (smaller y value)
          // 2. Are more to the left (smaller x value)
          // 3. Have existing pieces adjacent to them (to minimize gaps)
          
          // Base score from position
          const positionScore = y * 1000 + x;
          
          // Check adjacency (sides that touch existing pieces)
          let adjacencyBonus = 0;
          
          // Check left side
          if (x > 0) {
            let hasAdjacentLeft = false;
            for (let checkY = y; checkY < y + orientation.height; checkY++) {
              if (checkY < sheet.height && sheetGrid.isOccupied(x - 1, checkY)) {
                hasAdjacentLeft = true;
                break;
              }
            }
            if (hasAdjacentLeft) adjacencyBonus += 1000;
          }
          
          // Check right side
          if (x + orientation.width < sheet.width) {
            let hasAdjacentRight = false;
            for (let checkY = y; checkY < y + orientation.height; checkY++) {
              if (checkY < sheet.height && sheetGrid.isOccupied(x + orientation.width, checkY)) {
                hasAdjacentRight = true;
                break;
              }
            }
            if (hasAdjacentRight) adjacencyBonus += 1000;
          }
          
          // Check top side
          if (y > 0) {
            let hasAdjacentTop = false;
            for (let checkX = x; checkX < x + orientation.width; checkX++) {
              if (checkX < sheet.width && sheetGrid.isOccupied(checkX, y - 1)) {
                hasAdjacentTop = true;
                break;
              }
            }
            if (hasAdjacentTop) adjacencyBonus += 1000;
          }
          
          // Check bottom side
          if (y + orientation.height < sheet.height) {
            let hasAdjacentBottom = false;
            for (let checkX = x; checkX < x + orientation.width; checkX++) {
              if (checkX < sheet.width && sheetGrid.isOccupied(checkX, y + orientation.height)) {
                hasAdjacentBottom = true;
                break;
              }
            }
            if (hasAdjacentBottom) adjacencyBonus += 1000;
          }
          
          // Final score calculation - subtract adjacency bonus (higher adjacency = lower score = better)
          const finalScore = positionScore - adjacencyBonus;
          
          // Update if this position has a better score
          if (finalScore < bestScore) {
            bestScore = finalScore;
            bestPosition = { x, y, rotated: orientation.rotated };
          }
        }
      }
    }
  }

  return bestPosition;
};
