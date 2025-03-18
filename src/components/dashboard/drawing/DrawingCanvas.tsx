
import React, { useImperativeHandle, forwardRef, useState } from "react";
import { useCanvasSetup } from "./hooks/useCanvasSetup";
import { useDrawingState } from "./hooks/useDrawingState";
import { useDrawingHandlers } from "./hooks/useDrawingHandlers";
import { useDrawingActions } from "./hooks/useDrawingActions";
import { DrawingCanvasProps } from "./types/drawingTypes";
import { generatePiecesFromShapes } from "./utils/projectGenerationUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DrawingCanvas = forwardRef<any, DrawingCanvasProps>(
  ({ activeTool, activeColor, lineWidth = 2, showGrid = true }, ref) => {
    const navigate = useNavigate();
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

    // Generate a project from drawing
    const generateProject = () => {
      if (shapesRef.current.length === 0) {
        toast.error("Não há formas para gerar um projeto", {
          description: "Desenhe algumas formas primeiro"
        });
        return;
      }
      
      const pieces = generatePiecesFromShapes(shapesRef.current);
      
      if (pieces.length === 0) {
        toast.error("Não foi possível gerar peças", {
          description: "Desenhe formas retangulares, círculos ou triângulos"
        });
        return;
      }
      
      // Create a simple project with these pieces
      const projectData = {
        pieces: pieces,
        // Use a default sheet size
        sheet: {
          width: 2750,
          height: 1830,
          thickness: 18,
          materialName: "MDF"
        },
        placedPieces: []
      };
      
      // Store data in localStorage for transfer to project page
      localStorage.setItem('drawing-project-data', JSON.stringify(projectData));
      
      toast.success(`Projeto gerado com ${pieces.length} tipos de peças`, {
        description: "Redirecionando para o editor de projetos"
      });
      
      // Navigate to project editor after a short delay
      setTimeout(() => {
        navigate('/index');
      }, 1500);
    };

    // Expose functions to parent component through ref
    useImperativeHandle(ref, () => ({
      clearCanvas,
      undo,
      redo,
      saveAsImage,
      generateProject,
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
