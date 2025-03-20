
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
  
  // Check if a position is occupied
  isOccupied(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return true; // Consider outside the boundary as occupied
    }
    return this.grid[y][x];
  }
  
  // Check if an area has any occupied adjacent cells
  hasOccupiedAdjacent(x: number, y: number, width: number, height: number): boolean {
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
          if (this.grid[i][j]) {
            return true;
          }
        }
      }
    }
    return false;
  }
  
  // Check if an area is available for a piece
  isAreaAvailable(x: number, y: number, pieceWidth: number, pieceHeight: number, cutWidth: number): boolean {
    // Check that the piece fits within sheet boundaries
    if (x < 0 || y < 0 || x + pieceWidth > this.width || y + pieceHeight > this.height) {
      return false;
    }
    
    // Check each cell in the grid to ensure no overlap
    for (let i = y; i < y + pieceHeight; i++) {
      for (let j = x; j < x + pieceWidth; j++) {
        if (this.grid[i][j]) {
          return false; // Area is already occupied
        }
      }
    }
    
    // If cutWidth is specified, check for spacing between pieces
    if (cutWidth > 0) {
      const cutStartX = Math.max(0, x - cutWidth);
      const cutStartY = Math.max(0, y - cutWidth);
      const cutEndX = Math.min(this.width - 1, x + pieceWidth + cutWidth - 1);
      const cutEndY = Math.min(this.height - 1, y + pieceHeight + cutWidth - 1);
      
      // Check the border of the piece with cut width
      for (let i = cutStartY; i <= cutEndY; i++) {
        for (let j = cutStartX; j <= cutEndX; j++) {
          // Skip checking the actual piece area
          if (i >= y && i < y + pieceHeight && j >= x && j < x + pieceWidth) {
            continue;
          }
          if (i >= 0 && i < this.height && j >= 0 && j < this.width && this.grid[i][j]) {
            return false; // Cut width area is already occupied
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
  
  // Identify all unoccupied areas that could be reusable scraps
  findScrapAreas(minScrapSize: number = 100): { x: number; y: number; width: number; height: number }[] {
    const scraps: { x: number; y: number; width: number; height: number }[] = [];
    const visited = Array(this.height).fill(null).map(() => Array(this.width).fill(false));
    
    // Scan entire grid for unoccupied areas
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!this.grid[y][x] && !visited[y][x]) {
          // Found an unvisited, unoccupied cell - find the maximum rectangle from here
          let maxWidth = 0;
          let maxHeight = 0;
          
          // Find max width (how far right can we go)
          for (let j = x; j < this.width; j++) {
            if (this.grid[y][j]) break;
            maxWidth = j - x + 1;
          }
          
          // Find max height (how far down can we go with consistent width)
          let validRow = true;
          for (let i = y; i < this.height && validRow; i++) {
            for (let j = x; j < x + maxWidth; j++) {
              if (this.grid[i][j]) {
                validRow = false;
                break;
              }
            }
            if (validRow) {
              maxHeight = i - y + 1;
            }
          }
          
          // Mark this area as visited
          for (let i = y; i < y + maxHeight; i++) {
            for (let j = x; j < x + maxWidth; j++) {
              visited[i][j] = true;
            }
          }
          
          // Add this area if it's large enough to be reusable
          if (maxWidth * maxHeight >= minScrapSize) {
            scraps.push({
              x, 
              y, 
              width: maxWidth, 
              height: maxHeight
            });
          }
        }
      }
    }
    
    return scraps;
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
