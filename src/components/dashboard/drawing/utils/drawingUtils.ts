import { Shape } from '../types/drawingTypes';

export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape): void {
  ctx.beginPath();
  ctx.strokeStyle = shape.color;
  
  // Apply line width if specified, otherwise use context default
  if (shape.lineWidth) {
    ctx.lineWidth = shape.lineWidth;
  }
  
  const { startX, startY, endX = startX, endY = startY } = shape;
  
  switch (shape.type) {
    case 'square':
      ctx.rect(
        Math.min(startX, endX),
        Math.min(startY, endY),
        Math.abs(endX - startX),
        Math.abs(endY - startY)
      );
      break;
    case 'circle':
      const radiusX = Math.abs(endX - startX) / 2;
      const radiusY = Math.abs(endY - startY) / 2;
      const centerX = Math.min(startX, endX) + radiusX;
      const centerY = Math.min(startY, endY) + radiusY;
      
      ctx.ellipse(
        centerX,
        centerY,
        radiusX,
        radiusY,
        0,
        0,
        2 * Math.PI
      );
      break;
    case 'triangle':
      ctx.moveTo(startX + (endX - startX) / 2, startY);
      ctx.lineTo(endX, endY);
      ctx.lineTo(startX, endY);
      ctx.closePath();
      break;
    case 'line':
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      break;
  }
  
  ctx.stroke();
  
  // Reset to default line width after drawing
  if (shape.lineWidth) {
    ctx.lineWidth = 2; // Reset to default
  }
}

export function setupCanvas(canvas: HTMLCanvasElement, lineWidth: number = 2): CanvasRenderingContext2D | null {
  const container = canvas.parentElement;
  if (!container) return null;
  
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidth;
  }
  
  return ctx;
}

// Constants for grid
const MM_PER_PIXEL = 0.26458333; // 1 pixel is approximately 0.26458333 mm (96 DPI)
const GRID_MINOR_INTERVAL = 10; // Draw minor grid every 10 pixels (approx 2.6mm)
const GRID_MAJOR_INTERVAL = 50; // Draw major grid every 50 pixels (approx 13.2mm)

export function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const originalStrokeStyle = ctx.strokeStyle;
  const originalLineWidth = ctx.lineWidth;
  
  // Draw minor grid lines
  ctx.strokeStyle = '#f0f0f0'; // Light gray
  ctx.lineWidth = 0.5;
  
  for (let x = 0; x <= width; x += GRID_MINOR_INTERVAL) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  for (let y = 0; y <= height; y += GRID_MINOR_INTERVAL) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  // Draw major grid lines
  ctx.strokeStyle = '#d0d0d0'; // Medium gray
  ctx.lineWidth = 1;
  
  for (let x = 0; x <= width; x += GRID_MAJOR_INTERVAL) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  for (let y = 0; y <= height; y += GRID_MAJOR_INTERVAL) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Add mm labels to major grid lines
  ctx.fillStyle = '#888888';
  ctx.font = '10px Arial';
  ctx.textAlign = 'center';
  
  // X-axis labels (horizontal)
  for (let x = GRID_MAJOR_INTERVAL; x < width; x += GRID_MAJOR_INTERVAL) {
    const mmValue = Math.round(x * MM_PER_PIXEL);
    ctx.fillText(`${mmValue}mm`, x, 10);
  }
  
  // Y-axis labels (vertical)
  ctx.textAlign = 'right';
  for (let y = GRID_MAJOR_INTERVAL; y < height; y += GRID_MAJOR_INTERVAL) {
    const mmValue = Math.round(y * MM_PER_PIXEL);
    ctx.fillText(`${mmValue}mm`, 20, y + 4);
  }
  
  // Restore original context settings
  ctx.strokeStyle = originalStrokeStyle;
  ctx.lineWidth = originalLineWidth;
}

// Utility to convert between pixels and millimeters
export function pixelsToMm(pixels: number): number {
  return pixels * MM_PER_PIXEL;
}

export function mmToPixels(mm: number): number {
  return mm / MM_PER_PIXEL;
}
