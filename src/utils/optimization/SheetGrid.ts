import { Sheet } from '../../hooks/useSheetData';

// Class to track occupied areas on the sheet
export class SheetGrid {
  private grid: Uint8Array[];  // Use typed arrays for better performance
  private width: number;
  private height: number;
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    
    // Use TypedArrays for better memory and CPU performance
    this.grid = Array(height);
    for (let i = 0; i < height; i++) {
      this.grid[i] = new Uint8Array(width);
    }
  }
  
  // Check if a position is occupied
  isOccupied(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return true; // Consider outside the boundary as occupied
    }
    return this.grid[y][x] === 1;
  }
  
  // Check if an area has any occupied adjacent cells - optimized
  hasOccupiedAdjacent(x: number, y: number, width: number, height: number): boolean {
    // Boundary checks
    const startX = Math.max(0, x);
    const startY = Math.max(0, y);
    const endX = Math.min(this.width - 1, x + width - 1);
    const endY = Math.min(this.height - 1, y + height - 1);
    
    // Early return if invalid dimensions
    if (startX > endX || startY > endY) return false;
    
    // Check each cell
    for (let i = startY; i <= endY; i++) {
      const row = this.grid[i];
      for (let j = startX; j <= endX; j++) {
        if (row[j] === 1) return true;
      }
    }
    
    return false;
  }
  
  // Check if an area is available for a piece - optimized
  isAreaAvailable(x: number, y: number, pieceWidth: number, pieceHeight: number, cutWidth: number): boolean {
    // Quick check that the piece fits within sheet boundaries
    if (x < 0 || y < 0 || x + pieceWidth > this.width || y + pieceHeight > this.height) {
      return false;
    }
    
    // Fast check for occupation - no cut width
    if (cutWidth <= 0) {
      for (let i = y; i < y + pieceHeight; i++) {
        const row = this.grid[i];
        for (let j = x; j < x + pieceWidth; j++) {
          if (row[j] === 1) return false;
        }
      }
      return true;
    }
    
    // With cut width, more complex check
    const cutStartX = Math.max(0, x - cutWidth);
    const cutStartY = Math.max(0, y - cutWidth);
    const cutEndX = Math.min(this.width - 1, x + pieceWidth + cutWidth - 1);
    const cutEndY = Math.min(this.height - 1, y + pieceHeight + cutWidth - 1);
    
    // Check the border of the piece with cut width
    for (let i = cutStartY; i <= cutEndY; i++) {
      const row = this.grid[i];
      for (let j = cutStartX; j <= cutEndX; j++) {
        // Skip checking the actual piece area
        if (i >= y && i < y + pieceHeight && j >= x && j < x + pieceWidth) {
          continue;
        }
        
        if (row[j] === 1) {
          return false; // Cut width area is already occupied
        }
      }
    }
    
    return true;
  }
  
  // Mark an area as occupied - optimized
  occupyArea(x: number, y: number, pieceWidth: number, pieceHeight: number): void {
    const endX = Math.min(this.width, x + pieceWidth);
    const endY = Math.min(this.height, y + pieceHeight);
    
    for (let i = Math.max(0, y); i < endY; i++) {
      const row = this.grid[i];
      for (let j = Math.max(0, x); j < endX; j++) {
        row[j] = 1;
      }
    }
  }
  
  // Efficiently find all unoccupied areas that could be reusable scraps
  findScrapAreas(minScrapSize: number = 100): { x: number; y: number; width: number; height: number }[] {
    const scraps: { x: number; y: number; width: number; height: number }[] = [];
    
    // Use a separate grid for visited cells to avoid modifying the main grid
    const visited = Array(this.height);
    for (let i = 0; i < this.height; i++) {
      visited[i] = new Uint8Array(this.width);
    }
    
    // Find rectangles with faster scanning
    for (let y = 0; y < this.height; y++) {
      const gridRow = this.grid[y];
      const visitedRow = visited[y];
      
      for (let x = 0; x < this.width; x++) {
        if (gridRow[x] === 0 && visitedRow[x] === 0) {
          // Found an unvisited, unoccupied cell
          let maxWidth = 0;
          
          // Find max width (how far right can we go)
          for (let j = x; j < this.width; j++) {
            if (gridRow[j] === 1) break;
            maxWidth = j - x + 1;
          }
          
          // Find max height (how far down can we go with consistent width)
          let maxHeight = 0;
          let validHeight = true;
          
          for (let i = y; i < this.height && validHeight; i++) {
            for (let j = x; j < x + maxWidth; j++) {
              if (this.grid[i][j] === 1) {
                validHeight = false;
                break;
              }
            }
            
            if (validHeight) {
              maxHeight = i - y + 1;
            }
          }
          
          // Mark this area as visited
          for (let i = y; i < y + maxHeight; i++) {
            const visitRow = visited[i];
            for (let j = x; j < x + maxWidth; j++) {
              visitRow[j] = 1;
            }
          }
          
          // Add area if it's large enough
          const area = maxWidth * maxHeight;
          if (area >= minScrapSize) {
            scraps.push({
              x, 
              y, 
              width: maxWidth, 
              height: maxHeight
            });
            
            // Limit to top largest areas for performance
            if (scraps.length >= 10) {
              // Sort by area and keep only the largest
              scraps.sort((a, b) => (b.width * b.height) - (a.width * a.height));
              scraps.length = 5; // Keep only top 5
            }
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
        row += this.grid[i][j] === 1 ? '█' : '·';
      }
      console.log(row);
    }
  }
}
