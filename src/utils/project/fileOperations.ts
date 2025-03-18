
/**
 * Reads the contents of a text file
 */
export const readProjectFile = async (file: File): Promise<string> => {
  try {
    return await file.text();
  } catch (err) {
    throw new Error(`Erro ao ler arquivo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
  }
};
