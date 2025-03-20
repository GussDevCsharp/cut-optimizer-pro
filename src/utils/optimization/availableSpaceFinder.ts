
import { PlacedPiece, Sheet } from '../../hooks/useSheetData';
import { SheetGrid } from './SheetGrid';

export interface AvailableArea {
  x: number;
  y: number;
  width: number;
  height: number;
  isScrap?: boolean;
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
  
  // Find available areas (scraps) - increasing minimum size to only show larger areas
  const minAreaSize = 400; // Increased minimum size to only show larger scraps (was 50)
  const scrapAreas = grid.findScrapAreas(minAreaSize);
  
  // Convert to AvailableArea format and mark as scrap
  const availableAreas: AvailableArea[] = scrapAreas.map(area => ({
    ...area,
    isScrap: true
  }));
  
  // Sort areas by size (largest first)
  return availableAreas.sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });
};

// Group adjacent scrap areas that can be combined
export const groupAdjacentScraps = (
  scraps: AvailableArea[]
): AvailableArea[] => {
  if (scraps.length <= 1) return scraps;
  
  const grouped: AvailableArea[] = [];
  const visited = new Set<number>();
  
  const areAdjacent = (a: AvailableArea, b: AvailableArea): boolean => {
    // Two rectangles are adjacent if they share an edge
    // Check if right edge of a touches left edge of b
    const aRightTouchesBLeft = a.x + a.width === b.x && 
      ((a.y <= b.y && a.y + a.height > b.y) || 
       (b.y <= a.y && b.y + b.height > a.y));
    
    // Check if left edge of a touches right edge of b
    const aLeftTouchesBRight = a.x === b.x + b.width && 
      ((a.y <= b.y && a.y + a.height > b.y) || 
       (b.y <= a.y && b.y + b.height > a.y));
    
    // Check if bottom edge of a touches top edge of b
    const aBottomTouchesBTop = a.y + a.height === b.y && 
      ((a.x <= b.x && a.x + a.width > b.x) || 
       (b.x <= a.x && b.x + b.width > a.x));
    
    // Check if top edge of a touches bottom edge of b
    const aTopTouchesBBottom = a.y === b.y + b.height && 
      ((a.x <= b.x && a.x + a.width > b.x) || 
       (b.x <= a.x && b.x + b.width > a.x));
    
    return aRightTouchesBLeft || aLeftTouchesBRight || 
           aBottomTouchesBTop || aTopTouchesBBottom;
  };
  
  const canCombine = (a: AvailableArea, b: AvailableArea): boolean => {
    // Can only combine if they form a rectangle
    if (a.x === b.x && a.width === b.width) {
      // Vertically adjacent with same width
      return true;
    }
    if (a.y === b.y && a.height === b.height) {
      // Horizontally adjacent with same height
      return true;
    }
    return false;
  };
  
  const combineAreas = (a: AvailableArea, b: AvailableArea): AvailableArea => {
    const minX = Math.min(a.x, b.x);
    const minY = Math.min(a.y, b.y);
    const maxX = Math.max(a.x + a.width, b.x + b.width);
    const maxY = Math.max(a.y + a.height, b.y + b.height);
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      isScrap: true
    };
  };
  
  // Try to combine adjacent areas
  for (let i = 0; i < scraps.length; i++) {
    if (visited.has(i)) continue;
    
    let current = scraps[i];
    visited.add(i);
    
    let combined = true;
    while (combined) {
      combined = false;
      
      for (let j = 0; j < scraps.length; j++) {
        if (visited.has(j) && j !== i) continue;
        
        if (areAdjacent(current, scraps[j]) && canCombine(current, scraps[j])) {
          current = combineAreas(current, scraps[j]);
          visited.add(j);
          combined = true;
          break;
        }
      }
    }
    
    grouped.push(current);
  }
  
  return grouped;
};
