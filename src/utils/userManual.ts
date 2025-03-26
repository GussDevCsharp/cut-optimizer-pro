
import jsPDF from 'jspdf';

/**
 * Creates and downloads a PDF user manual for the platform
 */
export const generateUserManual = async (): Promise<void> => {
  const pdf = new jsPDF();
  
  // Title page
  pdf.setFontSize(24);
  pdf.text('Manual do Usuário', 105, 40, { align: 'center' });
  pdf.setFontSize(16);
  pdf.text('Melhor Corte - Otimizador de corte profissional', 105, 60, { align: 'center' });
  
  // Add company logo placeholder
  pdf.setFillColor(60, 60, 60);
  pdf.roundedRect(85, 80, 40, 40, 5, 5, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.text('MC', 105, 105, { align: 'center' });
  pdf.setTextColor(0, 0, 0);
  
  // Add footer to first page
  pdf.setFontSize(10);
  pdf.text(`© ${new Date().getFullYear()} Melhor Corte`, 105, 280, { align: 'center' });
  
  // Add version information
  pdf.setFontSize(8);
  pdf.text(`Versão: 1.0.0 | Data: ${new Date().toLocaleDateString('pt-BR')}`, 105, 287, { align: 'center' });
  
  // Table of contents
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('Índice', 20, 20);
  
  const sections = [
    { title: '1. Introdução', page: 3 },
    { title: '2. Tela Principal (Dashboard)', page: 4 },
    { title: '3. Gerenciamento de Projetos', page: 6 },
    { title: '4. Gerenciamento de Materiais', page: 8 },
    { title: '5. Editor de Projetos', page: 10 },
    { title: '6. Configuração de Chapas', page: 12 },
    { title: '7. Adição e Edição de Peças', page: 14 },
    { title: '8. Otimização de Corte', page: 16 },
    { title: '9. Visualização e Impressão', page: 18 },
    { title: '10. Exportação e Importação', page: 20 },
  ];
  
  let y = 30;
  sections.forEach(section => {
    pdf.setFontSize(12);
    pdf.text(`${section.title}`, 25, y);
    pdf.text(`${section.page}`, 180, y);
    y += 10;
  });
  
  // Add pages for each section
  sections.forEach(section => {
    pdf.addPage();
    pdf.setFontSize(18);
    pdf.text(section.title, 20, 20);
    
    // Content section
    pdf.setFontSize(10);
    let contentY = 40;
    
    // Introduction section (example)
    if (section.title.includes('Introdução')) {
      pdf.setFontSize(12);
      pdf.text('Bem-vindo ao Melhor Corte', 20, contentY);
      contentY += 10;
      
      const introText = [
        'O Melhor Corte é uma ferramenta profissional para otimização de corte de chapas e',
        'materiais diversos. Esta aplicação foi desenvolvida para maximizar o aproveitamento',
        'de material e reduzir o desperdício em processos de corte industrial e moveleiro.',
        '',
        'Com esta plataforma, você pode:',
        '• Criar e gerenciar múltiplos projetos de corte',
        '• Cadastrar diferentes materiais e suas dimensões',
        '• Adicionar peças com medidas personalizadas',
        '• Executar algoritmos de otimização para melhor aproveitamento',
        '• Visualizar o posicionamento das peças nas chapas',
        '• Imprimir ou exportar planos de corte detalhados',
        '• Acessar seus projetos em qualquer dispositivo',
        '',
        'Este manual contém instruções detalhadas sobre todas as funcionalidades da plataforma,',
        'com imagens ilustrativas de cada tela e explicações passo a passo.',
      ];
      
      introText.forEach(line => {
        pdf.setFontSize(10);
        pdf.text(line, 20, contentY);
        contentY += 6;
      });
    }
    
    // Dashboard section (example)
    else if (section.title.includes('Dashboard')) {
      pdf.setFontSize(12);
      pdf.text('Tela Principal (Dashboard)', 20, contentY);
      contentY += 10;
      
      const dashboardText = [
        'A tela principal oferece acesso rápido aos seus projetos e materiais cadastrados.',
        'Aqui você pode visualizar, criar, editar e gerenciar todos os seus recursos.',
        '',
        'Principais elementos da tela:',
        '• Abas de navegação entre Projetos e Materiais',
        '• Cartões de projetos recentes com imagens de prévia',
        '• Botão para criação de novos projetos',
        '• Lista de materiais cadastrados',
        '• Menu de usuário com acesso às configurações',
        '',
        'Para criar um novo projeto, basta clicar no cartão com o símbolo "+" e seguir as instruções.',
        'Para acessar um projeto existente, clique diretamente sobre o cartão do projeto desejado.',
      ];
      
      dashboardText.forEach(line => {
        pdf.setFontSize(10);
        pdf.text(line, 20, contentY);
        contentY += 6;
      });
      
      // Here we would add a screenshot image of the dashboard
      contentY += 10;
      pdf.text('Imagem da tela principal (Dashboard):', 20, contentY);
      contentY += 10;
      
      // placeholder for screenshot
      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(240, 240, 240);
      pdf.roundedRect(20, contentY, 170, 100, 3, 3, 'FD');
      pdf.setFontSize(12);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Imagem da tela principal', 105, contentY + 50, { align: 'center' });
      pdf.setTextColor(0, 0, 0);
    }
    
    // Continue with other sections...
    // In a real implementation, each section would have specific content and screenshots
  });
  
  // Save the PDF with a specific name
  pdf.save('manual_melhor_corte.pdf');
};
