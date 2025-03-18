
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
