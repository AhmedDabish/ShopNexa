export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'CreditCard' | 'PayPal' | 'COD' | 'Wallet';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  subTotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddressId: number;
  orderDate: Date;
  shippedDate?: Date;
  deliveredDate?: Date;
  trackingNumber?: string;
  notes?: string;
  promoCodeId?: number;
  orderItems?: OrderItem[];
  shippingAddress?: any;
  payment?: Payment;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: { name: string; images?: any[] };
}

export interface Payment {
  id: number;
  orderId: number;
  paymentMethod: string;
  amount: number;
  status: string;
  transactionId?: string;
  paymentDate?: Date;
  failureReason?: string;
}

export interface CreateOrderDto {
  shippingAddressId: number;
  paymentMethod: PaymentMethod;
  promoCodeId?: number;
  notes?: string;
}

export interface Banner {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  displayOrder: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

export interface PromoCode {
  id: number;
  code: string;
  description: string;
  discountType: 'Percentage' | 'FixedAmount';
  discountValue: number;
  minimumOrderAmount?: number;
  maxUsageCount?: number;
  usedCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface TrackingInfo {
  orderNumber: string;
  status: OrderStatus;
  trackingNumber?: string;
  steps: TrackingStep[];
}

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  date?: Date;
  completed: boolean;
  current: boolean;
}
