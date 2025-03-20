
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
  
  // First, sort pieces by area (largest first) and group similar pieces
  const groupedPieces = groupSimilarPieces(pieces);
  const placedPieces: PlacedPiece[] = [];
  
  // Pre-allocate all pieces array based on quantities
  const expandedPieces: Piece[] = [];
  let totalPieces = 0;
  
  // Map for quick lookup of similar pieces by dimension
  const dimensionMap = new Map<string, Piece[]>();
  
  // Precompute the expanded pieces and dimension maps - optimization
  groupedPieces.forEach(piece => {
    totalPieces += piece.quantity;
    
    // Create key for quick lookup
    const normalKey = `${piece.width}x${piece.height}`;
    const rotatedKey = piece.canRotate ? `${piece.height}x${piece.width}` : normalKey;
    
    if (!dimensionMap.has(normalKey)) {
      dimensionMap.set(normalKey, []);
    }
    if (piece.canRotate && normalKey !== rotatedKey && !dimensionMap.has(rotatedKey)) {
      dimensionMap.set(rotatedKey, []);
    }
    
    // Expand pieces based on quantity
    for (let i = 0; i < piece.quantity; i++) {
      const coloredPiece = {
        ...piece,
        color: piece.color || generatePastelColor()
      };
      expandedPieces.push(coloredPiece);
      
      // Add to dimension maps for quick lookup
      dimensionMap.get(normalKey)?.push(coloredPiece);
      if (piece.canRotate && normalKey !== rotatedKey) {
        dimensionMap.get(rotatedKey)?.push(coloredPiece);
      }
    }
  });
  
  console.log("Total pieces to place:", expandedPieces.length);
  
  // Initialize a single sheet grid to start with
  const sheetGrids: SheetGrid[] = [new SheetGrid(sheet.width, sheet.height)];
  
  // Cache sheet dimensions to avoid property lookups
  const sheetWidth = sheet.width;
  const sheetHeight = sheet.height;
  
  // Process pieces in optimal order
  for (const piece of expandedPieces) {
    let placed = false;
    
    // Get the width and height once
    const pieceWidth = piece.width;
    const pieceHeight = piece.height;
    const canRotate = piece.canRotate;
    
    // Try to place on existing sheets
    for (let sheetIndex = 0; sheetIndex < sheetGrids.length; sheetIndex++) {
      const currentGrid = sheetGrids[sheetIndex];
      
      // Filter placed pieces to only those on the current sheet - optimization
      // Only compute this once per sheet, not for every position check
      const currentSheetPieces = placedPieces.filter(p => p.sheetIndex === sheetIndex);
      
      // Find the best position on this sheet
      const position = findBestPosition(
        piece, 
        currentGrid, 
        sheet, 
        currentSheetPieces, 
        false // No spacing between pieces
      );
      
      if (position) {
        // Calculate dimensions based on rotation - only calculate once
        const finalWidth = position.rotated ? pieceHeight : pieceWidth;
        const finalHeight = position.rotated ? pieceWidth : pieceHeight;
        
        // Place the piece
        const placedPiece: PlacedPiece = {
          ...piece,
          x: position.x,
          y: position.y,
          rotated: position.rotated,
          width: finalWidth,
          height: finalHeight,
          sheetIndex: sheetIndex
        };
        
        // Mark the area as occupied
        currentGrid.occupyArea(position.x, position.y, finalWidth, finalHeight);
        placedPieces.push(placedPiece);
        placed = true;
        
        if (placedPieces.length < 5) { // Only log for the first few pieces
          console.log(`Placed piece ${finalWidth}x${finalHeight} at (${position.x},${position.y}) on sheet ${sheetIndex}, rotated: ${position.rotated}`);
        }
        
        break; // Move to the next piece
      }
    }
    
    // If not placed on any existing sheet, create a new sheet
    if (!placed) {
      const newSheetIndex = sheetGrids.length;
      const newSheetGrid = new SheetGrid(sheetWidth, sheetHeight);
      sheetGrids.push(newSheetGrid);
      
      // Try to place on the new sheet
      const newPosition = findBestPosition(piece, newSheetGrid, sheet, [], false);
      
      if (newPosition) {
        const finalWidth = newPosition.rotated ? pieceHeight : pieceWidth;
        const finalHeight = newPosition.rotated ? pieceWidth : pieceHeight;
        
        const placedPiece: PlacedPiece = {
          ...piece,
          x: newPosition.x,
          y: newPosition.y,
          rotated: newPosition.rotated,
          width: finalWidth,
          height: finalHeight,
          sheetIndex: newSheetIndex
        };
        
        // Mark the area as occupied
        newSheetGrid.occupyArea(newPosition.x, newPosition.y, finalWidth, finalHeight);
        placedPieces.push(placedPiece);
      } else {
        console.warn(`Failed to place piece ${pieceWidth}x${pieceHeight} even on a new sheet!`);
      }
    }
  }
  
  console.log("Optimization complete. Placed", placedPieces.length, "pieces on", sheetGrids.length, "sheets");
  return placedPieces;
};
