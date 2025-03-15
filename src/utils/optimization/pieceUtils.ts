
import { Piece } from "./types";

// Sort pieces by area (largest first) to improve packing efficiency
export const sortPiecesByArea = (pieces: Piece[]): Piece[] => {
  return [...pieces].sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });
};

// Check if a piece fits within the sheet boundaries
export const checkBoundaries = (
  piece: { width: number; height: number; x: number; y: number }, 
  sheet: { width: number; height: number }
): boolean => {
  return (
    piece.x >= 0 &&
    piece.y >= 0 &&
    piece.x + piece.width <= sheet.width &&
    piece.y + piece.height <= sheet.height
  );
};
