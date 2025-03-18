
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Building2 } from 'lucide-react';
import DrawingCanvas from '../../dashboard/DrawingCanvas';
import ShapeSelector from '../../dashboard/drawing/ShapeSelector';
import DrawingTools from './DrawingTools';

export const DrawingTab = () => {
  const [activeTool, setActiveTool] = useState<'select' | 'pencil' | 'square' | 'circle' | 'triangle'>('select');
  const [activeColor, setActiveColor] = useState('#3b82f6');
  const [lineWidth, setLineWidth] = useState(2);
  const canvasRef = useRef<any>(null);

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

  const handleGenerateProject = () => {
    if (canvasRef.current) {
      canvasRef.current.generateProject();
    }
  };

  const handleActions = {
    clearCanvas: () => canvasRef.current?.clearCanvas(),
    saveDrawing: () => canvasRef.current?.saveAsImage(),
    undo: () => canvasRef.current?.undo(),
    redo: () => canvasRef.current?.redo()
  };

  return (
    <>
      <Card className="p-1 aspect-video mb-2 border border-gray-300">
        <DrawingCanvas 
          ref={canvasRef} 
          activeTool={activeTool} 
          activeColor={activeColor}
          lineWidth={lineWidth}
        />
      </Card>
      
      <Card className="p-2 space-y-2 bg-gray-50 border border-gray-200">
        <div className="text-center mb-1">
          <h3 className="font-playfair text-base text-charcoal-dark">Ferramentas</h3>
          <div className="h-0.5 w-12 bg-lilac mx-auto mt-0.5"></div>
        </div>
        
        <ShapeSelector 
          activeTool={activeTool} 
          onSelectTool={handleToolSelect} 
          activeColor={activeColor}
          onColorChange={handleColorChange}
          lineWidth={lineWidth}
          onLineWidthChange={handleLineWidthChange}
        />
        
        <DrawingTools onAction={handleActions} />
        
        <div className="mt-3 pt-2 border-t border-gray-200">
          <button 
            onClick={handleGenerateProject}
            className="w-full py-2 px-3 bg-lilac hover:bg-lilac-dark text-white rounded flex items-center justify-center gap-2 transition-colors"
          >
            <Building2 size={16} />
            Gerar Projeto
          </button>
        </div>
      </Card>
    </>
  );
};
