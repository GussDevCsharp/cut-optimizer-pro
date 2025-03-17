
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SheetPanel from '../SheetPanel';
import CuttingBoard from '../CuttingBoard';
import { ProjectNameInput } from '../sheet-panel/ProjectNameInput';
import PiecesAndOptimizationPanel from '../PiecesAndOptimizationPanel';

export const DesktopLayout = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Controls in the order: Project Name, Chapa, Peças e Otimização */}
      <div className="lg:col-span-1 space-y-6">
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
        <SheetPanel />
        <PiecesAndOptimizationPanel />
      </div>
      
      {/* Right Column - Visualization with multiple sheets in carousel */}
      <div className="lg:col-span-2">
        <CuttingBoard />
      </div>
    </div>
  );
};

export default DesktopLayout;
