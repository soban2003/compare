export interface Item {
  id: string;
  name: string;
  prices: Record<string, number>;
}

export interface Vendor {
  id: string;
  name: string;
}