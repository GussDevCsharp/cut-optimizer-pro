
import { Shape } from '../types/drawingTypes';
import { Piece } from '@/hooks/useSheetData';
import { pixelsToMm } from './drawingUtils';

// Helper to get bounding box of a shape
export function getShapeBoundingBox(shape: Shape): { width: number, height: number } {
  const { startX, startY, endX = startX, endY = startY } = shape;
  
  // Calculate width and height in pixels
  const widthPx = Math.abs(endX - startX);
  const heightPx = Math.abs(endY - startY);
  
  // Convert to millimeters
  const widthMm = Math.ceil(pixelsToMm(widthPx));
  const heightMm = Math.ceil(pixelsToMm(heightPx));
  
  return {
    width: widthMm,
    height: heightMm
  };
}

// Generate pieces from shapes
export function generatePiecesFromShapes(shapes: Shape[]): Piece[] {
  const pieces: Piece[] = [];
  
  // Skip line shapes as they're not suitable for cutting projects
  const validShapes = shapes.filter(shape => shape.type !== 'line');
  
  if (validShapes.length === 0) {
    return pieces;
  }
  
  // Group similar shapes by dimensions (with 1mm tolerance)
  const shapeGroups: { [key: string]: Shape[] } = {};
  
  validShapes.forEach(shape => {
    const { width, height } = getShapeBoundingBox(shape);
    // Use dimensions as key to group similar shapes
    const key = `${width}x${height}`;
    
    if (!shapeGroups[key]) {
      shapeGroups[key] = [];
    }
    
    shapeGroups[key].push(shape);
  });
  
  // Create pieces from the shape groups
  let pieceCounter = 1;
  
  Object.entries(shapeGroups).forEach(([dimensions, shapesInGroup]) => {
    const [width, height] = dimensions.split('x').map(Number);
    
    if (width === 0 || height === 0) {
      return; // Skip invalid dimensions
    }
    
    // Create a piece for this group
    pieces.push({
      id: `drawing-piece-${pieceCounter++}`,
      width,
      height, 
      quantity: shapesInGroup.length,
      color: shapesInGroup[0].color, // Use color of the first shape in group
      rotation: 0,
      x: 0,
      y: 0,
      canRotate: true
    });
  });
  
  return pieces;
}
