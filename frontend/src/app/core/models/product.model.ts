export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  sku: string;
  categoryId: number;
  sellerId?: number;
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
  viewCount: number;
  averageRating: number;
  category?: Category;
  images?: ProductImage[];
  reviews?: Review[];
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  parentCategoryId?: number;
  isActive: boolean;
  subCategories?: Category[];
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: Date;
  isVerifiedPurchase: boolean;
  user?: { fullName: string; profileImage?: string };
}

export interface ProductFilter {
  page?: number;
  limit?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  q?: string;
  rating?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  sku: string;
  categoryId: number;
  isActive: boolean;
}

export interface CreateReviewDto {
  productId: number;
  rating: number;
  comment?: string;
}
