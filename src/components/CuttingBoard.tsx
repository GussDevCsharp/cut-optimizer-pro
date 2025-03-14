
import { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <Card className="h-full border shadow-subtle flex flex-col animate-fade-in">
      <CardContent className="p-4 flex-1 relative">
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
              {scale > 0.4 && (
                <div className="whitespace-nowrap">
                  {piece.width}×{piece.height}
                </div>
              )}
            </div>
          ))}
          
          {/* Stats overlay */}
          <div className="absolute top-2 left-2 text-xs space-y-1">
            <div className="px-3 py-1.5 rounded-md bg-background/95 border shadow-subtle">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CuttingBoard;
