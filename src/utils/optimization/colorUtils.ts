
// Helper function to generate a random pastel color
export const generatePastelColor = (): string => {
  // Use predefined pastel colors that match the reference image style
  const pastelColors = [
    // Light blue/teal colors (similar to the reference image)
    '#D1E8E8', '#C4E0E0', '#B0D8D8', '#9CCECE', '#D0E6F2',
    
    // Light yellows (for highlighting)
    '#FEF9C3', '#FEF08A', '#FDE047',
    
    // Light grays and whites
    '#F1F5F9', '#E2E8F0', '#E5E7EB', '#F8FAFC'
  ];
  
  return pastelColors[Math.floor(Math.random() * pastelColors.length)];
};
