
export const getFooterHtml = (): string => {
  return `
    <div class="footer">
      Plano de corte gerado em ${new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'})} às ${new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
    </div>
  `;
};
