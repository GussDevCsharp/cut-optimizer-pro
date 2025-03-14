
import React from 'react';
import { PlacedPiece } from '../../hooks/useSheetData';

interface SheetPieceProps {
  piece: PlacedPiece;
  scale: number;
}

export const SheetPiece = ({ piece, scale }: SheetPieceProps) => {
  // Calculate font size based on piece dimensions
  const minDimension = Math.min(piece.width, piece.height) * scale;
  const fontSize = Math.max(Math.min(minDimension / 6, 14), 8);
  
  return (
    <div
      style={{
        position: 'absolute',
        left: piece.x * scale,
        top: piece.y * scale,
        width: piece.width * scale,
        height: piece.height * scale,
        backgroundColor: piece.color,
        border: '1px solid rgba(0,0,0,0.2)',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transform: `rotate(${piece.rotated ? '90deg' : '0deg'})`,
        transformOrigin: 'center',
      }}
    >
      {/* Display width at the bottom of the piece */}
      <div 
        className="absolute bottom-0.5 w-full text-center" 
        style={{ fontSize: `${fontSize}px`, color: 'rgba(0,0,0,0.7)' }}
      >
        {piece.width}
      </div>
      
      {/* Display height on the left side of the piece with vertical text */}
      <div 
        className="absolute left-0.5 h-full flex items-center" 
        style={{ 
          fontSize: `${fontSize}px`, 
          color: 'rgba(0,0,0,0.7)', 
          writingMode: 'vertical-rl', 
          transform: 'rotate(180deg)' 
        }}
      >
        {piece.height}
      </div>
    </div>
  );
};
