
import { Piece, PlacedPiece, Sheet } from "./types";
import { generatePastelColor } from "./colorUtils";
import { sortPiecesByArea } from "./pieceUtils";
import { createGrid, markPieceOnGrid } from "./gridUtils";
import { findBestPosition } from "./positionFinder";

// Main optimization function that can handle multiple sheets
export const optimizeCutting = (
  pieces: Piece[],
  sheet: Sheet
): PlacedPiece[] => {
  console.time('optimizeCutting');
  
  // Pre-sort pieces by area (largest first) for better packing
  const sortedPieces = sortPiecesByArea(pieces);
  const placedPieces: PlacedPiece[] = [];
  
  // Prepare pieces array with expanded quantity
  const expandedPieces: Piece[] = [];
  sortedPieces.forEach(piece => {
    // Pre-calculate and cache colors
    const color = piece.color || generatePastelColor();
    for (let i = 0; i < piece.quantity; i++) {
      expandedPieces.push({
        ...piece,
        color
      });
    }
  });
  
  // Cache values that don't change during the algorithm
  let currentSheetIndex = 0;
  const sheetWidth = sheet.width;
  let currentSheetGrid = createGrid(sheet);
  
  // Place each piece optimally
  for (const piece of expandedPieces) {
    // Try to place on current sheet with fast position finder
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
