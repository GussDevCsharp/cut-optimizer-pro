
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

// Helper function to check if a piece is similar to another piece
const isSimilarPiece = (piece1: Piece, piece2: PlacedPiece): boolean => {
  const dimensions1 = [piece1.width, piece1.height];
  const dimensions2 = piece2.rotated 
    ? [piece2.height, piece2.width] 
    : [piece2.width, piece2.height];
  
  return (
    (dimensions1[0] === dimensions2[0] && dimensions1[1] === dimensions2[1]) ||
    (piece1.canRotate && dimensions1[0] === dimensions2[1] && dimensions1[1] === dimensions2[0])
  );
};

// Calculate potential scrap score for a position
// Higher score means this position will likely result in more usable scrap areas
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
  let score = 0;
  
  // Prefer positions that touch the edges of the sheet or other pieces
  // This promotes more consolidated placement and larger scrap areas
  const touchesLeft = x === 0;
  const touchesTop = y === 0;
  const touchesRight = x + width === sheet.width;
  const touchesBottom = y + height === sheet.height;
  
  // Check if the placement touches other pieces
  const touchesOtherPieceLeft = !touchesLeft && sheetGrid.hasOccupiedAdjacent(x - 1, y, 1, height);
  const touchesOtherPieceTop = !touchesTop && sheetGrid.hasOccupiedAdjacent(x, y - 1, width, 1);
  const touchesOtherPieceRight = !touchesRight && sheetGrid.hasOccupiedAdjacent(x + width, y, 1, height);
  const touchesOtherPieceBottom = !touchesBottom && sheetGrid.hasOccupiedAdjacent(x, y + height, width, 1);
  
  // Add scores for touching edges or other pieces
  if (touchesLeft) score += 10;
  if (touchesTop) score += 10;
  if (touchesRight) score += 5;
  if (touchesBottom) score += 5;
  
  if (touchesOtherPieceLeft) score += 8;
  if (touchesOtherPieceTop) score += 8;
  if (touchesOtherPieceRight) score += 4;
  if (touchesOtherPieceBottom) score += 4;
  
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
  const rightSpace = sheet.width - (x + width);
  const bottomSpace = sheet.height - (y + height);
  
  // Penalize positions that leave narrow strips
  if (rightSpace > 0 && rightSpace < minReuseSize) {
    score -= 10;
  }
  
  if (bottomSpace > 0 && bottomSpace < minReuseSize) {
    score -= 10;
  }
  
  // IMPORTANT NEW ADDITION: Strongly favor positioning next to similar pieces
  // This will encourage grouping same-sized pieces together
  const similarPiecesNearby = placedPieces.filter(placedPiece => {
    // Check if dimensions match
    const isSimilar = isSimilarPiece(piece, placedPiece);
    if (!isSimilar) return false;
    
    // Check if it's adjacent (within 5mm to account for cut width)
    const adjacencyThreshold = 5;
    
    // Check left/right adjacency
    const isLeftAdjacent = Math.abs(placedPiece.x + placedPiece.width - x) <= adjacencyThreshold;
    const isRightAdjacent = Math.abs(x + width - placedPiece.x) <= adjacencyThreshold;
    
    // Check top/bottom adjacency
    const isTopAdjacent = Math.abs(placedPiece.y + placedPiece.height - y) <= adjacencyThreshold;
    const isBottomAdjacent = Math.abs(y + height - placedPiece.y) <= adjacencyThreshold;
    
    // Check if at least one direction is adjacent
    return (isLeftAdjacent || isRightAdjacent) || (isTopAdjacent || isBottomAdjacent);
  });
  
  // Add a significant bonus for each similar piece nearby
  // This should greatly increase the likelihood of grouping similar pieces
  score += similarPiecesNearby.length * 25;
  
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
  // Try both orientations
  const orientations = [
    { width: piece.width, height: piece.height, rotated: false },
    { width: piece.height, height: piece.width, rotated: true && piece.canRotate } // Only rotate if allowed
  ].filter(o => !o.rotated || piece.canRotate); // Filter out rotated option if rotation not allowed
  
  let bestPosition = null;
  let highestScore = Number.MIN_SAFE_INTEGER;

  // Try every possible position on the sheet
  for (const orientation of orientations) {
    for (let y = 0; y <= sheet.height - orientation.height; y++) {
      for (let x = 0; x <= sheet.width - orientation.width; x++) {
        if (sheetGrid.isAreaAvailable(x, y, orientation.width, orientation.height, allowSpaces ? sheet.cutWidth : 0)) {
          // Calculate score for this position, including the nearby similar pieces factor
          const score = calculateScrapScore(
            piece, 
            x, 
            y, 
            orientation.width, 
            orientation.height, 
            sheetGrid, 
            sheet,
            placedPieces
          );
          
          // Check if this position is better than our current best
          if (score > highestScore) {
            highestScore = score;
            bestPosition = { x, y, rotated: orientation.rotated };
          }
          
          // If we found a position with a very good score, we can break early
          if (score > 40) { // Increased threshold to ensure we find truly optimal positions
            break;
          }
        }
      }
    }
  }

  return bestPosition;
};
