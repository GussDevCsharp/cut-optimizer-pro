
/**
 * Creates a temporary container for the HTML content to render for PDF generation
 */
export const createTemporaryContainer = (htmlContent: string): HTMLDivElement => {
  const container = document.createElement('div');
  container.innerHTML = htmlContent;
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  document.body.appendChild(container);
  return container;
};

/**
 * Removes the temporary container from the DOM
 */
export const removeTemporaryContainer = (container: HTMLDivElement): void => {
  if (container && container.parentNode) {
    document.body.removeChild(container);
  }
};
