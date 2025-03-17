
/**
 * Helper functions for processing Excel data
 */

import { v4 as uuidv4 } from 'uuid';
import { Piece } from '../hooks/useSheetData';
import { getRandomColor } from './colorUtils';

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

// Find a row that contains headers
export const findHeaderRow = (data: any[][]): HeaderInfo => {
  // Look for a row that might contain headers
  for (let i = 0; i < Math.min(10, data.length); i++) {
    const row = data[i];
    if (!row || !row.length) continue;
    
    const potentialHeaders = row.map(cell => String(cell || '').toLowerCase());
    
    // Check if this row contains any of our expected header keywords
    if (potentialHeaders.some(h => 
      h.includes('larg') || 
      h.includes('width') || 
      h.includes('alt') || 
      h.includes('height') ||
      h.includes('quant')
    )) {
      return { rowIndex: i, headers: row.map(cell => String(cell || '')) };
    }
  }
  
  // If no header row found, assume the first row is headers
  return { rowIndex: 0, headers: data[0]?.map(cell => String(cell || '')) || [] };
};

// Determine the column indexes based on headers
export const getColumnIndexes = (headerInfo: HeaderInfo): ColumnIndexes => {
  const result: ColumnIndexes = {};
  
  headerInfo.headers.forEach((header, index) => {
    if (!header) return;
    
    const headerLower = String(header).toLowerCase();
    
    if (headerLower.includes('larg') || headerLower.includes('width')) {
      result.width = index;
    }
    else if (headerLower.includes('alt') || headerLower.includes('height')) {
      result.height = index;
    }
    else if (headerLower.includes('quant')) {
      result.quantity = index;
    }
    else if (headerLower.includes('rot')) {
      result.canRotate = index;
    }
    else if (headerLower.includes('label') || headerLower.includes('nome') || headerLower.includes('desc')) {
      result.label = index;
    }
  });
  
  return result;
};

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
  
  const importedPieces: Piece[] = [];
  
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

// Create and download example Excel file
export const createAndDownloadExampleFile = () => {
  if (!window.XLSX) {
    throw new Error('XLSX library not loaded');
  }

  // Create sample data
  const exampleData = [
    { largura: 100, altura: 200, quantidade: 3 },
    { largura: 150, altura: 300, quantidade: 1 },
    { largura: 400, altura: 600, quantidade: 5 }
  ];

  // Create a new workbook
  const wb = window.XLSX.utils.book_new();
  const ws = window.XLSX.utils.json_to_sheet(exampleData);
  
  // Add the worksheet to the workbook
  window.XLSX.utils.book_append_sheet(wb, ws, "Peças");

  // Write the workbook and trigger a download
  window.XLSX.writeFile(wb, "exemplo_importacao_pecas.xlsx");
};

// Load XLSX library dynamically
export const loadXLSXLibrary = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (window.XLSX) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load XLSX library'));
    document.head.appendChild(script);
  });
};
