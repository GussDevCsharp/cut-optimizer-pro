export const getRandomColor = () => {
  // Palette with predominantly light colors like in the reference image
  // plus the existing lilac, gray, and pale colors
  const colors = [
    // Light blue/teal colors (similar to the reference image)
    '#D1E8E8', '#C4E0E0', '#B0D8D8', '#9CCECE', '#D0E6F2',
    
    // Keep some of the original lilac and gray palette
    '#D6BCFA', '#C4B5FD', '#A78BFA', '#9B87F5', 
    
    // Light grays
    '#F1F5F9', '#E2E8F0', '#E5E7EB', '#F8FAFC',
    
    // Yellows (for highlighting certain pieces, like in reference)
    '#FEF9C3', '#FEF08A', '#FDE047', '#FACC15'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
