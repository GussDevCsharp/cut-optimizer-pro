
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SheetPanel from '../SheetPanel';
import CuttingBoard from '../CuttingBoard';
import { ProjectNameInput } from '../sheet-panel/ProjectNameInput';
import PiecesAndOptimizationPanel from '../PiecesAndOptimizationPanel';

export const MobileLayout = () => {
  return (
    <div className="w-full space-y-4">
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

      {/* Tabs interface for mobile */}
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
    </div>
  );
};

export default MobileLayout;
