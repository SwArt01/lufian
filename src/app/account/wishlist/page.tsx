"use client";

import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { dataService } from "@/lib/data";
import { Product } from "@/lib/types";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function WishlistPage() {
    const { user } = useUser();
    const { t } = useLanguage();
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadWishlist = async () => {
            if (user && user.wishlist.length > 0) {
                try {
                    const products = await dataService.getProducts();
                    const filtered = products.filter((p: Product) => user.wishlist.includes(p.id));
                    setWishlistProducts(filtered);
                } catch (error) {
                    console.error('Error loading wishlist:', error);
                }
            }
        };
        loadWishlist();
    }, [user]);

    return (
        <div className="container-custom py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
                    {t("wishlist.title")}
                </h1>
                {wishlistProducts.length > 0 && (
                    <p className="text-text-secondary">
                        {wishlistProducts.length} items saved
                    </p>
                )}
            </div>

            {wishlistProducts.length === 0 ? (
                <div className="text-center py-24">
                    <Heart size={64} className="mx-auto mb-6 text-gray-300" />
                    <h2 className="text-2xl font-bold mb-3">
                        {t("wishlist.empty")}
                    </h2>
                    <p className="text-text-secondary mb-8">
                        {t("wishlist.emptyDesc")}
                    </p>
                    <Link href="/collection">
                        <Button size="lg" className="rounded-full px-8">
                            {t("cart.startShopping")}
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlistProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
