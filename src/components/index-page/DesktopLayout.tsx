
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SheetPanel from '../SheetPanel';
import CuttingBoard from '../CuttingBoard';
import { ProjectNameInput } from '../sheet-panel/ProjectNameInput';
import PiecesAndOptimizationPanel from '../PiecesAndOptimizationPanel';
import CollapsiblePiecesList from '../pieces-panel/CollapsiblePiecesList';
import { useSheetData } from '@/hooks/useSheetData';

export const DesktopLayout = () => {
  const { pieces, updatePiece, removePiece } = useSheetData();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
      
      {/* Middle Column - Visualization with multiple sheets in carousel */}
      <div className="lg:col-span-2">
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
  );
};

export default DesktopLayout;
