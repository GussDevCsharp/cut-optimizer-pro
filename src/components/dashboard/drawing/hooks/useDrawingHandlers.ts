
import { MutableRefObject } from 'react';
import { Shape, DrawingTool } from '../types/drawingTypes';
import { drawShape } from '../utils/drawingUtils';

interface DrawingHandlersParams {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  contextRef: MutableRefObject<CanvasRenderingContext2D | null>;
  isDrawingRef: MutableRefObject<boolean>;
  shapesRef: MutableRefObject<Shape[]>;
  currentShapeRef: MutableRefObject<Shape | null>;
  undoHistoryRef: MutableRefObject<Shape[][]>;
  redoHistoryRef: MutableRefObject<Shape[][]>;
  activeTool: DrawingTool;
  activeColor: string;
}

export function useDrawingHandlers({
  canvasRef,
  contextRef,
  isDrawingRef,
  shapesRef,
  currentShapeRef,
  undoHistoryRef,
  redoHistoryRef,
  activeTool,
  activeColor
}: DrawingHandlersParams) {
  const redrawCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw all shapes
    shapesRef.current.forEach(shape => drawShape(ctx, shape));
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    isDrawingRef.current = true;
    
    if (activeTool === 'pencil') {
      contextRef.current?.beginPath();
      contextRef.current?.moveTo(x, y);
      currentShapeRef.current = {
        type: 'line',
        startX: x,
        startY: y,
        color: activeColor
      };
    } else if (activeTool !== 'select') {
      currentShapeRef.current = {
        type: activeTool,
        startX: x,
        startY: y,
        color: activeColor
      };
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !contextRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (activeTool === 'pencil') {
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    } else if (activeTool !== 'select') {
      // Redraw canvas to clear the temporary shape
      redrawCanvas();
      
      // Draw the shape in progress
      if (currentShapeRef.current) {
        drawShape(contextRef.current, {
          ...currentShapeRef.current,
          endX: x,
          endY: y
        });
      }
    }
  };

  const finishDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !contextRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    isDrawingRef.current = false;
    
    if (activeTool === 'pencil') {
      contextRef.current.closePath();
    }
    
    if (currentShapeRef.current && activeTool !== 'select') {
      const newShape = {
        ...currentShapeRef.current,
        endX: x,
        endY: y
      };
      
      shapesRef.current = [...shapesRef.current, newShape];
      undoHistoryRef.current.push([...shapesRef.current]);
      redoHistoryRef.current = [];
      currentShapeRef.current = null;
      
      // Final redraw to ensure everything is consistent
      redrawCanvas();
    }
  };

  return {
    startDrawing,
    draw,
    finishDrawing,
    redrawCanvas
  };
}
