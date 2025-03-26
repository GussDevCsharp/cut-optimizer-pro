
import { Piece, Sheet } from '../../hooks/useSheetData';
import { SheetGrid } from './SheetGrid';
import { OptimizationDirection } from './optimizationEngine';

// Sort pieces by area (largest first) to improve packing efficiency
export const sortPiecesByArea = (pieces: Piece[]): Piece[] => {
  return [...pieces].sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });
};

// Optimized function to find the best position for a piece
export const findBestPosition = (
  piece: Piece,
  sheetGrid: SheetGrid,
  sheet: Sheet,
  direction: OptimizationDirection = 'horizontal'
): { x: number; y: number; rotated: boolean } | null => {
  // Try both orientations (if rotation is allowed)
  const orientations = [
    { width: piece.width, height: piece.height, rotated: false },
    // Only include rotated orientation if allowed
    piece.canRotate ? { width: piece.height, height: piece.width, rotated: true } : null
  ].filter(Boolean);

  // Increment step size for faster scanning (increase for bigger sheets)
  // This creates a grid-like search pattern instead of checking every pixel
  const stepSize = Math.min(10, Math.max(1, Math.floor(Math.min(sheet.width, sheet.height) / 200)));
  
  // For each orientation
  for (const orientation of orientations) {
    if (!orientation) continue;
    
    // Use different scanning patterns based on optimization direction
    if (direction === 'horizontal') {
      // Scan top-to-bottom, then left-to-right
      for (let y = 0; y <= sheet.height - orientation.height; y += stepSize) {
        let foundInRow = false;
        
        for (let x = 0; x <= sheet.width - orientation.width; x += stepSize) {
          // Check if this position works
          if (sheetGrid.isAreaAvailable(x, y, orientation.width, orientation.height, sheet.cutWidth)) {
            // Fine-tune position by checking each possible position in the step range
            for (let fineY = y; fineY < Math.min(y + stepSize, sheet.height - orientation.height + 1); fineY++) {
              for (let fineX = x; fineX < Math.min(x + stepSize, sheet.width - orientation.width + 1); fineX++) {
                if (sheetGrid.isAreaAvailable(fineX, fineY, orientation.width, orientation.height, sheet.cutWidth)) {
                  return { x: fineX, y: fineY, rotated: orientation.rotated };
                }
              }
            }
            
            foundInRow = true;
            break;
          }
        }
        
        if (foundInRow) break;
      }
    } else {
      // Vertical optimization - left-to-right, then top-to-bottom
      for (let x = 0; x <= sheet.width - orientation.width; x += stepSize) {
        let foundInColumn = false;
        
        for (let y = 0; y <= sheet.height - orientation.height; y += stepSize) {
          if (sheetGrid.isAreaAvailable(x, y, orientation.width, orientation.height, sheet.cutWidth)) {
            // Fine-tune position
            for (let fineX = x; fineX < Math.min(x + stepSize, sheet.width - orientation.width + 1); fineX++) {
              for (let fineY = y; fineY < Math.min(y + stepSize, sheet.height - orientation.height + 1); fineY++) {
                if (sheetGrid.isAreaAvailable(fineX, fineY, orientation.width, orientation.height, sheet.cutWidth)) {
                  return { x: fineX, y: fineY, rotated: orientation.rotated };
                }
              }
            }
            
            foundInColumn = true;
            break;
          }
        }
        
        if (foundInColumn) break;
      }
    }
  }

  return null;
}
