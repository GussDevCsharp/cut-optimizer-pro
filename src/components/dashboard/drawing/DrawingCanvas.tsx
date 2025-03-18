
import React, { useImperativeHandle, forwardRef } from "react";
import { useCanvasSetup } from "./hooks/useCanvasSetup";
import { useDrawingState } from "./hooks/useDrawingState";
import { useDrawingHandlers } from "./hooks/useDrawingHandlers";
import { useDrawingActions } from "./hooks/useDrawingActions";
import { DrawingCanvasProps } from "./types/drawingTypes";

const DrawingCanvas = forwardRef<any, DrawingCanvasProps>(
  ({ activeTool, activeColor }, ref) => {
    // Set up canvas and context
    const { canvasRef, contextRef } = useCanvasSetup(activeColor);
    
    // Set up drawing state
    const { isDrawingRef, shapesRef, undoHistoryRef, redoHistoryRef, currentShapeRef } = useDrawingState();
    
    // Set up drawing handlers
    const { startDrawing, draw, finishDrawing, redrawCanvas } = useDrawingHandlers({
      canvasRef,
      contextRef,
      isDrawingRef,
      shapesRef,
      currentShapeRef,
      undoHistoryRef,
      redoHistoryRef,
      activeTool,
      activeColor
    });

    // Set up drawing actions
    const { clearCanvas, undo, redo, saveAsImage, setDrawingColor } = useDrawingActions({
      canvasRef,
      contextRef,
      shapesRef,
      undoHistoryRef,
      redoHistoryRef,
      redrawCanvas
    });

    // Expose functions to parent component through ref
    useImperativeHandle(ref, () => ({
      clearCanvas,
      undo,
      redo,
      saveAsImage,
      setDrawingColor,
      setDrawingTool: () => {
        // Just to keep the interface consistent - tool is already updated in the parent
      }
    }));

    return (
      <canvas
        ref={canvasRef}
        className="w-full h-full border border-gray-200 rounded-md cursor-crosshair touch-none"
        // Mouse events
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        // Touch events
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={finishDrawing}
        onTouchCancel={finishDrawing}
      />
    );
  }
);

DrawingCanvas.displayName = "DrawingCanvas";
export default DrawingCanvas;
