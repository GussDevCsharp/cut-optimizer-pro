
import React from 'react';
import { PlacedPiece } from '../../hooks/useSheetData';

interface SheetPieceProps {
  piece: PlacedPiece;
  scale: number;
  isMobile?: boolean;
}

export const SheetPiece = ({ piece, scale, isMobile }: SheetPieceProps) => {
  // Calculate font size based on piece dimensions and device
  const minDimension = Math.min(piece.width, piece.height) * scale;
  const fontSize = isMobile 
    ? Math.max(Math.min(minDimension / 8, 12), 7) // Smaller text on mobile
    : Math.max(Math.min(minDimension / 6, 14), 8);
  
  // Calculate rotation transform
  const rotation = piece.rotated ? '90deg' : '0deg';
  
  // Calculate z-index based on piece area - smaller pieces should appear on top of larger ones
  const pieceArea = piece.width * piece.height;
  const zIndex = Math.max(10, 1000 - pieceArea); // Inverse relationship - smaller area = higher z-index
  
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
        transform: `rotate(${rotation})`,
        transformOrigin: piece.rotated ? 'center' : '0 0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderRadius: '2px',
        zIndex: zIndex, // Use calculated z-index to control layering
      }}
    >
      {/* Display width at the bottom of the piece */}
      <div 
        className="absolute bottom-0.5 w-full text-center font-medium" 
        style={{ fontSize: `${fontSize}px`, color: 'rgba(0,0,0,0.7)' }}
      >
        {piece.width}
      </div>
      
      {/* Display height on the left side of the piece with vertical text */}
      <div 
        className="absolute left-0.5 h-full flex items-center font-medium" 
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
