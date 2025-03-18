
import React from 'react';
import { useSheetData } from '@/hooks/useSheetData';
import CuttingBoard from '../../CuttingBoard';
import CollapsiblePiecesList from '../../pieces-panel/CollapsiblePiecesList';

export const PiecesListTab = () => {
  const { pieces, updatePiece, removePiece } = useSheetData();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
      {/* Left Column - Cutting Board */}
      <div className="lg:col-span-3">
        <CuttingBoard />
      </div>
      
      {/* Right Column - Pieces List */}
      <div className="lg:col-span-1 h-full">
        <CollapsiblePiecesList 
          pieces={pieces}
          onUpdatePiece={updatePiece}
          onRemovePiece={removePiece}
        />
      </div>
    </div>
  );
};

export default PiecesListTab;
