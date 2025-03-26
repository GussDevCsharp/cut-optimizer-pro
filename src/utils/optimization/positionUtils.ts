
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

// Evaluate a position based on how it affects potential scrap areas
const evaluatePosition = (
  x: number, 
  y: number, 
  pieceWidth: number, 
  pieceHeight: number, 
  sheetWidth: number, 
  sheetHeight: number,
  sheetGrid: SheetGrid,
  optimizeForScrap: boolean
): number => {
  if (!optimizeForScrap) {
    // Default evaluation: prefer positions closer to origin
    return x + y;
  }
  
  // Calculate potential scrap areas if piece is placed here
  // Right side scrap
  const rightScrapWidth = sheetWidth - (x + pieceWidth);
  const rightScrapHeight = pieceHeight;
  const rightScrapArea = rightScrapWidth > 0 ? rightScrapWidth * rightScrapHeight : 0;
  
  // Bottom side scrap
  const bottomScrapWidth = pieceWidth;
  const bottomScrapHeight = sheetHeight - (y + pieceHeight);
  const bottomScrapArea = bottomScrapHeight > 0 ? bottomScrapWidth * bottomScrapHeight : 0;
  
  // Corner scrap (largest potential reusable piece)
  const cornerScrapWidth = sheetWidth - (x + pieceWidth);
  const cornerScrapHeight = sheetHeight - (y + pieceHeight);
  const cornerScrapArea = (cornerScrapWidth > 0 && cornerScrapHeight > 0) 
                          ? cornerScrapWidth * cornerScrapHeight 
                          : 0;
  
  // Calculate a score - higher is better for larger potential scraps
  // We prioritize the corner scrap as it's most likely to be reusable
  const scrapScore = cornerScrapArea * 2 + Math.max(rightScrapArea, bottomScrapArea);
  
  // Adjust the score based on aspect ratio of the corner scrap
  // Square-ish scraps are more useful than long thin ones
  let aspectRatioBonus = 0;
  if (cornerScrapWidth > 0 && cornerScrapHeight > 0) {
    const aspectRatio = Math.max(cornerScrapWidth / cornerScrapHeight, cornerScrapHeight / cornerScrapWidth);
    aspectRatioBonus = aspectRatio < 3 ? 10000 : 0; // Bonus for more square-ish scraps
  }
  
  // Return negative of score because we're minimizing in the algorithm
  // (lower values are chosen first)
  return -(scrapScore + aspectRatioBonus);
};

// Try all possible positions for a piece on a specific sheet grid
export const findBestPosition = (
  piece: Piece,
  sheetGrid: SheetGrid,
  sheet: Sheet,
  direction: OptimizationDirection = 'horizontal',
  optimizeForScrap: boolean = false
): { x: number; y: number; rotated: boolean } | null => {
  // Try both orientations
  const orientations = [
    { width: piece.width, height: piece.height, rotated: false },
    { width: piece.height, height: piece.width, rotated: true && piece.canRotate } // Only rotate if allowed
  ].filter(o => !o.rotated || piece.canRotate); // Filter out rotated option if rotation not allowed
  
  let bestPosition = null;
  let bestScore = Number.MAX_SAFE_INTEGER;

  // Try every possible position on the sheet
  for (const orientation of orientations) {
    const maxX = sheet.width - orientation.width;
    const maxY = sheet.height - orientation.height;
    
    // Generate candidate positions based on direction
    const positions: {x: number, y: number}[] = [];
    
    if (direction === 'horizontal') {
      // Horizontal optimization - try positions from top to bottom, left to right
      for (let y = 0; y <= maxY; y++) {
        for (let x = 0; x <= maxX; x++) {
          positions.push({x, y});
        }
      }
    } else {
      // Vertical optimization - try positions from left to right, top to bottom
      for (let x = 0; x <= maxX; x++) {
        for (let y = 0; y <= maxY; y++) {
          positions.push({x, y});
        }
      }
    }

    for (const pos of positions) {
      if (sheetGrid.isAreaAvailable(pos.x, pos.y, orientation.width, orientation.height, sheet.cutWidth)) {
        // We found a valid position - evaluate it
        const score = evaluatePosition(
          pos.x, pos.y, 
          orientation.width, orientation.height, 
          sheet.width, sheet.height, 
          sheetGrid,
          optimizeForScrap
        );
        
        if (score < bestScore) {
          bestScore = score;
          bestPosition = { 
            x: pos.x, 
            y: pos.y, 
            rotated: orientation.rotated 
          };
        }
      }
    }
    
    // If we found a good position in the first orientation and aren't optimizing for scraps,
    // we might want to use it immediately rather than checking the second orientation
    if (bestPosition && !optimizeForScrap) {
      break;
    }
  }

  return bestPosition;
};
