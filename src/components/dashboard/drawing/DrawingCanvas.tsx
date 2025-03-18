import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

interface DrawingCanvasProps {
  activeTool: 'select' | 'pencil' | 'square' | 'circle' | 'triangle';
  activeColor: string;
  width?: number;
  height?: number;
}

interface Shape {
  type: 'square' | 'circle' | 'triangle' | 'line';
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
  color: string;
}

const DrawingCanvas = forwardRef<any, DrawingCanvasProps>(
  ({ activeTool, activeColor }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const isDrawingRef = useRef<boolean>(false);
    const shapesRef = useRef<Shape[]>([]);
    const undoHistoryRef = useRef<Shape[][]>([]);
    const redoHistoryRef = useRef<Shape[][]>([]);
    const currentShapeRef = useRef<Shape | null>(null);

    // Set up canvas on component mount
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Make the canvas responsive
      const resizeCanvas = () => {
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = 2;
            ctx.strokeStyle = activeColor;
            contextRef.current = ctx;
            
            // Redraw all shapes when resizing
            redrawCanvas();
          }
        }
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }, []);

    // Update stroke style when color changes
    useEffect(() => {
      if (contextRef.current) {
        contextRef.current.strokeStyle = activeColor;
      }
    }, [activeColor]);

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
          drawShape({
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

    const drawShape = (shape: Shape) => {
      if (!contextRef.current) return;
      
      const ctx = contextRef.current;
      ctx.beginPath();
      ctx.strokeStyle = shape.color;
      
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
    };

    const redrawCanvas = () => {
      if (!contextRef.current || !canvasRef.current) return;
      
      const ctx = contextRef.current;
      const canvas = canvasRef.current;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Redraw all shapes
      shapesRef.current.forEach(drawShape);
    };

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

    // Expose functions to parent component through ref
    useImperativeHandle(ref, () => ({
      clearCanvas,
      undo,
      redo,
      saveAsImage,
      setDrawingColor: (color: string) => {
        if (contextRef.current) {
          contextRef.current.strokeStyle = color;
        }
      },
      setDrawingTool: (tool: string) => {
        // Just to keep the interface consistent - tool is already updated in the parent
      }
    }));

    return (
      <canvas
        ref={canvasRef}
        className="w-full h-full border border-gray-200 rounded-md cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
      />
    );
  }
);

DrawingCanvas.displayName = "DrawingCanvas";
export default DrawingCanvas;
