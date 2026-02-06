"use client";

import Link from "next/link";
import { Twitter, Instagram, Facebook, Globe } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";

export function Footer() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const { toast } = useToast();

    if (pathname?.startsWith('/admin')) return null;

    const handlePlaceholder = (feature: string) => {
        toast(`${feature} ${t("toast.comingSoon")}`, "success");
    };

    return (
        <footer className="bg-white dark:bg-surface border-t border-border mt-20 pt-16 pb-8">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-primary text-lg">✦</span>
                            <span className="font-bold text-lg tracking-tight uppercase">Streetwear</span>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
                            {t("footer.brandDesc")}
                        </p>
                    </div>

                    {/* Shop */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-wider">{t("footer.shop")}</h4>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li><Link href="/collection" className="hover:text-primary transition-colors">{t("footer.allCollection")}</Link></li>
                            <li><Link href="/collection" className="hover:text-primary transition-colors">{t("home.newArrivals")}</Link></li>
                            <li>
                                <button onClick={() => handlePlaceholder(t("nav.drops"))} className="hover:text-primary transition-colors text-left">
                                    {t("footer.limitedDrops")}
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-wider">{t("footer.support")}</h4>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li>
                                <button onClick={() => handlePlaceholder(t("footer.shippingInfo"))} className="hover:text-primary transition-colors text-left">
                                    {t("footer.shippingInfo")}
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handlePlaceholder(t("footer.returns"))} className="hover:text-primary transition-colors text-left">
                                    {t("footer.returns")}
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handlePlaceholder(t("product.sizeGuide"))} className="hover:text-primary transition-colors text-left">
                                    {t("product.sizeGuide")}
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-wider">{t("footer.social")}</h4>
                        <div className="flex gap-4">
                            <button onClick={() => handlePlaceholder('Website')} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Globe size={18} />
                            </button>
                            <button onClick={() => handlePlaceholder('Instagram')} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Instagram size={18} />
                            </button>
                            <button onClick={() => handlePlaceholder('Twitter')} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Twitter size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-text-secondary uppercase tracking-wider">
                        {t("footer.copyright")}
                    </p>
                    <div className="flex gap-6 text-xs text-text-secondary uppercase tracking-wider">
                        <button onClick={() => handlePlaceholder(t("footer.privacy"))} className="hover:text-text-primary">{t("footer.privacy")}</button>
                        <button onClick={() => handlePlaceholder(t("footer.terms"))} className="hover:text-text-primary">{t("footer.terms")}</button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
