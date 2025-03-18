
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, List, PenTool } from 'lucide-react';
import SheetPanel from '../SheetPanel';
import CuttingBoard from '../CuttingBoard';
import { ProjectNameInput } from '../sheet-panel/ProjectNameInput';
import PiecesAndOptimizationPanel from '../PiecesAndOptimizationPanel';
import CollapsiblePiecesList from '../pieces-panel/CollapsiblePiecesList';
import { useSheetData } from '@/hooks/useSheetData';
import DrawingCanvas from '../dashboard/drawing/DrawingCanvas';
import ShapeSelector from '../dashboard/drawing/ShapeSelector';

export const DesktopLayout = () => {
  const { pieces, updatePiece, removePiece } = useSheetData();
  const [activeTool, setActiveTool] = useState<'select' | 'pencil' | 'square' | 'circle' | 'triangle'>('select');
  const [activeColor, setActiveColor] = useState('#3b82f6'); // Default color: blue
  const canvasRef = React.useRef<any>(null);

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
    <div className="space-y-1">
      {/* Project Name Card - more narrow and right-aligned */}
      <div className="flex justify-end mb-1">
        <Card className="animate-fade-in shadow-subtle border w-1/3 p-2">
          <ProjectNameInput />
        </Card>
      </div>
      
      <Tabs defaultValue="project" className="w-full">
        <TabsList className="mb-1 mx-auto w-[500px]">
          <TabsTrigger value="project" className="flex-1 gap-1.5">
            <FileText size={16} />
            <span>Informações do Projeto</span>
          </TabsTrigger>
          <TabsTrigger value="pieces" className="flex-1 gap-1.5">
            <List size={16} />
            <span>Peças Inseridas</span>
          </TabsTrigger>
          <TabsTrigger value="drawing" className="flex-1 gap-1.5">
            <PenTool size={16} />
            <span>Desenho</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Project Information Tab */}
        <TabsContent value="project" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
            {/* Left Column - Controls in the order: Sheet, Pieces e Otimização */}
            <div className="lg:col-span-1 space-y-2">
              <SheetPanel />
              <PiecesAndOptimizationPanel />
            </div>
            
            {/* Middle to Right Column - Visualization with multiple sheets in carousel */}
            <div className="lg:col-span-3">
              <CuttingBoard />
            </div>
          </div>
        </TabsContent>
        
        {/* Pieces List Tab */}
        <TabsContent value="pieces" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
            {/* Left Column - Cutting Board */}
            <div className="lg:col-span-3">
              <CuttingBoard />
            </div>
            
            {/* Right Column - Pieces List */}
            <div className="lg:col-span-1 h-full">
              <CollapsiblePiecesList 
                pieces={pieces}
                onUpdatePiece={updatePiece}
                onRemovePiece={removePiece}
              />
            </div>
          </div>
        </TabsContent>
        
        {/* Drawing Tab */}
        <TabsContent value="drawing" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
            <div className="lg:col-span-1">
              <Card className="p-3 space-y-3">
                <ShapeSelector 
                  activeTool={activeTool} 
                  onSelectTool={handleToolSelect} 
                  activeColor={activeColor}
                  onColorChange={handleColorChange}
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
            </div>
            <div className="lg:col-span-4">
              <Card className="p-1 aspect-video">
                <DrawingCanvas 
                  ref={canvasRef} 
                  activeTool={activeTool} 
                  activeColor={activeColor} 
                />
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesktopLayout;
