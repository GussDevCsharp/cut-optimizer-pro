
import { Piece, PlacedPiece, Sheet } from '../hooks/useSheetData';

// Helper function to generate a random pastel color
const generatePastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

// Check if a piece at given position would overlap with existing placed pieces
const checkOverlap = (
  piece: { width: number; height: number; x: number; y: number }, 
  placedPieces: PlacedPiece[]
): boolean => {
  for (const placedPiece of placedPieces) {
    // Use strict overlap detection - even a 0.1 unit overlap is not allowed
    if (
      piece.x < placedPiece.x + placedPiece.width &&
      piece.x + piece.width > placedPiece.x &&
      piece.y < placedPiece.y + placedPiece.height &&
      piece.y + piece.height > placedPiece.y
    ) {
      return true; // Overlap detected
    }
  }
  return false; // No overlap
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

// Create a grid map of the sheet to track which areas are occupied
const createAreaMap = (sheet: Sheet, cutWidth: number): boolean[][] => {
  // Calculate grid dimensions based on sheet size and cut width
  const gridWidth = Math.ceil(sheet.width / cutWidth);
  const gridHeight = Math.ceil(sheet.height / cutWidth);
  
  // Create a 2D array initialized with false (all cells empty)
  return Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(false));
};

// Mark an area as occupied in the area map
const markAreaAsOccupied = (
  areaMap: boolean[][], 
  piece: { x: number; y: number; width: number; height: number },
  cutWidth: number
): void => {
  // Convert piece coordinates to grid cells
  const startX = Math.floor(piece.x / cutWidth);
  const startY = Math.floor(piece.y / cutWidth);
  const endX = Math.ceil((piece.x + piece.width) / cutWidth);
  const endY = Math.ceil((piece.y + piece.height) / cutWidth);
  
  // Mark all cells covered by the piece as occupied
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      if (y < areaMap.length && x < areaMap[0].length) {
        areaMap[y][x] = true;
      }
    }
  }
};

// Check if an area is free in the area map
const isAreaFree = (
  areaMap: boolean[][], 
  piece: { x: number; y: number; width: number; height: number },
  cutWidth: number
): boolean => {
  // Convert piece coordinates to grid cells
  const startX = Math.floor(piece.x / cutWidth);
  const startY = Math.floor(piece.y / cutWidth);
  const endX = Math.ceil((piece.x + piece.width) / cutWidth);
  const endY = Math.ceil((piece.y + piece.height) / cutWidth);
  
  // Check if any cell in the area is already occupied
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      if (
        y >= areaMap.length || 
        x >= areaMap[0].length || 
        areaMap[y][x]
      ) {
        return false;
      }
    }
  }
  
  return true;
};

// Find the best position for a piece using area mapping
const findBestPosition = (
  piece: Piece,
  placedPieces: PlacedPiece[],
  sheet: Sheet,
  areaMap: boolean[][]
): { x: number; y: number; rotated: boolean } | null => {
  // Try both orientations to maximize sheet usage
  const orientations = [
    { width: piece.width, height: piece.height, rotated: false },
    { width: piece.height, height: piece.width, rotated: true }
  ];

  let bestFit = null;
  let bestY = sheet.height;
  let bestX = sheet.width;

  // Consider all possible positions with precision of cutWidth
  for (const orientation of orientations) {
    for (let y = 0; y <= sheet.height - orientation.height; y += sheet.cutWidth) {
      for (let x = 0; x <= sheet.width - orientation.width; x += sheet.cutWidth) {
        const testPiece = {
          ...orientation,
          x,
          y
        };

        // First check if area is free in our grid map (fast check)
        if (isAreaFree(areaMap, testPiece, sheet.cutWidth)) {
          // Then do exact overlap check to be double-sure
          if (!checkOverlap(testPiece, placedPieces) && checkBoundaries(testPiece, sheet)) {
            // Use top-left strategy - find the topmost position, then the leftmost
            if (y < bestY || (y === bestY && x < bestX)) {
              bestY = y;
              bestX = x;
              bestFit = { x, y, rotated: orientation.rotated };
            }
          }
        }
      }
    }
  }

  return bestFit;
};

// Main optimization function that uses area mapping
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
  
  // Track pieces by sheet and use area mapping for each sheet
  let currentSheetIndex = 0;
  let currentSheetPieces: PlacedPiece[] = [];
  let currentAreaMap = createAreaMap(sheet, sheet.cutWidth);
  
  for (const piece of expandedPieces) {
    // Try to place piece on current sheet using the area map
    const position = findBestPosition(piece, currentSheetPieces, sheet, currentAreaMap);
    
    if (position) {
      // Create the placed piece
      const placedPiece: PlacedPiece = {
        ...piece,
        x: position.x,
        y: position.y,
        rotated: position.rotated,
        width: position.rotated ? piece.height : piece.width,
        height: position.rotated ? piece.width : piece.height,
        sheetIndex: currentSheetIndex
      };
      
      // Final verification that there's no overlap
      if (!checkOverlap(placedPiece, currentSheetPieces)) {
        // Add piece to placed pieces
        placedPieces.push(placedPiece);
        currentSheetPieces.push(placedPiece);
        
        // Mark area as occupied in the map
        markAreaAsOccupied(currentAreaMap, placedPiece, sheet.cutWidth);
      } else {
        // Fallback: if we somehow still have an overlap, move to a new sheet
        currentSheetIndex++;
        currentSheetPieces = [];
        currentAreaMap = createAreaMap(sheet, sheet.cutWidth);
        
        // Try on new empty sheet
        const newPosition = findBestPosition(piece, [], sheet, currentAreaMap);
        if (newPosition) {
          const newPlacedPiece: PlacedPiece = {
            ...piece,
            x: newPosition.x,
            y: newPosition.y,
            rotated: newPosition.rotated,
            width: newPosition.rotated ? piece.height : piece.width,
            height: newPosition.rotated ? piece.width : piece.height,
            sheetIndex: currentSheetIndex
          };
          
          placedPieces.push(newPlacedPiece);
          currentSheetPieces.push(newPlacedPiece);
          markAreaAsOccupied(currentAreaMap, newPlacedPiece, sheet.cutWidth);
        }
      }
    } else {
      // No valid position found on current sheet, move to a new sheet
      currentSheetIndex++;
      currentSheetPieces = [];
      currentAreaMap = createAreaMap(sheet, sheet.cutWidth);
      
      // Try to place on the new sheet
      const newPosition = findBestPosition(piece, [], sheet, currentAreaMap);
      
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
        
        placedPieces.push(placedPiece);
        currentSheetPieces.push(placedPiece);
        markAreaAsOccupied(currentAreaMap, placedPiece, sheet.cutWidth);
      }
    }
  }
  
  return placedPieces;
};
