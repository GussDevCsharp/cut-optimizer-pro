
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
  
  // Priorize peças problemáticas (como 200x275)
  const priorityPieces: Piece[] = [];
  const normalPieces: Piece[] = [];
  
  // Identificar peças problemáticas
  sortedPieces.forEach(piece => {
    const isPriority = (piece.width === 200 && piece.height === 275) || 
                      (piece.width === 275 && piece.height === 200);
    if (isPriority) {
      priorityPieces.push(piece);
    } else {
      normalPieces.push(piece);
    }
  });
  
  // Expandir peças baseado na quantidade, começando pelas prioritárias
  const expandedPieces: Piece[] = [];
  
  // Primeiro as peças prioritárias
  priorityPieces.forEach(piece => {
    for (let i = 0; i < piece.quantity; i++) {
      expandedPieces.push({
        ...piece,
        color: piece.color || generatePastelColor()
      });
    }
  });
  
  // Depois as peças normais
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
  
  // Try to place each piece
  for (const piece of expandedPieces) {
    let placed = false;
    
    // Verifica se é uma peça problemática
    const isPriority = (piece.width === 200 && piece.height === 275) || 
                       (piece.width === 275 && piece.height === 200);
    
    if (isPriority) {
      console.log(`Trying to place priority piece ${piece.width}x${piece.height}`);
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
        
        if (isPriority || placedPieces.length < 5) { // Log prioridades e primeiras peças
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
  
  // Verificação final para detectar possíveis sobreposições
  console.log("Running final overlap check...");
  const verificationGrids: SheetGrid[] = [];
  for (let i = 0; i < sheetGrids.length; i++) {
    verificationGrids.push(new SheetGrid(sheet.width, sheet.height));
  }
  
  let hasOverlap = false;
  for (const piece of placedPieces) {
    const grid = verificationGrids[piece.sheetIndex];
    if (!grid.isAreaAvailable(piece.x, piece.y, piece.width, piece.height, 0)) {
      console.error(`OVERLAP DETECTED: Piece ${piece.width}x${piece.height} at (${piece.x},${piece.y}) on sheet ${piece.sheetIndex}`);
      hasOverlap = true;
    } else {
      grid.occupyArea(piece.x, piece.y, piece.width, piece.height);
    }
  }
  
  if (hasOverlap) {
    console.error("WARNING: Overlaps detected in final check. Algorithm may need further improvements.");
  } else {
    console.log("Final check complete: No overlaps detected.");
  }
  
  console.log("Optimization complete. Placed", placedPieces.length, "pieces on", sheetGrids.length, "sheets");
  return placedPieces;
};
