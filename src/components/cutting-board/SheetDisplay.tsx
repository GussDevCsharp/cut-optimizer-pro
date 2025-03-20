
import React from 'react';
import { Sheet, PlacedPiece } from '../../hooks/useSheetData';
import { SheetPiece } from './SheetPiece';
import { ScrapArea } from '../../utils/optimization/optimizationEngine';
import { ScrapAreaLabel } from './ScrapAreaLabel';

interface SheetDisplayProps {
  sheet: Sheet;
  displayPieces: PlacedPiece[];
  displayScrapAreas: ScrapArea[];
  scale: number;
  isMobile?: boolean;
}

export const SheetDisplay = ({ 
  sheet, 
  displayPieces, 
  displayScrapAreas, 
  scale, 
  isMobile 
}: SheetDisplayProps) => {
  // Calculate dimensions of the sheet in the display
  const displayWidth = sheet.width * scale;
  const displayHeight = sheet.height * scale;

  return (
    <div 
      className="relative mx-auto border border-gray-300 bg-white grid-pattern"
      style={{
        width: displayWidth,
        height: displayHeight,
        maxWidth: '100%',
        maxHeight: '100%',
        backgroundSize: `${isMobile ? '10px 10px' : '20px 20px'}`,
      }}
    >
      {/* Render scrap area labels */}
      {displayScrapAreas.map((area, index) => (
        <ScrapAreaLabel
          key={`scrap-${index}`}
          area={area}
          scale={scale}
          isMobile={isMobile}
        />
      ))}
      
      {/* Render pieces */}
      {displayPieces.map((piece, index) => (
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
  );
};
