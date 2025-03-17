
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { materialService } from '../index';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => mockSupabaseQueryBuilder),
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

describe('Material Service Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get materials through the service interface', async () => {
    // Setup mock return value
    mockSupabaseQueryBuilder.then.mockImplementationOnce((cb) => 
      Promise.resolve(cb({ data: [{ id: '1', description: 'Test Material' }], error: null }))
    );

    // Call the service method
    const result = await materialService.getMaterials('user-123');
    
    // Verify the result
    expect(result.data).toEqual([{ id: '1', description: 'Test Material' }]);
    expect(result.error).toBeNull();
    
    // Verify correct Supabase calls were made
    expect(supabase.from).toHaveBeenCalledWith('materials');
    expect(mockSupabaseQueryBuilder.select).toHaveBeenCalledWith('*');
    expect(mockSupabaseQueryBuilder.eq).toHaveBeenCalledWith('user_id', 'user-123');
  });

  it('should create material through the service interface', async () => {
    const newMaterial = {
      description: 'New Material',
      thickness: 18,
      width: 1000,
      height: 800,
      user_id: 'user-123'
    };
    
    // Setup mock return value
    mockSupabaseQueryBuilder.then.mockImplementationOnce((cb) => 
      Promise.resolve(cb({ data: { id: '1', ...newMaterial }, error: null }))
    );

    // Call the service method
    const result = await materialService.createMaterial(newMaterial);
    
    // Verify the result
    expect(result.data).toEqual({ id: '1', ...newMaterial });
    expect(result.error).toBeNull();
    
    // Verify correct Supabase calls were made
    expect(supabase.from).toHaveBeenCalledWith('materials');
    expect(mockSupabaseQueryBuilder.insert).toHaveBeenCalled();
  });

  it('should create materials table through the service interface', async () => {
    // Call the service method
    const result = await materialService.createMaterialsTable();
    
    // Verify correct Supabase calls were made
    expect(supabase.rpc).toHaveBeenCalledWith('execute_sql', expect.any(Object));
    expect(result.error).toBeNull();
  });
});
