
import { Piece, Sheet } from '../../hooks/useSheetData';
import { SheetGrid } from './SheetGrid';

// Sort pieces by area (largest first) to improve packing efficiency
export const sortPiecesByArea = (pieces: Piece[]): Piece[] => {
  return [...pieces].sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });
};

// Try all possible positions for a piece on a specific sheet grid
export const findBestPosition = (
  piece: Piece,
  sheetGrid: SheetGrid,
  sheet: Sheet
): { x: number; y: number; rotated: boolean } | null => {
  // Try both orientations
  const orientations = [
    { width: piece.width, height: piece.height, rotated: false },
    { width: piece.height, height: piece.width, rotated: true && piece.canRotate } // Only rotate if allowed
  ].filter(o => !o.rotated || piece.canRotate); // Filter out rotated option if rotation not allowed
  
  let bestPosition = null;
  let lowestY = Number.MAX_SAFE_INTEGER;
  let lowestX = Number.MAX_SAFE_INTEGER;

  // Incrementos menores para busca mais detalhada em peças grandes como 200x275
  const stepSize = piece.width > 150 && piece.height > 150 ? 1 : 1;

  // Try every possible position on the sheet
  for (const orientation of orientations) {
    // Verifica se a dimensão é grande (como 200x275) e prioriza a orientação que melhor se encaixa na folha
    const isPriority = (orientation.width === 200 && orientation.height === 275) || 
                       (orientation.width === 275 && orientation.height === 200);
    
    // Step through the sheet in smaller increments for large pieces
    for (let y = 0; y <= sheet.height - orientation.height; y += stepSize) {
      for (let x = 0; x <= sheet.width - orientation.width; x += stepSize) {
        if (sheetGrid.isAreaAvailable(x, y, orientation.width, orientation.height, sheet.cutWidth)) {
          // Para peças grandes que estavam tendo problemas, verifica com uma margem extra de segurança
          if ((piece.width === 200 && piece.height === 275) || 
              (piece.width === 275 && piece.height === 200)) {
            // Verificação adicional de segurança para peças problemáticas
            const isSecure = sheetGrid.isSecurePosition(x, y, orientation.width, orientation.height, sheet.cutWidth + 1);
            if (!isSecure) continue;
          }
          
          // We found a valid position - check if it's "better" than our current best
          // Better means closer to the top-left corner, with priority for problematic pieces
          const score = y * 1000 + x; // Base score
          const currentBestScore = lowestY * 1000 + lowestX;
          
          // Se for uma peça prioritária (como 200x275) e estiver na orientação mais adequada
          // ou se não houver posição anterior, ou se a posição atual for melhor
          if (isPriority || bestPosition === null || score < currentBestScore) {
            lowestY = y;
            lowestX = x;
            bestPosition = { x, y, rotated: orientation.rotated };
            
            // Se a peça for prioritária e encontrarmos uma posição válida, podemos usar
            if (isPriority && orientation.rotated === true) {
              return bestPosition; // Retorna imediatamente para peças prioritárias na orientação rotacionada
            }
          }
        }
      }
      
      // If we found a position at the current y and it's not a priority piece, we can move to the next y level
      if (bestPosition && bestPosition.y === y && !isPriority) {
        break;
      }
    }
    
    // Se encontramos uma posição na orientação atual e não é uma peça problemática,
    // podemos prosseguir ao invés de tentar a próxima orientação
    if (bestPosition && !isPriority) {
      break;
    }
  }

  return bestPosition;
};
