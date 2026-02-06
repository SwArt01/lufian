"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, UserOrder } from "@/lib/types";

interface UserContextType {
    user: User | null;
    updateUser: (user: Partial<User>) => void;
    addToWishlist: (productId: string) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    addOrder: (order: UserOrder) => void;
    clearUser: () => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = "lufian_user";

// Default user for demo purposes
const createDefaultUser = (): User => ({
    id: `user-${Date.now()}`,
    name: "Guest User",
    email: "",
    phone: "",
    orders: [],
    wishlist: [],
    createdAt: new Date().toISOString(),
});

export function UserProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse user data", e);
                setUser(createDefaultUser());
            }
        } else {
            setUser(createDefaultUser());
        }
    }, []);

    // Save to localStorage whenever user changes
    useEffect(() => {
        if (user) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        }
    }, [user]);

    const updateUser = (updates: Partial<User>) => {
        if (!user) return;
        setUser({ ...user, ...updates });
    };

    const addToWishlist = (productId: string) => {
        if (!user) return;
        if (!user.wishlist.includes(productId)) {
            setUser({
                ...user,
                wishlist: [...user.wishlist, productId],
            });
        }
    };

    const removeFromWishlist = (productId: string) => {
        if (!user) return;
        setUser({
            ...user,
            wishlist: user.wishlist.filter((id) => id !== productId),
        });
    };

    const isInWishlist = (productId: string): boolean => {
        return user?.wishlist.includes(productId) || false;
    };

    const addOrder = (order: UserOrder) => {
        if (!user) return;
        setUser({
            ...user,
            orders: [order, ...user.orders], // New orders at the beginning
        });
    };

    const clearUser = () => {
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(createDefaultUser());
    };

    const logout = () => {
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
        router.push('/account/login');
    };

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                addOrder,
                clearUser,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
