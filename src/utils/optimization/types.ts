
import { Piece, PlacedPiece, Sheet } from '../../hooks/useSheetData';

export interface Position {
  x: number;
  y: number;
  rotated: boolean;
}

export interface PieceWithOrientation {
  width: number;
  height: number;
  rotated: boolean;
  x?: number;
  y?: number;
}

export type { Piece, PlacedPiece, Sheet };
