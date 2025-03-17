import { Piece } from '../../hooks/useSheetData';
import { SheetGrid } from './SheetGrid';

// Sort pieces by area (largest first) to improve packing efficiency
export const sortPiecesByArea = (pieces: Piece[]): Piece[] => {
  return [...pieces].sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });
};

// Optimized function to find the best position for a piece on a sheet
export const findBestPosition = (
  piece: Piece,
  sheetGrid: SheetGrid,
): { x: number; y: number; rotated: boolean } | null => {
  // Try both orientations if rotation is allowed
  const orientations = [
    { width: piece.width, height: piece.height, rotated: false }
  ];
  
  // Only add rotated option if rotation is allowed
  if (piece.canRotate !== false) {
    orientations.push({ width: piece.height, height: piece.width, rotated: true });
  }
  
  let bestPosition = null;
  let bestScore = Number.MAX_SAFE_INTEGER;

  // Optimization: Use fast paths for common piece sizes
  // Try every position on the sheet with an optimized step size
  const stepSize = Math.min(5, Math.floor(Math.min(piece.width, piece.height) / 4)) || 1;
  
  // Process each orientation
  for (const orientation of orientations) {
    // Skip if this orientation won't fit on sheet
    if (orientation.width > sheetGrid['width'] || orientation.height > sheetGrid['height']) {
      continue;
    }
    
    // First try to place at (0,0) - this is often the best position
    if (sheetGrid.isAreaAvailable(0, 0, orientation.width, orientation.height)) {
      return { x: 0, y: 0, rotated: orientation.rotated };
    }
    
    // Scan from top to bottom for efficiency
    for (let y = 0; y <= sheetGrid['height'] - orientation.height; y++) {
      // Fast scan - we don't need to check every single pixel
      // Try every position on the sheet, with an optimized increment
      for (let x = 0; x <= sheetGrid['width'] - orientation.width; x++) {
        if (sheetGrid.isAreaAvailable(x, y, orientation.width, orientation.height)) {
          // Simple score function - prioritize top-left positions
          const score = y * 1000 + x;
          
          // If we find a position at the top edge, it's usually good
          if (y === 0) {
            return { x, y, rotated: orientation.rotated };
          }
          
          // Otherwise, keep the best position
          if (score < bestScore) {
            bestPosition = { x, y, rotated: orientation.rotated };
            bestScore = score;
          }
        }
      }
      
      // Early termination - if we found a good position in the first few rows, use it
      if (bestPosition && bestPosition.y < 3) {
        return bestPosition;
      }
    }
  }
  
  return bestPosition;
};
