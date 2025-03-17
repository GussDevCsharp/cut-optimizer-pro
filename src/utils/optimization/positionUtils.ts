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

// Cache for position checks to avoid redundant calculations
const positionCache = new Map<string, {x: number, y: number, rotated: boolean} | null>();

// Optimized function to find the best position for a piece on a sheet
export const findBestPosition = (
  piece: Piece,
  sheetGrid: SheetGrid,
): { x: number; y: number; rotated: boolean } | null => {
  // Generate cache key based on piece dimensions and sheet state
  const cacheKey = `${piece.width}-${piece.height}-${piece.canRotate}-${sheetGrid.getOccupancyHash()}`;
  
  // Check if we have a cached result
  if (positionCache.has(cacheKey)) {
    return positionCache.get(cacheKey);
  }
  
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

  // For large pieces, use smaller step sizes to ensure precise placement
  const stepSize = piece.width > 300 || piece.height > 300 ? 1 : 
                  Math.min(5, Math.floor(Math.min(piece.width, piece.height) / 4)) || 1;
  
  // Process each orientation
  for (const orientation of orientations) {
    // Skip if this orientation won't fit on sheet
    if (orientation.width > sheetGrid['width'] || orientation.height > sheetGrid['height']) {
      continue;
    }
    
    // First try to place at (0,0) - this is often the best position
    if (sheetGrid.isAreaAvailable(0, 0, orientation.width, orientation.height)) {
      const position = { x: 0, y: 0, rotated: orientation.rotated };
      positionCache.set(cacheKey, position);
      return position;
    }
    
    // Use a smarter scanning approach for efficiency
    const scanPoints = sheetGrid.getScanPoints();
    
    for (const { x, y } of scanPoints) {
      if (x + orientation.width <= sheetGrid['width'] && 
          y + orientation.height <= sheetGrid['height'] &&
          sheetGrid.isAreaAvailable(x, y, orientation.width, orientation.height)) {
        
        // Simple score function - prioritize top-left positions
        const score = y * 1000 + x;
        
        // If we find a position at the top edge, it's usually good
        if (y === 0) {
          const position = { x, y, rotated: orientation.rotated };
          positionCache.set(cacheKey, position);
          return position;
        }
        
        // Otherwise, keep the best position
        if (score < bestScore) {
          bestPosition = { x, y, rotated: orientation.rotated };
          bestScore = score;
        }
      }
    }
    
    // Fall back to traditional scanning if scan points didn't work
    if (!bestPosition) {
      for (let y = 0; y <= sheetGrid['height'] - orientation.height; y += stepSize) {
        // Boundary check for last step
        if (y + orientation.height > sheetGrid['height']) continue;
        
        for (let x = 0; x <= sheetGrid['width'] - orientation.width; x += stepSize) {
          // Boundary check for last step
          if (x + orientation.width > sheetGrid['width']) continue;
          
          if (sheetGrid.isAreaAvailable(x, y, orientation.width, orientation.height)) {
            const score = y * 1000 + x;
            
            if (score < bestScore) {
              bestPosition = { x, y, rotated: orientation.rotated };
              bestScore = score;
            }
          }
        }
      }
    }
  }
  
  // Cache result before returning
  positionCache.set(cacheKey, bestPosition);
  
  // Clear cache if it gets too large
  if (positionCache.size > 10000) {
    positionCache.clear();
  }
  
  return bestPosition;
};
