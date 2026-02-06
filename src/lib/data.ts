import { supabase } from './supabase';
import { Product, Customer, AdminOrder } from './types';
import productsData from '@/data/products.json';
import { mockCustomers, mockOrders } from '@/data/adminMockData';

// Supabase-based data service with localStorage fallback for SSR
export const dataService = {
    // Products
    getProducts: async (): Promise<Product[]> => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // If no data in Supabase, use static fallback
            if (!data || data.length === 0) {
                console.log('No products in Supabase, using static data');
                return productsData as unknown as Product[];
            }

            // Map database fields to app types
            return data.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category,
                description: p.description || '',
                price: p.price,
                originalPrice: p.original_price || undefined,
                sku: p.sku,
                sizes: p.sizes || [],
                colors: p.colors || [],
                stock: p.stock || 0,
                images: p.images || [],
                tags: (p.tags || []) as ('NEW' | 'HOT' | 'LIMITED' | 'SALE')[],
                createdAt: p.created_at
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
            // Fallback to static data
            return productsData as unknown as Product[];
        }
    },

    getProduct: async (id: string): Promise<Product | undefined> => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                // Fallback to static data
                const staticProduct = productsData.find(p => p.id === id);
                return staticProduct as unknown as Product | undefined;
            }

            return {
                id: data.id,
                name: data.name,
                category: data.category,
                description: data.description || '',
                price: data.price,
                originalPrice: data.original_price || undefined,
                sku: data.sku,
                sizes: data.sizes || [],
                colors: data.colors || [],
                stock: data.stock || 0,
                images: data.images || [],
                tags: (data.tags || []) as ('NEW' | 'HOT' | 'LIMITED' | 'SALE')[],
                createdAt: data.created_at
            };
        } catch (error) {
            console.error('Error fetching product:', error);
            // Fallback to static data
            const staticProduct = productsData.find(p => p.id === id);
            return staticProduct as unknown as Product | undefined;
        }
    },

    saveProduct: async (product: Product): Promise<boolean> => {
        try {
            const dbProduct = {
                id: product.id,
                name: product.name,
                category: product.category,
                description: product.description,
                price: product.price,
                original_price: product.originalPrice || null,
                sku: product.sku,
                sizes: product.sizes,
                colors: product.colors || [],
                stock: product.stock,
                images: product.images,
                tags: product.tags,
                created_at: product.createdAt
            };

            const { error } = await supabase
                .from('products')
                .upsert(dbProduct, { onConflict: 'id' });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error saving product:', error);
            return false;
        }
    },

    deleteProduct: async (id: string): Promise<boolean> => {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            return false;
        }
    },

    // Orders
    getOrders: async (): Promise<AdminOrder[]> => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map to AdminOrder format
            return (data || []).map(o => ({
                id: o.id,
                customer: 'Customer', // Will be fetched separately if needed
                date: new Date(o.created_at).toLocaleDateString('tr-TR'),
                total: `₺${o.total.toLocaleString('tr-TR')}`,
                status: mapOrderStatus(o.status),
                items: Array.isArray(o.items) ? o.items.length : 0
            }));
        } catch (error) {
            console.error('Error fetching orders:', error);
            return mockOrders;
        }
    },

    saveOrder: async (order: AdminOrder): Promise<boolean> => {
        try {
            // For admin orders, we'll update status mainly
            const { error } = await supabase
                .from('orders')
                .update({ status: order.status.toLowerCase() })
                .eq('id', order.id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error saving order:', error);
            return false;
        }
    },

    updateOrderStatus: async (id: string, status: AdminOrder['status']): Promise<boolean> => {
        try {
            const dbStatus = status.toLowerCase() as 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
            const { error } = await supabase
                .from('orders')
                .update({ status: dbStatus })
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error updating order status:', error);
            return false;
        }
    },

    // Customers - fetch from profiles table
    getCustomers: async (): Promise<Customer[]> => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map(p => ({
                id: p.id,
                name: p.name || 'Unknown',
                email: '', // Email is in auth.users, not directly accessible
                orders: 0,
                totalSpent: '₺0',
                lastActive: new Date(p.created_at).toLocaleDateString('tr-TR')
            }));
        } catch (error) {
            console.error('Error fetching customers:', error);
            return mockCustomers;
        }
    },

    saveCustomer: async (customer: Customer): Promise<boolean> => {
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: customer.id,
                    name: customer.name
                }, { onConflict: 'id' });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error saving customer:', error);
            return false;
        }
    }
};

// Helper function to map order status
function mapOrderStatus(status: string): AdminOrder['status'] {
    const statusMap: Record<string, AdminOrder['status']> = {
        'pending': 'Pending',
        'confirmed': 'Processing',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || 'Pending';
}

// Sync functions for components that can't use async (will be deprecated)
export const dataServiceSync = {
    getProducts: (): Product[] => {
        if (typeof window === 'undefined') return productsData as unknown as Product[];
        const cached = sessionStorage.getItem('cached_products');
        return cached ? JSON.parse(cached) : (productsData as unknown as Product[]);
    },

    getProduct: (id: string): Product | undefined => {
        const products = dataServiceSync.getProducts();
        return products.find(p => p.id === id);
    }
};
