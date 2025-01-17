export interface IProductService {
  product(id: string): Promise<IProduct>;
  products(): Promise<IProduct[]>;
}

export interface IVariant {
  color: string;
  quantity: number;
  size: string[];
}

export interface IProduct {
  available: boolean;
  name: string;
  price: string;
  variants: IVariant[];
}
