
import React from 'react';
import { PlacedPiece } from '../../hooks/useSheetData';

interface SheetPieceProps {
  piece: PlacedPiece | ScrapArea;
  scale: number;
  isMobile?: boolean;
  isScrap?: boolean;
}

// Define a type for scrap areas
export interface ScrapArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  sheetIndex: number;
}

export const SheetPiece = ({ piece, scale, isMobile, isScrap = false }: SheetPieceProps) => {
  // Calculate font size based on piece dimensions and device
  const minDimension = Math.min(piece.width, piece.height) * scale;
  const fontSize = isMobile 
    ? Math.max(Math.min(minDimension / 8, 12), 7) // Smaller text on mobile
    : Math.max(Math.min(minDimension / 6, 14), 8);
  
  // Calculate rotation transform for non-scrap pieces
  const rotation = !isScrap && 'rotated' in piece && piece.rotated ? '90deg' : '0deg';
  
  // Different styling for scrap areas
  const backgroundColor = isScrap ? 'rgba(240, 240, 240, 0.7)' : ('color' in piece ? piece.color : '#D6BCFA');
  const border = isScrap ? '1px dashed rgba(0,0,0,0.3)' : '1px solid rgba(0,0,0,0.2)';
  const textColor = isScrap ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.7)';
  
  return (
    <div
      style={{
        position: 'absolute',
        left: piece.x * scale,
        top: piece.y * scale,
        width: piece.width * scale,
        height: piece.height * scale,
        backgroundColor,
        border,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transform: `rotate(${rotation})`,
        transformOrigin: !isScrap && 'rotated' in piece && piece.rotated ? 'center' : '0 0',
        boxShadow: isScrap ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
        borderRadius: '2px',
        zIndex: isScrap ? 5 : 10, // Lower z-index for scrap areas so pieces appear on top
      }}
    >
      {/* Display width at the bottom of the area */}
      <div 
        className="absolute bottom-0.5 w-full text-center font-medium" 
        style={{ fontSize: `${fontSize}px`, color: textColor }}
      >
        {piece.width}
      </div>
      
      {/* Display height on the left side of the area with vertical text */}
      <div 
        className="absolute left-0.5 h-full flex items-center font-medium" 
        style={{ 
          fontSize: `${fontSize}px`, 
          color: textColor, 
          writingMode: 'vertical-rl', 
          transform: 'rotate(180deg)' 
        }}
      >
        {piece.height}
      </div>
      
      {/* For scrap areas, add a "SOBRA" label in the center */}
      {isScrap && (
        <div
          className="absolute font-medium text-center opacity-60"
          style={{ fontSize: `${fontSize}px`, color: textColor }}
        >
          SOBRA
        </div>
      )}
    </div>
  );
};
