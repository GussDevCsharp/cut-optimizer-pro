
import React from 'react';
import { PlacedPiece, ScrapPiece } from '../../hooks/useSheetData';
import { RegularPiece } from './piece-components/RegularPiece';
import { ScrapPieceComponent } from './piece-components/ScrapPieceComponent';

interface SheetPieceProps {
  piece: PlacedPiece | ScrapPiece;
  scale: number;
  isMobile?: boolean;
}

export const SheetPiece = ({ piece, scale, isMobile }: SheetPieceProps) => {
  // Check if this is a scrap piece
  const isScrap = 'isScrap' in piece && piece.isScrap;
  
  // Route to the appropriate component based on piece type
  if (isScrap) {
    return <ScrapPieceComponent piece={piece as ScrapPiece} scale={scale} isMobile={isMobile} />;
  }
  
  return <RegularPiece piece={piece} scale={scale} isMobile={isMobile} />;
};
