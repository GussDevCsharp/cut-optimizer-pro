
import { PlacedPiece, Sheet } from '../../hooks/useSheetData';
import { SheetGrid } from './SheetGrid';

export interface AvailableArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Finds available areas on a sheet based on placed pieces
 */
export const findAvailableAreas = (sheet: Sheet, placedPieces: PlacedPiece[], sheetIndex: number): AvailableArea[] => {
  const { width: sheetWidth, height: sheetHeight, cutWidth } = sheet;
  
  // Create a grid to track occupied cells
  const grid = new SheetGrid(sheetWidth, sheetHeight);
  
  // Mark all placed pieces on this sheet as occupied
  const piecesOnSheet = placedPieces.filter(p => p.sheetIndex === sheetIndex);
  piecesOnSheet.forEach(piece => {
    grid.occupyArea(piece.x, piece.y, piece.width, piece.height);
  });
  
  // Find contiguous available areas
  const availableAreas: AvailableArea[] = [];
  const visited = Array(sheetHeight).fill(null).map(() => Array(sheetWidth).fill(false));
  
  // Helper to check if a cell is available and within boundaries
  const isCellAvailable = (x: number, y: number): boolean => {
    return x >= 0 && y >= 0 && x < sheetWidth && y < sheetHeight && 
           !visited[y][x] && grid.isCellAvailable(x, y);
  };
  
  // Find the largest rectangle that can be placed at a starting point
  const findMaxRectangle = (startX: number, startY: number): AvailableArea | null => {
    let maxWidth = 0;
    let maxHeight = 0;
    
    // Find max width (how far we can go right)
    for (let x = startX; x < sheetWidth; x++) {
      if (isCellAvailable(x, startY)) {
        maxWidth++;
      } else {
        break;
      }
    }
    
    // Find max height (how far we can go down while maintaining width)
    outer: for (let y = startY; y < sheetHeight; y++) {
      for (let x = startX; x < startX + maxWidth; x++) {
        if (!isCellAvailable(x, y)) {
          break outer;
        }
      }
      maxHeight++;
    }
    
    // Mark all cells in this rectangle as visited
    for (let y = startY; y < startY + maxHeight; y++) {
      for (let x = startX; x < startX + maxWidth; x++) {
        visited[y][x] = true;
      }
    }
    
    if (maxWidth > 0 && maxHeight > 0) {
      // Respect cut width by reducing the area slightly
      const adjustedArea = {
        x: startX,
        y: startY,
        width: maxWidth,
        height: maxHeight
      };
      
      return adjustedArea;
    }
    
    return null;
  };
  
  // Scan the sheet to find all available areas
  for (let y = 0; y < sheetHeight; y++) {
    for (let x = 0; x < sheetWidth; x++) {
      if (isCellAvailable(x, y)) {
        const rectangle = findMaxRectangle(x, y);
        if (rectangle) {
          availableAreas.push(rectangle);
        }
      }
    }
  }
  
  return availableAreas.filter(area => {
    // Filter out areas that are too small to be useful
    // Adjust these thresholds as needed
    return area.width >= 10 && area.height >= 10;
  });
};
