
import React from 'react';
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Sheet, PlacedPiece } from '../../hooks/useSheetData';

interface StatsDisplayProps {
  sheet: Sheet;
  placedPieces: PlacedPiece[];
  stats: {
    efficiency: number;
    sheetCount: number;
  };
  onPrint: () => void;
}

export const StatsDisplay = ({ sheet, placedPieces, stats, onPrint }: StatsDisplayProps) => {
  return (
    <div className="mb-4 text-sm flex justify-between items-center">
      <div className="px-3 py-1.5 rounded-md bg-background/95 border shadow-subtle inline-block">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="text-muted-foreground">Dimensões:</div>
          <div className="font-medium text-right">{sheet.width}×{sheet.height}mm</div>
          
          <div className="text-muted-foreground">Peças:</div>
          <div className="font-medium text-right">{placedPieces.length}</div>
          
          <div className="text-muted-foreground">Chapas utilizadas:</div>
          <div className="font-medium text-right">{stats.sheetCount}</div>
          
          <div className="text-muted-foreground">Eficiência:</div>
          <div className="font-medium text-right">{stats.efficiency.toFixed(1)}%</div>
          
          <div className="text-muted-foreground">Largura de corte:</div>
          <div className="font-medium text-right">{sheet.cutWidth}mm</div>
        </div>
      </div>
      
      <Button variant="outline" size="sm" onClick={onPrint} className="gap-2">
        <Printer size={16} />
        Imprimir
      </Button>
    </div>
  );
};
