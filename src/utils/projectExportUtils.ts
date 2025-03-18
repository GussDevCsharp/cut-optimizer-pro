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
  PROJECT_INFO: "PROJECT_INFO:",
  SHEET_DATA: "SHEET_DATA:",
  PIECE: "PIECE:",
  PLACED: "PLACED:"
};

/**
 * Generates a text file content representing the entire project
 */
export const exportProjectToText = (projectData: ProjectData): string => {
  const { projectName, sheet, pieces, placedPieces } = projectData;
  let output = "";
  
  // Project Info Line
  output += `${LINE_PREFIXES.PROJECT_INFO}NAME=${projectName};VERSION=1.0;TIMESTAMP=${new Date().toISOString()}\n`;
  
  // Sheet Data Line
  output += `${LINE_PREFIXES.SHEET_DATA}WIDTH=${sheet.width};HEIGHT=${sheet.height};CUT_WIDTH=${sheet.cutWidth}`;
  if (sheet.materialId) {
    output += `;MATERIAL_ID=${sheet.materialId}`;
  }
  output += '\n';
  
  // Pieces Data Lines
  pieces.forEach(piece => {
    output += `${LINE_PREFIXES.PIECE}WIDTH=${piece.width};HEIGHT=${piece.height};QUANTITY=${piece.quantity};CAN_ROTATE=${piece.canRotate}\n`;
  });
  
  // Placed Pieces Data Lines
  placedPieces.forEach(piece => {
    output += `${LINE_PREFIXES.PLACED}WIDTH=${piece.width};HEIGHT=${piece.height};X=${piece.x};Y=${piece.y};ROTATED=${piece.rotated};SHEET_INDEX=${piece.sheetIndex}\n`;
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
    if (trimmedLine.startsWith(LINE_PREFIXES.PROJECT_INFO)) {
      processProjectInfoLine(trimmedLine.substring(LINE_PREFIXES.PROJECT_INFO.length), projectData);
    } else if (trimmedLine.startsWith(LINE_PREFIXES.SHEET_DATA)) {
      processSheetDataLine(trimmedLine.substring(LINE_PREFIXES.SHEET_DATA.length), projectData);
    } else if (trimmedLine.startsWith(LINE_PREFIXES.PIECE)) {
      processPieceDataLine(trimmedLine.substring(LINE_PREFIXES.PIECE.length), projectData);
    } else if (trimmedLine.startsWith(LINE_PREFIXES.PLACED)) {
      processPlacedPieceDataLine(trimmedLine.substring(LINE_PREFIXES.PLACED.length), projectData);
    }
  }
  
  return projectData;
};

/**
 * Process a line of project info data
 */
const processProjectInfoLine = (dataStr: string, projectData: ProjectData) => {
  const data = parseDataString(dataStr);
  if (data.NAME) {
    projectData.projectName = data.NAME;
  }
  // Other project info fields can be processed here
};

/**
 * Process a line of sheet data
 */
const processSheetDataLine = (dataStr: string, projectData: ProjectData) => {
  const data = parseDataString(dataStr);
  
  if (data.WIDTH) {
    projectData.sheet.width = parseInt(data.WIDTH, 10);
  }
  if (data.HEIGHT) {
    projectData.sheet.height = parseInt(data.HEIGHT, 10);
  }
  if (data.CUT_WIDTH) {
    projectData.sheet.cutWidth = parseInt(data.CUT_WIDTH, 10);
  }
  if (data.MATERIAL_ID) {
    projectData.sheet.materialId = data.MATERIAL_ID;
  }
};

/**
 * Process a line of piece data
 */
const processPieceDataLine = (dataStr: string, projectData: ProjectData) => {
  const data = parseDataString(dataStr);
  
  if (data.WIDTH && data.HEIGHT) {
    const piece: Piece = {
      id: uuidv4(), // Generate an ID for the piece
      width: parseInt(data.WIDTH, 10),
      height: parseInt(data.HEIGHT, 10),
      quantity: data.QUANTITY ? parseInt(data.QUANTITY, 10) : 1,
      canRotate: data.CAN_ROTATE === "true",
      color: getRandomColor() // Let the platform handle colors
    };
    
    projectData.pieces.push(piece);
  }
};

/**
 * Process a line of placed piece data
 */
const processPlacedPieceDataLine = (dataStr: string, projectData: ProjectData) => {
  const data = parseDataString(dataStr);
  
  if (data.WIDTH && data.HEIGHT && data.X && data.Y) {
    const placedPiece: PlacedPiece = {
      id: uuidv4(), // Generate an ID for the placed piece
      width: parseInt(data.WIDTH, 10),
      height: parseInt(data.HEIGHT, 10),
      quantity: 1,
      canRotate: true,
      x: parseInt(data.X, 10),
      y: parseInt(data.Y, 10),
      rotated: data.ROTATED === "true",
      sheetIndex: data.SHEET_INDEX ? parseInt(data.SHEET_INDEX, 10) : 0,
      color: getRandomColor() // Let the platform handle colors
    };
    
    projectData.placedPieces.push(placedPiece);
  }
};

/**
 * Helper function to parse key-value pairs from a data string
 */
const parseDataString = (dataStr: string) => {
  const result: Record<string, string> = {};
  const pairs = dataStr.split(';');
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value !== undefined) {
      result[key] = value;
    }
  }
  
  return result;
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
