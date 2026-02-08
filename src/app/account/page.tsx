"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/context/UserAuthContext";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin, Edit2, Package, Heart, X, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

export default function AccountPage() {
    const router = useRouter();
    const { user: authUser, isAuthenticated, isLoading: authLoading, logout, updateProfile } = useUserAuth();
    const { user: localUser } = useUser(); // For wishlist from localStorage
    const { t } = useLanguage();
    const { toast } = useToast();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/account/login");
        }
    }, [isAuthenticated, authLoading, router]);

    // Update form data when user loads
    useEffect(() => {
        if (authUser) {
            setFormData({
                name: authUser.name || "",
                email: authUser.email || "",
                phone: authUser.phone || "",
            });
        }
    }, [authUser]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateProfile(formData);
        setIsEditModalOpen(false);
        toast(t("toast.profileUpdated"), "success");
    };

    const handleLogout = async () => {
        await logout();
        router.push("/account/login");
    };

    // Show loading while checking auth (max 3 seconds)
    const [loadingTimeout, setLoadingTimeout] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingTimeout(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    if (authLoading && !loadingTimeout) {
        return (
            <div className="container-custom py-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // If not authenticated or loading timed out, show login prompt
    if (!authUser) {
        return (
            <div className="container-custom py-24 text-center">
                <h2 className="text-2xl font-bold mb-4">Giriş Yapmanız Gerekiyor</h2>
                <p className="text-text-secondary mb-6">Hesabınıza erişmek için lütfen giriş yapın.</p>
                <Link href="/account/login">
                    <Button size="lg">Giriş Yap</Button>
                </Link>
            </div>
        );
    }

    // Use local user for wishlist count
    const wishlistCount = localUser?.wishlist?.length || 0;
    const ordersCount = localUser?.orders?.length || 0;

    return (
        <div className="container-custom py-12">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
                    {t("account.title")}
                </h1>
                <p className="text-text-secondary">
                    {t("account.subtitle")}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
                {/* Profile Card */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    <div className="bg-white dark:bg-surface border border-gray-100 dark:border-gray-700 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-sm">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                                    {authUser.name?.charAt(0).toUpperCase() || authUser.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{authUser.name || authUser.email?.split('@')[0]}</h2>
                                    <p className="text-sm text-text-secondary">
                                        {t("account.memberSince")} {new Date(authUser.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                <Edit2 size={16} className="mr-2" />
                                {t("account.editProfile")}
                            </Button>
                        </div>

                        <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-6">
                            <div className="flex items-center gap-3 text-text-secondary">
                                <Mail size={20} />
                                <span>{authUser.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-text-secondary">
                                <Phone size={20} />
                                <span>{authUser.phone || 'Telefon eklenmedi'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white dark:bg-surface border border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">{t("account.recentOrders")}</h3>
                            <Link href="/account/orders">
                                <Button variant="ghost" size="sm">
                                    {t("account.viewAll")}
                                </Button>
                            </Link>
                        </div>

                        <div className="text-center py-8 text-text-secondary">
                            <Package size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>{t("account.noOrders")}</p>
                            <p className="text-sm mt-2">{t("account.noOrdersDesc")}</p>
                            <Link href="/collection">
                                <Button size="sm" className="mt-4">
                                    {t("cart.startShopping")}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <Link href="/account/wishlist">
                        <div className="bg-white dark:bg-surface border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                                <Heart size={24} className="text-red-500" />
                                <span className="text-2xl font-black">
                                    {wishlistCount}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg mb-1">{t("nav.wishlist")}</h3>
                            <p className="text-sm text-text-secondary">
                                Kayıtlı ürünleriniz
                            </p>
                        </div>
                    </Link>

                    <Link href="/account/orders">
                        <div className="bg-white dark:bg-surface border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                                <Package size={24} className="text-primary" />
                                <span className="text-2xl font-black">
                                    {ordersCount}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg mb-1">{t("orders.title")}</h3>
                            <p className="text-sm text-text-secondary">
                                Siparişlerinizi takip edin
                            </p>
                        </div>
                    </Link>

                    <Link href="/account/addresses">
                        <div className="bg-white dark:bg-surface border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                                <MapPin size={24} className="text-green-500" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">Adreslerim</h3>
                            <p className="text-sm text-text-secondary">
                                Teslimat adreslerinizi yönetin
                            </p>
                        </div>
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full mt-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut size={24} className="text-red-500" />
                            <div>
                                <h3 className="font-bold text-lg mb-1 text-red-600 dark:text-red-400">Çıkış Yap</h3>
                                <p className="text-sm text-red-500/70">Hesabınızdan güvenli çıkış yapın</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-surface rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{t("account.editProfile")}</h2>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Ad Soyad</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-10 px-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">E-posta</label>
                                <input
                                    type="email"
                                    disabled
                                    className="w-full h-10 px-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                    value={formData.email}
                                />
                                <p className="text-xs text-gray-400 mt-1">E-posta değiştirilemez</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Telefon</label>
                                <input
                                    type="tel"
                                    className="w-full h-10 px-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                                    {t("common.cancel")}
                                </Button>
                                <Button type="submit">
                                    {t("common.save")}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
