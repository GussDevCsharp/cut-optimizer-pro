
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
  for (const placedPiece of placedPieces) {
    // Check if pieces overlap considering the cut width
    if (
      piece.x < placedPiece.x + placedPiece.width + cutWidth &&
      piece.x + piece.width + cutWidth > placedPiece.x &&
      piece.y < placedPiece.y + placedPiece.height + cutWidth &&
      piece.y + piece.height + cutWidth > placedPiece.y
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

// Find the best position for a new piece
const findBestPosition = (
  piece: Piece,
  placedPieces: PlacedPiece[],
  sheet: Sheet
): { x: number; y: number; rotated: boolean } | null => {
  // Try both orientations - always check rotation regardless of canRotate setting
  // We'll always try both orientations for optimal placement
  const orientations = [
    { width: piece.width, height: piece.height, rotated: false },
    { width: piece.height, height: piece.width, rotated: true }
  ];

  let bestFit = null;
  let bestY = sheet.height;
  let bestX = sheet.width;

  // Strategy: find the topmost, then leftmost position where the piece fits
  for (const orientation of orientations) {
    // Create a grid of possible positions with cutWidth as step size
    for (let y = 0; y <= sheet.height - orientation.height; y += 1) {
      for (let x = 0; x <= sheet.width - orientation.width; x += 1) {
        const testPiece = {
          ...orientation,
          x,
          y
        };

        if (
          !checkOverlap(testPiece, placedPieces, sheet.cutWidth) &&
          checkBoundaries(testPiece, sheet)
        ) {
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
  let currentSheetPieces: PlacedPiece[] = [];
  
  for (const piece of expandedPieces) {
    // Try to place on current sheet
    const position = findBestPosition(piece, currentSheetPieces, sheet);
    
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
      
      placedPieces.push(placedPiece);
      currentSheetPieces.push(placedPiece);
    } else {
      // Move to a new sheet
      currentSheetIndex++;
      currentSheetPieces = [];
      
      // Try to place on the new sheet
      const newPosition = findBestPosition(piece, currentSheetPieces, sheet);
      
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
        
        placedPieces.push(placedPiece);
        currentSheetPieces.push(placedPiece);
      }
    }
  }
  
  return placedPieces;
};
