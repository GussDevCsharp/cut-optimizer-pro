
import React, { useRef } from 'react';
import { Card } from "@/components/ui/card";
import DrawingCanvas from '../../dashboard/DrawingCanvas';
import DrawingTools from './DrawingTools';

interface DrawingTabProps {
  activeTool: 'select' | 'pencil' | 'square' | 'circle' | 'triangle';
  activeColor: string;
  lineWidth: number;
  onToolSelect: (tool: 'select' | 'pencil' | 'square' | 'circle' | 'triangle') => void;
  onColorChange: (color: string) => void;
  onLineWidthChange: (width: number) => void;
  canvasRef: React.RefObject<any>;
}

export const DrawingTab = ({
  activeTool,
  activeColor,
  lineWidth,
  onToolSelect,
  onColorChange,
  onLineWidthChange,
  canvasRef
}: DrawingTabProps) => {
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

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  const handleSaveDrawing = () => {
    if (canvasRef.current) {
      canvasRef.current.saveAsImage();
    }
  };

  const handleGenerateProject = () => {
    if (canvasRef.current) {
      canvasRef.current.generateProject();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
      <div className="lg:col-span-1">
        <DrawingTools 
          activeTool={activeTool}
          activeColor={activeColor}
          lineWidth={lineWidth}
          onToolSelect={onToolSelect}
          onColorChange={onColorChange}
          onLineWidthChange={onLineWidthChange}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClearCanvas={handleClearCanvas}
          onSaveDrawing={handleSaveDrawing}
          onGenerateProject={handleGenerateProject}
        />
      </div>
      <div className="lg:col-span-4">
        <Card className="p-1 aspect-video border border-gray-300">
          <DrawingCanvas 
            ref={canvasRef} 
            activeTool={activeTool} 
            activeColor={activeColor}
            lineWidth={lineWidth}
          />
        </Card>
      </div>
    </div>
  );
};

export default DrawingTab;
