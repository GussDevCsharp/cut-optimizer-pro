
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
  
  // Draw dimensions
  if (shape.type !== 'line') {
    drawDimensions(ctx, shape);
  }
  
  // Add dashed rectangle outline for non-rectangular shapes
  if (shape.type !== 'square' && shape.type !== 'line') {
    drawDashedBoundingBox(ctx, shape);
  }
}

// New function to draw dashed bounding box for non-rectangular shapes
export function drawDashedBoundingBox(ctx: CanvasRenderingContext2D, shape: Shape): void {
  const { startX, startY, endX = startX, endY = startY } = shape;
  
  // Calculate the bounding box
  const minX = Math.min(startX, endX);
  const minY = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  
  // Save current context state
  ctx.save();
  
  // Set dashed line properties
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 3]); // Dashed line pattern
  
  // Draw the rectangle
  ctx.strokeRect(minX, minY, width, height);
  
  // Restore context
  ctx.restore();
}

// New function to draw dimensions
export function drawDimensions(ctx: CanvasRenderingContext2D, shape: Shape): void {
  const { startX, startY, endX = startX, endY = startY } = shape;
  
  // Calculate the bounding box
  const minX = Math.min(startX, endX);
  const minY = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  
  // Convert to mm for display
  const widthMm = Math.ceil(pixelsToMm(width));
  const heightMm = Math.ceil(pixelsToMm(height));
  
  // Save current context state
  ctx.save();
  
  // Set text properties for dimensions
  ctx.font = '12px Arial';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.textAlign = 'center';
  
  // Draw width dimension (on top)
  const widthText = `${widthMm}mm`;
  ctx.fillText(widthText, minX + width / 2, minY - 5);
  
  // Draw height dimension (on left side)
  const heightText = `${heightMm}mm`;
  ctx.save();
  ctx.translate(minX - 5, minY + height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(heightText, 0, 0);
  ctx.restore();
  
  // If it's not a square, add a small text in the bottom right to indicate outer dimensions
  if (shape.type !== 'square') {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.font = '10px Arial';
    ctx.fillText('*dimensão externa', minX + width - 45, minY + height + 15);
  }
  
  // Restore context
  ctx.restore();
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
