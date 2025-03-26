
import { Piece } from '../../hooks/useSheetData';
import { PieceDimensionsInput } from './piece-form/PieceDimensionsInput';
import { PieceQuantityInput } from './piece-form/PieceQuantityInput';
import { PieceRotationToggle } from './piece-form/PieceRotationToggle';
import { AddPieceButton } from './piece-form/AddPieceButton';
import { usePieceForm } from './piece-form/usePieceForm';

interface PieceFormProps {
  onAddPiece: (piece: Piece) => void;
  projectId: string | null;
}

export const PieceForm = (props: PieceFormProps) => {
  const {
    newPiece,
    isSaving,
    handleDimensionChange,
    handleQuantityChange,
    handleToggleRotation,
    handleAddPiece
  } = usePieceForm(props);

  return (
    <div className="space-y-4">
      <PieceDimensionsInput
        piece={newPiece}
        onDimensionChange={handleDimensionChange}
      />

      <PieceQuantityInput
        quantity={newPiece.quantity}
        onQuantityChange={handleQuantityChange}
      />
      
      <PieceRotationToggle
        canRotate={newPiece.canRotate}
        onToggleRotation={handleToggleRotation}
      />

      <AddPieceButton
        onClick={handleAddPiece}
        isLoading={isSaving}
      />
    </div>
  );
};
