
/**
 * Utilities for processing Excel data
 */

import { v4 as uuidv4 } from 'uuid';
import { Piece } from '../../hooks/useSheetData';
import { getRandomColor } from '../colorUtils';
import { ColumnIndexes } from './types';
import { findHeaderRow, getColumnIndexes } from './headerUtils';

// Parse a number from a cell value
export const parseNumberFromCell = (cell: any): number => {
  if (cell === undefined || cell === null || cell === '') return NaN;
  
  if (typeof cell === 'number') {
    return cell;
  }
  
  // Try to extract a number from a string
  const numberMatch = String(cell).match(/(\d+(\.\d+)?)/);
  return numberMatch ? parseFloat(numberMatch[1]) : NaN;
};

// Process Excel data into pieces
export const processExcelData = (data: any[][]): Piece[] => {
  if (data.length === 0) {
    throw new Error('Planilha vazia');
  }
  
  if (data.length === 1) {
    throw new Error('A planilha contém apenas cabeçalhos, sem dados');
  }
  
  // Find the header row and column indexes
  const headerInfo = findHeaderRow(data);
  console.log('Header info:', headerInfo);
  
  const columnIndexes = getColumnIndexes(headerInfo);
  console.log('Column indexes:', columnIndexes);
  
  if (!columnIndexes.width || !columnIndexes.height) {
    // Try a simpler approach - look at the first row and try to identify columns by position
    console.log('Trying simple column detection');
    // Assume first row might be header if it contains strings
    const firstRowIsHeader = data[0].some(cell => typeof cell === 'string' && cell.toString().trim() !== '');
    
    const simpleColumnIndexes = {
      width: 0,  // First column
      height: 1, // Second column
      quantity: 2 // Third column (if exists)
    };
    
    console.log('Using simple column indexes:', simpleColumnIndexes);
    
    // Start from row 1 if first row is header, otherwise from row 0
    const startRow = firstRowIsHeader ? 1 : 0;
    
    return processRowsWithSimpleIndexes(data, startRow, simpleColumnIndexes);
  } else {
    // Use header-based approach if columns were identified
    const startRow = headerInfo.rowIndex + 1;
    return processRowsWithHeaderIndexes(data, startRow, columnIndexes);
  }
};

// Process rows using simple column indexes
const processRowsWithSimpleIndexes = (
  data: any[][], 
  startRow: number, 
  indexes: { width: number, height: number, quantity: number }
): Piece[] => {
  const pieces: Piece[] = [];
  
  for (let i = startRow; i < data.length; i++) {
    const row: any[] = data[i];
    
    // Skip completely empty rows
    if (row.every(cell => cell === null || cell === undefined || cell === '')) continue;
    
    // Get values using direct indexes
    const width = parseNumberFromCell(row[indexes.width]);
    const height = parseNumberFromCell(row[indexes.height]);
    
    // Get quantity if the column exists, otherwise default to 1
    const quantity = row.length > indexes.quantity 
      ? parseNumberFromCell(row[indexes.quantity]) || 1 
      : 1;
    
    console.log(`Row ${i} - width: ${width}, height: ${height}, quantity: ${quantity}`);
    
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      console.warn(`Ignorando linha ${i + 1}: dados de dimensão inválidos`, row);
      continue;
    }
    
    // Create individual pieces based on quantity
    for (let q = 0; q < quantity; q++) {
      pieces.push({
        id: uuidv4(),
        label: `${width}x${height}`, // Generate a label from dimensions
        width,
        height,
        quantity: 1, // Each piece now has quantity 1
        canRotate: true,
        color: getRandomColor()
      });
    }
  }
  
  return pieces;
};

// Process rows using header-based column indexes
const processRowsWithHeaderIndexes = (
  data: any[][], 
  startRow: number, 
  columnIndexes: ColumnIndexes
): Piece[] => {
  const pieces: Piece[] = [];
  
  for (let i = startRow; i < data.length; i++) {
    const row: any[] = data[i];
    
    // Skip completely empty rows
    if (!row.length || row.every(cell => cell === null || cell === undefined || cell === '')) {
      console.log(`Skipping empty row ${i}`);
      continue;
    }
    
    if (columnIndexes.width === undefined || columnIndexes.height === undefined) {
      continue; // Skip if essential columns are not found
    }
    
    const width = parseNumberFromCell(row[columnIndexes.width]);
    const height = parseNumberFromCell(row[columnIndexes.height]);
    const quantity = columnIndexes.quantity !== undefined 
      ? parseNumberFromCell(row[columnIndexes.quantity]) || 1 
      : 1;
    
    const canRotate = columnIndexes.canRotate !== undefined
      ? Boolean(row[columnIndexes.canRotate])
      : true;
    
    // Get label if available, otherwise generate one from dimensions
    const label = columnIndexes.label !== undefined && row[columnIndexes.label]
      ? String(row[columnIndexes.label])
      : `${width}x${height}`;
    
    console.log(`Row ${i} - width: ${width}, height: ${height}, quantity: ${quantity}`);
    
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      console.warn(`Ignorando linha ${i + 1}: dados de dimensão inválidos`, row);
      continue;
    }
    
    // Create individual pieces based on quantity
    for (let q = 0; q < quantity; q++) {
      pieces.push({
        id: uuidv4(),
        label,
        width,
        height,
        quantity: 1, // Each piece now has quantity 1
        canRotate,
        color: getRandomColor()
      });
    }
  }
  
  return pieces;
};
