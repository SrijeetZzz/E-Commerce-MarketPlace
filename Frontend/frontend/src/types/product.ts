export interface Listing {
  _id: string;
  price: number;
  sellerId: string;
  stock: number;
  sellerName: string;
}

export interface ProductListItem  {
  _id: string;
  title: string;
  brand: string;
  images: string[];

  categoryId: string;
  subCategoryId: string;

  category: string;
  subCategory: string;

  listings: Listing[];

  minPrice: number;
  maxPrice: number;
  totalListings: number;

  createdAt: string;
}

export interface ProductDetail {
  _id: string;
  title: string;
  description: string;
  brand: string;

  categoryId: string;
  subCategoryId: string;

  images: string[];
  tags: string[];

  priceRange: {
    min: number;
    max: number;
  };

  avgRating: number;
  totalReviews: number;

  createdAt: string;

  listings: Listing[];
}