
import { MutableRefObject } from 'react';
import { Shape } from '../types/drawingTypes';
import { drawGrid } from '../utils/drawingUtils';

interface DrawingActionsParams {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  contextRef: MutableRefObject<CanvasRenderingContext2D | null>;
  shapesRef: MutableRefObject<Shape[]>;
  undoHistoryRef: MutableRefObject<Shape[][]>;
  redoHistoryRef: MutableRefObject<Shape[][]>;
  redrawCanvas: () => void;
}

export function useDrawingActions({
  canvasRef,
  contextRef,
  shapesRef,
  undoHistoryRef,
  redoHistoryRef,
  redrawCanvas
}: DrawingActionsParams) {
  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    
    // Clear all shapes
    shapesRef.current = [];
    
    // Save to history
    undoHistoryRef.current.push([...shapesRef.current]);
    redoHistoryRef.current = [];
    
    // Clear canvas and redraw grid
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
  };

  const undo = () => {
    if (undoHistoryRef.current.length <= 1) return;
    
    // Pop the current state
    undoHistoryRef.current.pop();
    
    // Get the previous state
    const previousShapes = undoHistoryRef.current[undoHistoryRef.current.length - 1];
    
    // Save current state for redo
    redoHistoryRef.current.push([...shapesRef.current]);
    
    // Set the shapes to the previous state
    shapesRef.current = [...previousShapes];
    
    // Redraw canvas
    redrawCanvas();
  };

  const redo = () => {
    if (redoHistoryRef.current.length === 0) return;
    
    // Get the next state
    const nextShapes = redoHistoryRef.current.pop() || [];
    
    // Save current state for undo
    undoHistoryRef.current.push([...shapesRef.current]);
    
    // Set the shapes to the next state
    shapesRef.current = [...nextShapes];
    
    // Redraw canvas
    redrawCanvas();
  };

  const saveAsImage = () => {
    if (!canvasRef.current) return;
    
    // Create a temporary canvas without the grid for saving
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    // Set dimensions
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;
    
    // Draw only the shapes (no grid)
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Copy current canvas state but don't include grid
    shapesRef.current.forEach(shape => {
      if (contextRef.current) {
        tempCtx.strokeStyle = shape.color;
        if (shape.lineWidth) {
          tempCtx.lineWidth = shape.lineWidth;
        }
        import('../utils/drawingUtils').then(({ drawShape }) => {
          drawShape(tempCtx, shape);
        });
      }
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = tempCanvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const setDrawingColor = (color: string) => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
    }
  };

  return {
    clearCanvas,
    undo,
    redo,
    saveAsImage,
    setDrawingColor,
  };
}
