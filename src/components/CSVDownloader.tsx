
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { Piece } from '@/hooks/useSheetData';

interface CSVDownloaderProps {
  data: Piece[];
  filename: string;
}

export const CSVDownloader: React.FC<CSVDownloaderProps> = ({ data, filename }) => {
  const handleDownload = () => {
    // Create CSV content
    const csvContent = [
      'Name,Width,Height', // Header row
      ...data.map(piece => `${piece.name},${piece.width},${piece.height}`)
    ].join('\n');

    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="outline" onClick={handleDownload}>
      <Download className="h-4 w-4 mr-2" />
      Exportar CSV
    </Button>
  );
};
