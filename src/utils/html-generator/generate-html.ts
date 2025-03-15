
import { Sheet, PlacedPiece } from '../../hooks/useSheetData';
import { getHeaderHtml } from './components/header';
import { getInfoSectionHtml } from './components/info-section';
import { getSheetPagesHtml } from './components/sheet-pages';
import { getFooterHtml } from './components/footer';
import { getStylesHtml } from './styles';
import { getScriptHtml } from './scripts';

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
        ${getStylesHtml()}
        ${getScriptHtml()}
      </head>
      <body>
        ${getHeaderHtml(projectName)}
        ${getInfoSectionHtml(sheet, placedPieces.length, sheetCount)}
        ${getSheetPagesHtml(sheets, placedPieces, sheet)}
        ${getFooterHtml()}
      </body>
    </html>
  `;
};
