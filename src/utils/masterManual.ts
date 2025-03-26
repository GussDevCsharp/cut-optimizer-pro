
import jsPDF from 'jspdf';
import { 
  FileText, 
  Shield, 
  Users, 
  CreditCard, 
  Settings, 
  Lock 
} from 'lucide-react';

/**
 * Generates and downloads a PDF manual for the Master Panel
 */
export const generateMasterManual = async (): Promise<void> => {
  // Create a new PDF document
  const pdf = new jsPDF();
  
  // Title page
  pdf.setFontSize(24);
  pdf.text('Manual do Painel Master', 105, 40, { align: 'center' });
  pdf.setFontSize(16);
  pdf.text('SoftCom Fortaleza', 105, 60, { align: 'center' });
  
  // Add company logo placeholder
  pdf.setFillColor(60, 60, 60);
  pdf.roundedRect(85, 80, 40, 40, 5, 5, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.text('SC', 105, 105, { align: 'center' });
  pdf.setTextColor(0, 0, 0);
  
  // Add footer
  pdf.setFontSize(10);
  pdf.text(`© ${new Date().getFullYear()} SoftCom Fortaleza`, 105, 280, { align: 'center' });
  
  // Table of contents
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('Índice', 20, 20);
  
  const sections = [
    { title: '1. Acesso ao Sistema', page: 3 },
    { title: '2. Gestão de Usuários', page: 5 },
    { title: '3. Controle Financeiro', page: 8 },
    { title: '4. Configurações Globais', page: 10 },
    { title: '5. Processo de Bloqueio/Renovação', page: 12 },
    { title: '6. Segurança e Acesso', page: 14 },
    { title: '7. Suporte', page: 16 },
  ];
  
  let y = 30;
  sections.forEach(section => {
    pdf.setFontSize(12);
    pdf.text(`${section.title}`, 25, y);
    pdf.text(`${section.page}`, 180, y);
    y += 10;
  });
  
  // Section 1: System Access
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('1. Acesso ao Sistema', 20, 20);
  
  pdf.setFontSize(14);
  pdf.text('1.1. Credenciais Iniciais', 20, 35);
  
  pdf.setFontSize(12);
  pdf.text('URL do Painel: https://admin.softcomfortaleza.com.br', 25, 45);
  pdf.text('Login: gustavo@softcomfortaleza.com.br', 25, 55);
  pdf.text('Senha inicial: S0ftC0m@2024! (alterar no primeiro acesso)', 25, 65);
  
  pdf.setFontSize(14);
  pdf.text('1.2. Primeiro Acesso', 20, 80);
  
  pdf.setFontSize(12);
  const firstAccessSteps = [
    '1. Acesse a URL do painel usando um navegador moderno',
    '2. Insira as credenciais fornecidas',
    '3. Você será solicitado a alterar sua senha',
    '4. Crie uma nova senha seguindo os critérios de segurança',
    '5. Recomendamos ativar a autenticação de dois fatores (2FA)'
  ];
  
  let stepY = 90;
  firstAccessSteps.forEach(step => {
    pdf.text(step, 25, stepY);
    stepY += 10;
  });
  
  // Section 2: User Management
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('2. Gestão de Usuários', 20, 20);
  
  pdf.setFontSize(14);
  pdf.text('2.1. Visualização de Clientes', 20, 35);
  
  pdf.setFontSize(12);
  pdf.text('Como usuário Master, você tem acesso completo a todos os clientes cadastrados no sistema.', 25, 45);
  pdf.text('Para acessar a lista de clientes:', 25, 55);
  
  const viewUsersSteps = [
    '1. No menu lateral, clique em "Usuários"',
    '2. Você verá a lista completa de todos os clientes',
    '3. Use a barra de pesquisa para encontrar clientes específicos',
    '4. Clique no nome de um cliente para ver detalhes completos'
  ];
  
  stepY = 65;
  viewUsersSteps.forEach(step => {
    pdf.text(step, 25, stepY);
    stepY += 10;
  });
  
  pdf.setFontSize(14);
  pdf.text('2.2. Filtros Avançados', 20, 105);
  
  pdf.setFontSize(12);
  pdf.text('Você pode filtrar a lista de clientes por:', 25, 115);
  
  const filters = [
    '• Status (ativo/bloqueado)',
    '• Tipo de plano',
    '• Data de expiração',
    '• Data de cadastro',
    '• Método de pagamento'
  ];
  
  stepY = 125;
  filters.forEach(filter => {
    pdf.text(filter, 25, stepY);
    stepY += 10;
  });
  
  // Add Financials section
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('3. Controle Financeiro', 20, 20);
  
  pdf.setFontSize(14);
  pdf.text('3.1. Relatórios de Pagamentos', 20, 35);
  
  pdf.setFontSize(12);
  pdf.text('Acesse relatórios detalhados de todos os pagamentos realizados no sistema:', 25, 45);
  
  const financialReportsSteps = [
    '1. No menu lateral, clique em "Financeiro"',
    '2. Selecione "Relatórios" no submenu',
    '3. Escolha o período desejado (dia, semana, mês, ano ou personalizado)',
    '4. Visualize gráficos e tabelas com dados financeiros',
    '5. Exporte relatórios em PDF, Excel ou CSV usando os botões na parte superior'
  ];
  
  stepY = 55;
  financialReportsSteps.forEach(step => {
    pdf.text(step, 25, stepY);
    stepY += 10;
  });
  
  pdf.setFontSize(14);
  pdf.text('3.2. Histórico de Transações', 20, 100);
  
  pdf.setFontSize(12);
  pdf.text('Para visualizar o histórico completo de transações por cliente:', 25, 110);
  
  const transactionHistorySteps = [
    '1. Acesse a página do cliente (Menu > Usuários > [Nome do Cliente])',
    '2. Clique na aba "Financeiro"',
    '3. Visualize todas as transações ordenadas por data',
    '4. Use filtros para encontrar transações específicas',
    '5. Clique em uma transação para ver detalhes completos'
  ];
  
  stepY = 120;
  transactionHistorySteps.forEach(step => {
    pdf.text(step, 25, stepY);
    stepY += 10;
  });
  
  // Add more sections for Global Settings, Blocking/Renewal Process, Security, etc.
  // ...
  
  // Process of Blocking/Renewal
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('5. Processo de Bloqueio/Renovação', 20, 20);
  
  pdf.setFontSize(14);
  pdf.text('5.1. Fluxo Automatizado', 20, 35);
  
  pdf.setFontSize(12);
  pdf.text('O sistema possui um fluxo automatizado para renovação de assinaturas:', 25, 45);
  
  const automatedFlowSteps = [
    '1. Sistema envia alerta diário (clientes perto de expirar)',
    '2. Aprovação de renovações manuais (se necessário)',
    '3. Sistema processa cobrança recorrente via MercadoPago',
    '4. Após confirmação do pagamento, o acesso é liberado',
    '5. Cliente recebe e-mail de confirmação automático'
  ];
  
  stepY = 55;
  automatedFlowSteps.forEach(step => {
    pdf.text(step, 25, stepY);
    stepY += 10;
  });
  
  pdf.setFontSize(14);
  pdf.text('5.2. Bloqueio Manual', 20, 100);
  
  pdf.setFontSize(12);
  pdf.text('Para bloquear o acesso de um cliente manualmente:', 25, 110);
  
  const manualBlockSteps = [
    '1. Acesse: Painel > Usuários > [Selecionar Cliente]',
    '2. Clique no botão "Bloquear Acesso"',
    '3. Confirme a ação na janela de diálogo',
    '4. O cliente receberá notificação por e-mail (opcional)',
    '5. O status do cliente mudará para "Bloqueado" imediatamente'
  ];
  
  stepY = 120;
  manualBlockSteps.forEach(step => {
    pdf.text(step, 25, stepY);
    stepY += 10;
  });
  
  // Security section
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('6. Segurança e Acesso', 20, 20);
  
  pdf.setFontSize(14);
  pdf.text('6.1. Controle de Acesso', 20, 35);
  
  pdf.setFontSize(12);
  pdf.text('Como usuário Master, você é o único com permissão para:', 25, 45);
  
  const accessControlPoints = [
    '• Alterar configurações globais do sistema',
    '• Resetar senhas de outros administradores',
    '• Criar novos usuários com nível administrativo',
    '• Modificar políticas de segurança',
    '• Acessar logs completos do sistema'
  ];
  
  stepY = 55;
  accessControlPoints.forEach(point => {
    pdf.text(point, 25, stepY);
    stepY += 10;
  });
  
  pdf.setFontSize(14);
  pdf.text('6.2. Recomendações de Segurança', 20, 100);
  
  pdf.setFontSize(12);
  const securityRecommendations = [
    '• Habilitar autenticação de dois fatores (2FA)',
    '• Alterar senha a cada 90 dias',
    '• Usar senhas fortes (mínimo 12 caracteres com letras, números e símbolos)',
    '• Não compartilhar credenciais',
    '• Verificar regularmente os logs de acesso',
    '• Desconectar-se ao finalizar o uso do sistema'
  ];
  
  stepY = 110;
  securityRecommendations.forEach(rec => {
    pdf.text(rec, 25, stepY);
    stepY += 10;
  });
  
  // Support section
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('7. Suporte', 20, 20);
  
  pdf.setFontSize(12);
  pdf.text('Para assistência imediata:', 25, 35);
  
  const supportInfo = [
    '• E-mail: suporte@softcomfortaleza.com.br',
    '• Telefone: (85) 98765-4321',
    '• Horário de atendimento: Segunda a Sexta, 8h às 18h'
  ];
  
  stepY = 45;
  supportInfo.forEach(info => {
    pdf.text(info, 25, stepY);
    stepY += 10;
  });
  
  pdf.setFontSize(14);
  pdf.text('Próximas Ações Recomendadas:', 20, 80);
  
  pdf.setFontSize(12);
  const nextActionSteps = [
    '1. Configurar autenticação de dois fatores (2FA)',
    '2. Definir política de renovação automática',
    '3. Personalizar templates de e-mail',
    '4. Revisar políticas de segurança',
    '5. Explorar relatórios financeiros'
  ];
  
  stepY = 90;
  nextActionSteps.forEach(action => {
    pdf.text(action, 25, stepY);
    stepY += 10;
  });
  
  // Code example
  pdf.setFillColor(240, 240, 240);
  pdf.roundedRect(25, 150, 160, 40, 3, 3, 'F');
  
  pdf.setFontSize(10);
  pdf.text('// Exemplo de código exclusivo para o master', 30, 160);
  pdf.text('if (user.email === "gustavo@softcomfortaleza.com.br") {', 30, 170);
  pdf.text('  grantFullAccess();', 30, 180);
  pdf.text('}', 30, 190);
  
  // Save the PDF
  pdf.save('manual_painel_master_softcom.pdf');
};
