
// Class to track occupied areas on the sheet - optimized for performance
export class SheetGrid {
  private grid: Uint8Array[];
  private width: number;
  private height: number;
  private cutWidth: number;
  
  constructor(width: number, height: number, cutWidth: number) {
    this.width = width;
    this.height = height;
    this.cutWidth = cutWidth;
    
    // Use typed arrays for better performance
    this.grid = new Array(height);
    for (let i = 0; i < height; i++) {
      this.grid[i] = new Uint8Array(width);
    }
  }
  
  // Check if an area is available for a piece (including cut width)
  isAreaAvailable(x: number, y: number, pieceWidth: number, pieceHeight: number): boolean {
    // Quick boundary check
    if (x < 0 || y < 0 || x + pieceWidth > this.width || y + pieceHeight > this.height) {
      return false;
    }
    
    // Check the piece area first - fast path
    for (let i = y; i < y + pieceHeight; i++) {
      const row = this.grid[i];
      for (let j = x; j < x + pieceWidth; j++) {
        if (row[j] === 1) {
          return false; // Area is already occupied
        }
      }
    }
    
    // Check for cut width spacing - more efficient implementation
    const startCheckX = Math.max(0, x - this.cutWidth);
    const startCheckY = Math.max(0, y - this.cutWidth);
    const endCheckX = Math.min(this.width - 1, x + pieceWidth + this.cutWidth - 1);
    const endCheckY = Math.min(this.height - 1, y + pieceHeight + this.cutWidth - 1);
    
    // Check if we're already at the piece boundaries
    for (let i = startCheckY; i <= endCheckY; i++) {
      // Skip checking within the actual piece area
      if (i >= y && i < y + pieceHeight) {
        // Only check the borders
        // Left border
        for (let j = startCheckX; j < x; j++) {
          if (this.grid[i][j] === 1) {
            return false;
          }
        }
        // Right border
        for (let j = x + pieceWidth; j <= endCheckX; j++) {
          if (this.grid[i][j] === 1) {
            return false;
          }
        }
      } else {
        // Full row check outside piece
        for (let j = startCheckX; j <= endCheckX; j++) {
          if (this.grid[i][j] === 1) {
            return false;
          }
        }
      }
    }
    
    return true;
  }
  
  // Mark an area as occupied - more efficient implementation
  occupyArea(x: number, y: number, pieceWidth: number, pieceHeight: number): void {
    // Mark the piece area
    for (let i = y; i < y + pieceHeight; i++) {
      const row = this.grid[i];
      for (let j = x; j < x + pieceWidth; j++) {
        row[j] = 1;
      }
    }
  }
}
