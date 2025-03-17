
import { Piece, PlacedPiece, Sheet } from '../../hooks/useSheetData';
import { sortPiecesByArea, findBestPosition } from './positionUtils';
import { SheetGrid } from './SheetGrid';
import { generatePastelColor } from './colorUtils';

// This file runs in a separate thread as a Web Worker

// Handle messages from the main thread
self.onmessage = (event) => {
  const { pieces, sheet, messageId } = event.data;
  
  if (!pieces || !sheet) {
    self.postMessage({ error: 'Invalid input data', messageId });
    return;
  }
  
  try {
    // Run the optimization algorithm
    const result = optimizeCutting(pieces, sheet, (progress) => {
      // Report progress back to main thread
      self.postMessage({ type: 'progress', progress, messageId });
    });
    
    // Send the result back to the main thread
    self.postMessage({ type: 'complete', result, messageId });
  } catch (error) {
    console.error('Optimization worker error:', error);
    self.postMessage({ 
      type: 'error', 
      error: error instanceof Error ? error.message : String(error),
      messageId 
    });
  }
};

// Optimized cutting algorithm that runs in the worker thread
const optimizeCutting = (
  pieces: Piece[],
  sheet: Sheet,
  progressCallback: (progress: number) => void
): PlacedPiece[] => {
  console.time('optimization-worker');
  
  // Sort pieces by area (largest first) - critical for optimal packing
  const sortedPieces = sortPiecesByArea(pieces);
  const placedPieces: PlacedPiece[] = [];
  
  // Create a map to batch pieces by dimensions for faster processing
  const piecesMap = new Map<string, {piece: Piece, count: number}>();
  
  // Group identical pieces to reduce iterations
  for (const piece of sortedPieces) {
    const key = `${piece.width}-${piece.height}-${piece.canRotate ? 'r' : 'nr'}`;
    if (piecesMap.has(key)) {
      const existing = piecesMap.get(key)!;
      existing.count += piece.quantity;
    } else {
      piecesMap.set(key, { piece, count: piece.quantity });
    }
  }
  
  // Convert back to array with correct quantities
  const expandedPieces: Array<{piece: Piece, index: number}> = [];
  let totalPieces = 0;
  
  piecesMap.forEach(({ piece, count }, key) => {
    for (let i = 0; i < count; i++) {
      expandedPieces.push({
        piece: {
          ...piece,
          color: piece.color || generatePastelColor()
        },
        index: totalPieces++
      });
    }
  });
  
  // Initialize sheet grids array with the first sheet
  const sheetGrids: SheetGrid[] = [new SheetGrid(sheet.width, sheet.height, sheet.cutWidth)];
  
  // Use a binary heap for better placement decisions with large counts
  let lastProgressReport = 0;
  const progressThreshold = Math.max(1, Math.floor(totalPieces / 50)); // Report progress more frequently
  
  // Try to place each piece
  for (let i = 0; i < expandedPieces.length; i++) {
    const { piece, index } = expandedPieces[i];
    let placed = false;
    
    // Try to place on existing sheets
    for (let sheetIndex = 0; sheetIndex < sheetGrids.length; sheetIndex++) {
      const position = findBestPosition(piece, sheetGrids[sheetIndex]);
      
      if (position) {
        // Calculate actual dimensions after potential rotation
        const placedWidth = position.rotated ? piece.height : piece.width;
        const placedHeight = position.rotated ? piece.width : piece.height;
        
        // Place on this sheet
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
        
        // Mark the area as occupied
        sheetGrids[sheetIndex].occupyArea(position.x, position.y, placedPiece.width, placedPiece.height);
        placedPieces.push(placedPiece);
        placed = true;
        break;
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
      }
    }
    
    // Report progress more frequently for better user experience
    if (index - lastProgressReport >= progressThreshold) {
      lastProgressReport = index;
      const progress = Math.min(95, Math.round((index / totalPieces) * 100));
      progressCallback(progress);
    }
  }
  
  // Sort the pieces by sheet index and area
  const result = placedPieces.sort((a, b) => {
    // First sort by sheet index
    if (a.sheetIndex !== b.sheetIndex) {
      return a.sheetIndex - b.sheetIndex;
    }
    
    // Then sort by area (larger pieces should be placed first/behind)
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });
  
  console.timeEnd('optimization-worker');
  progressCallback(100); // Final progress update
  
  return result;
};
