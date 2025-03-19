
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

  // Font size for sheet dimensions
  const dimensionFontSize = isMobile ? 10 : 12;

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
  }, [placedPieces, currentSheetIndex]);

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
                <div className="relative mx-auto">
                  {/* Sheet dimensions - width at bottom */}
                  <div 
                    className="absolute -bottom-5 w-full text-center font-medium text-gray-600" 
                    style={{ fontSize: `${dimensionFontSize}px` }}
                  >
                    {sheet.width}
                  </div>
                  
                  {/* Sheet dimensions - height on left */}
                  <div 
                    className="absolute -left-5 h-full flex items-center justify-center font-medium text-gray-600"
                    style={{ 
                      fontSize: `${dimensionFontSize}px`, 
                      writingMode: 'vertical-rl', 
                      transform: 'rotate(180deg)' 
                    }}
                  >
                    {sheet.height}
                  </div>
                  
                  {/* Main sheet container with grid pattern */}
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
                    {/* Render pieces only for the current sheet */}
                    {sheetIndex === currentSheetIndex && displayPieces.map((piece, index) => (
                      <SheetPiece 
                        key={`${piece.id}-${index}`} 
                        piece={piece} 
                        scale={scale} 
                        isMobile={isMobile}
                      />
                    ))}
                    
                    {/* Check if there are any cuts to show as dotted lines */}
                    {sheetIndex === currentSheetIndex && sheet.cutWidth > 0 && displayPieces.length > 0 && (
                      <>
                        {/* Optional: Render cut lines as dotted lines if needed */}
                        {/* (This could be implemented to show cutting paths) */}
                      </>
                    )}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      
      {/* Navigation controls */}
      <div className="flex justify-center mt-8 mb-4"> {/* Increased top margin to make room for the sheet width label */}
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
