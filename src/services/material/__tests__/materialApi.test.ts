
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  createMaterialsTable
} from '../materialApi';
import { supabase } from '@/integrations/supabase/client';

// Mock the materialsTable function and Supabase client
vi.mock('../queries', () => ({
  materialsTable: vi.fn(() => mockSupabaseQueryBuilder),
  createTableScript: 'CREATE TABLE test'
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: vi.fn(() => ({ error: null }))
  }
}));

// Create mock query builder with chainable methods
const mockSupabaseQueryBuilder = {
  select: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  then: vi.fn().mockImplementation((cb) => Promise.resolve(cb({ data: [], error: null })))
};

describe('Material API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMaterials', () => {
    it('should return materials for a user', async () => {
      mockSupabaseQueryBuilder.then.mockImplementationOnce((cb) => 
        Promise.resolve(cb({ data: [{ id: '1', description: 'Test' }], error: null }))
      );

      const result = await getMaterials('user-123');
      
      expect(mockSupabaseQueryBuilder.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseQueryBuilder.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockSupabaseQueryBuilder.eq).toHaveBeenCalledWith('user_id', 'user-123');
      expect(result.data).toEqual([{ id: '1', description: 'Test' }]);
      expect(result.error).toBeNull();
    });

    it('should handle errors when table does not exist', async () => {
      const tableNotExistError = { code: 'PGRST116', message: 'relation "materials" does not exist' };
      mockSupabaseQueryBuilder.then.mockImplementationOnce((cb) => 
        Promise.resolve(cb({ data: null, error: tableNotExistError }))
      );

      const result = await getMaterials('user-123');
      
      expect(result.data).toEqual([]);
      expect(result.error).toContain('tabela de materiais não existe');
    });
  });

  describe('getMaterial', () => {
    it('should return a specific material by ID', async () => {
      mockSupabaseQueryBuilder.then.mockImplementationOnce((cb) =>
        Promise.resolve(cb({ data: { id: '1', description: 'Test' }, error: null }))
      );

      const result = await getMaterial('1');
      
      expect(mockSupabaseQueryBuilder.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseQueryBuilder.eq).toHaveBeenCalledWith('id', '1');
      expect(mockSupabaseQueryBuilder.single).toHaveBeenCalled();
      expect(result.data).toEqual({ id: '1', description: 'Test' });
      expect(result.error).toBeNull();
    });
  });

  describe('createMaterial', () => {
    it('should create a new material', async () => {
      const newMaterial = { 
        description: 'New Material', 
        thickness: 18, 
        width: 1000, 
        height: 500,
        user_id: 'user-123'
      };
      
      mockSupabaseQueryBuilder.then.mockImplementationOnce((cb) =>
        Promise.resolve(cb({ data: { id: '1', ...newMaterial }, error: null }))
      );

      const result = await createMaterial(newMaterial);
      
      expect(mockSupabaseQueryBuilder.insert).toHaveBeenCalled();
      expect(mockSupabaseQueryBuilder.select).toHaveBeenCalled();
      expect(result.data).toEqual({ id: '1', ...newMaterial });
      expect(result.error).toBeNull();
    });
  });

  describe('updateMaterial', () => {
    it('should update an existing material', async () => {
      const updateData = { 
        description: 'Updated Material',
        thickness: 22
      };
      
      mockSupabaseQueryBuilder.then.mockImplementationOnce((cb) =>
        Promise.resolve(cb({ data: { id: '1', ...updateData }, error: null }))
      );

      const result = await updateMaterial('1', updateData);
      
      expect(mockSupabaseQueryBuilder.update).toHaveBeenCalled();
      expect(mockSupabaseQueryBuilder.eq).toHaveBeenCalledWith('id', '1');
      expect(result.data).toEqual({ id: '1', ...updateData });
      expect(result.error).toBeNull();
    });
  });

  describe('deleteMaterial', () => {
    it('should delete a material', async () => {
      mockSupabaseQueryBuilder.then.mockImplementationOnce((cb) =>
        Promise.resolve(cb({ error: null }))
      );

      const result = await deleteMaterial('1');
      
      expect(mockSupabaseQueryBuilder.delete).toHaveBeenCalled();
      expect(mockSupabaseQueryBuilder.eq).toHaveBeenCalledWith('id', '1');
      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
    });
  });

  describe('createMaterialsTable', () => {
    it('should execute SQL to create the materials table', async () => {
      const result = await createMaterialsTable();
      
      expect(supabase.rpc).toHaveBeenCalledWith('execute_sql', { sql: 'CREATE TABLE test' });
      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
    });
  });
});
