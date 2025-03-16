
import { Piece, PlacedPiece, Sheet } from '../hooks/useSheetData';

// Helper function to generate a random pastel color
const generatePastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

// Check if a piece at given position would overlap with existing placed pieces
const checkOverlap = (
  piece: { width: number; height: number; x: number; y: number }, 
  placedPieces: PlacedPiece[]
): boolean => {
  for (const placedPiece of placedPieces) {
    // Use strict overlap detection - even a 0.1 unit overlap is not allowed
    if (
      piece.x < placedPiece.x + placedPiece.width &&
      piece.x + piece.width > placedPiece.x &&
      piece.y < placedPiece.y + placedPiece.height &&
      piece.y + piece.height > placedPiece.y
    ) {
      return true; // Overlap detected
    }
  }
  return false; // No overlap
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

// Find the best position for a new piece using a more precise algorithm
const findBestPosition = (
  piece: Piece,
  placedPieces: PlacedPiece[],
  sheet: Sheet
): { x: number; y: number; rotated: boolean } | null => {
  // Always try both orientations to maximize sheet usage
  const orientations = [
    { width: piece.width, height: piece.height, rotated: false },
    { width: piece.height, height: piece.width, rotated: true }
  ];

  let bestFit = null;
  let bestY = sheet.height;
  let bestX = sheet.width;

  // Consider all possible positions to avoid any overlaps
  for (const orientation of orientations) {
    // Try all positions with the precision of cutWidth
    for (let y = 0; y <= sheet.height - orientation.height; y += sheet.cutWidth) {
      for (let x = 0; x <= sheet.width - orientation.width; x += sheet.cutWidth) {
        const testPiece = {
          ...orientation,
          x,
          y
        };

        // Double-check to ensure no overlap with existing pieces and within boundaries
        if (!checkOverlap(testPiece, placedPieces) && checkBoundaries(testPiece, sheet)) {
          // Use top-left strategy - find the topmost position, then the leftmost
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

// Main optimization function that can handle multiple sheets
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
      
      // Verify one more time there's no overlap before adding
      if (!checkOverlap(placedPiece, currentSheetPieces)) {
        placedPieces.push(placedPiece);
        currentSheetPieces.push(placedPiece);
      } else {
        // This is a fallback - if somehow we still have an overlap, move to new sheet
        currentSheetIndex++;
        currentSheetPieces = [];
        
        // Try on new sheet with no other pieces
        const newPosition = findBestPosition(piece, [], sheet);
        if (newPosition) {
          const newPlacedPiece: PlacedPiece = {
            ...piece,
            x: newPosition.x,
            y: newPosition.y,
            rotated: newPosition.rotated,
            width: newPosition.rotated ? piece.height : piece.width,
            height: newPosition.rotated ? piece.width : piece.height,
            sheetIndex: currentSheetIndex
          };
          
          placedPieces.push(newPlacedPiece);
          currentSheetPieces.push(newPlacedPiece);
        }
      }
    } else {
      // Move to a new sheet
      currentSheetIndex++;
      currentSheetPieces = [];
      
      // Try to place on the new sheet
      const newPosition = findBestPosition(piece, [], sheet);
      
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
