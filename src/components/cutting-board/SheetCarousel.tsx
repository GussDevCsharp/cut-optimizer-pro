
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
} from "@/components/ui/carousel";
import { Sheet, PlacedPiece } from '../../hooks/useSheetData';
import { SheetPiece } from './SheetPiece';
import { SheetThumbnails } from './SheetThumbnails';
import { ScrapArea } from '../../utils/optimization/optimizationEngine';
import { ScrapAreaLabel } from './ScrapAreaLabel';

interface SheetCarouselProps {
  sheet: Sheet;
  placedPieces: PlacedPiece[];
  scrapAreas: ScrapArea[];
  sheetCount: number;
  currentSheetIndex: number;
  setCurrentSheetIndex: (index: number) => void;
  isMobile?: boolean;
}

export const SheetCarousel = ({ 
  sheet, 
  placedPieces, 
  scrapAreas,
  sheetCount, 
  currentSheetIndex, 
  setCurrentSheetIndex,
  isMobile
}: SheetCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayPieces, setDisplayPieces] = useState<PlacedPiece[]>([]);
  const [displayScrapAreas, setDisplayScrapAreas] = useState<ScrapArea[]>([]);
  
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
    } else {
      setDisplayPieces([]);
    }
    
    if (scrapAreas && scrapAreas.length > 0) {
      const filteredScrapAreas = scrapAreas.filter(a => a.sheetIndex === currentSheetIndex);
      setDisplayScrapAreas(filteredScrapAreas);
    } else {
      setDisplayScrapAreas([]);
    }
  }, [placedPieces, scrapAreas, currentSheetIndex]);

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
                  {/* Render scrap area labels only for the current sheet */}
                  {sheetIndex === currentSheetIndex && displayScrapAreas.map((area, index) => (
                    <ScrapAreaLabel
                      key={`scrap-${index}`}
                      area={area}
                      scale={scale}
                      isMobile={isMobile}
                    />
                  ))}
                  
                  {/* Render pieces only for the current sheet */}
                  {sheetIndex === currentSheetIndex && displayPieces.map((piece, index) => (
                    <SheetPiece 
                      key={`${piece.id}-${index}`} 
                      piece={piece} 
                      scale={scale} 
                      isMobile={isMobile}
                    />
                  ))}
                  
                  {/* Display sheet dimensions outside the sheet */}
                  <div 
                    style={{
                      position: 'absolute',
                      width: displayWidth,
                      textAlign: 'center',
                      top: -20,
                      left: 0,
                      fontSize: isMobile ? 10 : 12,
                      fontWeight: 500,
                      color: 'rgba(0,0,0,0.7)'
                    }}
                  >
                    {sheet.width}
                  </div>
                  
                  <div 
                    style={{
                      position: 'absolute',
                      height: displayHeight,
                      writingMode: 'vertical-lr',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      left: -20,
                      top: 0,
                      fontSize: isMobile ? 10 : 12,
                      fontWeight: 500,
                      color: 'rgba(0,0,0,0.7)'
                    }}
                  >
                    {sheet.height}
                  </div>
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
