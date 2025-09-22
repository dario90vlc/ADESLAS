
export enum ProductCategory {
  Dental = "Productos Dentales",
  Ambulatory = "Productos Ambulatorios",
  Hospital = "Productos Hospitalarios",
  MyBox = "MyBox Salud",
  Business = "Productos de Empresa",
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  strongPoint?: string;
  features: string[];
  advantages: string[];
  limitations: string[];
  defenseArguments: string[];
  idealClient?: string[];
}
