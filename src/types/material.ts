
export interface Material {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  type: string;
  price?: number;
  unit: string;
  thickness?: number;
  width?: number;
  height?: number;
  color?: string;
  stock_quantity?: number;
  supplier?: string;
  availability?: string;
  created_at?: string;
  updated_at?: string;
}

export const MATERIAL_TYPES = [
  { value: "wood", label: "Madeira" },
  { value: "mdf", label: "MDF" },
  { value: "laminate", label: "Laminado" },
  { value: "metal", label: "Metal" },
  { value: "plastic", label: "Plástico" },
  { value: "glass", label: "Vidro" },
  { value: "fabric", label: "Tecido" },
  { value: "other", label: "Outro" }
];

export const MATERIAL_UNITS = [
  { value: "m²", label: "Metro Quadrado (m²)" },
  { value: "m", label: "Metro Linear (m)" },
  { value: "unit", label: "Unidade" },
  { value: "kg", label: "Quilograma (kg)" },
  { value: "l", label: "Litro (l)" },
  { value: "piece", label: "Peça" }
];
