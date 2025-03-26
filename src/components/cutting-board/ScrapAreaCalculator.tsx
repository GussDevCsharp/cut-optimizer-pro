import React from 'react';
import { PlacedPiece } from '../../hooks/useSheetData';
import { ScrapArea } from './SheetPiece';

interface ScrapAreaCalculatorProps {
  placedPieces: PlacedPiece[];
  sheetWidth: number;
  sheetHeight: number;
  currentSheetIndex: number;
}

export const calculateScrapAreas = (
  pieces: PlacedPiece[], 
  sheetWidth: number, 
  sheetHeight: number, 
  currentSheetIndex: number
): ScrapArea[] => {
  if (pieces.length === 0) {
    // If no pieces, the whole sheet is a scrap area
    return [{
      id: 'full-sheet-scrap',
      x: 0,
      y: 0,
      width: sheetWidth,
      height: sheetHeight,
      sheetIndex: currentSheetIndex
    }];
  }

  // Create a grid to track occupied areas (1mm resolution)
  const resolution = 1;
  const gridWidth = Math.ceil(sheetWidth / resolution);
  const gridHeight = Math.ceil(sheetHeight / resolution);
  const grid = Array(gridHeight).fill(0).map(() => Array(gridWidth).fill(false));

  // Mark all pieces on the grid
  pieces.forEach(piece => {
    const startX = Math.floor(piece.x / resolution);
    const startY = Math.floor(piece.y / resolution);
    const endX = Math.min(Math.ceil((piece.x + piece.width) / resolution), gridWidth);
    const endY = Math.min(Math.ceil((piece.y + piece.height) / resolution), gridHeight);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        if (y >= 0 && y < gridHeight && x >= 0 && x < gridWidth) {
          grid[y][x] = true;
        }
      }
    }
  });

  // Find contiguous empty areas with maximum usability
  const identified = Array(gridHeight).fill(0).map(() => Array(gridWidth).fill(false));
  const scrapAreas: ScrapArea[] = [];
  let scrapId = 0;

  // Improved algorithm to find the largest possible usable rectangles
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (!grid[y][x] && !identified[y][x]) {
        // Found an empty cell, search for the largest rectangle
        let width = 0;
        while (x + width < gridWidth && !grid[y][x + width]) {
          width++;
        }
        
        let height = 0;
        let isValid = true;
        
        while (isValid && y + height < gridHeight) {
          for (let i = 0; i < width; i++) {
            if (grid[y + height][x + i]) {
              isValid = false;
              break;
            }
          }
          if (isValid) height++;
        }
        
        // Mark the identified area
        for (let j = y; j < y + height; j++) {
          for (let i = x; i < x + width; i++) {
            identified[j][i] = true;
          }
        }
        
        // Only add areas that are larger than the cut width and have a usable size
        const areaWidth = width * resolution;
        const areaHeight = height * resolution;
        const cutWidth = 4; // Default cut width
        const minSize = cutWidth * 4; // Minimum usable size
        
        if (areaWidth > minSize && areaHeight > minSize) {
          // Calculate area and aspect ratio for sorting
          const area = areaWidth * areaHeight;
          const aspectRatio = Math.min(areaWidth / areaHeight, areaHeight / areaWidth);
          
          // Score favors larger areas with better aspect ratios (closer to square)
          const score = area * (aspectRatio * 0.5 + 0.5);
          
          scrapAreas.push({
            id: `scrap-${scrapId++}`,
            x: x * resolution,
            y: y * resolution,
            width: areaWidth,
            height: areaHeight,
            sheetIndex: currentSheetIndex,
            area,
            score
          } as ScrapArea);
        }
      }
    }
  }

  // Sort by score (highest first) and keep a reasonable number of areas
  const MAX_SCRAP_AREAS = 20; // Increased to show more potential reusable pieces
  return scrapAreas
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, MAX_SCRAP_AREAS);
};

// Component that returns scrap areas (purely logic, no UI)
export const useScrapAreas = ({ 
  placedPieces, 
  sheetWidth, 
  sheetHeight, 
  currentSheetIndex
}: ScrapAreaCalculatorProps): ScrapArea[] => {
  const filteredPieces = placedPieces.filter(p => p.sheetIndex === currentSheetIndex);
  return calculateScrapAreas(filteredPieces, sheetWidth, sheetHeight, currentSheetIndex);
};
