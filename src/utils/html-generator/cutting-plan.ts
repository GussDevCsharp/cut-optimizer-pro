
import { Sheet, PlacedPiece } from '../../hooks/useSheetData';
import { getCuttingPlanStyles } from './styles';
import { getScalingScript } from './scaling-script';
import { generateHeader, generateProjectInfo, generateFooter } from './header';
import { generateSheets } from './sheet-generator';

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
          ${getCuttingPlanStyles()}
        </style>
      </head>
      <body>
        ${generateHeader(projectName)}
        
        ${generateProjectInfo(sheet, placedPieces, sheetCount)}
        
        <script>
          ${getScalingScript(sheet)}
        </script>
        
        ${generateSheets(sheet, placedPieces, sheets)}

        ${generateFooter()}
      </body>
    </html>
  `;
};
