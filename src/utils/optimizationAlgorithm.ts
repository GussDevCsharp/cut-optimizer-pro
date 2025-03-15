
import { Piece, PlacedPiece, Sheet } from '../hooks/useSheetData';

// Helper function to generate a random pastel color
const generatePastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

// Check if a piece at given position would overlap with existing placed pieces
const checkOverlap = (
  piece: { width: number; height: number; x: number; y: number }, 
  placedPieces: PlacedPiece[], 
  cutWidth: number
): boolean => {
  // Account for cut width in checking overlaps
  const adjustedPiece = {
    x: piece.x - cutWidth/2,
    y: piece.y - cutWidth/2,
    width: piece.width + cutWidth,
    height: piece.height + cutWidth
  };
  
  for (const placedPiece of placedPieces) {
    const adjustedPlacedPiece = {
      x: placedPiece.x - cutWidth/2,
      y: placedPiece.y - cutWidth/2,
      width: placedPiece.width + cutWidth,
      height: placedPiece.height + cutWidth
    };
    
    // Check if pieces overlap
    if (
      adjustedPiece.x < adjustedPlacedPiece.x + adjustedPlacedPiece.width &&
      adjustedPiece.x + adjustedPiece.width > adjustedPlacedPiece.x &&
      adjustedPiece.y < adjustedPlacedPiece.y + adjustedPlacedPiece.height &&
      adjustedPiece.y + adjustedPiece.height > adjustedPlacedPiece.y
    ) {
      return true;
    }
  }
  return false;
};

// Check if a piece fits within the sheet boundaries
const checkBoundaries = (
  piece: { width: number; height: number; x: number; y: number }, 
  sheet: Sheet
): boolean => {
  return (
    piece.x >= 0 &&
    piece.y >= 0 &&
    piece.x + piece.width <= sheet.width &&
    piece.y + piece.height <= sheet.height
  );
};

// Sort pieces by area (largest first) to improve packing efficiency
const sortPiecesByArea = (pieces: Piece[]): Piece[] => {
  return [...pieces].sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });
};

// Create a grid representation of the sheet to track occupied spaces
const createGrid = (sheet: Sheet, cutWidth: number): boolean[][] => {
  // Create a grid where each cell represents 1mm×1mm
  const grid: boolean[][] = [];
  for (let y = 0; y < sheet.height; y++) {
    grid[y] = new Array(sheet.width).fill(false);
  }
  return grid;
};

// Mark a placed piece on the grid as occupied
const markPieceOnGrid = (
  grid: boolean[][],
  piece: { x: number; y: number; width: number; height: number },
  cutWidth: number
): void => {
  const endX = Math.min(piece.x + piece.width + cutWidth, grid[0].length);
  const endY = Math.min(piece.y + piece.height + cutWidth, grid.length);
  
  for (let y = Math.max(0, piece.y - cutWidth); y < endY; y++) {
    for (let x = Math.max(0, piece.x - cutWidth); x < endX; x++) {
      if (y < grid.length && x < grid[0].length) {
        grid[y][x] = true;
      }
    }
  }
};

// Check if a piece can be placed at a specific position using the grid
const canPlacePieceAtPosition = (
  grid: boolean[][],
  piece: { x: number; y: number; width: number; height: number },
  sheet: Sheet
): boolean => {
  // Check boundaries
  if (
    piece.x < 0 ||
    piece.y < 0 ||
    piece.x + piece.width > sheet.width ||
    piece.y + piece.height > sheet.height
  ) {
    return false;
  }
  
  // Check if all required cells are available
  for (let y = piece.y; y < piece.y + piece.height; y++) {
    for (let x = piece.x; x < piece.x + piece.width; x++) {
      if (y >= grid.length || x >= grid[0].length || grid[y][x]) {
        return false;
      }
    }
  }
  
  return true;
};

// Find the best position for a new piece
const findBestPosition = (
  piece: Piece,
  grid: boolean[][],
  sheet: Sheet
): { x: number; y: number; rotated: boolean } | null => {
  // Try both orientations if canRotate is true
  const orientations = piece.canRotate 
    ? [
        { width: piece.width, height: piece.height, rotated: false },
        { width: piece.height, height: piece.width, rotated: true }
      ]
    : [
        { width: piece.width, height: piece.height, rotated: false }
      ];

  let bestFit = null;
  let bestY = sheet.height;
  let bestX = sheet.width;

  // Strategy: find the topmost, then leftmost position where the piece fits
  for (const orientation of orientations) {
    // Try each position in the grid
    for (let y = 0; y <= sheet.height - orientation.height; y++) {
      for (let x = 0; x <= sheet.width - orientation.width; x++) {
        const testPiece = {
          ...orientation,
          x,
          y
        };

        if (canPlacePieceAtPosition(grid, testPiece, sheet)) {
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

// Main optimization function that can now handle multiple sheets
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
  let currentSheetGrid = createGrid(sheet, sheet.cutWidth);
  let currentSheetPieces: PlacedPiece[] = [];
  
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
      
      // Mark the piece on the grid
      markPieceOnGrid(currentSheetGrid, placedPiece, sheet.cutWidth);
      
      placedPieces.push(placedPiece);
      currentSheetPieces.push(placedPiece);
    } else {
      // Move to a new sheet
      currentSheetIndex++;
      currentSheetGrid = createGrid(sheet, sheet.cutWidth);
      currentSheetPieces = [];
      
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
        
        // Mark the piece on the grid
        markPieceOnGrid(currentSheetGrid, placedPiece, sheet.cutWidth);
        
        placedPieces.push(placedPiece);
        currentSheetPieces.push(placedPiece);
      }
    }
  }
  
  return placedPieces;
};
