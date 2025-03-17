
export interface Material {
  id: string;
  user_id: string;
  description: string;
  thickness: number;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
}

export interface MaterialFormValues {
  description: string;
  thickness: number;
  width: number;
  height: number;
}
