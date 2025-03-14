
import { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import { useSheetData, PlacedPiece } from '../hooks/useSheetData';

const GRID_SIZE = 20; // Grid size in pixels
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2;

export const CuttingBoard = () => {
  const { sheet, placedPieces, stats } = useSheetData();
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showOverlay, setShowOverlay] = useState(true);

  // Apply zoom limits
  const safeZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));

  // Calculate scaled dimensions
  const scaledWidth = sheet.width * safeZoom;
  const scaledHeight = sheet.height * safeZoom;

  // Handle zoom
  const handleZoomIn = () => {
    setZoom(prev => Math.min(MAX_ZOOM, prev + 0.1));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(MIN_ZOOM, prev - 0.1));
  };

  // Handle mouse wheel zooming
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) return;
      
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta)));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  // Handle panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    setIsDragging(true);
    setStartPan({ x: pan.x, y: pan.y });
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    
    setPan({
      x: startPan.x + dx,
      y: startPan.y + dy
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    // Hide overlay after a short delay
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate the size ratio for proper piece positioning
  const scaleRatio = safeZoom;

  return (
    <Card className="h-full border shadow-subtle flex flex-col animate-fade-in">
      <CardContent className="p-0 flex-1 relative">
        <div 
          ref={containerRef}
          className="absolute inset-0 overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Drawing area with grid pattern background */}
          <div 
            className="grid-pattern bg-white absolute"
            style={{
              width: scaledWidth, 
              height: scaledHeight,
              transform: `translate(${pan.x}px, ${pan.y}px)`,
              backgroundSize: `${GRID_SIZE * safeZoom}px ${GRID_SIZE * safeZoom}px`,
            }}
            ref={boardRef}
          >
            {/* Pieces being placed */}
            {placedPieces.map((piece, index) => (
              <div
                key={`${piece.id}-${index}`}
                style={{
                  position: 'absolute',
                  left: piece.x * scaleRatio,
                  top: piece.y * scaleRatio,
                  width: piece.width * scaleRatio,
                  height: piece.height * scaleRatio,
                  backgroundColor: piece.color,
                  border: `${1 * safeZoom}px solid rgba(0,0,0,0.2)`,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: `${12 * safeZoom}px`,
                  color: 'rgba(0,0,0,0.6)',
                  transition: 'transform 0.2s ease',
                  transform: `rotate(${piece.rotated ? '90deg' : '0deg'})`,
                  transformOrigin: 'center',
                  overflow: 'hidden',
                }}
              >
                {safeZoom > 0.4 && (
                  <div className="whitespace-nowrap">
                    {piece.width}×{piece.height}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full shadow-md"
              onClick={handleZoomIn}
            >
              <ZoomIn size={16} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full shadow-md"
              onClick={handleZoomOut}
            >
              <ZoomOut size={16} />
            </Button>
          </div>
          
          {/* Stats overlay */}
          <div className="absolute top-4 left-4 text-xs space-y-1">
            <div className="px-3 py-1.5 rounded-md bg-background/95 border shadow-subtle">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="text-muted-foreground">Dimensões:</div>
                <div className="font-medium text-right">{sheet.width}×{sheet.height}mm</div>
                
                <div className="text-muted-foreground">Peças:</div>
                <div className="font-medium text-right">{placedPieces.length}</div>
                
                <div className="text-muted-foreground">Eficiência:</div>
                <div className="font-medium text-right">{stats.efficiency.toFixed(1)}%</div>
              </div>
            </div>
          </div>
          
          {/* Instructions overlay */}
          {showOverlay && (
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300">
              <div className="bg-white/90 p-4 rounded-lg shadow-lg max-w-xs text-center">
                <Move className="mx-auto mb-2 text-primary/70" />
                <p className="text-sm">
                  Use o mouse para mover a visualização e a roda para zoom
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CuttingBoard;
