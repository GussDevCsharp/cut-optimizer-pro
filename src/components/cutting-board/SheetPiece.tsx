
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
  let fontSize = isMobile 
    ? Math.max(Math.min(minDimension / 8, 12), 8) // Smaller text on mobile
    : Math.max(Math.min(minDimension / 6, 14), 9);
  
  // Make labels slightly smaller
  const labelFontSize = Math.max(fontSize - 2, 7);
  
  // Calculate rotation transform
  const rotation = piece.rotated ? '90deg' : '0deg';
  
  // Generate a label for the piece (e.g., A1, B1)
  const pieceLabel = `${String.fromCharCode(65 + (piece.id.charCodeAt(0) % 26))}${(parseInt(piece.id, 36) % 9) + 1}`;
  
  // Determine if we need to show vertical dimension based on aspect ratio
  const showVerticalDimension = piece.height > piece.width * 1.2;
  
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
        transformOrigin: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderRadius: '2px',
        zIndex: 10,
      }}
    >
      {/* Piece label (like A1, B2, etc.) */}
      <div 
        className="absolute top-1 left-1 font-medium" 
        style={{ fontSize: `${labelFontSize}px`, color: 'rgba(0,0,0,0.7)' }}
      >
        {pieceLabel}
      </div>
      
      {/* Center width dimension */}
      <div 
        className="font-medium text-center" 
        style={{ fontSize: `${fontSize}px`, color: 'rgba(0,0,0,0.8)' }}
      >
        {piece.width}
      </div>
      
      {/* Vertical dimension for tall pieces */}
      {showVerticalDimension && (
        <div 
          className="absolute transform -rotate-90 font-medium"
          style={{ 
            fontSize: `${fontSize}px`, 
            color: 'rgba(0,0,0,0.8)',
            zIndex: 2
          }}
        >
          {piece.height}
        </div>
      )}
      
      {/* Display width at the bottom of the piece */}
      <div 
        className="absolute bottom-0.5 w-full text-center font-medium" 
        style={{ fontSize: `${labelFontSize}px`, color: 'rgba(0,0,0,0.7)' }}
      >
        {piece.width}
      </div>
      
      {/* Display height on the left side of the piece with vertical text */}
      <div 
        className="absolute left-0.5 h-full flex items-center font-medium" 
        style={{ 
          fontSize: `${labelFontSize}px`, 
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
