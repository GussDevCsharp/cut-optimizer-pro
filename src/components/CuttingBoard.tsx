
import { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, ChevronLeft, ChevronRight } from "lucide-react";
import { useSheetData, PlacedPiece } from '../hooks/useSheetData';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import { useEffect, useState } from 'react';

export const CuttingBoard = () => {
  const { sheet, placedPieces, stats, currentSheetIndex, setCurrentSheetIndex } = useSheetData();
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
  
  // Group pieces by sheet index
  const sheetCount = stats.sheetCount > 0 ? stats.sheetCount : 1;
  const sheets = Array.from({ length: sheetCount }, (_, i) => i);

  // Use a React state to track the current API
  const [api, setApi] = useState<any>(null);

  // Use an effect to navigate to the current sheet index when it changes
  useEffect(() => {
    if (api) {
      api.scrollTo(currentSheetIndex);
    }
  }, [currentSheetIndex, api]);

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
            .sheet-container { border: 1px solid #ccc; margin-top: 20px; position: relative; page-break-after: always; }
            .sheet-title { font-weight: bold; margin-bottom: 10px; }
            .piece { position: absolute; border: 1px solid rgba(0,0,0,0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px; box-sizing: border-box; overflow: hidden; }
            .dimension-width { position: absolute; bottom: 2px; font-size: 10px; }
            .dimension-height { position: absolute; left: 2px; writing-mode: vertical-lr; transform: rotate(180deg); font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Plano de Corte</h1>
            <div>Data: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="print-info">
            <div class="print-info-item">
              <span class="print-info-label">Dimensões da chapa:</span>
              <span class="print-info-value">${sheet.width}×${sheet.height}mm</span>
            </div>
            <div class="print-info-item">
              <span class="print-info-label">Total de peças:</span>
              <span class="print-info-value">${placedPieces.length}</span>
            </div>
            <div class="print-info-item">
              <span class="print-info-label">Número de chapas:</span>
              <span class="print-info-value">${sheetCount}</span>
            </div>
            <div class="print-info-item">
              <span class="print-info-label">Largura de corte:</span>
              <span class="print-info-value">${sheet.cutWidth}mm</span>
            </div>
          </div>
          
          ${sheets.map(sheetIndex => {
            const sheetPieces = placedPieces.filter(p => p.sheetIndex === sheetIndex);
            return `
              <div class="sheet-title">Chapa ${sheetIndex + 1}</div>
              <div class="sheet-container" style="width: ${sheet.width}px; height: ${sheet.height}px; max-width: 100%;">
                ${sheetPieces.map((piece) => `
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
                    <span class="dimension-width">${piece.width}</span>
                    <span class="dimension-height">${piece.height}</span>
                  </div>
                `).join('')}
              </div>
            `;
          }).join('')}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setTimeout(() => printWindow.close(), 1000);
  };

  // Function to handle sheet change
  const handleSheetChange = (index: number) => {
    setCurrentSheetIndex(index);
  };

  return (
    <Card className="h-full border shadow-subtle flex flex-col animate-fade-in">
      <CardContent className="p-4 flex-1 relative">
        {/* Stats display - outside the sheet */}
        <div className="mb-4 text-sm flex justify-between items-center">
          <div className="px-3 py-1.5 rounded-md bg-background/95 border shadow-subtle inline-block">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="text-muted-foreground">Dimensões:</div>
              <div className="font-medium text-right">{sheet.width}×{sheet.height}mm</div>
              
              <div className="text-muted-foreground">Peças:</div>
              <div className="font-medium text-right">{placedPieces.length}</div>
              
              <div className="text-muted-foreground">Chapas utilizadas:</div>
              <div className="font-medium text-right">{sheetCount}</div>
              
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

        {/* Sheet carousel */}
        {sheets.length > 0 && (
          <div>
            <div className="flex justify-center items-center mb-2">
              <span className="font-medium text-sm">
                Chapa {currentSheetIndex + 1} de {sheetCount}
              </span>
            </div>
            <Carousel
              className="w-full"
              setApi={setApi}
              opts={{ startIndex: currentSheetIndex, loop: false }}
              onSelect={(api) => {
                if (api) {
                  const selectedIndex = api.selectedScrollSnap();
                  handleSheetChange(selectedIndex);
                }
              }}
            >
              <CarouselContent>
                {sheets.map((sheetIndex) => {
                  const sheetPieces = placedPieces.filter(p => p.sheetIndex === sheetIndex);
                  
                  return (
                    <CarouselItem key={sheetIndex}>
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
                        {/* Placed pieces for this sheet */}
                        {sheetPieces.map((piece, index) => {
                          // Calculate font size based on piece dimensions
                          const minDimension = Math.min(piece.width, piece.height) * scale;
                          const fontSize = Math.max(Math.min(minDimension / 6, 14), 8);
                          
                          return (
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
                                overflow: 'hidden',
                                transform: `rotate(${piece.rotated ? '90deg' : '0deg'})`,
                                transformOrigin: 'center',
                              }}
                            >
                              {/* Display separate dimensions for width and height */}
                              <div 
                                className="absolute bottom-0.5 w-full text-center" 
                                style={{ fontSize: `${fontSize}px`, color: 'rgba(0,0,0,0.7)' }}
                              >
                                {piece.width}
                              </div>
                              <div 
                                className="absolute left-0.5 h-full flex items-center" 
                                style={{ 
                                  fontSize: `${fontSize}px`, 
                                  color: 'rgba(0,0,0,0.7)', 
                                  writingMode: 'vertical-rl', 
                                  transform: 'rotate(180deg)' 
                                }}
                              >
                                {piece.height}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <div className="flex justify-center mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentSheetIndex(Math.max(0, currentSheetIndex - 1))}
                  disabled={currentSheetIndex === 0}
                  className="mr-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentSheetIndex(Math.min(sheetCount - 1, currentSheetIndex + 1))}
                  disabled={currentSheetIndex === sheetCount - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Carousel>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CuttingBoard;
