
import React, { useImperativeHandle, forwardRef, useState } from "react";
import { useCanvasSetup } from "./hooks/useCanvasSetup";
import { useDrawingState } from "./hooks/useDrawingState";
import { useDrawingHandlers } from "./hooks/useDrawingHandlers";
import { useDrawingActions } from "./hooks/useDrawingActions";
import { DrawingCanvasProps } from "./types/drawingTypes";

const DrawingCanvas = forwardRef<any, DrawingCanvasProps>(
  ({ activeTool, activeColor, lineWidth = 2, showGrid = true }, ref) => {
    // Local state to track line width
    const [currentLineWidth, setCurrentLineWidth] = useState(lineWidth);
    
    // Set up canvas and context
    const { canvasRef, contextRef } = useCanvasSetup(activeColor, currentLineWidth, showGrid);
    
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
      activeColor,
      lineWidth: currentLineWidth
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

    // Function to change line width
    const setLineWidth = (width: number) => {
      setCurrentLineWidth(width);
      if (contextRef.current) {
        contextRef.current.lineWidth = width;
      }
    };

    // Expose functions to parent component through ref
    useImperativeHandle(ref, () => ({
      clearCanvas,
      undo,
      redo,
      saveAsImage,
      setDrawingColor,
      setLineWidth,
      setDrawingTool: () => {
        // Just to keep the interface consistent - tool is already updated in the parent
      }
    }));

    return (
      <div className="relative w-full h-full">
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
        <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 text-xs rounded shadow-sm">
          Escala: 1 pixel ≈ 0.26mm
        </div>
      </div>
    );
  }
);

DrawingCanvas.displayName = "DrawingCanvas";
export default DrawingCanvas;
