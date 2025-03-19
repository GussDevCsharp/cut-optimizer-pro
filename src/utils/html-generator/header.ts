
export const generateHeader = (projectName: string): string => {
  return `
    <div class="print-header">
      <h1>Plano de Corte${projectName ? ': ' + projectName : ''}</h1>
      <div class="print-date">Data: ${new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</div>
    </div>
  `;
};

export const generateProjectInfo = (sheet: { width: number; height: number; cutWidth: number }, placedPieces: any[], sheetCount: number): string => {
  return `
    <div class="print-info">
      <div class="print-info-item">
        <span class="print-info-label">Dimensões da chapa:</span>
        <span class="print-info-value">${sheet.width}×${sheet.height}mm</span>
      </div>
      <div class="print-info-item">
        <span class="print-info-label">Total de peças:</span>
        <span class="print-info-value">${placedPieces.length}</span>
      </div>
      <div class="print-info-item">
        <span class="print-info-label">Número de chapas:</span>
        <span class="print-info-value">${sheetCount}</span>
      </div>
      <div class="print-info-item">
        <span class="print-info-label">Largura de corte:</span>
        <span class="print-info-value">${sheet.cutWidth}mm</span>
      </div>
    </div>
  `;
};

export const generateFooter = (): string => {
  return `
    <div class="footer">
      Plano de corte gerado em ${new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'})} às ${new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
    </div>
  `;
};
