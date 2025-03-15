
import { Piece, PlacedPiece, Sheet } from '../hooks/useSheetData';

// Helper function to generate a random pastel color
const generatePastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

// Sort pieces by area (largest first) to improve packing efficiency
const sortPiecesByArea = (pieces: Piece[]): Piece[] => {
  return [...pieces].sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });
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

// Create a grid representation of the sheet to track occupied spaces
// Use a more efficient data structure - typed array for better performance
const createGrid = (sheet: Sheet): Uint8Array => {
  // Create a flat 1D array representing the grid
  return new Uint8Array(sheet.width * sheet.height);
};

// Mark a placed piece on the grid as occupied
const markPieceOnGrid = (
  grid: Uint8Array,
  piece: { x: number; y: number; width: number; height: number },
  sheetWidth: number,
  cutWidth: number
): void => {
  const startX = Math.max(0, piece.x - cutWidth);
  const startY = Math.max(0, piece.y - cutWidth);
  const endX = Math.min(piece.x + piece.width + cutWidth, sheetWidth);
  const endY = Math.min(piece.y + piece.height + cutWidth, sheetWidth);
  
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const index = y * sheetWidth + x;
      if (index >= 0 && index < grid.length) {
        grid[index] = 1;
      }
    }
  }
};

// Check if a piece can be placed at a specific position using the grid
const canPlacePieceAtPosition = (
  grid: Uint8Array,
  piece: { x: number; y: number; width: number; height: number },
  sheetWidth: number,
  sheet: Sheet
): boolean => {
  // Check boundaries first (quick rejection)
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
    // Fast scan of row using slice instead of nested loop
    const rowStartIndex = y * sheetWidth + piece.x;
    const rowEndIndex = rowStartIndex + piece.width;
    
    // Check if any cell in this row is occupied (value > 0)
    if (grid.slice(rowStartIndex, rowEndIndex).some(cell => cell > 0)) {
      return false;
    }
  }
  
  return true;
};

// Find the best position for a new piece using a faster algorithm
const findBestPosition = (
  piece: Piece,
  grid: Uint8Array,
  sheet: Sheet,
  sheetWidth: number
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

  // Optimize by scanning in larger increments initially
  const scanStep = 1; // We could increase this for even faster results, but might reduce quality
  
  // Strategy: find the topmost, then leftmost position where the piece fits
  for (const orientation of orientations) {
    // Skip this orientation if it's too large for the sheet
    if (orientation.width > sheet.width || orientation.height > sheet.height) {
      continue;
    }
    
    // Improved scanning algorithm: scan top to bottom, left to right
    for (let y = 0; y <= sheet.height - orientation.height; y += scanStep) {
      let rowFit = false;
      
      for (let x = 0; x <= sheet.width - orientation.width; x += scanStep) {
        const testPiece = {
          ...orientation,
          x,
          y
        };

        if (canPlacePieceAtPosition(grid, testPiece, sheetWidth, sheet)) {
          // Found a valid position - check if it's better than our current best
          if (y < bestY || (y === bestY && x < bestX)) {
            bestY = y;
            bestX = x;
            bestFit = { x, y, rotated: orientation.rotated };
            rowFit = true;
            break; // Found a position in this row, move to next row
          }
        }
      }
      
      if (rowFit && y < bestY) {
        break; // If we found a fit in an upper row, don't need to check lower rows
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
  console.time('optimizeCutting');
  
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
  const sheetWidth = sheet.width; // Cache this value
  let currentSheetGrid = createGrid(sheet);
  
  for (const piece of expandedPieces) {
    // Try to place on current sheet
    const position = findBestPosition(piece, currentSheetGrid, sheet, sheetWidth);
    
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
      markPieceOnGrid(currentSheetGrid, placedPiece, sheetWidth, sheet.cutWidth);
      
      placedPieces.push(placedPiece);
    } else {
      // Move to a new sheet
      currentSheetIndex++;
      currentSheetGrid = createGrid(sheet);
      
      // Try to place on the new sheet
      const newPosition = findBestPosition(piece, currentSheetGrid, sheet, sheetWidth);
      
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
        markPieceOnGrid(currentSheetGrid, placedPiece, sheetWidth, sheet.cutWidth);
        
        placedPieces.push(placedPiece);
      }
    }
  }
  
  console.timeEnd('optimizeCutting');
  return placedPieces;
};
