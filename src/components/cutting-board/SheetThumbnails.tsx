
import React from 'react';
import { Sheet, PlacedPiece } from '../../hooks/useSheetData';

interface SheetThumbnailsProps {
  sheet: Sheet;
  placedPieces: PlacedPiece[];
  sheetCount: number;
  currentSheetIndex: number;
  onSelectSheet: (index: number) => void;
}

export const SheetThumbnails = ({ 
  sheet, 
  placedPieces, 
  sheetCount, 
  currentSheetIndex,
  onSelectSheet
}: SheetThumbnailsProps) => {
  const sheets = Array.from({ length: sheetCount }, (_, i) => i);
  
  return (
    <div className="mt-4 py-2 border-t">
      <div className="flex items-center justify-center">
        <p className="text-sm text-muted-foreground mb-2">Chapas Utilizadas:</p>
      </div>
      <div className="flex overflow-x-auto pb-2 gap-2 justify-center">
        {sheets.map((index) => {
          const isActive = index === currentSheetIndex;
          const sheetPieces = placedPieces.filter(p => p.sheetIndex === index);
          
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
                width: 80,
                height: 120,
                minWidth: 80,
              }}
            >
              {/* Miniatura da chapa */}
              <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </div>
              
              {/* Peças na miniatura */}
              {sheetPieces.map((piece, pieceIndex) => {
                const scale = Math.min(80 / sheet.width, 120 / sheet.height);
                
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
