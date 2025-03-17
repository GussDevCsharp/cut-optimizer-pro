
import { getMaterials, getMaterial, createMaterial, updateMaterial, deleteMaterial, createMaterialsTable } from './materialApi';
import type { MaterialService } from './types';

// Export the material service interface implementation
export const materialService: MaterialService = {
  getMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  createMaterialsTable
};

// Export individual functions for direct imports if needed
export {
  getMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  createMaterialsTable
};
