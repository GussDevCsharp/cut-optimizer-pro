
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

// Calculate potential waste score - lower scores represent better positions
// that will result in larger continuous unused areas
const calculateWasteScore = (
  x: number, 
  y: number, 
  pieceWidth: number, 
  pieceHeight: number, 
  sheetGrid: SheetGrid,
  sheet: Sheet
): number => {
  // Calculate corner scores - we want to place pieces in corners to maximize 
  // the remaining continuous space
  const isLeftEdge = x === 0;
  const isRightEdge = x + pieceWidth === sheet.width;
  const isTopEdge = y === 0;
  const isBottomEdge = y + pieceHeight === sheet.height;
  
  // Count how many edges this placement touches (more is better)
  const edgeCount = (isLeftEdge ? 1 : 0) + (isRightEdge ? 1 : 0) + 
                    (isTopEdge ? 1 : 0) + (isBottomEdge ? 1 : 0);
  
  // Count how many adjacent occupied cells (more is better as it reduces fragmentation)
  let adjacentCount = 0;
  
  // Check cells to the left
  if (x > 0) {
    for (let yCheck = y; yCheck < y + pieceHeight; yCheck++) {
      if (!sheetGrid.isCellAvailable(x - 1, yCheck)) {
        adjacentCount++;
      }
    }
  }
  
  // Check cells to the right
  if (x + pieceWidth < sheet.width) {
    for (let yCheck = y; yCheck < y + pieceHeight; yCheck++) {
      if (!sheetGrid.isCellAvailable(x + pieceWidth, yCheck)) {
        adjacentCount++;
      }
    }
  }
  
  // Check cells above
  if (y > 0) {
    for (let xCheck = x; xCheck < x + pieceWidth; xCheck++) {
      if (!sheetGrid.isCellAvailable(xCheck, y - 1)) {
        adjacentCount++;
      }
    }
  }
  
  // Check cells below
  if (y + pieceHeight < sheet.height) {
    for (let xCheck = x; xCheck < x + pieceWidth; xCheck++) {
      if (!sheetGrid.isCellAvailable(xCheck, y + pieceHeight)) {
        adjacentCount++;
      }
    }
  }
  
  // Calculate distance from origin (prefer positions closer to the origin)
  const distanceFromOrigin = Math.sqrt(x * x + y * y);
  
  // Calculate final score - lower is better
  // We prioritize: 
  // 1. Edge placement (reduces fragmentation)
  // 2. Adjacent to other pieces (reduces fragmentation)
  // 3. Proximity to origin (tidier layout)
  const edgeScore = (4 - edgeCount) * 100; // Maximum of 400 if touching no edges
  const adjacencyScore = -adjacentCount * 10; // Negative because more adjacency is better
  const distanceScore = distanceFromOrigin * 0.5;
  
  return edgeScore + adjacencyScore + distanceScore;
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
          // Calculate waste score for this position
          const score = calculateWasteScore(x, y, orientation.width, orientation.height, sheetGrid, sheet);
          
          // We found a valid position - check if it has a better score than our current best
          if (score < bestScore) {
            bestScore = score;
            bestPosition = { x, y, rotated: orientation.rotated };
          }
        }
      }
    }
  }

  return bestPosition;
};
