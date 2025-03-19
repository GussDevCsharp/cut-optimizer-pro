
import React from 'react';
import { ScrapPiece } from '../../../hooks/useSheetData';
import { PieceLabel } from './PieceLabel';
import { PieceDimensions } from './PieceDimensions';

interface ScrapPieceProps {
  piece: ScrapPiece;
  scale: number;
  isMobile?: boolean;
}

export const ScrapPieceComponent = ({ piece, scale, isMobile }: ScrapPieceProps) => {
  // Calculate font size based on piece dimensions and device
  const minDimension = Math.min(piece.width, piece.height) * scale;
  let fontSize = isMobile 
    ? Math.max(Math.min(minDimension / 8, 12), 8) // Smaller text on mobile
    : Math.max(Math.min(minDimension / 6, 14), 9);
  
  // Make labels slightly smaller
  const labelFontSize = Math.max(fontSize - 2, 7);
  
  // Calculate rotation transform
  const rotation = piece.rotated ? '90deg' : '0deg';
  
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
        backgroundColor: '#9BDEAC', // Light green for scrap pieces
        border: '2px dashed rgba(0,0,0,0.3)',
        opacity: 0.9,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transform: `rotate(${rotation})`,
        transformOrigin: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderRadius: '2px',
        zIndex: 5, // Scraps have lower z-index
      }}
    >
      {/* Piece label (like "Sobra") */}
      <PieceLabel 
        label="Sobra" 
        fontSize={labelFontSize} 
        color="rgba(0,100,0,0.8)" 
        position="top-left" 
      />
      
      {/* Piece dimensions */}
      <PieceDimensions 
        width={piece.width}
        height={piece.height}
        fontSize={fontSize}
        labelFontSize={labelFontSize}
        showVerticalDimension={showVerticalDimension}
        color="rgba(0,100,0,0.8)"
        labelColor="rgba(0,100,0,0.7)"
        isScrap={true}
      />
    </div>
  );
};
