
import { Piece, PlacedPiece, Sheet } from '../../hooks/useSheetData';
import { SheetGrid } from './SheetGrid';
import { generatePastelColor } from './colorUtils';
import { sortPiecesByArea, findBestPosition, groupSimilarPieces } from './positionUtils';

// Main optimization function that handles multiple sheets and prioritizes filling existing sheets
export const optimizeCutting = (
  pieces: Piece[],
  sheet: Sheet
): PlacedPiece[] => {
  console.log("Starting optimization with", pieces.length, "piece types");
  
  // Sort and group similar pieces together for more efficient cutting
  const groupedPieces = groupSimilarPieces(pieces);
  const placedPieces: PlacedPiece[] = [];
  
  // Expand pieces based on quantity
  const expandedPieces: Piece[] = [];
  groupedPieces.forEach(piece => {
    for (let i = 0; i < piece.quantity; i++) {
      expandedPieces.push({
        ...piece,
        color: piece.color || generatePastelColor()
      });
    }
  });
  
  console.log("Total pieces to place:", expandedPieces.length);
  
  // Initialize sheet grids array with the first sheet
  const sheetGrids: SheetGrid[] = [new SheetGrid(sheet.width, sheet.height)];
  
  // Try to place each piece
  for (const piece of expandedPieces) {
    let placed = false;
    
    // Try to place on existing sheets, starting from the first sheet
    for (let sheetIndex = 0; sheetIndex < sheetGrids.length; sheetIndex++) {
      // Filter placed pieces to only those on the current sheet
      const currentSheetPieces = placedPieces.filter(p => p.sheetIndex === sheetIndex);
      
      const position = findBestPosition(
        piece, 
        sheetGrids[sheetIndex], 
        sheet, 
        currentSheetPieces, 
        false // Set adjacency to false to eliminate spaces
      );
      
      if (position) {
        // Place on this sheet
        const placedPiece: PlacedPiece = {
          ...piece,
          x: position.x,
          y: position.y,
          rotated: position.rotated,
          width: position.rotated ? piece.height : piece.width,
          height: position.rotated ? piece.width : piece.height,
          sheetIndex: sheetIndex
        };
        
        // Mark the area as occupied
        sheetGrids[sheetIndex].occupyArea(position.x, position.y, placedPiece.width, placedPiece.height);
        placedPieces.push(placedPiece);
        placed = true;
        
        if (placedPieces.length < 5) { // Only log for first few pieces to avoid console spam
          console.log(`Placed piece ${placedPiece.width}x${placedPiece.height} at (${position.x},${position.y}) on sheet ${sheetIndex}, rotated: ${position.rotated}`);
        }
        
        break; // Move to the next piece
      }
    }
    
    // If not placed on any existing sheet, create a new sheet
    if (!placed) {
      const newSheetIndex = sheetGrids.length;
      const newSheetGrid = new SheetGrid(sheet.width, sheet.height);
      sheetGrids.push(newSheetGrid);
      
      console.log("Created new sheet:", newSheetIndex);
      
      // Try to place on the new sheet (no existing pieces yet)
      const newPosition = findBestPosition(piece, newSheetGrid, sheet, [], false);
      
      if (newPosition) {
        const placedPiece: PlacedPiece = {
          ...piece,
          x: newPosition.x,
          y: newPosition.y,
          rotated: newPosition.rotated,
          width: newPosition.rotated ? piece.height : piece.width,
          height: newPosition.rotated ? piece.width : piece.height,
          sheetIndex: newSheetIndex
        };
        
        // Mark the area as occupied
        newSheetGrid.occupyArea(newPosition.x, newPosition.y, placedPiece.width, placedPiece.height);
        placedPieces.push(placedPiece);
        
        console.log(`Placed piece ${placedPiece.width}x${placedPiece.height} at (${newPosition.x},${newPosition.y}) on new sheet ${newSheetIndex}, rotated: ${newPosition.rotated}`);
      } else {
        console.warn(`Failed to place piece ${piece.width}x${piece.height} even on a new sheet!`);
      }
    }
  }
  
  console.log("Optimization complete. Placed", placedPieces.length, "pieces on", sheetGrids.length, "sheets");
  return placedPieces;
};
