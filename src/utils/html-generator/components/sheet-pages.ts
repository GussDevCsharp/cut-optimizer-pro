
import { PlacedPiece } from '../../../hooks/useSheetData';

export const getSheetPagesHtml = (sheets: number[], placedPieces: PlacedPiece[], sheet: any): string => {
  return sheets.map(sheetIndex => {
    const sheetPieces = placedPieces.filter(p => p.sheetIndex === sheetIndex);
    return `
      <div class="sheet-page">
        <div class="sheet-title">Chapa ${sheetIndex + 1}</div>
        <div class="sheet-container">
          ${sheetPieces.map((piece) => `
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
              <span class="dimension-width">${piece.width}</span>
              <span class="dimension-height">${piece.height}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
};
