
import { ProjectData, LINE_PREFIXES } from './types';

/**
 * Generates a text file content representing the entire project
 */
export const exportProjectToText = (projectData: ProjectData): string => {
  const { projectName, sheet, pieces, placedPieces } = projectData;
  let output = "";
  
  // Project Info Line
  output += `${LINE_PREFIXES.PROJECT_INFO};${projectName};1.0;${new Date().toISOString()}\n`;
  
  // Sheet Data Line
  output += `${LINE_PREFIXES.SHEET_DATA};${sheet.width};${sheet.height};${sheet.cutWidth}`;
  if (sheet.materialId) {
    output += `;${sheet.materialId}`;
  }
  output += '\n';
  
  // Pieces Data Lines
  pieces.forEach(piece => {
    output += `${LINE_PREFIXES.PIECE};${piece.width};${piece.height};${piece.quantity};${piece.canRotate};${piece.name || 'Sem nome'}\n`;
  });
  
  // Placed Pieces Data Lines - still include these in export, just not in import
  placedPieces.forEach(piece => {
    output += `${LINE_PREFIXES.PLACED};${piece.width};${piece.height};${piece.x};${piece.y};${piece.rotated};${piece.sheetIndex}\n`;
  });
  
  return output;
};

/**
 * Creates and downloads an example text project file
 */
export const downloadExampleProjectFile = () => {
  const content = generateExampleProject();
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'exemplo_projeto_corte.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Generates an example text file content
 */
export const generateExampleProject = (): string => {
  const exampleData: ProjectData = {
    projectName: "Exemplo de Projeto",
    sheet: {
      width: 1220,
      height: 2440,
      cutWidth: 4,
      materialId: "example-material-id"
    },
    pieces: [
      {
        id: "piece-1",
        width: 500,
        height: 300,
        quantity: 2,
        canRotate: true,
        color: "#FF5733",
        name: "Peça 1"
      },
      {
        id: "piece-2",
        width: 400,
        height: 200,
        quantity: 3,
        canRotate: false,
        color: "#33FF57",
        name: "Peça 2"
      }
    ],
    placedPieces: [] // No placed pieces in the example
  };
  
  return exportProjectToText(exampleData);
};
