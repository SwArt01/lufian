export interface ProductColor {
    name: string;
    hex: string;
    images?: string[];
}

export interface Product {
    id: string;
    name: string;
    category: 'hoodie' | 'crewneck' | 'sweatshirt';
    description: string;
    price: number;
    originalPrice?: number;
    sku: string;
    sizes: string[];
    colors?: ProductColor[];
    stock: number;
    images: string[];
    tags: ('NEW' | 'HOT' | 'LIMITED' | 'SALE')[];
    createdAt: string;
}

export interface AdminOrder {
    id: string;
    customer: string;
    date: string;
    total: string;
    status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled' | 'Pending';
    items: number;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    orders: number;
    totalSpent: string;
    lastActive: string;
}

export interface CartItem extends Product {
    cartId: string;
    selectedSize: string;
    quantity: number;
}

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'completed';
    createdAt: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface UserOrder {
    id: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    deliveryAddress?: Address;
    trackingNumber?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: Address;
    orders: UserOrder[];
    wishlist: string[]; // Product IDs
    createdAt: string;
}
