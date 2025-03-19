
import { SheetGrid } from './SheetGrid';

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Finds the largest possible rectangles that can be fitted in the empty spaces
export const findMaxRectangles = (sheetGrid: SheetGrid, minSize: number = 50): Rectangle[] => {
  const width = sheetGrid.getWidth();
  const height = sheetGrid.getHeight();
  
  // Create a copy of the grid for our calculations
  const grid = Array(height).fill(null).map((_, y) => 
    Array(width).fill(null).map((_, x) => sheetGrid.isCellOccupied(x, y) ? 1 : 0)
  );
  
  // Calculate the height map (how many consecutive empty cells above each cell)
  const heightMap = Array(height).fill(null).map(() => Array(width).fill(0));
  
  // Fill the first row
  for (let x = 0; x < width; x++) {
    heightMap[0][x] = grid[0][x] === 0 ? 1 : 0;
  }
  
  // Fill the rest of the height map
  for (let y = 1; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 0) {
        heightMap[y][x] = heightMap[y-1][x] + 1;
      } else {
        heightMap[y][x] = 0;
      }
    }
  }
  
  // Find the maximum rectangles
  const rectangles: Rectangle[] = [];
  
  for (let y = 0; y < height; y++) {
    const stack: number[] = [];
    let i = 0;
    
    while (i < width) {
      if (stack.length === 0 || heightMap[y][stack[stack.length - 1]] <= heightMap[y][i]) {
        stack.push(i++);
      } else {
        const top = stack.pop() as number;
        const area = heightMap[y][top] * (stack.length === 0 ? i : i - stack[stack.length - 1] - 1);
        const rectHeight = heightMap[y][top];
        const rectWidth = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
        const rectX = stack.length === 0 ? 0 : stack[stack.length - 1] + 1;
        const rectY = y - rectHeight + 1;
        
        // Only add rectangles larger than the minimum size
        if (rectWidth >= minSize && rectHeight >= minSize) {
          rectangles.push({
            x: rectX,
            y: rectY,
            width: rectWidth,
            height: rectHeight
          });
        }
      }
    }
    
    while (stack.length > 0) {
      const top = stack.pop() as number;
      const area = heightMap[y][top] * (stack.length === 0 ? width : width - stack[stack.length - 1] - 1);
      const rectHeight = heightMap[y][top];
      const rectWidth = stack.length === 0 ? width : width - stack[stack.length - 1] - 1;
      const rectX = stack.length === 0 ? 0 : stack[stack.length - 1] + 1;
      const rectY = y - rectHeight + 1;
      
      // Only add rectangles larger than the minimum size
      if (rectWidth >= minSize && rectHeight >= minSize) {
        rectangles.push({
          x: rectX,
          y: rectY,
          width: rectWidth,
          height: rectHeight
        });
      }
    }
  }
  
  // Filter out rectangles that are contained within other rectangles
  const filteredRectangles = rectangles.filter((rect1, i) => {
    return !rectangles.some((rect2, j) => {
      if (i === j) return false;
      
      return (
        rect1.x >= rect2.x &&
        rect1.y >= rect2.y &&
        rect1.x + rect1.width <= rect2.x + rect2.width &&
        rect1.y + rect1.height <= rect2.y + rect2.height
      );
    });
  });
  
  // Sort by area (largest first)
  return filteredRectangles.sort((a, b) => {
    return (b.width * b.height) - (a.width * a.height);
  });
};
