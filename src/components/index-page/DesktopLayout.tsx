
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors } from 'lucide-react';
import { ProjectNameInput } from '../sheet-panel/ProjectNameInput';
import SheetPanel from '../SheetPanel';
import PiecesPanel from '../PiecesPanel';
import CuttingBoard from '../CuttingBoard';
import OptimizationControls from '../OptimizationControls';

export const DesktopLayout = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Controls in the order: Project Name, Chapa, Peças, Melhor Corte */}
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
        <PiecesPanel />
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
      </div>
      
      {/* Right Column - Visualization with multiple sheets in carousel */}
      <div className="lg:col-span-2">
        <CuttingBoard />
      </div>
    </div>
  );
};

export default DesktopLayout;
