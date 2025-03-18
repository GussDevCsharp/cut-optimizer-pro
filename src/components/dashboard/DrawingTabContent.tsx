
import React, { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Square, Circle, Triangle, Trash2, Save, Undo, Redo } from "lucide-react";
import { toast } from "sonner";
import DrawingCanvas from "./drawing/DrawingCanvas";
import ShapeSelector from "./drawing/ShapeSelector";

interface DrawingTabContentProps {
  userId: string | undefined;
  isActiveTab: boolean;
}

export function DrawingTabContent({ userId, isActiveTab }: DrawingTabContentProps) {
  const [activeTool, setActiveTool] = useState<'select' | 'pencil' | 'square' | 'circle' | 'triangle'>('select');
  const [activeColor, setActiveColor] = useState('#3b82f6'); // Default color: blue
  const [lineWidth, setLineWidth] = useState(2); // Default line width: 2px
  const canvasRef = useRef<any>(null);

  // Initialize or reset the canvas when tab becomes active
  useEffect(() => {
    if (isActiveTab && canvasRef.current) {
      // Any initialization can be done here when the tab becomes active
    }
  }, [isActiveTab]);

  const handleColorChange = (color: string) => {
    setActiveColor(color);
    if (canvasRef.current) {
      canvasRef.current.setDrawingColor(color);
    }
  };

  const handleToolSelect = (tool: typeof activeTool) => {
    setActiveTool(tool);
    if (canvasRef.current) {
      canvasRef.current.setDrawingTool(tool);
    }
  };

  const handleLineWidthChange = (width: number) => {
    setLineWidth(width);
    if (canvasRef.current) {
      canvasRef.current.setLineWidth(width);
    }
  };

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
      toast.success("Canvas limpo");
    }
  };

  const handleSaveDrawing = () => {
    if (canvasRef.current) {
      canvasRef.current.saveAsImage();
      toast.success("Desenho salvo com sucesso");
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const handleRedo = () => {
    if (canvasRef.current) {
      canvasRef.current.redo();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Módulo de Desenho</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleUndo}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRedo}>
            <Redo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearCanvas}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveDrawing}>
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-1">
          <Card className="p-4 space-y-4">
            <ShapeSelector 
              activeTool={activeTool} 
              onSelectTool={handleToolSelect} 
              activeColor={activeColor}
              onColorChange={handleColorChange}
              lineWidth={lineWidth}
              onLineWidthChange={handleLineWidthChange}
            />
          </Card>
        </div>
        <div className="lg:col-span-4">
          <Card className="p-1 lg:p-2 aspect-video">
            <DrawingCanvas 
              ref={canvasRef} 
              activeTool={activeTool} 
              activeColor={activeColor}
              lineWidth={lineWidth}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
