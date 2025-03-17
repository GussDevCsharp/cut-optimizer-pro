
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
    
    // Check each cell in the grid to ensure no overlap with the piece itself
    for (let i = y; i < y + pieceHeight; i++) {
      for (let j = x; j < x + pieceWidth; j++) {
        if (this.grid[i] && this.grid[i][j]) {
          return false; // Area is already occupied
        }
      }
    }
    
    // Check for cut width spacing to ensure no pieces are too close together
    // We need to check a border around the piece of width cutWidth
    const startCheckX = Math.max(0, x - cutWidth);
    const startCheckY = Math.max(0, y - cutWidth);
    const endCheckX = Math.min(this.width - 1, x + pieceWidth + cutWidth - 1);
    const endCheckY = Math.min(this.height - 1, y + pieceHeight + cutWidth - 1);
    
    for (let i = startCheckY; i <= endCheckY; i++) {
      for (let j = startCheckX; j <= endCheckX; j++) {
        // Skip checking the actual piece area
        if (i >= y && i < y + pieceHeight && j >= x && j < x + pieceWidth) {
          continue;
        }
        
        // Check if this cell is occupied
        if (i >= 0 && i < this.height && j >= 0 && j < this.width && this.grid[i][j]) {
          return false; // Cut width area is already occupied
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
    console.log("Grid state:");
    for (let i = 0; i < this.height; i++) {
      let row = '';
      for (let j = 0; j < this.width; j++) {
        row += this.grid[i][j] ? '█' : '·';
      }
      console.log(row);
    }
  }
}
