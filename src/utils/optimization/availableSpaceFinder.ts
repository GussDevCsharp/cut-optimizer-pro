
import { PlacedPiece, Sheet } from '../../hooks/useSheetData';
import { SheetGrid } from './SheetGrid';

export interface AvailableArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Find available areas on the sheet
export const findAvailableAreas = (
  placedPieces: PlacedPiece[],
  sheet: Sheet,
  sheetIndex: number
): AvailableArea[] => {
  // Initialize grid with the entire sheet marked as available
  const grid = new SheetGrid(sheet.width, sheet.height);
  
  // Mark all placed pieces on the grid
  const sheetPieces = placedPieces.filter(p => p.sheetIndex === sheetIndex);
  for (const piece of sheetPieces) {
    grid.occupyArea(piece.x, piece.y, piece.width, piece.height);
  }
  
  // Find available areas
  const availableAreas: AvailableArea[] = [];
  const minAreaSize = 50; // Minimum size area to display (to avoid tiny spaces)
  
  // Scan the grid for available spaces
  let y = 0;
  while (y < sheet.height) {
    let x = 0;
    while (x < sheet.width) {
      // If this position is available, find the largest rectangle starting from here
      if (!grid.isOccupied(x, y)) {
        // Find max width (how far we can go to the right)
        let maxWidth = 0;
        for (let testX = x; testX < sheet.width; testX++) {
          if (grid.isOccupied(testX, y)) {
            break;
          }
          maxWidth = testX - x + 1;
        }
        
        // Find max height (how far we can go down with the max width)
        let maxHeight = 0;
        let validRect = true;
        
        for (let testY = y; testY < sheet.height && validRect; testY++) {
          for (let testX = x; testX < x + maxWidth; testX++) {
            if (grid.isOccupied(testX, testY)) {
              validRect = false;
              break;
            }
          }
          
          if (validRect) {
            maxHeight = testY - y + 1;
          } else {
            break;
          }
        }
        
        // Add if area is large enough
        if (maxWidth >= minAreaSize && maxHeight >= minAreaSize) {
          availableAreas.push({
            x,
            y,
            width: maxWidth,
            height: maxHeight
          });
          
          // Mark this area as occupied so we don't find overlapping areas
          grid.occupyArea(x, y, maxWidth, maxHeight);
        }
        
        // Skip past this rectangle
        x += maxWidth;
      } else {
        x++;
      }
    }
    y++;
  }
  
  return availableAreas;
};
