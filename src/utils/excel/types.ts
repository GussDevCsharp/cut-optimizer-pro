
/**
 * Type definitions for Excel processing
 */

import { Piece } from '../../hooks/useSheetData';

export interface HeaderInfo {
  rowIndex: number;
  headers: string[];
}

export interface ColumnIndexes {
  width?: number;
  height?: number;
  quantity?: number;
  canRotate?: number;
  label?: number;
}
