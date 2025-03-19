
import React, { useEffect, useState } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
} from "@/components/ui/carousel";
import { Sheet, PlacedPiece, ScrapPiece } from '../../hooks/useSheetData';
import { SheetThumbnails } from './SheetThumbnails';
import { SheetDisplay } from './SheetDisplay';
import { SheetNavigation } from './SheetNavigation';

interface SheetCarouselProps {
  sheet: Sheet;
  placedPieces: PlacedPiece[];
  scrapPieces: ScrapPiece[];
  sheetCount: number;
  currentSheetIndex: number;
  setCurrentSheetIndex: (index: number) => void;
  isMobile?: boolean;
}

export const SheetCarousel = ({ 
  sheet, 
  placedPieces, 
  scrapPieces,
  sheetCount, 
  currentSheetIndex, 
  setCurrentSheetIndex,
  isMobile
}: SheetCarouselProps) => {
  const [displayPieces, setDisplayPieces] = useState<PlacedPiece[]>([]);
  const [displayScraps, setDisplayScraps] = useState<ScrapPiece[]>([]);
  
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
    
    if (scrapPieces && scrapPieces.length > 0) {
      const filteredScraps = scrapPieces.filter(p => p.sheetIndex === currentSheetIndex);
      setDisplayScraps(filteredScraps);
    } else {
      setDisplayScraps([]);
    }
  }, [placedPieces, scrapPieces, currentSheetIndex]);

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
          {sheets.map((sheetIndex) => (
            <CarouselItem key={sheetIndex}>
              <SheetDisplay 
                sheet={sheet}
                displayPieces={displayPieces}
                displayScraps={displayScraps}
                scale={scale}
                displayWidth={displayWidth}
                displayHeight={displayHeight}
                dimensionFontSize={dimensionFontSize}
                sheetIndex={sheetIndex}
                currentSheetIndex={currentSheetIndex}
                isMobile={isMobile}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Navigation controls */}
      <SheetNavigation 
        currentSheetIndex={currentSheetIndex}
        sheetCount={sheetCount}
        setCurrentSheetIndex={setCurrentSheetIndex}
        isMobile={isMobile}
      />
      
      {/* Sheet thumbnails */}
      <SheetThumbnails
        sheet={sheet}
        placedPieces={placedPieces}
        scrapPieces={scrapPieces}
        sheetCount={sheetCount}
        currentSheetIndex={currentSheetIndex}
        onSelectSheet={setCurrentSheetIndex}
        isMobile={isMobile}
      />
    </div>
  );
};
