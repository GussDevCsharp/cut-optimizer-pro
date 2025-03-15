
import { Piece, Sheet, Position, PieceWithOrientation } from "./types";
import { canPlacePieceAtPosition } from "./gridUtils";

// Find the best position for a new piece using a faster algorithm
export const findBestPosition = (
  piece: Piece,
  grid: Uint8Array,
  sheet: Sheet,
  sheetWidth: number
): Position | null => {
  // Try both orientations if canRotate is true
  const orientations = piece.canRotate 
    ? [
        { width: piece.width, height: piece.height, rotated: false },
        { width: piece.height, height: piece.width, rotated: true }
      ]
    : [
        { width: piece.width, height: piece.height, rotated: false }
      ];

  let bestFit = null;
  let bestY = sheet.height;
  let bestX = sheet.width;

  // Optimize by scanning in larger increments initially
  const scanStep = 1; // We could increase this for even faster results, but might reduce quality
  
  // Strategy: find the topmost, then leftmost position where the piece fits
  for (const orientation of orientations) {
    // Skip this orientation if it's too large for the sheet
    if (orientation.width > sheet.width || orientation.height > sheet.height) {
      continue;
    }
    
    // Improved scanning algorithm: scan top to bottom, left to right
    for (let y = 0; y <= sheet.height - orientation.height; y += scanStep) {
      let rowFit = false;
      
      for (let x = 0; x <= sheet.width - orientation.width; x += scanStep) {
        const testPiece = {
          ...orientation,
          x,
          y
        };

        if (canPlacePieceAtPosition(grid, testPiece, sheetWidth, sheet)) {
          // Found a valid position - check if it's better than our current best
          if (y < bestY || (y === bestY && x < bestX)) {
            bestY = y;
            bestX = x;
            bestFit = { x, y, rotated: orientation.rotated };
            rowFit = true;
            break; // Found a position in this row, move to next row
          }
        }
      }
      
      if (rowFit && y < bestY) {
        break; // If we found a fit in an upper row, don't need to check lower rows
      }
    }
  }

  return bestFit;
};
