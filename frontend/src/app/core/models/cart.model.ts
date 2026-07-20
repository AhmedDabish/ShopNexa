export interface Cart {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  cartItems: CartItem[];
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  priceAtAdd: number;
  addedAt: Date;
  product?: {
    id: number;
    name: string;
    price: number;
    discountPrice?: number;
    stockQuantity: number;
    images?: { imageUrl: string; isPrimary: boolean }[];
  };
}
