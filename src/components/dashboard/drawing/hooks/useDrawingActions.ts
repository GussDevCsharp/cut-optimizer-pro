
import { MutableRefObject } from 'react';
import { Shape } from '../types/drawingTypes';

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
    
    // Save current state for undo
    undoHistoryRef.current.push([...shapesRef.current]);
    redoHistoryRef.current = [];
    
    // Clear all shapes
    shapesRef.current = [];
    
    // Redraw (clear) canvas
    redrawCanvas();
  };

  const undo = () => {
    if (undoHistoryRef.current.length > 0) {
      // Save current state for redo
      redoHistoryRef.current.push([...shapesRef.current]);
      
      // Pop the last state from undo history
      const previousState = undoHistoryRef.current.pop();
      if (previousState && previousState.length > 0) {
        // Set the current shapes to the previous state
        shapesRef.current = [...previousState];
      } else {
        // If the previous state was empty, clear the canvas
        shapesRef.current = [];
      }
      
      // Redraw canvas
      redrawCanvas();
    }
  };

  const redo = () => {
    if (redoHistoryRef.current.length > 0) {
      // Save current state for undo
      undoHistoryRef.current.push([...shapesRef.current]);
      
      // Pop the last state from redo history
      const nextState = redoHistoryRef.current.pop();
      if (nextState) {
        // Set the current shapes to the next state
        shapesRef.current = [...nextState];
      }
      
      // Redraw canvas
      redrawCanvas();
    }
  };

  const saveAsImage = () => {
    if (!canvasRef.current) return;
    
    // Convert canvas to data URL
    const dataUrl = canvasRef.current.toDataURL('image/png');
    
    // Create a link element
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `desenho-${new Date().toISOString().slice(0, 10)}.png`;
    
    // Trigger download
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
    setDrawingColor
  };
}
