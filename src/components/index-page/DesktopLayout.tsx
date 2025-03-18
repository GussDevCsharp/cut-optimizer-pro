
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, List, PenTool, Building2 } from 'lucide-react';
import SheetPanel from '../SheetPanel';
import CuttingBoard from '../CuttingBoard';
import { ProjectNameInput } from '../sheet-panel/ProjectNameInput';
import PiecesAndOptimizationPanel from '../PiecesAndOptimizationPanel';
import CollapsiblePiecesList from '../pieces-panel/CollapsiblePiecesList';
import { useSheetData } from '@/hooks/useSheetData';
import DrawingCanvas from '../dashboard/DrawingCanvas';
import ShapeSelector from '../dashboard/drawing/ShapeSelector';

export const DesktopLayout = () => {
  const { pieces, updatePiece, removePiece } = useSheetData();
  const [activeTool, setActiveTool] = useState<'select' | 'pencil' | 'square' | 'circle' | 'triangle'>('select');
  const [activeColor, setActiveColor] = useState('#3b82f6'); // Default color: blue
  const [lineWidth, setLineWidth] = useState(2); // Default line width: 2px
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
    <div className="space-y-1">
      {/* Project Name Card - more narrow and right-aligned */}
      <div className="flex justify-end mb-1">
        <Card className="animate-fade-in shadow-subtle border w-1/3 p-2 bg-gray-50">
          <ProjectNameInput />
        </Card>
      </div>
      
      <Tabs defaultValue="project" className="w-full font-work-sans">
        <TabsList className="mb-1 mx-auto w-[500px] bg-charcoal/90 text-white">
          <TabsTrigger value="project" className="flex-1 gap-1.5 data-[state=active]:bg-lilac data-[state=active]:text-white">
            <FileText size={16} />
            <span>Informações do Projeto</span>
          </TabsTrigger>
          <TabsTrigger value="pieces" className="flex-1 gap-1.5 data-[state=active]:bg-lilac data-[state=active]:text-white">
            <List size={16} />
            <span>Peças Inseridas</span>
          </TabsTrigger>
          <TabsTrigger value="drawing" className="flex-1 gap-1.5 data-[state=active]:bg-lilac data-[state=active]:text-white">
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
              <Card className="p-3 space-y-3 bg-gray-50 border border-gray-200">
                <div className="text-center mb-2">
                  <h3 className="font-playfair text-lg text-charcoal-dark">Ferramentas de Desenho</h3>
                  <div className="h-0.5 w-16 bg-lilac mx-auto mt-1"></div>
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
                  >
                    Salvar
                  </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button 
                    onClick={handleGenerateProject}
                    className="w-full py-2 px-3 bg-lilac hover:bg-lilac-dark text-white rounded flex items-center justify-center gap-2 transition-colors"
                  >
                    <Building2 size={16} />
                    Gerar Projeto
                  </button>
                </div>
              </Card>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesktopLayout;
