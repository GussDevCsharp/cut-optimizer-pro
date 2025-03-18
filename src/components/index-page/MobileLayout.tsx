
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Settings, List, PenTool } from 'lucide-react';
import SheetPanel from '../SheetPanel';
import CuttingBoard from '../CuttingBoard';
import { ProjectNameInput } from '../sheet-panel/ProjectNameInput';
import PiecesAndOptimizationPanel from '../PiecesAndOptimizationPanel';
import { useSheetData } from '@/hooks/useSheetData';
import CollapsiblePiecesList from '../pieces-panel/CollapsiblePiecesList';
import DrawingCanvas from '../dashboard/drawing/DrawingCanvas';
import ShapeSelector from '../dashboard/drawing/ShapeSelector';

export const MobileLayout = () => {
  const { pieces, updatePiece, removePiece } = useSheetData();
  const [activeTool, setActiveTool] = useState<'select' | 'pencil' | 'square' | 'circle' | 'triangle'>('select');
  const [activeColor, setActiveColor] = useState('#3b82f6'); // Default color: blue
  const [lineWidth, setLineWidth] = useState(2); // Default line width: 2px
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
    <div className="w-full space-y-1">
      {/* Project Name Card - more compact */}
      <div className="flex justify-end mb-1">
        <Card className="animate-fade-in shadow-subtle border w-4/5 p-2">
          <ProjectNameInput />
        </Card>
      </div>

      {/* Main/Outer Tabs for Project/Pieces/Drawing */}
      <Tabs defaultValue="project" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-1">
          <TabsTrigger value="project" className="gap-1.5">
            <FileText size={16} />
            <span>Projeto</span>
          </TabsTrigger>
          <TabsTrigger value="pieces" className="gap-1.5">
            <List size={16} />
            <span>Peças</span>
          </TabsTrigger>
          <TabsTrigger value="drawing" className="gap-1.5">
            <PenTool size={16} />
            <span>Desenho</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Project Information Tab with nested tabs for Visualization/Settings */}
        <TabsContent value="project" className="mt-0">
          <Tabs defaultValue="cuttingBoard" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="cuttingBoard">Visualização</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cuttingBoard" className="mt-1">
              <CuttingBoard />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-1 space-y-2">
              <SheetPanel />
              <PiecesAndOptimizationPanel />
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        {/* Pieces List Tab */}
        <TabsContent value="pieces" className="mt-0">
          <CuttingBoard />
          <div className="mt-2">
            <CollapsiblePiecesList 
              pieces={pieces}
              onUpdatePiece={updatePiece}
              onRemovePiece={removePiece}
            />
          </div>
        </TabsContent>
        
        {/* Drawing Tab */}
        <TabsContent value="drawing" className="mt-0">
          <Card className="p-1 aspect-video mb-2">
            <DrawingCanvas 
              ref={canvasRef} 
              activeTool={activeTool} 
              activeColor={activeColor}
              lineWidth={lineWidth}
            />
          </Card>
          
          <Card className="p-2 space-y-2">
            <ShapeSelector 
              activeTool={activeTool} 
              onSelectTool={handleToolSelect} 
              activeColor={activeColor}
              onColorChange={handleColorChange}
              lineWidth={lineWidth}
              onLineWidthChange={handleLineWidthChange}
            />
            
            <div className="flex flex-wrap gap-1 mt-2">
              <button 
                onClick={handleUndo}
                className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                title="Desfazer"
              >
                Desfazer
              </button>
              <button 
                onClick={handleRedo}
                className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                title="Refazer"
              >
                Refazer
              </button>
              <button 
                onClick={handleClearCanvas}
                className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                title="Limpar"
              >
                Limpar
              </button>
              <button 
                onClick={handleSaveDrawing}
                className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                title="Salvar"
              >
                Salvar
              </button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileLayout;
