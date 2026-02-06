export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    name: string
                    category: 'hoodie' | 'crewneck' | 'sweatshirt'
                    description: string | null
                    price: number
                    sku: string
                    sizes: string[]
                    stock: number
                    images: string[]
                    tags: string[]
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    category: 'hoodie' | 'crewneck' | 'sweatshirt'
                    description?: string | null
                    price: number
                    sku: string
                    sizes?: string[]
                    stock?: number
                    images?: string[]
                    tags?: string[]
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    category?: 'hoodie' | 'crewneck' | 'sweatshirt'
                    description?: string | null
                    price?: number
                    sku?: string
                    sizes?: string[]
                    stock?: number
                    images?: string[]
                    tags?: string[]
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    name: string | null
                    phone: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    name?: string | null
                    phone?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string | null
                    phone?: string | null
                    created_at?: string
                }
            }
            addresses: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    full_name: string
                    phone: string
                    city: string
                    district: string
                    address: string
                    is_default: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    full_name: string
                    phone: string
                    city: string
                    district: string
                    address: string
                    is_default?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    full_name?: string
                    phone?: string
                    city?: string
                    district?: string
                    address?: string
                    is_default?: boolean
                    created_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string | null
                    items: Json
                    total: number
                    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    delivery_address: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    items: Json
                    total: number
                    status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    delivery_address?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    items?: Json
                    total?: number
                    status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    delivery_address?: Json | null
                    created_at?: string
                }
            }
        }
    }
}

// Helper types for easier use
export type Product = Database['public']['Tables']['products']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Address = Database['public']['Tables']['addresses']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
