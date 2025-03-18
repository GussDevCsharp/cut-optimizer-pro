
import React from "react";
import { Button } from "@/components/ui/button";
import { FileTerminal, Download } from "lucide-react";
import { downloadExampleProjectFile } from "../../../utils/projectExportUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const FileFormatDocumentation: React.FC = () => {
  return (
    <div className="space-y-4">
      <Alert>
        <FileTerminal className="h-4 w-4" />
        <AlertTitle>Documentação de Formato</AlertTitle>
        <AlertDescription>
          Especificação do formato de arquivo para sistemas externos
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2 text-sm">
        <h3 className="font-semibold">Formato de Arquivo de Projeto</h3>
        <p className="text-muted-foreground">
          O formato de arquivo permite que aplicativos externos exportem e importem projetos completos, 
          incluindo configurações de chapas e peças. Cada linha representa um bloco de informação.
        </p>
        
        <h4 className="font-medium mt-4">Estrutura do Arquivo</h4>
        <div className="bg-secondary p-2 rounded-md">
          <pre className="text-xs overflow-x-auto">
{`PROJECT_INFO:NAME=Nome do Projeto;VERSION=1.0;TIMESTAMP=2023-06-25T12:30:45.000Z
SHEET_DATA:WIDTH=1220;HEIGHT=2440;CUT_WIDTH=4;MATERIAL_ID=opcional-id-material
PIECE:WIDTH=500;HEIGHT=300;QUANTITY=2;CAN_ROTATE=true
PIECE:WIDTH=400;HEIGHT=200;QUANTITY=3;CAN_ROTATE=false
PLACED:WIDTH=500;HEIGHT=300;X=10;Y=10;ROTATED=false;SHEET_INDEX=0`}
          </pre>
        </div>
        
        <h4 className="font-medium mt-4">Tipos de Linha</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>PROJECT_INFO</strong>: Informações gerais do projeto
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>NAME - Nome do projeto</li>
              <li>VERSION - Versão do formato (atual: 1.0)</li>
              <li>TIMESTAMP - Data e hora da exportação</li>
            </ul>
          </li>
          <li>
            <strong>SHEET_DATA</strong>: Configuração da chapa
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>WIDTH - Largura da chapa em mm</li>
              <li>HEIGHT - Altura da chapa em mm</li>
              <li>CUT_WIDTH - Largura do corte em mm</li>
              <li>MATERIAL_ID - Identificador do material (opcional)</li>
            </ul>
          </li>
          <li>
            <strong>PIECE</strong>: Definição de uma peça 
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>WIDTH - Largura da peça em mm</li>
              <li>HEIGHT - Altura da peça em mm</li>
              <li>QUANTITY - Quantidade de peças</li>
              <li>CAN_ROTATE - Indica se a peça pode ser rotacionada (true/false)</li>
            </ul>
          </li>
          <li>
            <strong>PLACED</strong>: Peça posicionada na chapa
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>WIDTH - Largura da peça em mm</li>
              <li>HEIGHT - Altura da peça em mm</li>
              <li>X - Posição X na chapa (coordenada do canto superior esquerdo)</li>
              <li>Y - Posição Y na chapa (coordenada do canto superior esquerdo)</li>
              <li>ROTATED - Indica se a peça está rotacionada (true/false)</li>
              <li>SHEET_INDEX - Índice da chapa onde a peça está posicionada (0, 1, 2, ...)</li>
            </ul>
          </li>
        </ul>
        
        <h4 className="font-medium mt-4">Notas de Implementação</h4>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>O arquivo deve ser salvo em formato texto (.txt) com codificação UTF-8.</li>
          <li>Cada linha deve conter apenas um tipo de informação.</li>
          <li>Os campos são case-sensitive.</li>
          <li>As linhas em branco são ignoradas.</li>
          <li>As cores das peças são definidas pela plataforma.</li>
          <li>IDs são gerados automaticamente pela plataforma.</li>
          <li>As coordenadas X e Y são relativas ao canto superior esquerdo da chapa.</li>
        </ul>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={downloadExampleProjectFile}
      >
        <Download size={16} />
        Baixar Exemplo
      </Button>
    </div>
  );
};
