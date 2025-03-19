
import React from 'react';
import { PlacedPiece } from '../../../hooks/useSheetData';
import { PieceLabel } from './PieceLabel';
import { PieceDimensions } from './PieceDimensions';

interface RegularPieceProps {
  piece: PlacedPiece;
  scale: number;
  isMobile?: boolean;
}

export const RegularPiece = ({ piece, scale, isMobile }: RegularPieceProps) => {
  // Calculate font size based on piece dimensions and device
  const minDimension = Math.min(piece.width, piece.height) * scale;
  let fontSize = isMobile 
    ? Math.max(Math.min(minDimension / 8, 12), 8) // Smaller text on mobile
    : Math.max(Math.min(minDimension / 6, 14), 9);
  
  // Make labels slightly smaller
  const labelFontSize = Math.max(fontSize - 2, 7);
  
  // Calculate rotation transform
  const rotation = piece.rotated ? '90deg' : '0deg';
  
  // Generate a piece label (e.g., A1, B1)
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
        zIndex: 10, // Regular pieces have higher z-index
      }}
    >
      {/* Piece label (like A1, B2, etc.) */}
      <PieceLabel 
        label={pieceLabel} 
        fontSize={labelFontSize} 
        color="rgba(0,0,0,0.7)" 
        position="top-left" 
      />
      
      {/* Center width dimension */}
      <PieceDimensions 
        width={piece.width}
        height={piece.height}
        fontSize={fontSize}
        labelFontSize={labelFontSize}
        showVerticalDimension={showVerticalDimension}
        color="rgba(0,0,0,0.8)"
        labelColor="rgba(0,0,0,0.7)"
      />
    </div>
  );
};
