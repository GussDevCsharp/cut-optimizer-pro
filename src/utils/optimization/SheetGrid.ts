
import { Sheet } from '../../hooks/useSheetData';

// Optimized class to track occupied areas on the sheet using sparse grid
export class SheetGrid {
  private grid: Map<number, Set<number>>;
  private width: number;
  private height: number;
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = new Map();
  }
  
  // Optimized method to check if an area is available
  isAreaAvailable(x: number, y: number, pieceWidth: number, pieceHeight: number, cutWidth: number): boolean {
    // Check boundaries
    if (x < 0 || y < 0 || x + pieceWidth > this.width || y + pieceHeight > this.height) {
      return false;
    }
    
    // Calculate area to check (including cut width)
    const checkX = Math.max(0, x - cutWidth);
    const checkY = Math.max(0, y - cutWidth);
    const checkWidth = Math.min(this.width - checkX, pieceWidth + 2 * cutWidth);
    const checkHeight = Math.min(this.height - checkY, pieceHeight + 2 * cutWidth);
    
    // Check if any cell in the grid is occupied in the expanded area
    for (let i = checkY; i < checkY + checkHeight; i++) {
      const row = this.grid.get(i);
      if (row) {
        for (let j = checkX; j < checkX + checkWidth; j++) {
          // Skip checking the cells outside the grid boundaries
          if (j < 0 || j >= this.width) continue;
          
          // If we find any occupied cell in the expanded area, this position is invalid
          if (row.has(j)) {
            return false;
          }
        }
      }
    }
    
    return true;
  }
  
  // Mark an area as occupied - optimized with sparse representation
  occupyArea(x: number, y: number, pieceWidth: number, pieceHeight: number): void {
    for (let i = y; i < y + pieceHeight; i++) {
      // Skip cells outside grid
      if (i < 0 || i >= this.height) continue;
      
      // Get or create row
      let row = this.grid.get(i);
      if (!row) {
        row = new Set<number>();
        this.grid.set(i, row);
      }
      
      // Mark cells in row
      for (let j = x; j < x + pieceWidth; j++) {
        if (j >= 0 && j < this.width) {
          row.add(j);
        }
      }
    }
  }
}
