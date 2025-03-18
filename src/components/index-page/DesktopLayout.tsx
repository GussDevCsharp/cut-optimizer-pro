
import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, List, PenTool } from 'lucide-react';
import { useSheetData } from '@/hooks/useSheetData';
import ProjectHeader from './desktop/ProjectHeader';
import ProjectInfoTab from './desktop/ProjectInfoTab';
import PiecesListTab from './desktop/PiecesListTab';
import DrawingTab from './desktop/DrawingTab';

export const DesktopLayout = () => {
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
  
  return (
    <div className="space-y-1">
      <ProjectHeader />
      
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
          <ProjectInfoTab />
        </TabsContent>
        
        {/* Pieces List Tab */}
        <TabsContent value="pieces" className="mt-0">
          <PiecesListTab />
        </TabsContent>
        
        {/* Drawing Tab */}
        <TabsContent value="drawing" className="mt-0">
          <DrawingTab 
            activeTool={activeTool}
            activeColor={activeColor}
            lineWidth={lineWidth}
            onToolSelect={handleToolSelect}
            onColorChange={handleColorChange}
            onLineWidthChange={handleLineWidthChange}
            canvasRef={canvasRef}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesktopLayout;
