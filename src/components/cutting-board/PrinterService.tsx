
import { Sheet, PlacedPiece } from '../../hooks/useSheetData';

interface PrinterServiceProps {
  sheet: Sheet;
  placedPieces: PlacedPiece[];
  sheetCount: number;
  sheets: number[];
}

export const usePrinterService = ({ sheet, placedPieces, sheetCount, sheets }: PrinterServiceProps) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Plano de Corte</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .print-header { margin-bottom: 20px; }
            .print-header h1 { margin: 0 0 10px 0; }
            .print-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
            .print-info-item { display: flex; justify-content: space-between; }
            .print-info-label { color: #666; }
            .print-info-value { font-weight: bold; }
            .sheet-container { border: 1px solid #ccc; margin-top: 20px; position: relative; page-break-after: always; }
            .sheet-title { font-weight: bold; margin-bottom: 10px; }
            .piece { position: absolute; border: 1px solid rgba(0,0,0,0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px; box-sizing: border-box; overflow: hidden; }
            .dimension-width { position: absolute; bottom: 2px; font-size: 10px; }
            .dimension-height { position: absolute; left: 2px; writing-mode: vertical-lr; transform: rotate(180deg); font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Plano de Corte</h1>
            <div>Data: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="print-info">
            <div class="print-info-item">
              <span class="print-info-label">Dimensões da chapa:</span>
              <span class="print-info-value">${sheet.width}×${sheet.height}mm</span>
            </div>
            <div class="print-info-item">
              <span class="print-info-label">Total de peças:</span>
              <span class="print-info-value">${placedPieces.length}</span>
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
          
          ${sheets.map(sheetIndex => {
            const sheetPieces = placedPieces.filter(p => p.sheetIndex === sheetIndex);
            return `
              <div class="sheet-title">Chapa ${sheetIndex + 1}</div>
              <div class="sheet-container" style="width: ${sheet.width}px; height: ${sheet.height}px; max-width: 100%;">
                ${sheetPieces.map((piece) => `
                  <div class="piece" 
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
            `;
          }).join('')}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setTimeout(() => printWindow.close(), 1000);
  };

  return { handlePrint };
};
