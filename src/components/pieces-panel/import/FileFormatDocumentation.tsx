
import React from "react";
import { Button } from "@/components/ui/button";
import { FileTerminal, Download } from "lucide-react";
import { downloadExampleProjectFile } from "../../../utils/project";
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
{`P;Nome do Projeto;1.0;2023-06-25T12:30:45.000Z
S;1220;2440;4;opcional-id-material
R;500;300;2;true
R;400;200;3;false
C;500;300;10;10;false;0`}
          </pre>
        </div>
        
        <h4 className="font-medium mt-4">Tipos de Linha</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>P</strong>: Informações do projeto
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>Nome do projeto</li>
              <li>Versão do formato (atual: 1.0)</li>
              <li>Data e hora da exportação</li>
            </ul>
          </li>
          <li>
            <strong>S</strong>: Configuração da chapa
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>Largura da chapa em mm</li>
              <li>Altura da chapa em mm</li>
              <li>Largura do corte em mm</li>
              <li>Identificador do material (opcional)</li>
            </ul>
          </li>
          <li>
            <strong>R</strong>: Definição de uma peça 
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>Largura da peça em mm</li>
              <li>Altura da peça em mm</li>
              <li>Quantidade de peças</li>
              <li>Indica se a peça pode ser rotacionada (true/false)</li>
            </ul>
          </li>
          <li>
            <strong>C</strong>: Peça posicionada na chapa
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>Largura da peça em mm</li>
              <li>Altura da peça em mm</li>
              <li>Posição X na chapa (coordenada do canto superior esquerdo)</li>
              <li>Posição Y na chapa (coordenada do canto superior esquerdo)</li>
              <li>Indica se a peça está rotacionada (true/false)</li>
              <li>Índice da chapa onde a peça está posicionada (0, 1, 2, ...)</li>
            </ul>
          </li>
        </ul>
        
        <h4 className="font-medium mt-4">Notas de Implementação</h4>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>O arquivo deve ser salvo em formato texto (.txt) com codificação UTF-8.</li>
          <li>Cada linha começa com um identificador de tipo (P, S, R, C).</li>
          <li>Os valores são separados por ponto-e-vírgula (;).</li>
          <li>A ordem dos valores é fixa para cada tipo de linha.</li>
          <li>As linhas em branco são ignoradas.</li>
          <li>As cores das peças são definidas pela plataforma.</li>
          <li>IDs são gerados automaticamente pela plataforma.</li>
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
