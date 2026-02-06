"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { Heart } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useUser();
    const { toast } = useToast();
    const { t } = useLanguage();
    const inWishlist = isInWishlist(product.id);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to product page
        e.stopPropagation();

        if (inWishlist) {
            removeFromWishlist(product.id);
            toast(t("product.removedFromWishlist"), "success");
        } else {
            addToWishlist(product.id);
            toast(t("product.addedToWishlist"), "success");
        }
    };

    return (
        <Link href={`/product/${product.id}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 mb-4">
                {/* Badge */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {product.stock === 0 && (
                        <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
                            Tükendi
                        </span>
                    )}
                    {product.tags.includes('NEW') && product.stock > 0 && (
                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
                            {t("product.tagNew")}
                        </span>
                    )}
                    {product.tags.includes('HOT') && product.stock > 0 && (
                        <span className="bg-danger text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
                            {t("product.tagHot")}
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all hover:scale-110"
                    aria-label={inWishlist ? t("product.removeFromWishlistAria") : t("product.addToWishlistAria")}
                >
                    <Heart
                        size={18}
                        className={`transition-colors ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-700"
                            }`}
                    />
                </button>

                {/* Image */}
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Hover overlay */}
                <div className={`absolute inset-0 transition-opacity ${product.stock === 0 ? 'bg-black/30 opacity-100' : 'bg-black/5 opacity-0 group-hover:opacity-100'}`} />
            </div>

            <div className="space-y-1">
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm text-text-secondary capitalize">{product.category}</p>
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-primary font-bold text-lg">
                        ₺{product.price.toLocaleString('tr-TR')}
                    </span>
                    <span className="text-xs text-text-secondary font-medium tracking-wider uppercase border-b border-transparent group-hover:border-text-secondary transition-all">
                        {t("product.viewItem")}
                    </span>
                </div>
            </div>
        </Link>
    );
}
