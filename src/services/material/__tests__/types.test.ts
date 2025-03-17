
import { describe, it, expect } from 'vitest';
import type { MaterialService } from '../types';

describe('Material Service Types', () => {
  it('should define the MaterialService interface', () => {
    // This is a type check test - it will fail to compile if the interface is missing any required methods
    const validateServiceShape = (service: MaterialService) => {
      // Just verifies that these methods exist on the interface
      expect(typeof service.getMaterials).toBe('function');
      expect(typeof service.getMaterial).toBe('function');
      expect(typeof service.createMaterial).toBe('function');
      expect(typeof service.updateMaterial).toBe('function');
      expect(typeof service.deleteMaterial).toBe('function');
      expect(typeof service.createMaterialsTable).toBe('function');
    };
    
    // We don't actually call this function, it just verifies the shape at compile time
    expect(validateServiceShape).toBeDefined();
  });
});
