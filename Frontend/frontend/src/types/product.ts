export interface Listing {
  _id: string;
  price: number;
  sellerId: string;
  stock: number;
}

export interface Product {
  _id: string;
  title: string;
  brand: string;
  category: string;
  images: string[];
  listings: Listing[];
  minPrice: number;
}