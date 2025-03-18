
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

  // Método adicional para verificar posições com uma margem extra de segurança para peças problemáticas
  isSecurePosition(x: number, y: number, pieceWidth: number, pieceHeight: number, safetyMargin: number): boolean {
    // Verifica cada ponto ao redor da peça com uma margem extra de segurança
    const extendedCutStartX = Math.max(0, x - safetyMargin);
    const extendedCutStartY = Math.max(0, y - safetyMargin);
    const extendedCutEndX = Math.min(this.width - 1, x + pieceWidth + safetyMargin - 1);
    const extendedCutEndY = Math.min(this.height - 1, y + pieceHeight + safetyMargin - 1);
    
    // Verifica os cantos com atenção especial (onde sobreposições costumam ocorrer)
    const corners = [
      { x: extendedCutStartX, y: extendedCutStartY },
      { x: extendedCutEndX, y: extendedCutStartY },
      { x: extendedCutStartX, y: extendedCutEndY },
      { x: extendedCutEndX, y: extendedCutEndY }
    ];
    
    for (const corner of corners) {
      // Verificação extra nos cantos
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const cx = corner.x + dx;
          const cy = corner.y + dy;
          if (cx >= 0 && cx < this.width && cy >= 0 && cy < this.height) {
            if (this.grid[cy][cx]) {
              return false; // Área não é segura
            }
          }
        }
      }
    }
    
    // Se passou por todas as verificações, a posição é segura
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
