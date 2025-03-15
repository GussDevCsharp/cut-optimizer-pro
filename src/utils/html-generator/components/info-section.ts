
import { Sheet } from '../../../hooks/useSheetData';

export const getInfoSectionHtml = (sheet: Sheet, pieceCount: number, sheetCount: number): string => {
  return `
    <div class="print-info">
      <div class="print-info-item">
        <span class="print-info-label">Dimensões da chapa:</span>
        <span class="print-info-value">${sheet.width}×${sheet.height}mm</span>
      </div>
      <div class="print-info-item">
        <span class="print-info-label">Total de peças:</span>
        <span class="print-info-value">${pieceCount}</span>
      </div>
      <div class="print-info-item">
        <span class="print-info-label">Número de chapas:</span>
        <span class="print-info-value">${sheetCount}</span>
      </div>
      <div class="print-info-item">
        <span class="print-info-label">Largura de corte:</span>
        <span class="print-info-value">${sheet.cutWidth}mm</span>
      </div>
    </div>
  `;
};
