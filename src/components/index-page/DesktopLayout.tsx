
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, List } from 'lucide-react';
import SheetPanel from '../SheetPanel';
import CuttingBoard from '../CuttingBoard';
import { ProjectNameInput } from '../sheet-panel/ProjectNameInput';
import PiecesAndOptimizationPanel from '../PiecesAndOptimizationPanel';
import CollapsiblePiecesList from '../pieces-panel/CollapsiblePiecesList';
import { useSheetData } from '@/hooks/useSheetData';

export const DesktopLayout = () => {
  const { pieces, updatePiece, removePiece } = useSheetData();
  
  return (
    <div className="space-y-2">
      {/* Project Name Card - more narrow and right-aligned */}
      <div className="flex justify-end mb-1">
        <Card className="animate-fade-in shadow-subtle border w-1/3 p-3">
          <ProjectNameInput />
        </Card>
      </div>
      
      <Tabs defaultValue="project" className="w-full">
        <TabsList className="mb-2 mx-auto w-[400px]">
          <TabsTrigger value="project" className="flex-1 gap-1.5">
            <FileText size={16} />
            <span>Informações do Projeto</span>
          </TabsTrigger>
          <TabsTrigger value="pieces" className="flex-1 gap-1.5">
            <List size={16} />
            <span>Peças Inseridas</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Project Information Tab */}
        <TabsContent value="project" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            {/* Left Column - Controls in the order: Sheet, Pieces e Otimização */}
            <div className="lg:col-span-1 space-y-3">
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
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
      </Tabs>
    </div>
  );
};

export default DesktopLayout;
