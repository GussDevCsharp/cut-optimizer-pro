
import React, { useEffect, useRef, useState } from 'react';
import { Carousel } from "@/components/ui/carousel";
import { Sheet, PlacedPiece } from '../../hooks/useSheetData';
import { ScrapArea } from '../../utils/optimization/optimizationEngine';
import { SheetThumbnails } from './SheetThumbnails';
import { CarouselNavigation } from './CarouselNavigation';
import { SheetCarouselContent } from './SheetCarouselContent';
import { SheetHeader } from './SheetHeader';

interface SheetCarouselProps {
  sheet: Sheet;
  placedPieces: PlacedPiece[];
  scrapAreas: ScrapArea[];
  sheetCount: number;
  currentSheetIndex: number;
  setCurrentSheetIndex: (index: number) => void;
  isMobile?: boolean;
  showScrapDimensions?: boolean;
}

export const SheetCarousel = ({ 
  sheet, 
  placedPieces, 
  scrapAreas,
  sheetCount, 
  currentSheetIndex, 
  setCurrentSheetIndex,
  isMobile,
  showScrapDimensions = true
}: SheetCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate container dimensions based on screen size
  const containerWidth = isMobile ? window.innerWidth - 40 : 800;  
  const containerHeight = isMobile ? Math.min(window.innerHeight * 0.5, 400) : 600;
  
  // Calculate scale factor to fit the sheet in the container
  const scaleX = containerWidth / sheet.width;
  const scaleY = containerHeight / sheet.height;
  const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in, only zoom out if needed

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
      {/* Sheet header */}
      <SheetHeader 
        currentSheetIndex={currentSheetIndex} 
        sheetCount={sheetCount} 
        isMobile={isMobile} 
      />
      
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{ startIndex: currentSheetIndex, loop: false }}
        onSelect={(api) => handleSheetChange(api)}
      >
        <SheetCarouselContent
          sheet={sheet}
          placedPieces={placedPieces}
          scrapAreas={scrapAreas}
          sheetCount={sheetCount}
          currentSheetIndex={currentSheetIndex}
          scale={scale}
          isMobile={isMobile}
          showScrapDimensions={showScrapDimensions}
        />
      </Carousel>
      
      {/* Navigation controls */}
      <CarouselNavigation
        currentSheetIndex={currentSheetIndex}
        sheetCount={sheetCount}
        setCurrentSheetIndex={setCurrentSheetIndex}
        isMobile={isMobile}
      />
      
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
