
import { Sheet } from "./types";

// Create a grid representation of the sheet to track occupied spaces
export const createGrid = (sheet: Sheet): Uint8Array => {
  // Create a flat 1D array representing the grid
  return new Uint8Array(sheet.width * sheet.height);
};

// Mark a placed piece on the grid as occupied
export const markPieceOnGrid = (
  grid: Uint8Array,
  piece: { x: number; y: number; width: number; height: number },
  sheetWidth: number,
  cutWidth: number
): void => {
  const startX = Math.max(0, piece.x - cutWidth);
  const startY = Math.max(0, piece.y - cutWidth);
  const endX = Math.min(piece.x + piece.width + cutWidth, sheetWidth);
  const endY = Math.min(piece.y + piece.height + cutWidth, sheetWidth);
  
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const index = y * sheetWidth + x;
      if (index >= 0 && index < grid.length) {
        grid[index] = 1;
      }
    }
  }
};

// Check if a piece can be placed at a specific position using the grid
export const canPlacePieceAtPosition = (
  grid: Uint8Array,
  piece: { x: number; y: number; width: number; height: number },
  sheetWidth: number,
  sheet: { width: number; height: number }
): boolean => {
  // Check boundaries first (quick rejection)
  if (
    piece.x < 0 ||
    piece.y < 0 ||
    piece.x + piece.width > sheet.width ||
    piece.y + piece.height > sheet.height
  ) {
    return false;
  }
  
  // Check if all required cells are available
  for (let y = piece.y; y < piece.y + piece.height; y++) {
    // Fast scan of row using slice instead of nested loop
    const rowStartIndex = y * sheetWidth + piece.x;
    const rowEndIndex = rowStartIndex + piece.width;
    
    // Check if any cell in this row is occupied (value > 0)
    if (grid.slice(rowStartIndex, rowEndIndex).some(cell => cell > 0)) {
      return false;
    }
  }
  
  return true;
};
