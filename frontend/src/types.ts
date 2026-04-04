export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  /** Key/value specs; API may send JSON object or string */
  specs: Record<string, string> | Record<string, unknown>;
  isLimited?: boolean;
  subCategory?: string;
  /** Inventory from API (`stock` column) */
  stock?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  preferences?: {
    theme: 'stark' | 'void';
    currency: string;
    units: 'MET' | 'IMP';
  };
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'Order Received' | 'Processing' | 'Shipped' | 'Delivered';
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    zip: string;
  };
}
