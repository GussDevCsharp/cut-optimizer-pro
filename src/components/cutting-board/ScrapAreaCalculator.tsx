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

  // First pass: find all possible scrap areas with maximum dimensions
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (!grid[y][x] && !identified[y][x]) {
        // Found an empty cell, find the largest rectangle that can be formed from this corner
        let maxX = x;
        let maxY = y;
        
        // Find max width (how far we can go right)
        while (maxX < gridWidth && !grid[y][maxX]) {
          maxX++;
        }
        
        // Find initial height (how far we can go down with full width)
        let currentHeight = 0;
        let canExtend = true;
        
        while (canExtend && y + currentHeight < gridHeight) {
          // Check the entire row at this height
          for (let checkX = x; checkX < maxX; checkX++) {
            if (grid[y + currentHeight][checkX]) {
              canExtend = false;
              break;
            }
          }
          
          if (canExtend) {
            currentHeight++;
          }
        }
        
        maxY = y + currentHeight;
        
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
        
        if (areaWidth > cutWidth * 3 && areaHeight > cutWidth * 3) {
          // Calculate area to help sorting by size later
          const area = areaWidth * areaHeight;
          
          scrapAreas.push({
            id: `scrap-${scrapId++}`,
            x: x * resolution,
            y: y * resolution,
            width: areaWidth,
            height: areaHeight,
            sheetIndex: currentSheetIndex,
            area // Add area for sorting
          } as ScrapArea);
        }
      }
    }
  }

  // Sort by area (largest first) and only keep the largest areas for better usability
  // Using a higher number than before to show more potential reusable pieces
  const MAX_SCRAP_AREAS = 15;
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
