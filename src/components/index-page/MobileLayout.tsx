
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Settings, List } from 'lucide-react';
import SheetPanel from '../SheetPanel';
import CuttingBoard from '../CuttingBoard';
import { ProjectNameInput } from '../sheet-panel/ProjectNameInput';
import PiecesAndOptimizationPanel from '../PiecesAndOptimizationPanel';
import { useSheetData } from '@/hooks/useSheetData';
import CollapsiblePiecesList from '../pieces-panel/CollapsiblePiecesList';

export const MobileLayout = () => {
  const { pieces, updatePiece, removePiece } = useSheetData();
  
  return (
    <div className="w-full space-y-4">
      {/* Project Name Card - more compact */}
      <div className="flex justify-end">
        <Card className="animate-fade-in shadow-subtle border w-4/5">
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
      </div>

      {/* Main/Outer Tabs for Project/Pieces */}
      <Tabs defaultValue="project" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="project" className="gap-1.5">
            <FileText size={16} />
            <span>Projeto</span>
          </TabsTrigger>
          <TabsTrigger value="pieces" className="gap-1.5">
            <List size={16} />
            <span>Peças</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Project Information Tab with nested tabs for Visualization/Settings */}
        <TabsContent value="project" className="mt-0">
          <Tabs defaultValue="cuttingBoard" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="cuttingBoard">Visualização</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cuttingBoard" className="mt-4">
              <CuttingBoard />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-4 space-y-4">
              <SheetPanel />
              <PiecesAndOptimizationPanel />
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        {/* Pieces List Tab */}
        <TabsContent value="pieces" className="mt-0">
          <CuttingBoard />
          <div className="mt-4">
            <CollapsiblePiecesList 
              pieces={pieces}
              onUpdatePiece={updatePiece}
              onRemovePiece={removePiece}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileLayout;
