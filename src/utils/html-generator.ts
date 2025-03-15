
import { Sheet, PlacedPiece } from '../hooks/useSheetData';

export const generateCuttingPlanHtml = (
  sheet: Sheet,
  placedPieces: PlacedPiece[],
  sheetCount: number,
  sheets: number[],
  projectName: string
): string => {
  return `
    <html>
      <head>
        <title>Plano de Corte - ${projectName || 'Sem nome'}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body { 
            font-family: 'Inter', sans-serif; 
            margin: 20px; 
            color: #222222;
            line-height: 1.5;
          }
          .print-header { 
            margin-bottom: 25px; 
            padding-bottom: 15px;
            border-bottom: 1px solid #E2E2E2;
          }
          .print-header h1 { 
            margin: 0 0 5px 0; 
            font-weight: 600;
            color: #1a1f2c;
          }
          .print-date {
            color: #8e9196;
            font-size: 14px;
            margin-bottom: 5px;
          }
          .print-info { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 15px; 
            margin-bottom: 25px; 
            background-color: #F6F6F7;
            border-radius: 8px;
            padding: 15px;
          }
          .print-info-item { 
            display: flex; 
            justify-content: space-between;
            padding: 5px 0;
          }
          .print-info-label { 
            color: #8e9196; 
            font-weight: 500;
          }
          .print-info-value { 
            font-weight: 600;
            color: #1a1f2c;
          }
          .sheet-container { 
            border: 1px solid #E2E2E2; 
            margin-bottom: 20px; 
            position: relative; 
            page-break-after: always; 
            box-sizing: border-box;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            width: 100%;
            height: auto;
            max-width: 100%;
          }
          .sheet-page {
            page-break-after: always;
            padding-bottom: 20px;
            width: 100%;
            max-width: 100%;
            display: flex;
            flex-direction: column;
          }
          .sheet-page:last-child {
            page-break-after: avoid;
          }
          .sheet-title { 
            font-weight: 600; 
            margin-bottom: 12px; 
            color: #1a1f2c;
            font-size: 16px;
            display: flex;
            align-items: center;
          }
          .sheet-title:before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #9b87f5;
            margin-right: 8px;
          }
          .piece { 
            position: absolute; 
            border: 1px solid rgba(0,0,0,0.1); 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            font-size: 12px; 
            box-sizing: border-box; 
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            border-radius: 2px;
          }
          .dimension-width { 
            position: absolute; 
            bottom: 2px; 
            width: 100%; 
            text-align: center; 
            font-size: 10px;
            font-weight: 500;
            color: rgba(0,0,0,0.75);
          }
          .dimension-height { 
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
          }
          .project-info {
            margin-bottom: 10px;
            font-size: 14px;
            color: #8e9196;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #8e9196;
            padding-top: 15px;
            border-top: 1px solid #E2E2E2;
          }
          @media print {
            @page { margin: 0.5cm; }
            body { margin: 1cm; }
            .sheet-page { page-break-after: always; width: 100%; }
            .sheet-page:last-child { page-break-after: avoid; }
            .sheet-container { max-width: 100%; width: 100%; }
            .print-info {
              background-color: #F9F9F9;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .piece {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>Plano de Corte${projectName ? ': ' + projectName : ''}</h1>
          <div class="print-date">Data: ${new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</div>
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
        
        <script>
          function calculateMaxScale() {
            // We want to use the maximum available space while maintaining aspect ratio
            const contentArea = document.querySelector('.sheet-container');
            if (!contentArea) return 1;
            
            // Get the parent container's width (available width)
            const containerWidth = window.innerWidth - 40;
            
            // Calculate scale based on sheet dimensions
            const sheetWidth = ${sheet.width};
            const sheetHeight = ${sheet.height};
            
            // Calculate the aspect ratio of the sheet
            const sheetRatio = sheetWidth / sheetHeight;
            
            // Allow the sheet to be up to 95% of the available width
            const maxWidth = containerWidth * 0.95;
            
            // Calculate the height based on the aspect ratio and max width
            const expectedHeight = maxWidth / sheetRatio;
            
            // Check if the expected height fits within the available height
            // If not, we'll need to scale based on height instead
            const availableHeight = window.innerHeight - 350; // Account for header, info, etc.
            
            if (expectedHeight > availableHeight) {
              // Scale based on height
              return (availableHeight / sheetHeight);
            } else {
              // Scale based on width
              return (maxWidth / sheetWidth);
            }
          }
          
          function applyMaxScale() {
            const scale = calculateMaxScale();
            const sheetContainers = document.querySelectorAll('.sheet-container');
            
            sheetContainers.forEach(container => {
              const originalWidth = ${sheet.width};
              const originalHeight = ${sheet.height};
              
              // Scale the container to fit the available space
              container.style.width = (originalWidth * scale) + 'px';
              container.style.height = (originalHeight * scale) + 'px';
              
              // Scale pieces within the sheet
              const pieces = container.querySelectorAll('.piece');
              pieces.forEach(piece => {
                const originalLeft = parseFloat(piece.getAttribute('data-x'));
                const originalTop = parseFloat(piece.getAttribute('data-y'));
                const originalPieceWidth = parseFloat(piece.getAttribute('data-width'));
                const originalPieceHeight = parseFloat(piece.getAttribute('data-height'));
                
                piece.style.left = (originalLeft * scale) + 'px';
                piece.style.top = (originalTop * scale) + 'px';
                piece.style.width = (originalPieceWidth * scale) + 'px';
                piece.style.height = (originalPieceHeight * scale) + 'px';
                
                // Adjust font size based on the scale but ensure it's readable
                const fontSize = Math.max(Math.min(10 * scale, 16), 6);
                piece.style.fontSize = fontSize + 'px';
                
                const dimensionElements = piece.querySelectorAll('.dimension-width, .dimension-height');
                dimensionElements.forEach(el => {
                  el.style.fontSize = fontSize + 'px';
                });
              });
            });
          }
          
          // Apply scaling when the page loads and when window is resized
          window.addEventListener('load', applyMaxScale);
          window.addEventListener('resize', applyMaxScale);
          
          // Additionally trigger a resize after a brief delay to ensure everything is loaded
          setTimeout(applyMaxScale, 300);
        </script>
        
        ${sheets.map(sheetIndex => {
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
        }).join('')}

        <div class="footer">
          Plano de corte gerado em ${new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'})} às ${new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
        </div>
      </body>
    </html>
  `;
};
