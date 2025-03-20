
import { Piece, Sheet, PlacedPiece } from '../../hooks/useSheetData';
import { SheetGrid } from './SheetGrid';

// Sort pieces by area (largest first) to improve packing efficiency
export const sortPiecesByArea = (pieces: Piece[]): Piece[] => {
  return [...pieces].sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });
};

// Group similar pieces together for more efficient cutting
export const groupSimilarPieces = (pieces: Piece[]): Piece[] => {
  // First sort by area (largest first)
  const sortedByArea = sortPiecesByArea(pieces);
  
  // Then group pieces with the same dimensions together
  const dimensionGroups: Record<string, Piece[]> = {};
  
  sortedByArea.forEach(piece => {
    // Create a key based on dimensions (handle both normal and rotated orientations)
    const normalKey = `${piece.width}x${piece.height}`;
    const rotatedKey = piece.canRotate ? `${piece.height}x${piece.width}` : normalKey;
    
    // Use the key for the largest orientation
    const dimensionKey = normalKey > rotatedKey ? normalKey : rotatedKey;
    
    if (!dimensionGroups[dimensionKey]) {
      dimensionGroups[dimensionKey] = [];
    }
    
    dimensionGroups[dimensionKey].push(piece);
  });
  
  // Flatten the groups back into a single array
  return Object.values(dimensionGroups).flat();
};

// Create a cache for piece similarity lookups - significant performance gain
const similarityCache = new Map<string, boolean>();

// Helper function to check if a piece is similar to another piece
const isSimilarPiece = (piece1: Piece, piece2: PlacedPiece): boolean => {
  // Create a cache key
  const cacheKey = `${piece1.id}|${piece1.width}x${piece1.height}|${piece2.id}|${piece2.width}x${piece2.height}|${piece2.rotated}`;
  
  // Return cached result if available
  if (similarityCache.has(cacheKey)) {
    return similarityCache.get(cacheKey)!;
  }
  
  const dimensions1 = [piece1.width, piece1.height];
  const dimensions2 = piece2.rotated 
    ? [piece2.height, piece2.width] 
    : [piece2.width, piece2.height];
  
  const result = (
    (dimensions1[0] === dimensions2[0] && dimensions1[1] === dimensions2[1]) ||
    (piece1.canRotate && dimensions1[0] === dimensions2[1] && dimensions1[1] === dimensions2[0])
  );
  
  // Cache the result
  similarityCache.set(cacheKey, result);
  
  return result;
};

// Cache for position scoring
const positionCache = new Map<string, number>();

// Calculate potential scrap score for a position
const calculateScrapScore = (
  piece: Piece,
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  sheetGrid: SheetGrid, 
  sheet: Sheet,
  placedPieces: PlacedPiece[]
): number => {
  // Create a cache key
  const cacheKey = `${piece.id}|${x},${y}|${width}x${height}|${placedPieces.length}`;
  
  // Return cached score if available
  if (positionCache.has(cacheKey)) {
    return positionCache.get(cacheKey)!;
  }
  
  let score = 0;
  
  // Cache sheet dimensions
  const sheetWidth = sheet.width;
  const sheetHeight = sheet.height;
  
  // Quick edge checks
  const touchesLeft = x === 0;
  const touchesTop = y === 0;
  const touchesRight = x + width === sheetWidth;
  const touchesBottom = y + height === sheetHeight;
  
  // Check if the placement touches other pieces - more efficient grid checking
  const touchesOtherPieceLeft = !touchesLeft && sheetGrid.hasOccupiedAdjacent(x - 1, y, 1, height);
  const touchesOtherPieceTop = !touchesTop && sheetGrid.hasOccupiedAdjacent(x, y - 1, width, 1);
  const touchesOtherPieceRight = !touchesRight && sheetGrid.hasOccupiedAdjacent(x + width, y, 1, height);
  const touchesOtherPieceBottom = !touchesBottom && sheetGrid.hasOccupiedAdjacent(x, y + height, width, 1);
  
  // Calculate score for edges - using bitwise operations for speed
  score += (touchesLeft ? 10 : 0) + (touchesTop ? 10 : 0) + (touchesRight ? 5 : 0) + (touchesBottom ? 5 : 0);
  
  // Calculate score for touching other pieces
  score += (touchesOtherPieceLeft ? 8 : 0) + (touchesOtherPieceTop ? 8 : 0) + 
           (touchesOtherPieceRight ? 4 : 0) + (touchesOtherPieceBottom ? 4 : 0);
  
  // Higher scores for corner placements
  if ((touchesLeft && touchesTop) || 
      (touchesLeft && touchesBottom) || 
      (touchesRight && touchesTop) || 
      (touchesRight && touchesBottom)) {
    score += 15;
  }
  
  // Prefer placements that don't create small unusable spaces
  const minReuseSize = 100; // Minimum size considered reusable
  
  // Check remaining space to the right and below
  const rightSpace = sheetWidth - (x + width);
  const bottomSpace = sheetHeight - (y + height);
  
  // Penalize positions that leave narrow strips
  if (rightSpace > 0 && rightSpace < minReuseSize) {
    score -= 10;
  }
  
  if (bottomSpace > 0 && bottomSpace < minReuseSize) {
    score -= 10;
  }
  
  // Use early termination for similar piece checks
  // Only check the last 20 placed pieces for similarity - major performance boost
  const checkCount = Math.min(placedPieces.length, 20);
  const recentPieces = placedPieces.slice(-checkCount);
  
  // Limit the distance for adjacency check to improve performance
  const adjacencyThreshold = 5;
  
  let similarPiecesNearbyCount = 0;
  
  for (let i = 0; i < recentPieces.length; i++) {
    const placedPiece = recentPieces[i];
    
    // Check if dimensions match using the cached similarity function
    if (!isSimilarPiece(piece, placedPiece)) continue;
    
    // Quick adjacency check using math abs
    const isLeftAdjacent = Math.abs(placedPiece.x + placedPiece.width - x) <= adjacencyThreshold;
    const isRightAdjacent = Math.abs(x + width - placedPiece.x) <= adjacencyThreshold;
    const isTopAdjacent = Math.abs(placedPiece.y + placedPiece.height - y) <= adjacencyThreshold;
    const isBottomAdjacent = Math.abs(y + height - placedPiece.y) <= adjacencyThreshold;
    
    // Check if at least one direction is adjacent
    if ((isLeftAdjacent || isRightAdjacent) || (isTopAdjacent || isBottomAdjacent)) {
      similarPiecesNearbyCount++;
      
      // Early termination when we have enough similar pieces
      if (similarPiecesNearbyCount >= 3) break;
    }
  }
  
  // Add a significant bonus for each similar piece nearby
  score += similarPiecesNearbyCount * 25;
  
  // Cache the final score
  positionCache.set(cacheKey, score);
  
  return score;
};

