import { v4 as uuidv4 } from 'uuid';
import { Piece, Sheet, PlacedPiece } from '../hooks/useSheetData';
import { getRandomColor } from './colorUtils';

interface ProjectData {
  projectName: string;
  sheet: Sheet;
  pieces: Piece[];
  placedPieces: PlacedPiece[];
}

// Define section markers for the file format
const SECTION_MARKERS = {
  PROJECT_INFO: "#PROJECT_INFO",
  SHEET_DATA: "#SHEET_DATA",
  PIECES_DATA: "#PIECES_DATA",
  PLACED_PIECES_DATA: "#PLACED_PIECES_DATA"
};

/**
 * Generates a text file content representing the entire project
 */
export const exportProjectToText = (projectData: ProjectData): string => {
  const { projectName, sheet, pieces, placedPieces } = projectData;
  let output = "";
  
  // Project Info Section
  output += `${SECTION_MARKERS.PROJECT_INFO}\n`;
  output += `NAME=${projectName}\n`;
  output += `VERSION=1.0\n`;
  output += `TIMESTAMP=${new Date().toISOString()}\n\n`;
  
  // Sheet Data Section
  output += `${SECTION_MARKERS.SHEET_DATA}\n`;
  output += `WIDTH=${sheet.width}\n`;
  output += `HEIGHT=${sheet.height}\n`;
  output += `CUT_WIDTH=${sheet.cutWidth}\n`;
  if (sheet.materialId) {
    output += `MATERIAL_ID=${sheet.materialId}\n`;
  }
  output += '\n';
  
  // Pieces Data Section
  output += `${SECTION_MARKERS.PIECES_DATA}\n`;
  pieces.forEach(piece => {
    output += `PIECE:ID=${piece.id};WIDTH=${piece.width};HEIGHT=${piece.height};QUANTITY=${piece.quantity};CAN_ROTATE=${piece.canRotate};COLOR=${piece.color || ''}\n`;
  });
  output += '\n';
  
  // Placed Pieces Data Section
  output += `${SECTION_MARKERS.PLACED_PIECES_DATA}\n`;
  placedPieces.forEach(piece => {
    output += `PLACED:ID=${piece.id};WIDTH=${piece.width};HEIGHT=${piece.height};X=${piece.x};Y=${piece.y};ROTATED=${piece.rotated};SHEET_INDEX=${piece.sheetIndex};COLOR=${piece.color || ''}\n`;
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
  
  // Split content by lines and process each section
  const lines = content.split(/\r?\n/);
  let currentSection = "";
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    // Check if line is a section marker
    if (trimmedLine.startsWith("#")) {
      currentSection = trimmedLine;
      continue;
    }
    
    // Process line based on current section
    switch (currentSection) {
      case SECTION_MARKERS.PROJECT_INFO:
        processProjectInfoLine(trimmedLine, projectData);
        break;
      case SECTION_MARKERS.SHEET_DATA:
        processSheetDataLine(trimmedLine, projectData);
        break;
      case SECTION_MARKERS.PIECES_DATA:
        processPieceDataLine(trimmedLine, projectData);
        break;
      case SECTION_MARKERS.PLACED_PIECES_DATA:
        processPlacedPieceDataLine(trimmedLine, projectData);
        break;
    }
  }
  
  return projectData;
};

/**
 * Process a line of project info data
 */
const processProjectInfoLine = (line: string, projectData: ProjectData) => {
  if (line.startsWith("NAME=")) {
    projectData.projectName = line.substring(5);
  }
  // Other project info fields can be processed here
};

/**
 * Process a line of sheet data
 */
const processSheetDataLine = (line: string, projectData: ProjectData) => {
  if (line.startsWith("WIDTH=")) {
    projectData.sheet.width = parseInt(line.substring(6), 10);
  } else if (line.startsWith("HEIGHT=")) {
    projectData.sheet.height = parseInt(line.substring(7), 10);
  } else if (line.startsWith("CUT_WIDTH=")) {
    projectData.sheet.cutWidth = parseInt(line.substring(10), 10);
  } else if (line.startsWith("MATERIAL_ID=")) {
    projectData.sheet.materialId = line.substring(12);
  }
};

/**
 * Process a line of piece data
 */
const processPieceDataLine = (line: string, projectData: ProjectData) => {
  if (!line.startsWith("PIECE:")) return;
  
  const pieceData = parseSectionData(line.substring(6));
  
  if (pieceData) {
    const piece: Piece = {
      id: pieceData.ID || uuidv4(),
      width: parseInt(pieceData.WIDTH, 10),
      height: parseInt(pieceData.HEIGHT, 10),
      quantity: parseInt(pieceData.QUANTITY, 10),
      canRotate: pieceData.CAN_ROTATE === "true",
      color: pieceData.COLOR || getRandomColor()
    };
    
    projectData.pieces.push(piece);
  }
};

/**
 * Process a line of placed piece data
 */
const processPlacedPieceDataLine = (line: string, projectData: ProjectData) => {
  if (!line.startsWith("PLACED:")) return;
  
  const placedData = parseSectionData(line.substring(7));
  
  if (placedData) {
    const placedPiece: PlacedPiece = {
      id: placedData.ID || uuidv4(),
      width: parseInt(placedData.WIDTH, 10),
      height: parseInt(placedData.HEIGHT, 10),
      quantity: 1,
      canRotate: true,
      x: parseInt(placedData.X, 10),
      y: parseInt(placedData.Y, 10),
      rotated: placedData.ROTATED === "true",
      sheetIndex: parseInt(placedData.SHEET_INDEX, 10),
      color: placedData.COLOR || getRandomColor()
    };
    
    projectData.placedPieces.push(placedPiece);
  }
};

/**
 * Helper function to parse key-value pairs from a section line
 */
const parseSectionData = (dataStr: string) => {
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
