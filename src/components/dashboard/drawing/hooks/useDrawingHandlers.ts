
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

  // Get coordinates from either mouse or touch event
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Check if it's a touch event
    if ('touches' in e) {
      // Handle touch event
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      // Handle mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    // Prevent default behavior for touch events to avoid scrolling
    if ('touches' in e) {
      e.preventDefault();
    }
    
    const { x, y } = getCoordinates(e);
    
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

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !contextRef.current || !canvasRef.current) return;
    
    // Prevent default behavior for touch events to avoid scrolling
    if ('touches' in e) {
      e.preventDefault();
    }
    
    const { x, y } = getCoordinates(e);
    
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

  const finishDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !contextRef.current || !canvasRef.current) return;
    
    let x, y;
    
    // For touch events, we need to use changedTouches since there may not be any active touches
    if ('changedTouches' in e) {
      const touch = e.changedTouches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      const rect = canvasRef.current.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
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
