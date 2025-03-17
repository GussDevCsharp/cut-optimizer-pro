
import { Piece, PlacedPiece, Sheet } from '../hooks/useSheetData';

// Helper function to generate a random pastel color
const generatePastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

// Create a grid to track occupied areas on the sheet
class SheetGrid {
  private grid: boolean[][];
  private width: number;
  private height: number;
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = Array(height).fill(null).map(() => Array(width).fill(false));
  }
  
  // Check if an area is available for a piece (including cut width)
  isAreaAvailable(x: number, y: number, pieceWidth: number, pieceHeight: number, cutWidth: number): boolean {
    // Check that the piece fits within sheet boundaries
    if (x < 0 || y < 0 || x + pieceWidth > this.width || y + pieceHeight > this.height) {
      return false;
    }
    
    // Account for cut width by checking a slightly expanded area
    const startX = Math.max(0, x);
    const startY = Math.max(0, y);
    const endX = Math.min(this.width - 1, x + pieceWidth - 1);
    const endY = Math.min(this.height - 1, y + pieceHeight - 1);
    
    // Check each cell in the grid to ensure no overlap
    for (let i = startY; i <= endY; i++) {
      for (let j = startX; j <= endX; j++) {
        if (this.grid[i][j]) {
          return false; // Area is already occupied
        }
      }
    }
    
    // Also check for cut width spacing to ensure no pieces are too close together
    const cutStartX = Math.max(0, x - cutWidth);
    const cutStartY = Math.max(0, y - cutWidth);
    const cutEndX = Math.min(this.width - 1, x + pieceWidth + cutWidth - 1);
    const cutEndY = Math.min(this.height - 1, y + pieceHeight + cutWidth - 1);
    
    // Check the border of the piece with cut width
    for (let i = cutStartY; i <= cutEndY; i++) {
      for (let j = cutStartX; j <= cutEndX; j++) {
        // Skip checking the actual piece area
        if (i >= startY && i <= endY && j >= startX && j <= endX) {
          continue;
        }
        if (i >= 0 && i < this.height && j >= 0 && j < this.width && this.grid[i][j]) {
          return false; // Cut width area is already occupied
        }
      }
    }
    
    return true;
  }
  
  // Mark an area as occupied
  occupyArea(x: number, y: number, pieceWidth: number, pieceHeight: number): void {
    for (let i = y; i < y + pieceHeight; i++) {
      for (let j = x; j < x + pieceWidth; j++) {
        if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
          this.grid[i][j] = true;
        }
      }
    }
  }
  
  // Debug method to print the grid
  printGrid(): void {
    for (let i = 0; i < this.height; i++) {
      let row = '';
      for (let j = 0; j < this.width; j++) {
        row += this.grid[i][j] ? '█' : '·';
      }
      console.log(row);
    }
  }
}

// Sort pieces by area (largest first) to improve packing efficiency
const sortPiecesByArea = (pieces: Piece[]): Piece[] => {
  return [...pieces].sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });
};

// Try all possible positions for a piece
const findBestPosition = (
  piece: Piece,
  sheetGrid: SheetGrid,
  sheet: Sheet
): { x: number; y: number; rotated: boolean } | null => {
  // Try both orientations
  const orientations = [
    { width: piece.width, height: piece.height, rotated: false },
    { width: piece.height, height: piece.width, rotated: true && piece.canRotate } // Only rotate if allowed
  ].filter(o => !o.rotated || piece.canRotate); // Filter out rotated option if rotation not allowed
  
  let bestPosition = null;
  let lowestY = Number.MAX_SAFE_INTEGER;
  let lowestX = Number.MAX_SAFE_INTEGER;

  // Try every possible position on the sheet
  for (const orientation of orientations) {
    for (let y = 0; y <= sheet.height - orientation.height; y++) {
      for (let x = 0; x <= sheet.width - orientation.width; x++) {
        if (sheetGrid.isAreaAvailable(x, y, orientation.width, orientation.height, sheet.cutWidth)) {
          // We found a valid position - check if it's "better" than our current best
          // Better means closer to the top-left corner
          if (y < lowestY || (y === lowestY && x < lowestX)) {
            lowestY = y;
            lowestX = x;
            bestPosition = { x, y, rotated: orientation.rotated };
            
            // If we found a position at y=0, we can break early as this is already optimal
            if (y === 0) {
              break;
            }
          }
        }
      }
      
      // If we found a position at the current y, we can move to the next piece
      if (bestPosition && bestPosition.y === y) {
        break;
      }
    }
    
    // If we found a position in the first orientation, try the next orientation
    if (bestPosition) {
      break;
    }
  }

  return bestPosition;
};

