
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
}

export const SheetCarousel = ({ 
  sheet, 
  placedPieces, 
  sheetCount, 
  currentSheetIndex, 
  setCurrentSheetIndex 
}: SheetCarouselProps) => {
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
  const sheets = Array.from({ length: sheetCount }, (_, i) => i);

  // State to track the carousel API
  const [api, setApi] = useState<any>(null);

  // Use an effect to navigate to the current sheet index when it changes
  useEffect(() => {
    if (api) {
      api.scrollTo(currentSheetIndex);
    }
  }, [currentSheetIndex, api]);

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
        <span className="font-medium text-sm">
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
                  {sheetPieces.map((piece, index) => (
                    <SheetPiece 
                      key={`${piece.id}-${index}`} 
                      piece={piece} 
                      scale={scale} 
                    />
                  ))}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      
      {/* Controles de navegação */}
      <div className="flex justify-center mt-2 mb-4">
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
      
      {/* Miniaturas das chapas */}
      <SheetThumbnails
        sheet={sheet}
        placedPieces={placedPieces}
        sheetCount={sheetCount}
        currentSheetIndex={currentSheetIndex}
        onSelectSheet={setCurrentSheetIndex}
      />
    </div>
  );
};
