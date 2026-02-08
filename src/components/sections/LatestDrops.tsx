"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { dataService } from "@/lib/data";
import { Product } from "@/lib/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LatestDrops() {
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await dataService.getProducts();
                setProducts(data.slice(0, 3));
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setMounted(true);
            }
        };
        loadProducts();
    }, []);

    return (
        <section className="py-12 md:py-16 lg:py-24 bg-background">
            <div className="container-custom">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">{t("home.newArrivals")}</span>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight">{t("home.latestDrops")}</h2>
                    </div>
                    <Link
                        href="/collection"
                        className="hidden md:flex items-center gap-2 text-sm font-bold border-b-2 border-primary/20 hover:border-primary transition-all pb-1"
                    >
                        {t("account.viewAll")} <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                    {!mounted ? (
                        // Skeleton loading
                        <>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-[4/5] rounded-xl bg-gray-200 dark:bg-gray-700 mb-4" />
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                </div>
                            ))}
                        </>
                    ) : (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link
                        href="/collection"
                        className="inline-flex items-center gap-2 text-sm font-bold border-b-2 border-primary/20 hover:border-primary transition-all pb-1"
                    >
                        {t("account.viewAll")} <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

