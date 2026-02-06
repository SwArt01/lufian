"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "lufian_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Always start with default "light" to match server
    const [theme, setTheme] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    // Read from localStorage and apply theme after mount
    useEffect(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
        if (stored && (stored === "light" || stored === "dark")) {
            setTheme(stored);
        }
        setMounted(true);
    }, []);

    // Apply theme to document (only after mounted)
    useEffect(() => {
        if (mounted) {
            const root = document.documentElement;
            root.classList.remove("light", "dark");
            root.classList.add(theme);
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
