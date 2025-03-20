
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
import { findAvailableAreas, groupAdjacentScraps, AvailableArea } from '../../utils/optimization/availableSpaceFinder';
import { AvailableAreaDisplay } from './AvailableAreaDisplay';

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
  const [availableAreas, setAvailableAreas] = useState<AvailableArea[]>([]);
  
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
      
      // Calculate available areas for this sheet
      const areas = findAvailableAreas(placedPieces, sheet, currentSheetIndex);
      
      // Group adjacent scrap areas
      const groupedAreas = groupAdjacentScraps(areas);
      
      setAvailableAreas(groupedAreas);
    } else {
      setDisplayPieces([]);
      setAvailableAreas([]);
    }
  }, [placedPieces, currentSheetIndex, sheet]);

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
                  {/* Display sheet width and height */}
                  <div 
                    className="absolute left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium bg-white/70 px-2 py-0.5 rounded-md"
                    style={{ top: '10px', zIndex: 20 }}
                  >
                    {sheet.width} mm
                  </div>
                  <div 
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 rotate-90 text-xs text-gray-500 font-medium bg-white/70 px-2 py-0.5 rounded-md"
                    style={{ marginRight: '10px', zIndex: 20 }}
                  >
                    {sheet.height} mm
                  </div>
                  
                  {/* Render available areas */}
                  {sheetIndex === currentSheetIndex && availableAreas.map((area, idx) => (
                    <AvailableAreaDisplay
                      key={`area-${idx}`}
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
