
import { v4 as uuidv4 } from 'uuid';
import { Piece } from '../hooks/useSheetData';
import { getRandomColor } from './colorUtils';

/**
 * Processes text content and extracts piece information.
 * Supported formats:
 * - 100x200 (3) - width x height (quantity)
 * - 100 200 3 - width height quantity
 */
export const processTextContent = (content: string): { 
  importedPieces: Piece[], 
  invalidLines: string[] 
} => {
  if (!content.trim()) {
    throw new Error('Nenhum texto inserido');
  }

  // Split by any line break character to handle different OS formats
  const lines = content.trim().split(/\r?\n/);
  const importedPieces: Piece[] = [];
  const invalidLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    let width, height, quantity = 1;
    let processed = false;
    
    // Try the format: 100x200 (3)
    const xMatch = line.match(/(\d+)\s*[xX]\s*(\d+)(?:\s*\((\d+)\))?/);
    if (xMatch) {
      width = parseInt(xMatch[1]);
      height = parseInt(xMatch[2]);
      quantity = xMatch[3] ? parseInt(xMatch[3]) : 1;
      processed = true;
    } 
    // Try the format: 100 200 3
    else {
      const spacesMatch = line.match(/(\d+)\s+(\d+)(?:\s+(\d+))?/);
      if (spacesMatch) {
        width = parseInt(spacesMatch[1]);
        height = parseInt(spacesMatch[2]);
        quantity = spacesMatch[3] ? parseInt(spacesMatch[3]) : 1;
        processed = true;
      }
    }
    
    if (processed && width > 0 && height > 0 && quantity > 0) {
      // Create individual pieces based on quantity
      for (let q = 0; q < quantity; q++) {
        importedPieces.push({
          id: uuidv4(),
          width,
          height,
          quantity: 1, // Each piece now has quantity 1
          canRotate: true,
          color: getRandomColor(),
          name: `Peça ${i+1}-${q+1}`
        });
      }
    } else {
      invalidLines.push(`Linha ${i + 1}: "${line}"`);
    }
  }
  
  return { importedPieces, invalidLines };
};

/**
 * Reads the contents of a text file.
 */
export const readTextFile = async (file: File): Promise<string> => {
  try {
    return await file.text();
  } catch (err) {
    throw new Error(`Erro ao ler arquivo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
  }
};
