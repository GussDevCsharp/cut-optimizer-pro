
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
  
  const containerWidth = isMobile ? window.innerWidth - 40 : 800;  
  const containerHeight = isMobile ? Math.min(window.innerHeight * 0.5, 400) : 600;
  
  const scaleX = containerWidth / sheet.width;
  const scaleY = containerHeight / sheet.height;
  const scale = Math.min(scaleX, scaleY, 1);
  
  const displayWidth = sheet.width * scale;
  const displayHeight = sheet.height * scale;
  
  const sheets = Array.from({ length: sheetCount }, (_, i) => i);

  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    if (api) {
      api.scrollTo(currentSheetIndex);
    }
  }, [currentSheetIndex, api]);
  
  useEffect(() => {
    if (placedPieces && placedPieces.length > 0) {
      const filteredPieces = placedPieces.filter(p => p.sheetIndex === currentSheetIndex);
      setDisplayPieces(filteredPieces);
      
      // Get only the 3 largest areas (already limited in findAvailableAreas function)
      const areas = findAvailableAreas(placedPieces, sheet, currentSheetIndex);
      const groupedAreas = groupAdjacentScraps(areas);
      
      // If there are more than 3 grouped areas, take only the 3 largest
      const limitedAreas = groupedAreas.slice(0, 3);
      setAvailableAreas(limitedAreas);
    } else {
      setDisplayPieces([]);
      setAvailableAreas([]);
    }
  }, [placedPieces, currentSheetIndex, sheet]);

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
                  {/* Width dimension label - positioned on top outside the sheet */}
                  <div 
                    className="absolute left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium bg-white/90 px-2 py-0.5 rounded-md"
                    style={{ top: '-20px', zIndex: 20 }}
                  >
                    {sheet.width} mm
                  </div>
                  
                  {/* Height dimension label - positioned on the right outside the sheet */}
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 rotate-90 text-xs text-gray-500 font-medium bg-white/90 px-2 py-0.5 rounded-md"
                    style={{ right: '-35px', zIndex: 20 }}
                  >
                    {sheet.height} mm
                  </div>
                  
                  <div 
                    ref={containerRef}
                    className="relative border border-gray-300 bg-white grid-pattern"
                    style={{
                      width: displayWidth,
                      height: displayHeight,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      backgroundSize: `${isMobile ? '10px 10px' : '20px 20px'}`,
                    }}
                  >
                    {sheetIndex === currentSheetIndex && availableAreas.map((area, idx) => (
                      <AvailableAreaDisplay
                        key={`area-${idx}`}
                        area={area}
                        scale={scale}
                        isMobile={isMobile}
                        colorIndex={idx}
                      />
                    ))}
                    
                    {sheetIndex === currentSheetIndex && displayPieces.map((piece, index) => (
                      <SheetPiece 
                        key={`${piece.id}-${index}`} 
                        piece={piece} 
                        scale={scale} 
                        isMobile={isMobile}
                      />
                    ))}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      
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
