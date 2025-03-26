
// Helper function to generate a color in our tech palette
export const generatePastelColor = (): string => {
  // Using industrial tech colors with transparency for visualization
  const colors = [
    // Blues with transparency
    'hsla(208, 100%, 33%, 0.8)', // #005BAA with alpha
    'hsla(210, 53%, 36%, 0.8)', // #2A5C8F with alpha
    'hsla(210, 47%, 43%, 0.8)', // #3A6DA0 with alpha
    // Oranges with transparency
    'hsla(17, 100%, 60%, 0.8)', // #FF6B35 with alpha
    'hsla(17, 93%, 55%, 0.8)', // #F96323 with alpha
    'hsla(17, 100%, 70%, 0.8)', // #FF7D4F with alpha
    // Grays with transparency
    'hsla(217, 12%, 49%, 0.7)', // #6D7B8D with alpha
    'hsla(217, 12%, 59%, 0.7)', // #8D99AB with alpha
    'hsla(217, 12%, 69%, 0.7)'  // #ADB7C9 with alpha
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};
