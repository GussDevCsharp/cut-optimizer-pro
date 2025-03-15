
export const getHeaderHtml = (projectName: string): string => {
  return `
    <div class="print-header">
      <h1>Plano de Corte${projectName ? ': ' + projectName : ''}</h1>
      <div class="print-date">Data: ${new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</div>
    </div>
  `;
};
