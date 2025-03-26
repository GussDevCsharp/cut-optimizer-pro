
import { Piece } from '@/hooks/useSheetData';

/**
 * Calculate the total area of all pieces
 */
export const calculateTotalArea = (pieces: Piece[]): number => {
  return pieces.reduce((total, piece) => {
    return total + (piece.width * piece.height);
  }, 0);
};
