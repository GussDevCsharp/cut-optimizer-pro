
import React from 'react';
import { Sheet, PlacedPiece, ScrapPiece } from '../../hooks/useSheetData';
import { SheetPiece } from './SheetPiece';

interface SheetDisplayProps {
  sheet: Sheet;
  displayPieces: PlacedPiece[];
  displayScraps: ScrapPiece[];
  scale: number;
  displayWidth: number;
  displayHeight: number;
  dimensionFontSize: number;
  sheetIndex: number;
  currentSheetIndex: number;
  isMobile?: boolean;
}

export const SheetDisplay = ({
  sheet,
  displayPieces,
  displayScraps,
  scale,
  displayWidth,
  displayHeight,
  dimensionFontSize,
  sheetIndex,
  currentSheetIndex,
  isMobile
}: SheetDisplayProps) => {
  return (
    <div className="relative mx-auto">
      {/* Sheet dimensions - width at bottom */}
      <div 
        className="absolute -bottom-5 w-full text-center font-medium text-gray-600" 
        style={{ fontSize: `${dimensionFontSize}px` }}
      >
        {sheet.width}mm
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
        {sheet.height}mm
      </div>
      
      {/* Sheet dimensions - width at top */}
      <div 
        className="absolute -top-5 w-full text-center font-medium text-gray-600" 
        style={{ fontSize: `${dimensionFontSize}px` }}
      >
        {sheet.width}mm
      </div>
      
      {/* Sheet dimensions - height on right */}
      <div 
        className="absolute -right-5 h-full flex items-center justify-center font-medium text-gray-600"
        style={{ 
          fontSize: `${dimensionFontSize}px`, 
          writingMode: 'vertical-rl', 
          transform: 'rotate(180deg)' 
        }}
      >
        {sheet.height}mm
      </div>
      
      {/* Main sheet container with grid pattern */}
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
        {/* In-sheet width dimension */}
        <div 
          className="absolute bottom-2 left-0 right-0 text-center font-medium text-gray-500 z-10 bg-white/60 py-1 rounded-sm"
          style={{ fontSize: `${dimensionFontSize * 1.2}px` }}
        >
          {sheet.width} mm
        </div>
        
        {/* In-sheet height dimension */}
        <div 
          className="absolute top-10 left-2 font-medium text-gray-500 z-10 bg-white/60 px-1 py-1 rounded-sm"
          style={{ 
            fontSize: `${dimensionFontSize * 1.2}px`,
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)'
          }}
        >
          {sheet.height} mm
        </div>
        
        {/* Render scrap pieces first (lower z-index) */}
        {sheetIndex === currentSheetIndex && displayScraps.map((scrap, index) => (
          <SheetPiece 
            key={`${scrap.id}-${index}`} 
            piece={scrap} 
            scale={scale} 
            isMobile={isMobile}
          />
        ))}
        
        {/* Render regular pieces on top */}
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
  );
};
