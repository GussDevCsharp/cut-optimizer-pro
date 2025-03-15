
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
