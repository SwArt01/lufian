"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// Types
export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    createdAt: string;
}

export interface Address {
    id: string;
    title: string;
    fullName: string;
    phone: string;
    city: string;
    district: string;
    address: string;
    isDefault: boolean;
}

interface UserAuthContextType {
    user: User | null;
    addresses: Address[];
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
    addAddress: (address: Omit<Address, "id">) => Promise<void>;
    updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
    deleteAddress: (id: string) => Promise<void>;
    setDefaultAddress: (id: string) => Promise<void>;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load user on mount and listen for auth changes
    useEffect(() => {
        // Get initial session
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    await loadUserData(session.user);
                }
            } catch (error) {
                console.error('Error loading session:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                await loadUserData(session.user);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setAddresses([]);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const loadUserData = async (supabaseUser: SupabaseUser) => {
        // Get profile data
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();

        const profileData = profile as { name?: string; phone?: string } | null;

        setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: profileData?.name || supabaseUser.email?.split('@')[0] || '',
            phone: profileData?.phone || undefined,
            createdAt: supabaseUser.created_at || new Date().toISOString()
        });

        // Load addresses
        await loadAddresses(supabaseUser.id);
    };

    const loadAddresses = async (userId: string) => {
        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', userId)
            .order('is_default', { ascending: false });

        if (!error && data) {
            setAddresses(data.map(a => ({
                id: a.id,
                title: a.title,
                fullName: a.full_name,
                phone: a.phone,
                city: a.city,
                district: a.district,
                address: a.address,
                isDefault: a.is_default
            })));
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.user) {
                await loadUserData(data.user);
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: 'Bir hata oluştu' };
        }
    };

    const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name
                    }
                }
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.user) {
                // Create profile
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    name
                });

                await loadUserData(data.user);
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: 'Bir hata oluştu' };
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setAddresses([]);
    };

    const updateProfile = async (data: Partial<User>) => {
        if (!user) return;

        const { error } = await supabase
            .from('profiles')
            .update({
                name: data.name,
                phone: data.phone
            })
            .eq('id', user.id);

        if (!error) {
            setUser({ ...user, ...data });
        }
    };

    const addAddress = async (address: Omit<Address, "id">) => {
        if (!user) return;

        // If this is the first address or marked as default, update others
        if (address.isDefault || addresses.length === 0) {
            await supabase
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', user.id);
        }

        const { data, error } = await supabase
            .from('addresses')
            .insert({
                user_id: user.id,
                title: address.title,
                full_name: address.fullName,
                phone: address.phone,
                city: address.city,
                district: address.district,
                address: address.address,
                is_default: address.isDefault || addresses.length === 0
            })
            .select()
            .single();

        if (!error && data) {
            await loadAddresses(user.id);
        }
    };

    const updateAddress = async (id: string, data: Partial<Address>) => {
        if (!user) return;

        const updateData: Record<string, unknown> = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.fullName !== undefined) updateData.full_name = data.fullName;
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.city !== undefined) updateData.city = data.city;
        if (data.district !== undefined) updateData.district = data.district;
        if (data.address !== undefined) updateData.address = data.address;
        if (data.isDefault !== undefined) updateData.is_default = data.isDefault;

        const { error } = await supabase
            .from('addresses')
            .update(updateData)
            .eq('id', id);

        if (!error) {
            await loadAddresses(user.id);
        }
    };

    const deleteAddress = async (id: string) => {
        if (!user) return;

        const deletedAddress = addresses.find(a => a.id === id);

        const { error } = await supabase
            .from('addresses')
            .delete()
            .eq('id', id);

        if (!error) {
            // If deleted address was default, set first remaining as default
            if (deletedAddress?.isDefault && addresses.length > 1) {
                const firstRemaining = addresses.find(a => a.id !== id);
                if (firstRemaining) {
                    await supabase
                        .from('addresses')
                        .update({ is_default: true })
                        .eq('id', firstRemaining.id);
                }
            }
            await loadAddresses(user.id);
        }
    };

    const setDefaultAddress = async (id: string) => {
        if (!user) return;

        // Set all to false
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user.id);

        // Set selected to true
        await supabase
            .from('addresses')
            .update({ is_default: true })
            .eq('id', id);

        await loadAddresses(user.id);
    };

    return (
        <UserAuthContext.Provider value={{
            user,
            addresses,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout,
            updateProfile,
            addAddress,
            updateAddress,
            deleteAddress,
            setDefaultAddress
        }}>
            {children}
        </UserAuthContext.Provider>
    );
}

export function useUserAuth() {
    const context = useContext(UserAuthContext);
    if (!context) {
        throw new Error("useUserAuth must be used within UserAuthProvider");
    }
    return context;
}
