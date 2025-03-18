
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-4">
      {/* Project Name Card always visible at top */}
      <Card className="animate-fade-in shadow-subtle border">
        <CardHeader className="pb-2">
          <CardTitle>Projeto</CardTitle>
          <CardDescription>
            Identifique seu projeto de corte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectNameInput />
        </CardContent>
      </Card>
      
      <Tabs defaultValue="project" className="w-full">
        <TabsList className="mb-4 mx-auto w-[400px]">
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Controls in the order: Sheet, Pieces e Otimização */}
            <div className="lg:col-span-1 space-y-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
