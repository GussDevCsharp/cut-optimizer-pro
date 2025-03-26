
import { Sheet } from '../../hooks/useSheetData';

// Class to track occupied areas on the sheet
export class SheetGrid {
  private grid: boolean[][];
  private width: number;
  private height: number;
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = Array(height).fill(null).map(() => Array(width).fill(false));
  }
  
  // Check if an area is available for a piece (including cut width)
  isAreaAvailable(x: number, y: number, pieceWidth: number, pieceHeight: number, cutWidth: number): boolean {
    // Check that the piece fits within sheet boundaries
    if (x < 0 || y < 0 || x + pieceWidth > this.width || y + pieceHeight > this.height) {
      return false;
    }
    
    // Account for cut width by checking a slightly expanded area
    const startX = Math.max(0, x);
    const startY = Math.max(0, y);
    const endX = Math.min(this.width - 1, x + pieceWidth - 1);
    const endY = Math.min(this.height - 1, y + pieceHeight - 1);
    
    // Check each cell in the grid to ensure no overlap
    for (let i = startY; i <= endY; i++) {
      for (let j = startX; j <= endX; j++) {
        if (this.grid[i][j]) {
          return false; // Area is already occupied
        }
      }
    }
    
    // Also check for cut width spacing to ensure no pieces are too close together
    const cutStartX = Math.max(0, x - cutWidth);
    const cutStartY = Math.max(0, y - cutWidth);
    const cutEndX = Math.min(this.width - 1, x + pieceWidth + cutWidth - 1);
    const cutEndY = Math.min(this.height - 1, y + pieceHeight + cutWidth - 1);
    
    // Check the border of the piece with cut width
    for (let i = cutStartY; i <= cutEndY; i++) {
      for (let j = cutStartX; j <= cutEndX; j++) {
        // Skip checking the actual piece area
        if (i >= startY && i <= endY && j >= startX && j <= endX) {
          continue;
        }
        if (i >= 0 && i < this.height && j >= 0 && j < this.width && this.grid[i][j]) {
          return false; // Cut width area is already occupied
        }
      }
    }
    
    return true;
  }
  
  // Get the largest continuous empty area starting from a point
  getLargestEmptyArea(startX: number, startY: number): {width: number, height: number} {
    if (startX >= this.width || startY >= this.height || this.grid[startY][startX]) {
      return {width: 0, height: 0};
    }
    
    // Find max width (how far we can go right)
    let maxWidth = 0;
    for (let x = startX; x < this.width && !this.grid[startY][x]; x++) {
      maxWidth++;
    }
    
    // Find max height (how far we can go down with full width)
    let maxHeight = 0;
    outerLoop: for (let y = startY; y < this.height; y++) {
      for (let x = startX; x < startX + maxWidth; x++) {
        if (x >= this.width || this.grid[y][x]) {
          break outerLoop;
        }
      }
      maxHeight++;
    }
    
    return {width: maxWidth, height: maxHeight};
  }
  
  // Mark an area as occupied
  occupyArea(x: number, y: number, pieceWidth: number, pieceHeight: number): void {
    for (let i = y; i < y + pieceHeight; i++) {
      for (let j = x; j < x + pieceWidth; j++) {
        if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
          this.grid[i][j] = true;
        }
      }
    }
  }
  
  // Get all empty areas larger than a minimum size
  getEmptyAreas(minWidth: number, minHeight: number): {x: number, y: number, width: number, height: number}[] {
    const emptyAreas: {x: number, y: number, width: number, height: number}[] = [];
    const checked = Array(this.height).fill(null).map(() => Array(this.width).fill(false));
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!this.grid[y][x] && !checked[y][x]) {
          const area = this.getLargestEmptyArea(x, y);
          
          if (area.width >= minWidth && area.height >= minHeight) {
            emptyAreas.push({x, y, ...area});
          }
          
          // Mark the checked area
          for (let i = y; i < y + area.height; i++) {
            for (let j = x; j < x + area.width; j++) {
              if (i < this.height && j < this.width) {
                checked[i][j] = true;
              }
            }
          }
        }
      }
    }
    
    return emptyAreas;
  }
  
  // Debug method to print the grid
  printGrid(): void {
    for (let i = 0; i < this.height; i++) {
      let row = '';
      for (let j = 0; j < this.width; j++) {
        row += this.grid[i][j] ? '█' : '·';
      }
      console.log(row);
    }
  }
}
