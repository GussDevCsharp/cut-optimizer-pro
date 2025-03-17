
/**
 * Type definitions for Text Import processing
 */

import { Piece } from '../../hooks/useSheetData';

export interface TextImportResult {
  importedPieces: Piece[];
  invalidLines: string[];
}

