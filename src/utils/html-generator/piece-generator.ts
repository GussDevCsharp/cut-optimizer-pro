
import { PlacedPiece } from '../../hooks/useSheetData';

export const generatePieceLabel = (id: string): string => {
  return `${String.fromCharCode(65 + (id.charCodeAt(0) % 26))}${(parseInt(id, 36) % 9) + 1}`;
};

export const generatePiece = (piece: PlacedPiece): string => {
  const pieceLabel = generatePieceLabel(piece.id);
  
  return `
    <div class="piece" 
      data-x="${piece.x}"
      data-y="${piece.y}"
      data-width="${piece.width}"
      data-height="${piece.height}"
      style="
        left: ${piece.x}px; 
        top: ${piece.y}px; 
        width: ${piece.width}px; 
        height: ${piece.height}px; 
        background-color: ${piece.color}; 
        transform: rotate(${piece.rotated ? '90deg' : '0deg'});
        transform-origin: center;
      "
    >
      <span class="piece-label">${pieceLabel}</span>
      <span class="dimension-center">${piece.width}</span>
      <span class="dimension-width">${piece.width}</span>
      <span class="dimension-height">${piece.height}</span>
      ${piece.height > piece.width * 1.5 ? `<span class="dimension-center" style="transform: rotate(-90deg)">${piece.height}</span>` : ''}
    </div>
  `;
};
