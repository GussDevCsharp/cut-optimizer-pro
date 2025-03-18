
import { Piece, PlacedPiece, Sheet } from '../../hooks/useSheetData';
import { SheetGrid } from './SheetGrid';
import { generatePastelColor } from './colorUtils';
import { sortPiecesByArea, findBestPosition } from './positionUtils';

// Main optimization function with performance improvements
export const optimizeCutting = (
  pieces: Piece[],
  sheet: Sheet
): PlacedPiece[] => {
  console.log("Starting optimization with", pieces.length, "piece types");
  
  // Sort pieces by area (largest first)
  const sortedPieces = sortPiecesByArea(pieces);
  const placedPieces: PlacedPiece[] = [];
  
  // Separate problematic pieces for special handling
  const priorityPieces: Piece[] = [];
  const normalPieces: Piece[] = [];
  
  // Identify problematic pieces (200x275 or similar)
  sortedPieces.forEach(piece => {
    const isPriority = (piece.width === 200 && piece.height === 275) || 
                      (piece.width === 275 && piece.height === 200);
    if (isPriority) {
      priorityPieces.push(piece);
    } else {
      normalPieces.push(piece);
    }
  });
  
  // Expand pieces based on quantity, starting with priority pieces
  const expandedPieces: Piece[] = [];
  
  // Process priority pieces first
  priorityPieces.forEach(piece => {
    for (let i = 0; i < piece.quantity; i++) {
      expandedPieces.push({
        ...piece,
        color: piece.color || generatePastelColor()
      });
    }
  });
  
  // Process normal pieces
  normalPieces.forEach(piece => {
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
  
  // Use a counter to reduce excessive logging
  let placementCounter = 0;
  
  // Try to place each piece
  for (const piece of expandedPieces) {
    let placed = false;
    placementCounter++;
    
    // Check if this is a problematic piece
    const isPriority = (piece.width === 200 && piece.height === 275) || 
                       (piece.width === 275 && piece.height === 200);
    
    // Only log important pieces or every 10th piece to reduce console output
    if (isPriority || placementCounter % 10 === 0) {
      console.log(`Trying to place ${isPriority ? 'priority ' : ''}piece ${piece.width}x${piece.height}, piece #${placementCounter}`);
    }
    
    // Try to place on existing sheets, starting from the first sheet
    for (let sheetIndex = 0; sheetIndex < sheetGrids.length; sheetIndex++) {
      const position = findBestPosition(piece, sheetGrids[sheetIndex], sheet);
      
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
        
        // Only log priority pieces or first few pieces to reduce output
        if (isPriority || placementCounter <= 5) {
          console.log(`Placed ${isPriority ? 'PRIORITY ' : ''}piece ${placedPiece.width}x${placedPiece.height} at (${position.x},${position.y}) on sheet ${sheetIndex}, rotated: ${position.rotated}`);
        }
        
        break; // Move to the next piece
      }
    }
    
    // If not placed on any existing sheet, create a new sheet
    if (!placed) {
      const newSheetIndex = sheetGrids.length;
      const newSheetGrid = new SheetGrid(sheet.width, sheet.height);
      sheetGrids.push(newSheetGrid);
      
      // Log new sheet creation
      console.log(`Created new sheet: ${newSheetIndex} for ${isPriority ? 'PRIORITY ' : ''}piece ${piece.width}x${piece.height}`);
      
      // Try to place on the new sheet
      const newPosition = findBestPosition(piece, newSheetGrid, sheet);
      
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
        
        console.log(`Placed ${isPriority ? 'PRIORITY ' : ''}piece ${placedPiece.width}x${placedPiece.height} at (${newPosition.x},${newPosition.y}) on new sheet ${newSheetIndex}, rotated: ${newPosition.rotated}`);
      } else {
        console.warn(`Failed to place ${isPriority ? 'PRIORITY ' : ''}piece ${piece.width}x${piece.height} even on a new sheet!`);
      }
    }
  }
  
  // Quick final overlap check
  console.log("Running final overlap check...");
  let hasOverlap = false;
  
  // Only check for overlaps on a sample of pieces to improve performance
  const sampleSize = Math.min(placedPieces.length, 20);
  for (let i = 0; i < sampleSize; i++) {
    const randomIndex = Math.floor(Math.random() * placedPieces.length);
    const pieceA = placedPieces[randomIndex];
    
    for (let j = 0; j < placedPieces.length; j++) {
      if (i === j) continue;
      
      const pieceB = placedPieces[j];
      if (pieceA.sheetIndex !== pieceB.sheetIndex) continue;
      
      // Check for overlap between pieceA and pieceB
      if (pieceA.x < pieceB.x + pieceB.width && 
          pieceA.x + pieceA.width > pieceB.x && 
          pieceA.y < pieceB.y + pieceB.height && 
          pieceA.y + pieceA.height > pieceB.y) {
        console.error(`OVERLAP DETECTED: Piece at (${pieceA.x},${pieceA.y}) overlaps with piece at (${pieceB.x},${pieceB.y}) on sheet ${pieceA.sheetIndex}`);
        hasOverlap = true;
        break;
      }
    }
    
    if (hasOverlap) break;
  }
  
  if (hasOverlap) {
    console.error("WARNING: Overlaps detected in sample check. Algorithm may need further improvements.");
  } else {
    console.log("Final check complete: No overlaps detected in sample.");
  }
  
  console.log("Optimization complete. Placed", placedPieces.length, "pieces on", sheetGrids.length, "sheets");
  return placedPieces;
};
