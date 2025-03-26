import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { useSheetData } from '@/hooks/useSheetData';
import { Piece } from '@/types/types';
import { OptimizationControls } from './OptimizationControls';
import { generateId } from '@/lib/utils';
import { Trash2, Upload, Download, Plus, Edit, Copy, Save, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { calculateTotalArea } from '@/utils/calculations';
import { useIsMobile } from '@/hooks/use-mobile';
import { CSVDownloader } from './CSVDownloader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';

interface PiecesAndOptimizationPanelProps {
  sheetId: string;
}

export const PiecesAndOptimizationPanel = ({ sheetId }: PiecesAndOptimizationPanelProps) => {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [name, setName] = useState('');
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [editingPieceId, setEditingPieceId] = useState<string | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string>('');
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [kerf, setKerf] = useState(2);
  const [grainDirection, setGrainDirection] = useState<'width' | 'height'>('width');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pieceToDuplicate, setPieceToDuplicate] = useState<Piece | null>(null);
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
	const [isSaving, setIsSaving] = useState(false);
  const { updateSheetData } = useSheetData();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedSheetData = localStorage.getItem(`sheetData-${sheetId}`);
    if (storedSheetData) {
      const parsedData = JSON.parse(storedSheetData);
      if (parsedData.pieces) {
        setPieces(parsedData.pieces);
      }
      if (parsedData.kerf) {
        setKerf(parsedData.kerf);
      }
      if (parsedData.grainDirection) {
        setGrainDirection(parsedData.grainDirection);
      }
    }
  }, [sheetId]);

  useEffect(() => {
    // Save to local storage whenever pieces, kerf, or grainDirection change
    const sheetData = { pieces, kerf, grainDirection };
    localStorage.setItem(`sheetData-${sheetId}`, JSON.stringify(sheetData));
  }, [pieces, kerf, grainDirection, sheetId]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setCsvFile(file);

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          setCsvData(e.target.result.toString());
        }
      };
      reader.readAsText(file);
      setIsImportDialogOpen(true);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.csv' });

  const handleAddPiece = () => {
    if (!name || !width || !height || quantity <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos corretamente.",
        variant: "destructive",
      });
      return;
    }

    const newPieces: Piece[] = [];
    for (let i = 0; i < quantity; i++) {
      const newPiece: Piece = {
        id: generateId(),
        name,
        width,
        height,
      };
      newPieces.push(newPiece);
    }

    setPieces(prevPieces => [...prevPieces, ...newPieces]);
    setName('');
    setWidth(undefined);
    setHeight(undefined);
    setQuantity(1);
  };

  const handleEditPiece = () => {
    if (!name || !width || !height) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos corretamente.",
        variant: "destructive",
      });
      return;
    }

    setPieces(prevPieces =>
      prevPieces.map(piece =>
        piece.id === editingPieceId ? { ...piece, name, width, height } : piece
      )
    );
    setEditingPieceId(null);
    setName('');
    setWidth(undefined);
    setHeight(undefined);
  };

  const handleStartEdit = (piece: Piece) => {
    setEditingPieceId(piece.id);
    setName(piece.name);
    setWidth(piece.width);
    setHeight(piece.height);
  };

  const handleDeletePiece = (id: string) => {
    setPieces(prevPieces => prevPieces.filter(piece => piece.id !== id));
  };

  const handleDuplicatePiece = (piece: Piece) => {
    setPieceToDuplicate(piece);
    setIsDialogOpen(true);
  };

  const confirmDuplicatePiece = () => {
    if (!pieceToDuplicate) return;

    const newPiece: Piece = {
      id: generateId(),
      name: pieceToDuplicate.name,
      width: pieceToDuplicate.width,
      height: pieceToDuplicate.height,
    };

    setPieces(prevPieces => [...prevPieces, newPiece]);
    setIsDialogOpen(false);
    setPieceToDuplicate(null);
  };

  const cancelDuplicatePiece = () => {
    setIsDialogOpen(false);
    setPieceToDuplicate(null);
  };

  const handleImportCSV = () => {
    if (!csvData) {
      toast({
        title: "Erro",
        description: "Nenhum dado CSV para importar.",
        variant: "destructive",
      });
      return;
    }

    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const nameIndex = headers.findIndex(header => header.toLowerCase() === 'name');
    const widthIndex = headers.findIndex(header => header.toLowerCase() === 'width');
    const heightIndex = headers.findIndex(header => header.toLowerCase() === 'height');
    const quantityIndex = headers.findIndex(header => header.toLowerCase() === 'quantity');

    if (nameIndex === -1 || widthIndex === -1 || heightIndex === -1) {
      toast({
        title: "Erro",
        description: "O arquivo CSV deve conter colunas 'Name', 'Width' e 'Height'.",
        variant: "destructive",
      });
      return;
    }

    const newPieces: Piece[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim());

      if (values.length === headers.length) {
        const name = values[nameIndex] || 'Peça';
        const width = parseFloat(values[widthIndex]);
        const height = parseFloat(values[heightIndex]);
        const quantity = quantityIndex !== -1 ? parseInt(values[quantityIndex], 10) : 1;

        if (!isNaN(width) && !isNaN(height) && quantity > 0) {
          for (let j = 0; j < quantity; j++) {
            const newPiece: Piece = {
              id: generateId(),
              name,
              width,
              height,
            };
            newPieces.push(newPiece);
          }
        }
      }
    }

    setPieces(prevPieces => [...prevPieces, ...newPieces]);
    setIsImportDialogOpen(false);
    setCsvFile(null);
    setCsvData('');
  };

  const handleCancelImport = () => {
    setIsImportDialogOpen(false);
    setCsvFile(null);
    setCsvData('');
  };

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  const handleKerfChange = (value: number[]) => {
    setKerf(value[0]);
  };

  const handleGrainDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGrainDirection(e.target.value as 'width' | 'height');
  };

  const startOptimization = async () => {
    setIsOptimized(false);
    setIsOptimizing(true);
    setOptimizationProgress(0); // Initialize to 0 at the start of optimization

    // Simulate optimization process
    const totalIterations = 100;
    for (let iteration = 1; iteration <= totalIterations; iteration++) {
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 50));

      // Calculate progress
      const newProgress = Math.min((iteration / totalIterations) * 100, 95);
      setOptimizationProgress(newProgress);
    }

    setIsOptimizing(false);
    setIsOptimized(true);
    setOptimizationProgress(100);
  };

	const handleSavePieces = async () => {
		setIsSaving(true);
		try {
			await updateSheetData(sheetId, { pieces, kerf, grainDirection });
			toast({
				title: "Sucesso!",
				description: "Peças salvas com sucesso.",
			});
		} catch (error) {
			console.error("Error saving pieces:", error);
			toast({
				title: "Erro",
				description: "Falha ao salvar as peças. Tente novamente.",
				variant: "destructive",
			});
		} finally {
			setIsSaving(false);
		}
	};

  const totalArea = calculateTotalArea(pieces);

  return (
    <div>
      <div className="md:flex md:gap-4">
        {/* Input Section */}
        <div className="mb-4 md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Adicionar Peça</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  type="number"
                  id="quantity"
                  value={quantity.toString()}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">Largura (mm)</Label>
                <Input
                  type="number"
                  id="width"
                  value={width !== undefined ? width.toString() : ''}
                  onChange={(e) => setWidth(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="height">Altura (mm)</Label>
                <Input
                  type="number"
                  id="height"
                  value={height !== undefined ? height.toString() : ''}
                  onChange={(e) => setHeight(parseFloat(e.target.value))}
                />
              </div>
            </div>

            {editingPieceId ? (
              <Button onClick={handleEditPiece} className="bg-blue-500 text-white hover:bg-blue-700">
                Salvar Edição
              </Button>
            ) : (
              <Button onClick={handleAddPiece} className="bg-green-500 text-white hover:bg-green-700">
                Adicionar Peça
              </Button>
            )}
          </div>
        </div>

        {/* Settings Section */}
        <div className="mb-4 md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Configurações</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="kerf">Kerf (mm): {kerf}</Label>
              <Slider
                defaultValue={[kerf]}
                max={10}
                step={0.5}
                onValueChange={handleKerfChange}
              />
            </div>
            <div>
              <Label htmlFor="grainDirection">Direção do Grão</Label>
              <select
                id="grainDirection"
                className="w-full p-2 border rounded"
                value={grainDirection}
                onChange={handleGrainDirectionChange}
              >
                <option value="width">Largura</option>
                <option value="height">Altura</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Import Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Importar Peças</h2>
        <div {...getRootProps()} className="border-2 border-dashed rounded-md p-4 cursor-pointer">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-gray-500">Solte o arquivo aqui...</p>
          ) : (
            <p className="text-gray-500">Arraste e solte um arquivo CSV aqui, ou clique para selecionar um arquivo.</p>
          )}
        </div>
        <Button variant="outline" size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Importar CSV
          <input
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files) {
                onDrop(Array.from(e.target.files));
              }
            }}
          />
        </Button>
      </div>

      {/* Optimization Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Otimização</h2>
        <OptimizationControls
          isOptimized={isOptimized}
          isOptimizing={isOptimizing}
          optimizationProgress={optimizationProgress}
          onStartOptimization={startOptimization}
        />
      </div>

      {/* Pieces Table Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Lista de Peças ({pieces.length})</h2>
          <Button variant="outline" size="sm" onClick={toggleTableVisibility}>
            {isTableVisible ? 'Esconder Tabela' : 'Mostrar Tabela'}
          </Button>
        </div>

        {isTableVisible && (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Total de área: {totalArea} mm²</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Nome</TableHead>
                  <TableHead>Largura</TableHead>
                  <TableHead>Altura</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pieces.map((piece) => (
                  <TableRow key={piece.id}>
                    <TableCell className="font-medium">{piece.name}</TableCell>
                    <TableCell>{piece.width}</TableCell>
                    <TableCell>{piece.height}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleStartEdit(piece)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDuplicatePiece(piece)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePiece(piece.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">{pieces.length} peças</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </div>

			<div className="flex justify-between items-center">
				<CSVDownloader data={pieces} filename={`pieces-${new Date().toISOString()}.csv`} />
				<Button 
					variant="outline" 
					isLoading={isSaving}
					onClick={handleSavePieces}
					disabled={isSaving}
				>
					{isSaving ? 'Salvando...' : 'Salvar Peças'}
					<Save className="h-4 w-4 ml-2" />
				</Button>
			</div>

      {/* Import CSV Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Importar CSV</DialogTitle>
            <DialogDescription>
              Deseja importar as peças do arquivo CSV?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={handleCancelImport}>Cancelar</Button>
            <Button onClick={handleImportCSV}>Importar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Duplicate Piece Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Duplicar Peça</DialogTitle>
            <DialogDescription>
              Deseja duplicar a peça selecionada?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={cancelDuplicatePiece}>
              Cancelar
            </Button>
            <Button type="submit" onClick={confirmDuplicatePiece}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
