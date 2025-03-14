
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
  // Add cut width to piece dimensions
  const pieceWithCut = {
    x: piece.x,
    y: piece.y,
    width: piece.width + cutWidth,
    height: piece.height + cutWidth
  };

  for (const placedPiece of placedPieces) {
    // Add cut width to placed piece dimensions
    const placedWithCut = {
      x: placedPiece.x,
      y: placedPiece.y,
      width: placedPiece.width + cutWidth,
      height: placedPiece.height + cutWidth
    };

    // Check if pieces overlap
    if (
      pieceWithCut.x < placedWithCut.x + placedWithCut.width &&
      pieceWithCut.x + pieceWithCut.width > placedWithCut.x &&
      pieceWithCut.y < placedWithCut.y + placedWithCut.height &&
      pieceWithCut.y + pieceWithCut.height > placedWithCut.y
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
  // Try both rotations if allowed
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
    // Create a grid of possible positions (for optimization, we could check fewer positions)
    for (let y = 0; y <= sheet.height - orientation.height; y += sheet.cutWidth) {
      for (let x = 0; x <= sheet.width - orientation.width; x += sheet.cutWidth) {
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

// Main optimization function
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
  
  // Place each piece
  for (const piece of expandedPieces) {
    const position = findBestPosition(piece, placedPieces, sheet);
    
    if (position) {
      const placedPiece: PlacedPiece = {
        ...piece,
        x: position.x,
        y: position.y,
        rotated: position.rotated,
        width: position.rotated ? piece.height : piece.width,
        height: position.rotated ? piece.width : piece.height
      };
      
      placedPieces.push(placedPiece);
    }
  }
  
  return placedPieces;
};
