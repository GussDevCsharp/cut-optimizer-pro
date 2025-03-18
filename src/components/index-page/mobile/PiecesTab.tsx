
import React from 'react';
import { useSheetData } from '@/hooks/useSheetData';
import CuttingBoard from '../../CuttingBoard';
import CollapsiblePiecesList from '../../pieces-panel/CollapsiblePiecesList';

export const PiecesTab = () => {
  const { pieces, updatePiece, removePiece } = useSheetData();
  
  return (
    <>
      <CuttingBoard />
      <div className="mt-2">
        <CollapsiblePiecesList 
          pieces={pieces}
          onUpdatePiece={updatePiece}
          onRemovePiece={removePiece}
        />
      </div>
    </>
  );
};
