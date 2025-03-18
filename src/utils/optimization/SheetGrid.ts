
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
  
  // Optimized method to check if an area is available
  isAreaAvailable(x: number, y: number, pieceWidth: number, pieceHeight: number, cutWidth: number): boolean {
    // Check that the piece fits within sheet boundaries
    if (x < 0 || y < 0 || x + pieceWidth > this.width || y + pieceHeight > this.height) {
      return false;
    }
    
    // Quick check for the piece area first
    const startX = Math.max(0, x);
    const startY = Math.max(0, y);
    const endX = Math.min(this.width - 1, x + pieceWidth - 1);
    const endY = Math.min(this.height - 1, y + pieceHeight - 1);
    
    // Check each cell in the grid to ensure no overlap - using fast loops
    for (let i = startY; i <= endY; i++) {
      for (let j = startX; j <= endX; j++) {
        if (this.grid[i][j]) {
          return false; // Area is already occupied
        }
      }
    }
    
    // Only check cut width around the piece - optimized boundary checking
    const cutStartX = Math.max(0, x - cutWidth);
    const cutStartY = Math.max(0, y - cutWidth);
    const cutEndX = Math.min(this.width - 1, x + pieceWidth + cutWidth - 1);
    const cutEndY = Math.min(this.height - 1, y + pieceHeight + cutWidth - 1);
    
    // Check top and bottom borders
    for (let j = cutStartX; j <= cutEndX; j++) {
      // Top border
      for (let i = cutStartY; i < startY; i++) {
        if (i >= 0 && i < this.height && this.grid[i][j]) {
          return false;
        }
      }
      
      // Bottom border
      for (let i = endY + 1; i <= cutEndY; i++) {
        if (i >= 0 && i < this.height && this.grid[i][j]) {
          return false;
        }
      }
    }
    
    // Check left and right borders
    for (let i = startY; i <= endY; i++) {
      // Left border
      for (let j = cutStartX; j < startX; j++) {
        if (j >= 0 && j < this.width && this.grid[i][j]) {
          return false;
        }
      }
      
      // Right border
      for (let j = endX + 1; j <= cutEndX; j++) {
        if (j >= 0 && j < this.width && this.grid[i][j]) {
          return false;
        }
      }
    }
    
    return true;
  }

  // Optimized method to check secure positions for problematic pieces
  isSecurePosition(x: number, y: number, pieceWidth: number, pieceHeight: number, safetyMargin: number): boolean {
    // Only check the corners and their surrounding areas instead of the whole perimeter
    const corners = [
      { x: x - safetyMargin, y: y - safetyMargin },
      { x: x + pieceWidth + safetyMargin - 1, y: y - safetyMargin },
      { x: x - safetyMargin, y: y + pieceHeight + safetyMargin - 1 },
      { x: x + pieceWidth + safetyMargin - 1, y: y + pieceHeight + safetyMargin - 1 }
    ];
    
    for (const corner of corners) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const cx = corner.x + dx;
          const cy = corner.y + dy;
          if (cx >= 0 && cx < this.width && cy >= 0 && cy < this.height) {
            if (this.grid[cy][cx]) {
              return false; // Not safe
            }
          }
        }
      }
    }
    
    return true;
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
