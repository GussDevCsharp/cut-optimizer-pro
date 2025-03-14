
import { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useSheetData, PlacedPiece } from '../hooks/useSheetData';

export const CuttingBoard = () => {
  const { sheet, placedPieces, stats } = useSheetData();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Fixed container dimensions
  const containerWidth = 800;
  const containerHeight = 600;
  
  // Calculate scale factor to fit the sheet in the container
  const scaleX = containerWidth / sheet.width;
  const scaleY = containerHeight / sheet.height;
  const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in, only zoom out if needed
  
  // Calculate dimensions of the sheet in the display
  const displayWidth = sheet.width * scale;
  const displayHeight = sheet.height * scale;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Plano de Corte</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .print-header { margin-bottom: 20px; }
            .print-header h1 { margin: 0 0 10px 0; }
            .print-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
            .print-info-item { display: flex; justify-content: space-between; }
            .print-info-label { color: #666; }
            .print-info-value { font-weight: bold; }
            .sheet-container { border: 1px solid #ccc; margin-top: 20px; position: relative; }
            .piece { position: absolute; border: 1px solid rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-size: 12px; box-sizing: border-box; overflow: hidden; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Plano de Corte</h1>
            <div>Data: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="print-info">
            <div class="print-info-item">
              <span class="print-info-label">Dimensões:</span>
              <span class="print-info-value">${sheet.width}×${sheet.height}mm</span>
            </div>
            <div class="print-info-item">
              <span class="print-info-label">Peças:</span>
              <span class="print-info-value">${placedPieces.length}</span>
            </div>
            <div class="print-info-item">
              <span class="print-info-label">Eficiência:</span>
              <span class="print-info-value">${stats.efficiency.toFixed(1)}%</span>
            </div>
            <div class="print-info-item">
              <span class="print-info-label">Largura de corte:</span>
              <span class="print-info-value">${sheet.cutWidth}mm</span>
            </div>
          </div>
          
          <div class="sheet-container" style="width: ${sheet.width}px; height: ${sheet.height}px; max-width: 100%;">
            ${placedPieces.map((piece) => `
              <div class="piece" 
                style="
                  left: ${piece.x}px; 
                  top: ${piece.y}px; 
                  width: ${piece.width}px; 
                  height: ${piece.height}px; 
                  background-color: ${piece.color}; 
                  transform: rotate(${piece.rotated ? '90deg' : '0deg'});
                  transform-origin: center;
                "
              >
                ${piece.width}×${piece.height}
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setTimeout(() => printWindow.close(), 1000);
  };

  return (
    <Card className="h-full border shadow-subtle flex flex-col animate-fade-in">
      <CardContent className="p-4 flex-1 relative">
        {/* Stats display - moved outside the sheet */}
        <div className="mb-4 text-sm flex justify-between items-center">
          <div className="px-3 py-1.5 rounded-md bg-background/95 border shadow-subtle inline-block">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="text-muted-foreground">Dimensões:</div>
              <div className="font-medium text-right">{sheet.width}×{sheet.height}mm</div>
              
              <div className="text-muted-foreground">Peças:</div>
              <div className="font-medium text-right">{placedPieces.length}</div>
              
              <div className="text-muted-foreground">Eficiência:</div>
              <div className="font-medium text-right">{stats.efficiency.toFixed(1)}%</div>
              
              <div className="text-muted-foreground">Largura de corte:</div>
              <div className="font-medium text-right">{sheet.cutWidth}mm</div>
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
            <Printer size={16} />
            Imprimir
          </Button>
        </div>

        <div 
          ref={containerRef}
          className="relative mx-auto border border-gray-300 bg-white grid-pattern"
          style={{
            width: displayWidth,
            height: displayHeight,
            maxWidth: '100%',
            maxHeight: '100%',
            backgroundSize: `20px 20px`,
          }}
        >
          {/* Placed pieces */}
          {placedPieces.map((piece, index) => (
            <div
              key={`${piece.id}-${index}`}
              style={{
                position: 'absolute',
                left: piece.x * scale,
                top: piece.y * scale,
                width: piece.width * scale,
                height: piece.height * scale,
                backgroundColor: piece.color,
                border: '1px solid rgba(0,0,0,0.2)',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'rgba(0,0,0,0.6)',
                transform: `rotate(${piece.rotated ? '90deg' : '0deg'})`,
                transformOrigin: 'center',
                overflow: 'hidden',
              }}
            >
              {/* Always show measurements inside pieces */}
              <div className="whitespace-nowrap">
                {piece.width}×{piece.height}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CuttingBoard;
