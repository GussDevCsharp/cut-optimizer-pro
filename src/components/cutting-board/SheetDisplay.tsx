
import React from 'react';
import { PlacedPiece, Sheet } from '../../hooks/useSheetData';
import { SheetPiece, ScrapArea } from './SheetPiece';
import { useScrapAreas } from './ScrapAreaCalculator';

interface SheetDisplayProps {
  sheet: Sheet;
  placedPieces: PlacedPiece[];
  currentSheetIndex: number;
  scale: number;
  isMobile?: boolean;
}

export const SheetDisplay = ({
  sheet,
  placedPieces,
  currentSheetIndex,
  scale,
  isMobile
}: SheetDisplayProps) => {
  // Filter pieces for the current sheet
  const displayPieces = placedPieces.filter(p => p.sheetIndex === currentSheetIndex);
  
  // Calculate scrap areas
  const scrapAreas = useScrapAreas({
    placedPieces,
    sheetWidth: sheet.width,
    sheetHeight: sheet.height,
    currentSheetIndex
  });

  return (
    <div 
      className="relative mx-auto border border-gray-300 bg-white grid-pattern"
      style={{
        width: sheet.width * scale,
        height: sheet.height * scale,
        maxWidth: '100%',
        maxHeight: '100%',
        backgroundSize: `${isMobile ? '10px 10px' : '20px 20px'}`,
      }}
    >
      {/* Render scrap areas (rendered first, lower z-index) */}
      {scrapAreas.map((scrapArea) => (
        <SheetPiece 
          key={scrapArea.id} 
          piece={scrapArea} 
          scale={scale} 
          isMobile={isMobile}
          isScrap={true}
        />
      ))}
      
      {/* Render pieces (rendered on top of scrap areas) */}
      {displayPieces.map((piece, index) => (
        <SheetPiece 
          key={`${piece.id}-${index}`} 
          piece={piece} 
          scale={scale} 
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};
