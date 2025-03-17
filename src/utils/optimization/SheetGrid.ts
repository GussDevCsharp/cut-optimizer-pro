// Class to track occupied areas on the sheet - optimized for performance
export class SheetGrid {
  private grid: Uint8Array[];
  private width: number;
  private height: number;
  private cutWidth: number;
  private occupancyHash: string = '';
  private scanPoints: Array<{x: number, y: number}> = [];
  
  constructor(width: number, height: number, cutWidth: number) {
    this.width = width;
    this.height = height;
    this.cutWidth = cutWidth;
    
    // Use typed arrays for better performance
    this.grid = new Array(height);
    for (let i = 0; i < height; i++) {
      this.grid[i] = new Uint8Array(width);
    }
    
    // Initialize scan points with corners and edges
    this.updateScanPoints();
  }
  
  // Get width property for external use
  get width(): number {
    return this.width;
  }
  
  // Get height property for external use
  get height(): number {
    return this.height;
  }
  
  // Get current occupancy hash for caching
  getOccupancyHash(): string {
    return this.occupancyHash;
  }
  
  // Get strategic scan points for faster placement
  getScanPoints(): Array<{x: number, y: number}> {
    return this.scanPoints;
  }
  
  // Update scan points after placing a piece
  private updateScanPoints(): void {
    // Start with corners and edges which are efficient places to check
    this.scanPoints = [
      { x: 0, y: 0 }, // Top-left
      { x: this.width - 1, y: 0 }, // Top-right
      { x: 0, y: this.height - 1 }, // Bottom-left
      { x: this.width - 1, y: this.height - 1 } // Bottom-right
    ];
    
    // Add points along top and left edges
    for (let x = 100; x < this.width - 100; x += 100) {
      this.scanPoints.push({ x, y: 0 });
    }
    
    for (let y = 100; y < this.height - 100; y += 100) {
      this.scanPoints.push({ x: 0, y });
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
    
    // Update occupancy hash
    this.occupancyHash = `${this.occupancyHash}-${x},${y},${pieceWidth},${pieceHeight}`;
    
    // Add new scan points at the corners of the placed piece
    this.scanPoints.push(
      { x: x + pieceWidth, y }, // Right top
      { x, y: y + pieceHeight }, // Left bottom
      { x: x + pieceWidth, y: y + pieceHeight } // Right bottom
    );
    
    // Keep scan points list manageable
    if (this.scanPoints.length > 200) {
      this.scanPoints = this.scanPoints.slice(-100);
    }
  }
}
