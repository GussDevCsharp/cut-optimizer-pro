
/// <reference types="vite/client" />

// Extensão para permitir importação de módulos Web Worker no Vite
declare module "*.ts" {
  const src: string;
  export default src;
}

// Provê tipagem para a propriedade URL no objeto import.meta
interface ImportMeta {
  url: string;
  // Adicione outras propriedades conforme necessário
}
