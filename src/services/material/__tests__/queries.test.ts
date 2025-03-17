
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { materialsTable, createTableScript } from '../queries';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({}))
  }
}));

describe('Material Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('materialsTable function should call supabase.from with "materials"', () => {
    materialsTable();
    expect(supabase.from).toHaveBeenCalledWith('materials');
  });

  it('createTableScript should contain SQL to create materials table', () => {
    expect(createTableScript).toContain('CREATE TABLE IF NOT EXISTS public.materials');
    expect(createTableScript).toContain('user_id UUID');
    expect(createTableScript).toContain('description TEXT');
    expect(createTableScript).toContain('thickness NUMERIC');
    expect(createTableScript).toContain('width NUMERIC');
    expect(createTableScript).toContain('height NUMERIC');
  });

  it('createTableScript should set up Row Level Security', () => {
    expect(createTableScript).toContain('ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY');
    expect(createTableScript).toContain('CREATE POLICY "Users can view their own materials"');
    expect(createTableScript).toContain('CREATE POLICY "Users can insert their own materials"');
    expect(createTableScript).toContain('CREATE POLICY "Users can update their own materials"');
    expect(createTableScript).toContain('CREATE POLICY "Users can delete their own materials"');
  });
});
