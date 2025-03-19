
import { PlacedPiece } from '../../hooks/useSheetData';

export const generatePieceLabel = (id: string): string => {
  return `${String.fromCharCode(65 + (id.charCodeAt(0) % 26))}${(parseInt(id, 36) % 9) + 1}`;
};

export const generatePiece = (piece: PlacedPiece): string => {
  const pieceLabel = generatePieceLabel(piece.id);
  
  // Determine if we need to show vertical dimension based on aspect ratio
  const showVerticalDimension = piece.height > piece.width * 1.2;
  
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
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: absolute;
        box-sizing: border-box;
        overflow: hidden;
        border: 1px solid rgba(0,0,0,0.15);
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        border-radius: 2px;
      "
    >
      <span class="piece-label" style="
        position: absolute;
        top: 2px;
        left: 2px;
        font-size: 10px;
        font-weight: 500;
        color: rgba(0,0,0,0.75);
      ">${pieceLabel}</span>
      
      <span class="dimension-center" style="
        font-weight: 600;
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        z-index: 2;
      ">${piece.width}</span>
      
      ${showVerticalDimension ? `
        <span class="dimension-vertical" style="
          position: absolute;
          font-weight: 600;
          font-size: 14px;
          color: rgba(0,0,0,0.85);
          transform: rotate(-90deg);
          z-index: 2;
        ">${piece.height}</span>
      ` : ''}
      
      <span class="dimension-width" style="
        position: absolute;
        bottom: 2px;
        width: 100%;
        text-align: center;
        font-size: 10px;
        font-weight: 500;
        color: rgba(0,0,0,0.75);
      ">${piece.width}</span>
      
      <span class="dimension-height" style="
        position: absolute;
        left: 2px;
        height: 100%;
        writing-mode: vertical-lr;
        transform: rotate(180deg);
        display: flex;
        align-items: center;
        font-size: 10px;
        font-weight: 500;
        color: rgba(0,0,0,0.75);
      ">${piece.height}</span>
    </div>
  `;
};