// Main optimization function that handles multiple sheets
export const optimizeCutting = (
  pieces: Piece[],
  sheet: Sheet
): PlacedPiece[] => {
  console.log("Starting optimization with", pieces.length, "piece types");
  
  const sortedPieces = sortPiecesByArea(pieces);
  const placedPieces: PlacedPiece[] = [];
  
  // Expand pieces based on quantity
  const expandedPieces: Piece[] = [];
  sortedPieces.forEach(piece => {
    for (let i = 0; i < piece.quantity; i++) {
      expandedPieces.push({
        ...piece,
        color: piece.color || generatePastelColor()
      });
    }
  });
  
  console.log("Total pieces to place:", expandedPieces.length);
  
  // Place each piece, creating new sheets as needed
  let currentSheetIndex = 0;
  let currentSheetGrid = new SheetGrid(sheet.width, sheet.height);
  
  for (const piece of expandedPieces) {
    // Try to place on current sheet
    const position = findBestPosition(piece, currentSheetGrid, sheet);
    
    if (position) {
      // Place on current sheet
      const placedPiece: PlacedPiece = {
        ...piece,
        x: position.x,
        y: position.y,
        rotated: position.rotated,
        width: position.rotated ? piece.height : piece.width,
        height: position.rotated ? piece.width : piece.height,
        sheetIndex: currentSheetIndex
      };
      
      // Double-check there's no overlap (safety check)
      if (!currentSheetGrid.isAreaAvailable(position.x, position.y, placedPiece.width, placedPiece.height, sheet.cutWidth)) {
        console.error("Overlap detected for piece", placedPiece);
        continue; // Skip this piece if there's an overlap
      }
      
      // Mark the area as occupied
      currentSheetGrid.occupyArea(position.x, position.y, placedPiece.width, placedPiece.height);
      
      placedPieces.push(placedPiece);
      
      // Debug grid after placement
      if (placedPieces.length < 5) { // Only log for first few pieces to avoid console spam
        console.log(`Placed piece ${placedPiece.width}x${placedPiece.height} at (${position.x},${position.y}) rotated: ${position.rotated}`);
        // currentSheetGrid.printGrid();
      }
    } else {
      // Move to a new sheet
      currentSheetIndex++;
      currentSheetGrid = new SheetGrid(sheet.width, sheet.height);
      console.log("Moving to sheet", currentSheetIndex);
      
      // Try to place on the new sheet
      const newPosition = findBestPosition(piece, currentSheetGrid, sheet);
      
      if (newPosition) {
        const placedPiece: PlacedPiece = {
          ...piece,
          x: newPosition.x,
          y: newPosition.y,
          rotated: newPosition.rotated,
          width: newPosition.rotated ? piece.height : piece.width,
          height: newPosition.rotated ? piece.width : piece.height,
          sheetIndex: currentSheetIndex
        };
        
        // Double-check there's no overlap (safety check)
        if (!currentSheetGrid.isAreaAvailable(newPosition.x, newPosition.y, placedPiece.width, placedPiece.height, sheet.cutWidth)) {
          console.error("Overlap detected for piece on new sheet", placedPiece);
          continue; // Skip this piece if there's an overlap
        }
        
        // Mark the area as occupied
        currentSheetGrid.occupyArea(newPosition.x, newPosition.y, placedPiece.width, placedPiece.height);
        
        placedPieces.push(placedPiece);
      }
    }
  }
  
  console.log("Optimization complete. Placed", placedPieces.length, "pieces on", currentSheetIndex + 1, "sheets");
  return placedPieces;
};
