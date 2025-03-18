
import jsPDF from 'jspdf';

/**
 * Creates and downloads a PDF with the format documentation
 */
export const exportDocumentationToPdf = () => {
  const pdf = new jsPDF();
  
  // Title
  pdf.setFontSize(18);
  pdf.text('Documentação do Formato de Arquivo de Projeto', 20, 20);
  
  // Subtitle
  pdf.setFontSize(12);
  pdf.text('Especificação para sistemas externos', 20, 30);
  
  // Main content
  pdf.setFontSize(10);
  
  let y = 40;
  const lineHeight = 6;
  
  pdf.text('O formato de arquivo permite que aplicativos externos exportem e importem projetos completos,', 20, y); y += lineHeight;
  pdf.text('incluindo configurações de chapas e peças. Cada linha representa um bloco de informação.', 20, y); y += lineHeight * 2;
  
  // File structure
  pdf.setFontSize(12);
  pdf.text('Estrutura do Arquivo', 20, y); y += lineHeight * 1.5;
  
  pdf.setFontSize(9);
  let exampleText = [
    'P;Nome do Projeto;1.0;2023-06-25T12:30:45.000Z',
    'S;1220;2440;4;opcional-id-material',
    'R;500;300;2;true',
    'R;400;200;3;false',
    'C;500;300;10;10;false;0'
  ];
  
  // Draw a box for the example
  pdf.setDrawColor(200, 200, 200);
  pdf.setFillColor(245, 245, 245);
  const boxHeight = exampleText.length * lineHeight + 4;
  pdf.roundedRect(20, y - 2, 170, boxHeight, 3, 3, 'FD');
  
  // Add example text
  pdf.setTextColor(60, 60, 60);
  exampleText.forEach(line => {
    pdf.text(line, 25, y);
    y += lineHeight;
  });
  
  y += lineHeight;
  pdf.setTextColor(0, 0, 0);
  
  // Line types
  pdf.setFontSize(12);
  pdf.text('Tipos de Linha', 20, y); y += lineHeight * 1.5;
  pdf.setFontSize(10);
  
  // P Line
  pdf.setFont(undefined, 'bold');
  pdf.text('P: Informações do projeto', 20, y); y += lineHeight;
  pdf.setFont(undefined, 'normal');
  pdf.text('- Nome do projeto', 25, y); y += lineHeight;
  pdf.text('- Versão do formato (atual: 1.0)', 25, y); y += lineHeight;
  pdf.text('- Data e hora da exportação', 25, y); y += lineHeight * 1.5;
  
  // S Line
  pdf.setFont(undefined, 'bold');
  pdf.text('S: Configuração da chapa', 20, y); y += lineHeight;
  pdf.setFont(undefined, 'normal');
  pdf.text('- Largura da chapa em mm', 25, y); y += lineHeight;
  pdf.text('- Altura da chapa em mm', 25, y); y += lineHeight;
  pdf.text('- Largura do corte em mm', 25, y); y += lineHeight;
  pdf.text('- Identificador do material (opcional)', 25, y); y += lineHeight * 1.5;
  
  // Check if need new page
  if (y > 250) {
    pdf.addPage();
    y = 20;
  }
  
  // R Line
  pdf.setFont(undefined, 'bold');
  pdf.text('R: Definição de uma peça', 20, y); y += lineHeight;
  pdf.setFont(undefined, 'normal');
  pdf.text('- Largura da peça em mm', 25, y); y += lineHeight;
  pdf.text('- Altura da peça em mm', 25, y); y += lineHeight;
  pdf.text('- Quantidade de peças', 25, y); y += lineHeight;
  pdf.text('- Indica se a peça pode ser rotacionada (true/false)', 25, y); y += lineHeight * 1.5;
  
  // C Line
  pdf.setFont(undefined, 'bold');
  pdf.text('C: Peça posicionada na chapa', 20, y); y += lineHeight;
  pdf.setFont(undefined, 'normal');
  pdf.text('- Largura da peça em mm', 25, y); y += lineHeight;
  pdf.text('- Altura da peça em mm', 25, y); y += lineHeight;
  pdf.text('- Posição X na chapa (coordenada do canto superior esquerdo)', 25, y); y += lineHeight;
  pdf.text('- Posição Y na chapa (coordenada do canto superior esquerdo)', 25, y); y += lineHeight;
  pdf.text('- Indica se a peça está rotacionada (true/false)', 25, y); y += lineHeight;
  pdf.text('- Índice da chapa onde a peça está posicionada (0, 1, 2, ...)', 25, y); y += lineHeight * 1.5;
  
  // Check if need new page
  if (y > 250) {
    pdf.addPage();
    y = 20;
  }
  
  // Implementation Notes
  pdf.setFontSize(12);
  pdf.text('Notas de Implementação', 20, y); y += lineHeight * 1.5;
  pdf.setFontSize(10);
  
  const notes = [
    'O arquivo deve ser salvo em formato texto (.txt) com codificação UTF-8.',
    'Cada linha começa com um identificador de tipo (P, S, R, C).',
    'Os valores são separados por ponto-e-vírgula (;).',
    'A ordem dos valores é fixa para cada tipo de linha.',
    'As linhas em branco são ignoradas.',
    'As cores das peças são definidas pela plataforma.',
    'IDs são gerados automaticamente pela plataforma.'
  ];
  
  notes.forEach(note => {
    pdf.text('• ' + note, 20, y);
    y += lineHeight;
  });
  
  // Save the PDF
  pdf.save('documentacao_formato_projeto.pdf');
};
