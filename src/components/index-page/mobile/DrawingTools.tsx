
import React from 'react';

interface DrawingToolsProps {
  onAction: {
    undo: () => void;
    redo: () => void;
    clearCanvas: () => void;
    saveDrawing: () => void;
  };
}

export const DrawingTools = ({ onAction }: DrawingToolsProps) => {
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      <button 
        onClick={onAction.undo}
        className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
        title="Desfazer"
      >
        Desfazer
      </button>
      <button 
        onClick={onAction.redo}
        className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
        title="Refazer"
      >
        Refazer
      </button>
      <button 
        onClick={onAction.clearCanvas}
        className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
        title="Limpar"
      >
        Limpar
      </button>
      <button 
        onClick={onAction.saveDrawing}
        className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
        title="Salvar"
      >
        Salvar
      </button>
    </div>
  );
};

export default DrawingTools;
