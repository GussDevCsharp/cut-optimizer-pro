
import { Piece, Sheet, PlacedPiece } from '../hooks/useSheetData';
import { optimizeCutting, OptimizationDirection } from '../utils/optimizationAlgorithm';

// Interface para as mensagens recebidas pelo worker
interface WorkerMessage {
  pieces: Piece[];
  sheet: Sheet;
  direction: OptimizationDirection;
}

// Event listener para mensagens recebidas
self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  const { pieces, sheet, direction } = event.data;
  
  try {
    // Executa a otimização em uma thread separada
    const result = optimizeCutting(pieces, sheet, direction);
    
    // Envia o resultado de volta para o thread principal
    self.postMessage({ success: true, placedPieces: result });
  } catch (error) {
    console.error('Error in optimization worker:', error);
    self.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido na otimização'
    });
  }
});

// Notifica que o worker está pronto
self.postMessage({ status: 'ready' });
