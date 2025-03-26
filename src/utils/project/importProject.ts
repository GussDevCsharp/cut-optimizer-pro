
import { v4 as uuidv4 } from 'uuid';
import { Piece, Sheet, PlacedPiece } from '../../hooks/useSheetData';
import { ProjectData, LINE_PREFIXES } from './types';
import { getRandomColor } from '../colorUtils';

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
      color: getRandomColor(), // Let the platform handle colors
      name: data.length >= 5 && data[4] ? data[4] : `Peça ${projectData.pieces.length + 1}`
    };
    
    if (piece.width > 0 && piece.height > 0) {
      projectData.pieces.push(piece);
    }
  }
};
