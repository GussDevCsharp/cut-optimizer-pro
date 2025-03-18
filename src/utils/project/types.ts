
import { Piece, Sheet, PlacedPiece } from '../../hooks/useSheetData';

export interface ProjectData {
  projectName: string;
  sheet: Sheet;
  pieces: Piece[];
  placedPieces: PlacedPiece[];
}

// Define line prefixes for the file format
export const LINE_PREFIXES = {
  PROJECT_INFO: "P",
  SHEET_DATA: "S",
  PIECE: "R",
  PLACED: "C"
};
