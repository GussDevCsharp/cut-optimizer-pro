
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
    const startX = Math.max(0, x - cutWidth);
    const startY = Math.max(0, y - cutWidth);
    const endX = Math.min(this.width - 1, x + pieceWidth + cutWidth);
    const endY = Math.min(this.height - 1, y + pieceHeight + cutWidth);
    
    // Check each cell in the grid
    for (let i = startY; i <= endY; i++) {
      for (let j = startX; j <= endX; j++) {
        if (this.grid[i][j]) {
          return false; // Area is already occupied
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
}

// Sort pieces by area (largest first) to improve packing efficiency
const sortPiecesByArea = (pieces: Piece[]): Piece[] => {
  return [...pieces].sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });
};

// Find the best position for a new piece using the sheet grid
const findBestPosition = (
  piece: Piece,
  sheetGrid: SheetGrid,
  sheet: Sheet
): { x: number; y: number; rotated: boolean } | null => {
  // Try both orientations regardless of canRotate setting for optimal placement
  const orientations = [
    { width: piece.width, height: piece.height, rotated: false },
    { width: piece.height, height: piece.width, rotated: true }
  ];

  let bestFit = null;
  let bestY = sheet.height;
  let bestX = sheet.width;

  // Strategy: find the topmost, then leftmost position where the piece fits
  for (const orientation of orientations) {
    // Create a grid of possible positions
    for (let y = 0; y <= sheet.height - orientation.height; y += 1) {
      for (let x = 0; x <= sheet.width - orientation.width; x += 1) {
        if (sheetGrid.isAreaAvailable(x, y, orientation.width, orientation.height, sheet.cutWidth)) {
          // Found a valid position - check if it's better than our current best
          if (y < bestY || (y === bestY && x < bestX)) {
            bestY = y;
            bestX = x;
            bestFit = { x, y, rotated: orientation.rotated };
          }
        }
      }
    }
  }

  return bestFit;
};

// Main optimization function that handles multiple sheets
export const optimizeCutting = (
  pieces: Piece[],
  sheet: Sheet
): PlacedPiece[] => {
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
      
      // Mark the area as occupied
      currentSheetGrid.occupyArea(position.x, position.y, placedPiece.width, placedPiece.height);
      
      placedPieces.push(placedPiece);
    } else {
      // Move to a new sheet
      currentSheetIndex++;
      currentSheetGrid = new SheetGrid(sheet.width, sheet.height);
      
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
        
        // Mark the area as occupied
        currentSheetGrid.occupyArea(newPosition.x, newPosition.y, placedPiece.width, placedPiece.height);
        
        placedPieces.push(placedPiece);
      }
    }
  }
  
  return placedPieces;
};
