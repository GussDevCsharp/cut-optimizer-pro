
// Helper function to generate a color in our tech palette
export const generatePastelColor = (): string => {
  // Using industrial tech colors with some variation
  const colors = [
    // Blues with transparency
    'hsla(208, 100%, 33%, 0.7)', // #005BAA with alpha
    'hsla(210, 29%, 25%, 0.7)', // #2A5C8F with alpha
    // Oranges with transparency
    'hsla(17, 100%, 60%, 0.7)', // #FF6B35 with alpha
    'hsla(17, 95%, 55%, 0.7)', // #F96323 with alpha
    // Grays with transparency
    'hsla(217, 12%, 49%, 0.6)', // #6D7B8D with alpha
    'hsla(217, 12%, 59%, 0.6)' // Lighter gray with alpha
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};