// Try all possible positions for a piece on a specific sheet grid
export const findBestPosition = (
  piece: Piece,
  sheetGrid: SheetGrid,
  sheet: Sheet,
  placedPieces: PlacedPiece[],
  allowSpaces: boolean = false
): { x: number; y: number; rotated: boolean } | null => {
  // Cache sheet dimensions
  const sheetWidth = sheet.width;
  const sheetHeight = sheet.height;
  const pieceWidth = piece.width;
  const pieceHeight = piece.height;
  const canRotate = piece.canRotate;
  
  // Pre-compute possible orientations
  const orientations = [
    { width: pieceWidth, height: pieceHeight, rotated: false }
  ];
  
  // Only add rotated option if rotation is allowed
  if (canRotate && pieceWidth !== pieceHeight) {
    orientations.push({ width: pieceHeight, height: pieceWidth, rotated: true });
  }
  
  let bestPosition = null;
  let highestScore = -1000000; // Use a lower initial value to ensure a position is found
  
  // Optimization: Use step sizes for faster scanning on large sheets
  // Start with smaller step sizes to ensure we don't miss good positions
  const xStep = Math.max(1, Math.floor(sheetWidth / 500));
  const yStep = Math.max(1, Math.floor(sheetHeight / 500));

  // Try every possible position on the sheet with improved scanning approach
  for (const orientation of orientations) {
    const oWidth = orientation.width;
    const oHeight = orientation.height;
    
    // Early termination if the piece doesn't fit on this sheet
    if (oWidth > sheetWidth || oHeight > sheetHeight) continue;
    
    // Scan the grid with step sizes (will be 1 for smaller sheets)
    for (let y = 0; y <= sheetHeight - oHeight; y += yStep) {
      for (let x = 0; x <= sheetWidth - oWidth; x += xStep) {
        // Quick check if area might be available
        if (!sheetGrid.isAreaAvailable(x, y, oWidth, oHeight, allowSpaces ? sheet.cutWidth : 0)) {
          continue;
        }
        
        // Calculate score for this position
        const score = calculateScrapScore(
          piece, 
          x, 
          y, 
          oWidth, 
          oHeight, 
          sheetGrid, 
          sheet,
          placedPieces
        );
        
        // Check if this position is better than our current best
        if (score > highestScore) {
          highestScore = score;
          bestPosition = { x, y, rotated: orientation.rotated };
          
          // If we found a very good position, break early
          // Higher threshold for better positions
          if (score > 55) break;
        }
      }
      
      // Break out of y-loop if we found a very good position
      if (highestScore > 55) break;
    }
    
    // Break out of orientation loop if we found a very good position
    if (highestScore > 55) break;
  }

  // If we didn't find a good position with step sizes, try without steps for edge cases
  if (!bestPosition && (xStep > 1 || yStep > 1)) {
    for (const orientation of orientations) {
      const oWidth = orientation.width;
      const oHeight = orientation.height;
      
      // Early termination if the piece doesn't fit on this sheet
      if (oWidth > sheetWidth || oHeight > sheetHeight) continue;
      
      // More precise scanning without steps
      for (let y = 0; y <= sheetHeight - oHeight; y++) {
        for (let x = 0; x <= sheetWidth - oWidth; x++) {
          // Skip positions we already checked
          if (y % yStep === 0 && x % xStep === 0) continue;
          
          if (sheetGrid.isAreaAvailable(x, y, oWidth, oHeight, allowSpaces ? sheet.cutWidth : 0)) {
            const score = calculateScrapScore(
              piece, 
              x, 
              y, 
              oWidth, 
              oHeight, 
              sheetGrid, 
              sheet,
              placedPieces
            );
            
            if (score > highestScore) {
              highestScore = score;
              bestPosition = { x, y, rotated: orientation.rotated };
            }
          }
        }
      }
    }
  }

  return bestPosition;
};

// Clear caches - call this when starting a new optimization
export const clearOptimizationCaches = (): void => {
  similarityCache.clear();
  positionCache.clear();
};
