"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, X, Heart, User, Moon, Sun, Globe } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const { itemCount } = useCart();
    const { user } = useUser();
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();

    const wishlistCount = user?.wishlist.length || 0;

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "tr" : "en");
    };

    // Add search handler
    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const query = e.currentTarget.value;
            if (query.trim()) {
                router.push(`/collection?search=${encodeURIComponent(query)}`);
                if (isMenuOpen) setIsMenuOpen(false);
            }
        }
    };

    // Hide on admin routes
    if (pathname?.startsWith('/admin')) return null;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-white/80 dark:bg-surface/80 backdrop-blur-md">
            <div className="container-custom flex h-16 md:h-20 items-center justify-between">

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 -ml-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-primary text-xl">✦</span>
                    <span className="font-bold text-xl tracking-tight uppercase">Streetwear</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/collection" className="text-sm font-medium hover:text-primary transition-colors">
                        {t("nav.collection")}
                    </Link>
                    <button
                        onClick={() => toast(t("nav.drops") + " " + t("toast.comingSoon"), "success")}
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        {t("nav.drops")}
                    </button>
                    <button
                        onClick={() => toast(t("nav.lookbook") + " " + t("toast.comingSoon"), "success")}
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        {t("nav.lookbook")}
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 md:gap-2">
                    <div className="hidden md:flex relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                        <input
                            type="text"
                            placeholder={t("nav.search")}
                            onKeyDown={handleSearch}
                            className="h-10 w-64 rounded-full bg-gray-100 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    {/* Mobile Search Icon */}
                    <button
                        className="md:hidden p-2 text-text-primary"
                        onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                    >
                        <Search size={22} />
                    </button>

                    {/* Wishlist - hidden on mobile */}
                    <Link href="/account/wishlist" className="hidden sm:block">
                        <Button variant="ghost" size="icon" className="relative rounded-full">
                            <Heart size={20} />
                            {wishlistCount > 0 && (
                                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {/* Cart */}
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative rounded-full">
                            <ShoppingBag size={20} />
                            {itemCount > 0 && (
                                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {/* Theme Toggle - hidden on mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="hidden sm:flex rounded-full"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>

                    {/* Language Toggle - hidden on mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleLanguage}
                        className="hidden sm:flex rounded-full"
                        title={language === 'en' ? 'Türkçe' : 'English'}
                    >
                        <div className="flex items-center gap-1">
                            <Globe size={16} />
                            <span className="text-xs font-bold uppercase">{language}</span>
                        </div>
                    </Button>

                    {/* Account - hidden on mobile */}
                    <Link href="/account" className="hidden sm:block">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <User size={20} />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Mobile Search Bar */}
            {isMobileSearchOpen && (
                <div className="md:hidden border-t border-border bg-white dark:bg-surface p-3 absolute w-full left-0 top-16 animate-in slide-in-from-top-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                        <input
                            type="text"
                            placeholder={t("nav.search")}
                            onKeyDown={(e) => {
                                handleSearch(e);
                                if (e.key === 'Enter') setIsMobileSearchOpen(false);
                            }}
                            autoFocus
                            className="h-12 w-full rounded-full bg-gray-100 dark:bg-gray-800 pl-10 pr-4 text-base outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-border bg-white dark:bg-surface p-4 absolute w-full left-0 top-16 animate-in slide-in-from-top-5 max-h-[calc(100vh-4rem)] overflow-y-auto">
                    <div className="flex flex-col space-y-4">
                        <Link href="/collection" className="text-lg font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                            {t("nav.collection")}
                        </Link>
                        <button
                            className="text-lg font-medium text-left py-2"
                            onClick={() => {
                                setIsMenuOpen(false);
                                toast(t("nav.drops") + " " + t("toast.comingSoon"), "success");
                            }}
                        >
                            {t("nav.drops")}
                        </button>
                        <button
                            className="text-lg font-medium text-left py-2"
                            onClick={() => {
                                setIsMenuOpen(false);
                                toast(t("nav.lookbook") + " " + t("toast.comingSoon"), "success");
                            }}
                        >
                            {t("nav.lookbook")}
                        </button>

                        {/* Quick Actions */}
                        <div className="pt-4 border-t border-border grid grid-cols-2 gap-3">
                            <Link href="/account/wishlist" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="outline" className="w-full h-12">
                                    <Heart size={18} className="mr-2" />
                                    {t("nav.wishlist")} {wishlistCount > 0 && `(${wishlistCount})`}
                                </Button>
                            </Link>
                            <Link href="/account" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="outline" className="w-full h-12">
                                    <User size={18} className="mr-2" />
                                    {t("nav.account")}
                                </Button>
                            </Link>
                        </div>

                        {/* Theme & Language Toggle for Mobile */}
                        <div className="pt-4 border-t border-border flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 h-12"
                                onClick={() => {
                                    toggleTheme();
                                }}
                            >
                                {theme === 'dark' ? <Sun size={18} className="mr-2" /> : <Moon size={18} className="mr-2" />}
                                {theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 h-12"
                                onClick={() => {
                                    toggleLanguage();
                                }}
                            >
                                <Globe size={18} className="mr-2" />
                                {language === 'en' ? 'Türkçe' : 'English'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
