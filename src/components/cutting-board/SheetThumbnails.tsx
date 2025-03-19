
import React from 'react';
import { Sheet, PlacedPiece, ScrapPiece } from '../../hooks/useSheetData';

interface SheetThumbnailsProps {
  sheet: Sheet;
  placedPieces: PlacedPiece[];
  scrapPieces?: ScrapPiece[]; // Add scrapPieces as an optional prop
  sheetCount: number;
  currentSheetIndex: number;
  onSelectSheet: (index: number) => void;
  isMobile?: boolean;
}

export const SheetThumbnails = ({ 
  sheet, 
  placedPieces, 
  scrapPieces = [], // Provide default empty array
  sheetCount, 
  currentSheetIndex,
  onSelectSheet,
  isMobile
}: SheetThumbnailsProps) => {
  const sheets = Array.from({ length: sheetCount }, (_, i) => i);
  
  // Adjust thumbnail size based on device
  const thumbnailWidth = isMobile ? 60 : 80;
  const thumbnailHeight = isMobile ? 90 : 120;
  
  return (
    <div className={`mt-4 py-2 border-t ${isMobile ? 'px-1' : ''}`}>
      <div className="flex items-center justify-center">
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-2`}>Chapas Utilizadas:</p>
      </div>
      <div className="flex overflow-x-auto pb-2 gap-2 justify-center">
        {sheets.map((index) => {
          const isActive = index === currentSheetIndex;
          const sheetPieces = placedPieces.filter(p => p.sheetIndex === index);
          const sheetScraps = scrapPieces.filter(p => p.sheetIndex === index);
          
          return (
            <div 
              key={index}
              onClick={() => onSelectSheet(index)}
              className={`
                relative cursor-pointer transition-all duration-200
                ${isActive ? 'ring-2 ring-primary scale-105' : 'hover:ring-1 hover:ring-primary/50'}
                border border-gray-300 bg-white
              `}
              style={{
                width: thumbnailWidth,
                height: thumbnailHeight,
                minWidth: thumbnailWidth,
              }}
            >
              {/* Miniatura da chapa */}
              <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </div>
              
              {/* Scrap pieces in the thumbnail */}
              {sheetScraps.map((scrap, scrapIndex) => {
                const scale = Math.min(thumbnailWidth / sheet.width, thumbnailHeight / sheet.height);
                
                return (
                  <div
                    key={`scrap-${scrap.id}-${scrapIndex}`}
                    style={{
                      position: 'absolute',
                      left: scrap.x * scale,
                      top: scrap.y * scale,
                      width: scrap.width * scale,
                      height: scrap.height * scale,
                      backgroundColor: scrap.color || "#9BDEAC",
                      border: '1px solid rgba(0,0,0,0.1)',
                      transform: `rotate(${scrap.rotated ? '90deg' : '0deg'})`,
                      transformOrigin: 'center',
                    }}
                  />
                );
              })}
              
              {/* Peças na miniatura */}
              {sheetPieces.map((piece, pieceIndex) => {
                const scale = Math.min(thumbnailWidth / sheet.width, thumbnailHeight / sheet.height);
                
                return (
                  <div
                    key={`${piece.id}-${pieceIndex}`}
                    style={{
                      position: 'absolute',
                      left: piece.x * scale,
                      top: piece.y * scale,
                      width: piece.width * scale,
                      height: piece.height * scale,
                      backgroundColor: piece.color,
                      border: '1px solid rgba(0,0,0,0.1)',
                      transform: `rotate(${piece.rotated ? '90deg' : '0deg'})`,
                      transformOrigin: 'center',
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
