
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SheetPanel from '../../SheetPanel';
import CuttingBoard from '../../CuttingBoard';
import PiecesAndOptimizationPanel from '../../PiecesAndOptimizationPanel';

export const ProjectTab = () => {
  return (
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
  );
};
