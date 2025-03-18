import { v4 as uuidv4 } from 'uuid';
import { Piece, Sheet, PlacedPiece } from '../hooks/useSheetData';
import { getRandomColor } from './colorUtils';

interface ProjectData {
  projectName: string;
  sheet: Sheet;
  pieces: Piece[];
  placedPieces: PlacedPiece[];
}

// Define line prefixes for the file format
const LINE_PREFIXES = {
  PROJECT_INFO: "P",
  SHEET_DATA: "S",
  PIECE: "R",
  PLACED: "C"
};

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
    output += `${LINE_PREFIXES.PIECE};${piece.width};${piece.height};${piece.quantity};${piece.canRotate}\n`;
  });
  
  // Placed Pieces Data Lines
  placedPieces.forEach(piece => {
    output += `${LINE_PREFIXES.PLACED};${piece.width};${piece.height};${piece.x};${piece.y};${piece.rotated};${piece.sheetIndex}\n`;
  });
  
  return output;
};

/**
 * Parses a text file content to extract project data
 */
export const importProjectFromText = (content: string): ProjectData => {
  // Initialize default project data
  const projectData: ProjectData = {
    projectName: "",
    sheet: {
      width: 1220,
      height: 2440,
      cutWidth: 4
    },
    pieces: [],
    placedPieces: []
  };
  
  // Split content by lines and process each line
  const lines = content.split(/\r?\n/);
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    // Process line based on its prefix
    const prefix = trimmedLine[0]; // First character is the prefix
    const data = trimmedLine.substring(2).split(';'); // Skip prefix and separator, then split
    
    switch (prefix) {
      case LINE_PREFIXES.PROJECT_INFO:
        processProjectInfoLine(data, projectData);
        break;
      case LINE_PREFIXES.SHEET_DATA:
        processSheetDataLine(data, projectData);
        break;
      case LINE_PREFIXES.PIECE:
        processPieceDataLine(data, projectData);
        break;
      case LINE_PREFIXES.PLACED:
        processPlacedPieceDataLine(data, projectData);
        break;
    }
  }
  
  return projectData;
};

/**
 * Process a line of project info data
 */
const processProjectInfoLine = (data: string[], projectData: ProjectData) => {
  if (data.length >= 1) {
    projectData.projectName = data[0];
  }
  // Other project info fields can be processed here
};

/**
 * Process a line of sheet data
 */
const processSheetDataLine = (data: string[], projectData: ProjectData) => {
  if (data.length >= 3) {
    projectData.sheet.width = parseInt(data[0], 10) || 1220;
    projectData.sheet.height = parseInt(data[1], 10) || 2440;
    projectData.sheet.cutWidth = parseInt(data[2], 10) || 4;
    
    if (data.length >= 4 && data[3]) {
      projectData.sheet.materialId = data[3];
    }
  }
};

/**
 * Process a line of piece data
 */
const processPieceDataLine = (data: string[], projectData: ProjectData) => {
  if (data.length >= 4) {
    const piece: Piece = {
      id: uuidv4(), // Generate an ID for the piece
      width: parseInt(data[0], 10) || 0,
      height: parseInt(data[1], 10) || 0,
      quantity: parseInt(data[2], 10) || 1,
      canRotate: data[3]?.toLowerCase() === "true",
      color: getRandomColor() // Let the platform handle colors
    };
    
    if (piece.width > 0 && piece.height > 0) {
      projectData.pieces.push(piece);
    }
  }
};

/**
 * Process a line of placed piece data
 */
const processPlacedPieceDataLine = (data: string[], projectData: ProjectData) => {
  if (data.length >= 6) {
    const placedPiece: PlacedPiece = {
      id: uuidv4(), // Generate an ID for the placed piece
      width: parseInt(data[0], 10) || 0,
      height: parseInt(data[1], 10) || 0,
      quantity: 1,
      canRotate: true,
      x: parseInt(data[2], 10) || 0,
      y: parseInt(data[3], 10) || 0,
      rotated: data[4]?.toLowerCase() === "true",
      sheetIndex: parseInt(data[5], 10) || 0,
      color: getRandomColor() // Let the platform handle colors
    };
    
    if (placedPiece.width > 0 && placedPiece.height > 0) {
      projectData.placedPieces.push(placedPiece);
    }
  }
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
        color: "#FF5733"
      },
      {
        id: "piece-2",
        width: 400,
        height: 200,
        quantity: 3,
        canRotate: false,
        color: "#33FF57"
      }
    ],
    placedPieces: [
      {
        id: "piece-1-placed",
        width: 500,
        height: 300,
        quantity: 1,
        canRotate: true,
        x: 10,
        y: 10,
        rotated: false,
        sheetIndex: 0,
        color: "#FF5733"
      }
    ]
  };
  
  return exportProjectToText(exampleData);
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
 * Reads the contents of a text file
 */
export const readProjectFile = async (file: File): Promise<string> => {
  try {
    return await file.text();
  } catch (err) {
    throw new Error(`Erro ao ler arquivo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
  }
};
