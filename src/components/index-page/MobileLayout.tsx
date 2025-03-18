
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Settings, List, PenTool, Building2 } from 'lucide-react';
import SheetPanel from '../SheetPanel';
import CuttingBoard from '../CuttingBoard';
import { ProjectNameInput } from '../sheet-panel/ProjectNameInput';
import PiecesAndOptimizationPanel from '../PiecesAndOptimizationPanel';
import { useSheetData } from '@/hooks/useSheetData';
import CollapsiblePiecesList from '../pieces-panel/CollapsiblePiecesList';
import DrawingCanvas from '../dashboard/DrawingCanvas';
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
  
  const handleGenerateProject = () => {
    if (canvasRef.current) {
      canvasRef.current.generateProject();
    }
  };
  
  return (
    <div className="w-full space-y-1 font-work-sans">
      {/* Project Name Card - more compact */}
      <div className="flex justify-end mb-1">
        <Card className="animate-fade-in shadow-subtle border w-4/5 p-2 bg-gray-50">
          <ProjectNameInput />
        </Card>
      </div>

      {/* Main/Outer Tabs for Project/Pieces/Drawing */}
      <Tabs defaultValue="project" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-1 bg-charcoal/90 text-white">
          <TabsTrigger value="project" className="gap-1.5 data-[state=active]:bg-lilac data-[state=active]:text-white">
            <FileText size={16} />
            <span>Projeto</span>
          </TabsTrigger>
          <TabsTrigger value="pieces" className="gap-1.5 data-[state=active]:bg-lilac data-[state=active]:text-white">
            <List size={16} />
            <span>Peças</span>
          </TabsTrigger>
          <TabsTrigger value="drawing" className="gap-1.5 data-[state=active]:bg-lilac data-[state=active]:text-white">
            <PenTool size={16} />
            <span>Desenho</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Project Information Tab with nested tabs for Visualization/Settings */}
        <TabsContent value="project" className="mt-0">
          <Tabs defaultValue="cuttingBoard" className="w-full">
            <TabsList className="w-full grid grid-cols-2 border border-gray-200 bg-gray-50">
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
              </button>
            </div>
            
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileLayout;
