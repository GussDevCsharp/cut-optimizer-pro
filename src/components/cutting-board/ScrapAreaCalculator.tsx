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

  // Find contiguous empty areas (simple algorithm)
  const identified = Array(gridHeight).fill(0).map(() => Array(gridWidth).fill(false));
  const scrapAreas: ScrapArea[] = [];
  let scrapId = 0;

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (!grid[y][x] && !identified[y][x]) {
        // Found an empty cell, expand to find the full empty rectangle
        let maxX = x;
        while (maxX < gridWidth && !grid[y][maxX]) {
          maxX++;
        }
        
        let maxY = y;
        let isRectangular = true;
        
        // Check if the area extends downward as a rectangle
        while (isRectangular && maxY < gridHeight) {
          for (let checkX = x; checkX < maxX; checkX++) {
            if (grid[maxY][checkX]) {
              isRectangular = false;
              break;
            }
          }
          if (isRectangular) maxY++;
        }
        
        // Mark the identified area
        for (let markY = y; markY < maxY; markY++) {
          for (let markX = x; markX < maxX; markX++) {
            identified[markY][markX] = true;
          }
        }
        
        // Only add areas that are larger than the cut width (using a minimum size threshold)
        const areaWidth = (maxX - x) * resolution;
        const areaHeight = (maxY - y) * resolution;
        const cutWidth = 4; // Default cut width
        
        if (areaWidth > cutWidth * 2 && areaHeight > cutWidth * 2) {
          scrapAreas.push({
            id: `scrap-${scrapId++}`,
            x: x * resolution,
            y: y * resolution,
            width: areaWidth,
            height: areaHeight,
            sheetIndex: currentSheetIndex
          });
        }
      }
    }
  }

  // Simplify by keeping only the largest scrap areas (avoid showing too many tiny areas)
  const MAX_SCRAP_AREAS = 10;
  return scrapAreas
    .sort((a, b) => (b.width * b.height) - (a.width * a.height))
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
