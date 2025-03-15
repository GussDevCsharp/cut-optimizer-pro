
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors } from 'lucide-react';
import { ProjectNameInput } from '../sheet-panel/ProjectNameInput';
import SheetPanel from '../SheetPanel';
import PiecesPanel from '../PiecesPanel';
import CuttingBoard from '../CuttingBoard';
import OptimizationControls from '../OptimizationControls';

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
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="cuttingBoard">Visualização</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="pieces">Peças</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cuttingBoard" className="mt-4">
          <CuttingBoard />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4 space-y-4">
          <SheetPanel />
          <Card className="animate-fade-in shadow-subtle border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  <CardTitle>Melhor Corte</CardTitle>
                </div>
              </div>
              <CardDescription>
                Otimize o corte de chapas com eficiência máxima
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OptimizationControls />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pieces" className="mt-4">
          <PiecesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileLayout;
