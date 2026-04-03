export interface Product {
  id: string;
  name: string;
  category: 'Rackets' | 'Shoes' | 'Shuttles' | 'Apparel';
  price: number;
  description: string;
  imageUrl: string;
  specs: Record<string, string>;
  isLimited?: boolean;
  subCategory?: string;
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
