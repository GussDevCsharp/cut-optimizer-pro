
import type { Material, MaterialFormValues } from "@/types/material";
import type { ApiResponse } from "@/types/project";

export interface MaterialService {
  getMaterials: (userId?: string) => Promise<ApiResponse<Material[]>>;
  getMaterial: (id: string) => Promise<ApiResponse<Material>>;
  createMaterial: (material: MaterialFormValues & { user_id: string }) => Promise<ApiResponse<Material>>;
  updateMaterial: (id: string, material: Partial<MaterialFormValues>) => Promise<ApiResponse<Material>>;
  deleteMaterial: (id: string) => Promise<ApiResponse<null>>;
  createMaterialsTable: () => Promise<ApiResponse<null>>;
}
