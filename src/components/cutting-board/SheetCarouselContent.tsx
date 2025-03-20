
import React, { useEffect, useState } from 'react';
import { CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Sheet, PlacedPiece } from '../../hooks/useSheetData';
import { ScrapArea } from '../../utils/optimization/optimizationEngine';
import { SheetDisplay } from './SheetDisplay';

interface SheetCarouselContentProps {
  sheet: Sheet;
  placedPieces: PlacedPiece[];
  scrapAreas: ScrapArea[];
  sheetCount: number;
  currentSheetIndex: number;
  scale: number;
  isMobile?: boolean;
  showScrapDimensions?: boolean;
}

export const SheetCarouselContent = ({ 
  sheet, 
  placedPieces, 
  scrapAreas,
  sheetCount, 
  currentSheetIndex,
  scale,
  isMobile,
  showScrapDimensions = true
}: SheetCarouselContentProps) => {
  const [displayPieces, setDisplayPieces] = useState<PlacedPiece[]>([]);
  const [displayScrapAreas, setDisplayScrapAreas] = useState<ScrapArea[]>([]);
  const sheets = Array.from({ length: sheetCount }, (_, i) => i);
  
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

  return (
    <CarouselContent>
      {sheets.map((sheetIndex) => {
        return (
          <CarouselItem key={sheetIndex}>
            {sheetIndex === currentSheetIndex && (
              <SheetDisplay
                sheet={sheet}
                displayPieces={displayPieces}
                displayScrapAreas={displayScrapAreas}
                scale={scale}
                isMobile={isMobile}
                showScrapDimensions={showScrapDimensions}
              />
            )}
          </CarouselItem>
        );
      })}
    </CarouselContent>
  );
};
