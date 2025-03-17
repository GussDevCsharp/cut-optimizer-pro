
import { Piece, PlacedPiece, Sheet } from '../../hooks/useSheetData';
import { SheetGrid } from './SheetGrid';
import { generatePastelColor } from './colorUtils';
import { sortPiecesByArea, findBestPosition } from './positionUtils';

// Main optimization function that handles multiple sheets and prioritizes filling existing sheets
export const optimizeCutting = (
  pieces: Piece[],
  sheet: Sheet
): PlacedPiece[] => {
  console.log("Starting optimization with", pieces.length, "piece types");
  
  // Sort pieces by area (largest first)
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
  
  // Initialize sheet grids array with the first sheet
  const sheetGrids: SheetGrid[] = [new SheetGrid(sheet.width, sheet.height)];
  
  // Track z-order index to ensure larger pieces are placed first and remain visible
  let zIndex = expandedPieces.length;
  
  // Try to place each piece
  for (const piece of expandedPieces) {
    let placed = false;
    
    // Try to place on existing sheets, starting from the first sheet
    for (let sheetIndex = 0; sheetIndex < sheetGrids.length; sheetIndex++) {
      const position = findBestPosition(piece, sheetGrids[sheetIndex], sheet);
      
      if (position) {
        // Calculate actual dimensions after potential rotation
        const placedWidth = position.rotated ? piece.height : piece.width;
        const placedHeight = position.rotated ? piece.width : piece.height;
        
        // Double-check that the placement is valid with these dimensions
        if (!sheetGrids[sheetIndex].isAreaAvailable(position.x, position.y, placedWidth, placedHeight, sheet.cutWidth)) {
          console.warn(`Position validation failed for piece ${piece.width}x${piece.height} at (${position.x},${position.y}), sheet ${sheetIndex}`);
          continue;
        }
        
        // Place on this sheet
        const placedPiece: PlacedPiece = {
          ...piece,
          x: position.x,
          y: position.y,
          rotated: position.rotated,
          width: placedWidth,
          height: placedHeight,
          sheetIndex: sheetIndex,
          // Add a z-index property to the piece to control layering order
          // Larger pieces (placed first) should appear behind smaller pieces
          color: piece.color || generatePastelColor(),
        };
        
        // Mark the area as occupied
        sheetGrids[sheetIndex].occupyArea(position.x, position.y, placedPiece.width, placedPiece.height);
        placedPieces.push(placedPiece);
        placed = true;
        zIndex--; // Decrement z-index for next piece
        
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
      
      // Try to place on the new sheet
      const newPosition = findBestPosition(piece, newSheetGrid, sheet);
      
      if (newPosition) {
        // Calculate actual dimensions after potential rotation
        const placedWidth = newPosition.rotated ? piece.height : piece.width;
        const placedHeight = newPosition.rotated ? piece.width : piece.height;
        
        // Double-check that the placement is valid with these dimensions
        if (!newSheetGrid.isAreaAvailable(newPosition.x, newPosition.y, placedWidth, placedHeight, sheet.cutWidth)) {
          console.warn(`New sheet position validation failed for piece ${piece.width}x${piece.height}`);
          continue; // Skip this piece if there's an invalid position
        }
        
        const placedPiece: PlacedPiece = {
          ...piece,
          x: newPosition.x,
          y: newPosition.y,
          rotated: newPosition.rotated,
          width: placedWidth,
          height: placedHeight,
          sheetIndex: newSheetIndex,
          color: piece.color || generatePastelColor(),
        };
        
        // Mark the area as occupied
        newSheetGrid.occupyArea(newPosition.x, newPosition.y, placedPiece.width, placedPiece.height);
        placedPieces.push(placedPiece);
        zIndex--; // Decrement z-index for next piece
        
        console.log(`Placed piece ${placedPiece.width}x${placedPiece.height} at (${newPosition.x},${newPosition.y}) on new sheet ${newSheetIndex}, rotated: ${newPosition.rotated}`);
      } else {
        console.warn(`Failed to place piece ${piece.width}x${piece.height} even on a new sheet!`);
      }
    }
  }
  
  console.log("Optimization complete. Placed", placedPieces.length, "pieces on", sheetGrids.length, "sheets");
  
  // Sort the pieces to ensure proper z-index rendering (larger pieces behind smaller ones)
  return placedPieces.sort((a, b) => {
    // First sort by sheet index
    if (a.sheetIndex !== b.sheetIndex) {
      return a.sheetIndex - b.sheetIndex;
    }
    
    // Then sort by area (larger pieces should be placed first/behind)
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });
};
