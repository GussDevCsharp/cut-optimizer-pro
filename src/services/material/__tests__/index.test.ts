
import { describe, it, expect, vi } from 'vitest';
import { materialService } from '../index';
import * as materialApi from '../materialApi';

// Mock the material API functions
vi.mock('../materialApi', () => ({
  getMaterials: vi.fn(),
  getMaterial: vi.fn(),
  createMaterial: vi.fn(),
  updateMaterial: vi.fn(),
  deleteMaterial: vi.fn(),
  createMaterialsTable: vi.fn()
}));

describe('Material Service Index', () => {
  it('should expose a MaterialService implementation', () => {
    // Check that materialService exports all required functions
    expect(materialService).toBeDefined();
    expect(materialService.getMaterials).toBe(materialApi.getMaterials);
    expect(materialService.getMaterial).toBe(materialApi.getMaterial);
    expect(materialService.createMaterial).toBe(materialApi.createMaterial);
    expect(materialService.updateMaterial).toBe(materialApi.updateMaterial);
    expect(materialService.deleteMaterial).toBe(materialApi.deleteMaterial);
    expect(materialService.createMaterialsTable).toBe(materialApi.createMaterialsTable);
  });

  it('should export individual functions for direct import', () => {
    // These checks confirm that the individual function exports are available
    expect(materialApi.getMaterials).toBeDefined();
    expect(materialApi.getMaterial).toBeDefined();
    expect(materialApi.createMaterial).toBeDefined();
    expect(materialApi.updateMaterial).toBeDefined();
    expect(materialApi.deleteMaterial).toBeDefined();
    expect(materialApi.createMaterialsTable).toBeDefined();
  });
});
