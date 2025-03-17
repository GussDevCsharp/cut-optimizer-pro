
import { Piece, PlacedPiece, Sheet } from '../../hooks/useSheetData';
import { SheetGrid } from './SheetGrid';
import { generatePastelColor } from './colorUtils';
import { sortPiecesByArea, findBestPosition } from './positionUtils';

// Main optimization function that handles multiple sheets and prioritizes filling existing sheets
export const optimizeCutting = (
  pieces: Piece[],
  sheet: Sheet
): PlacedPiece[] => {
  console.time('optimization');
  console.log("Starting optimization with", pieces.length, "piece types");
  
  // Sort pieces by area (largest first) - critical for optimal packing
  const sortedPieces = sortPiecesByArea(pieces);
  const placedPieces: PlacedPiece[] = [];
  
  // Expand pieces based on quantity - do this more efficiently
  const expandedPieces: Piece[] = [];
  for (const piece of sortedPieces) {
    for (let i = 0; i < piece.quantity; i++) {
      expandedPieces.push({
        ...piece,
        color: piece.color || generatePastelColor()
      });
    }
  }
  
  console.log("Total pieces to place:", expandedPieces.length);
  
  // Initialize sheet grids array with the first sheet - use a more efficient approach
  const sheetGrids: SheetGrid[] = [new SheetGrid(sheet.width, sheet.height, sheet.cutWidth)];
  
  // Try to place each piece with improved performance
  for (let i = 0; i < expandedPieces.length; i++) {
    const piece = expandedPieces[i];
    let placed = false;
    
    // Try to place on existing sheets, starting from the first sheet
    for (let sheetIndex = 0; sheetIndex < sheetGrids.length; sheetIndex++) {
      // Use the optimized findBestPosition function
      const position = findBestPosition(piece, sheetGrids[sheetIndex]);
      
      if (position) {
        // Calculate actual dimensions after potential rotation
        const placedWidth = position.rotated ? piece.height : piece.width;
        const placedHeight = position.rotated ? piece.width : piece.height;
        
        // Place on this sheet without redundant checks
        const placedPiece: PlacedPiece = {
          ...piece,
          x: position.x,
          y: position.y,
          rotated: position.rotated,
          width: placedWidth,
          height: placedHeight,
          sheetIndex: sheetIndex,
          color: piece.color || generatePastelColor(),
        };
        
        // Mark the area as occupied - this is now handled more efficiently in SheetGrid
        sheetGrids[sheetIndex].occupyArea(position.x, position.y, placedPiece.width, placedPiece.height);
        placedPieces.push(placedPiece);
        placed = true;
        
        // Only log occasionally to reduce overhead
        if (i < 5 || i % 100 === 0) {
          console.log(`Placed piece ${i+1}/${expandedPieces.length} on sheet ${sheetIndex}`);
        }
        
        break; // Move to the next piece
      }
    }
    
    // If not placed on any existing sheet, create a new sheet
    if (!placed) {
      const newSheetIndex = sheetGrids.length;
      const newSheetGrid = new SheetGrid(sheet.width, sheet.height, sheet.cutWidth);
      sheetGrids.push(newSheetGrid);
      
      // Try to place on the new sheet
      const newPosition = findBestPosition(piece, newSheetGrid);
      
      if (newPosition) {
        // Calculate actual dimensions after potential rotation
        const placedWidth = newPosition.rotated ? piece.height : piece.width;
        const placedHeight = newPosition.rotated ? piece.width : piece.height;
        
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
        
        console.log(`Created new sheet ${newSheetIndex} for piece ${i+1}/${expandedPieces.length}`);
      } else {
        console.warn(`Failed to place piece ${i+1}/${expandedPieces.length}`);
      }
    }
    
    // Early progress reporting for better UX
    if (expandedPieces.length > 50 && i % 20 === 0) {
      const progress = Math.round((i / expandedPieces.length) * 100);
      console.log(`Optimization progress: ${progress}%`);
    }
  }
  
  console.log("Optimization complete. Placed", placedPieces.length, "pieces on", sheetGrids.length, "sheets");
  console.timeEnd('optimization');
  
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
