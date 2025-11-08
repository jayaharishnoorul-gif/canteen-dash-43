export type UserRole = 'user' | 'manager' | 'worker';

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  createdAt: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  createdAt: number;
}

export interface CartItem {
  food: FoodItem;
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'upi';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: number;
  assignedWorker?: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export interface EBill {
  id: string;
  orderId: string;
  userId: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: number;
}
