
/**
 * Utilities for processing Excel headers
 */

import { HeaderInfo, ColumnIndexes } from './types';

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
