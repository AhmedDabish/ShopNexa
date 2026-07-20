export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImage?: string;
  createdAt: Date;
  lastLogin?: Date;
  isEmailConfirmed: boolean;
  isActive: boolean;
  walletBalance: number;
  roleId?: number;
  role?: Role;
}

export interface Role {
  id: number;
  name: 'Customer' | 'Seller' | 'Admin';
  description: string;
}

export interface Address {
  id: number;
  userId: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface SellerProfile {
  id: number;
  userId: number;
  storeName: string;
  storeDescription?: string;
  logoUrl?: string;
  totalEarnings: number;
  pendingPayouts: number;
  isApproved: boolean;
  createdAt: Date;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: 'Customer' | 'Seller';
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}
