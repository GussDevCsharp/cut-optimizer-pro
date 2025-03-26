import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
} from "@/components/ui/carousel";
import { Sheet, PlacedPiece } from '../../hooks/useSheetData';
import { SheetPiece, ScrapArea } from './SheetPiece';
import { SheetThumbnails } from './SheetThumbnails';

interface SheetCarouselProps {
  sheet: Sheet;
  placedPieces: PlacedPiece[];
  sheetCount: number;
  currentSheetIndex: number;
  setCurrentSheetIndex: (index: number) => void;
  isMobile?: boolean;
}

export const SheetCarousel = ({ 
  sheet, 
  placedPieces, 
  sheetCount, 
  currentSheetIndex, 
  setCurrentSheetIndex,
  isMobile
}: SheetCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayPieces, setDisplayPieces] = useState<PlacedPiece[]>([]);
  const [scrapAreas, setScrapAreas] = useState<ScrapArea[]>([]);
  
  // Calculate container dimensions based on screen size
  const containerWidth = isMobile ? window.innerWidth - 40 : 800;  
  const containerHeight = isMobile ? Math.min(window.innerHeight * 0.5, 400) : 600;
  
  // Calculate scale factor to fit the sheet in the container
  const scaleX = containerWidth / sheet.width;
  const scaleY = containerHeight / sheet.height;
  const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in, only zoom out if needed
  
  // Calculate dimensions of the sheet in the display
  const displayWidth = sheet.width * scale;
  const displayHeight = sheet.height * scale;
  
  // Group pieces by sheet index
  const sheets = Array.from({ length: sheetCount }, (_, i) => i);

  // State to track the carousel API
  const [api, setApi] = useState<any>(null);

  // Use an effect to navigate to the current sheet index when it changes
  useEffect(() => {
    if (api) {
      api.scrollTo(currentSheetIndex);
    }
  }, [currentSheetIndex, api]);
  
  // Filter pieces for the current sheet index when it changes
  useEffect(() => {
    if (placedPieces && placedPieces.length > 0) {
      const filteredPieces = placedPieces.filter(p => p.sheetIndex === currentSheetIndex);
      setDisplayPieces(filteredPieces);
      
      // Calculate scrap areas based on placed pieces
      calculateScrapAreas(filteredPieces);
    } else {
      setDisplayPieces([]);
      // If no pieces, the whole sheet is a scrap area
      setScrapAreas([{
        id: 'full-sheet-scrap',
        x: 0,
        y: 0,
        width: sheet.width,
        height: sheet.height,
        sheetIndex: currentSheetIndex
      }]);
    }
  }, [placedPieces, currentSheetIndex, sheet]);

  // Function to calculate scrap areas on the current sheet
  const calculateScrapAreas = (pieces: PlacedPiece[]) => {
    if (pieces.length === 0) {
      // If no pieces, the whole sheet is a scrap area
      setScrapAreas([{
        id: 'full-sheet-scrap',
        x: 0,
        y: 0,
        width: sheet.width,
        height: sheet.height,
        sheetIndex: currentSheetIndex
      }]);
      return;
    }

    // Create a grid to track occupied areas (1mm resolution)
    const resolution = 1;
    const gridWidth = Math.ceil(sheet.width / resolution);
    const gridHeight = Math.ceil(sheet.height / resolution);
    const grid = Array(gridHeight).fill(0).map(() => Array(gridWidth).fill(false));

    // Mark all pieces on the grid
    pieces.forEach(piece => {
      const startX = Math.floor(piece.x / resolution);
      const startY = Math.floor(piece.y / resolution);
      const endX = Math.min(Math.ceil((piece.x + piece.width) / resolution), gridWidth);
      const endY = Math.min(Math.ceil((piece.y + piece.height) / resolution), gridHeight);

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          if (y >= 0 && y < gridHeight && x >= 0 && x < gridWidth) {
            grid[y][x] = true;
          }
        }
      }
    });

    // Find contiguous empty areas (simple algorithm)
    const identified = Array(gridHeight).fill(0).map(() => Array(gridWidth).fill(false));
    const scrapAreas: ScrapArea[] = [];
    let scrapId = 0;

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (!grid[y][x] && !identified[y][x]) {
          // Found an empty cell, expand to find the full empty rectangle
          let maxX = x;
          while (maxX < gridWidth && !grid[y][maxX]) {
            maxX++;
          }
          
          let maxY = y;
          let isRectangular = true;
          
          // Check if the area extends downward as a rectangle
          while (isRectangular && maxY < gridHeight) {
            for (let checkX = x; checkX < maxX; checkX++) {
              if (grid[maxY][checkX]) {
                isRectangular = false;
                break;
              }
            }
            if (isRectangular) maxY++;
          }
          
          // Mark the identified area
          for (let markY = y; markY < maxY; markY++) {
            for (let markX = x; markX < maxX; markX++) {
              identified[markY][markX] = true;
            }
          }
          
          // Only add areas that are larger than the cut width
          const areaWidth = (maxX - x) * resolution;
          const areaHeight = (maxY - y) * resolution;
          
          if (areaWidth > sheet.cutWidth * 2 && areaHeight > sheet.cutWidth * 2) {
            scrapAreas.push({
              id: `scrap-${scrapId++}`,
              x: x * resolution,
              y: y * resolution,
              width: areaWidth,
              height: areaHeight,
              sheetIndex: currentSheetIndex
            });
          }
        }
      }
    }

    // Simplify by keeping only the largest scrap areas (avoid showing too many tiny areas)
    const MAX_SCRAP_AREAS = 10;
    const sortedScrapAreas = scrapAreas
      .sort((a, b) => (b.width * b.height) - (a.width * a.height))
      .slice(0, MAX_SCRAP_AREAS);
    
    setScrapAreas(sortedScrapAreas);
  };

  // Function to handle sheet change
  const handleSheetChange = (api: any) => {
    if (api) {
      const selectedIndex = api.selectedScrollSnap();
      setCurrentSheetIndex(selectedIndex);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center mb-2">
        <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
          Chapa {currentSheetIndex + 1} de {sheetCount}
        </span>
      </div>
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{ startIndex: currentSheetIndex, loop: false }}
        onSelect={(api) => handleSheetChange(api)}
      >
        <CarouselContent>
          {sheets.map((sheetIndex) => {
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
                    backgroundSize: `${isMobile ? '10px 10px' : '20px 20px'}`,
                  }}
                >
                  {/* Render scrap areas for the current sheet (rendered first, lower z-index) */}
                  {sheetIndex === currentSheetIndex && scrapAreas.map((scrapArea) => (
                    <SheetPiece 
                      key={scrapArea.id} 
                      piece={scrapArea} 
                      scale={scale} 
                      isMobile={isMobile}
                      isScrap={true}
                    />
                  ))}
                  
                  {/* Render pieces for the current sheet (rendered on top of scrap areas) */}
                  {sheetIndex === currentSheetIndex && displayPieces.map((piece, index) => (
                    <SheetPiece 
                      key={`${piece.id}-${index}`} 
                      piece={piece} 
                      scale={scale} 
                      isMobile={isMobile}
                    />
                  ))}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      
      {/* Navigation controls */}
      <div className="flex justify-center mt-2 mb-4">
        <Button 
          variant="outline" 
          size={isMobile ? "icon" : "sm"} 
          onClick={() => setCurrentSheetIndex(Math.max(0, currentSheetIndex - 1))}
          disabled={currentSheetIndex === 0}
          className={isMobile ? "w-8 h-8 mr-2" : "mr-2"}
        >
          <ChevronLeft className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
          {!isMobile && "Anterior"}
        </Button>
        <Button 
          variant="outline" 
          size={isMobile ? "icon" : "sm"} 
          onClick={() => setCurrentSheetIndex(Math.min(sheetCount - 1, currentSheetIndex + 1))}
          disabled={currentSheetIndex === sheetCount - 1}
          className={isMobile ? "w-8 h-8" : ""}
        >
          {!isMobile && "Próxima"}
          <ChevronRight className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
        </Button>
      </div>
      
      {/* Sheet thumbnails */}
      <SheetThumbnails
        sheet={sheet}
        placedPieces={placedPieces}
        sheetCount={sheetCount}
        currentSheetIndex={currentSheetIndex}
        onSelectSheet={setCurrentSheetIndex}
        isMobile={isMobile}
      />
    </div>
  );
};
