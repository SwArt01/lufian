"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { dataService } from "@/lib/data";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { ArrowLeft, MessageCircle, Truck, ShieldCheck, Leaf, Heart } from "lucide-react";
import Link from "next/link";

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addItem } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useUser();
    const { t } = useLanguage();
    const { toast } = useToast();

    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<number>(0);
    const [selectedImage, setSelectedImage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            if (id) {
                try {
                    const p = await dataService.getProduct(id as string);
                    setProduct(p);
                } catch (error) {
                    console.error('Error loading product:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        loadProduct();
    }, [id]);

    if (isLoading) return <div className="h-[50vh] flex items-center justify-center">{t("common.loading")}</div>;
    if (!product) return <div className="h-[50vh] flex items-center justify-center">{t("common.notFound")}</div>;

    const inWishlist = product ? isInWishlist(product.id) : false;

    const handleAddToCart = () => {
        if (product.stock === 0) {
            toast("Bu ürün tükendi", "error");
            return;
        }
        if (!selectedSize) {
            toast(t("product.selectSizeError"), "error");
            return;
        }
        addItem(product, selectedSize);
        toast(t("product.addedToCart"), "success");
    };

    const handleToggleWishlist = () => {
        if (!product) return;

        if (inWishlist) {
            removeFromWishlist(product.id);
            toast(t("product.removedFromWishlist"), "success");
        } else {
            addToWishlist(product.id);
            toast(t("product.addedToWishlist"), "success");
        }
    };

    const handleWhatsAppOrder = () => {
        if (!selectedSize) {
            toast(t("product.selectSizeError"), "error");
            return;
        }

        // Direct WhatsApp order for single item
        const message = `Merhaba! Sipariş vermek istiyorum:
- ${product.name} (${selectedSize}) x1
Fiyat: ₺${product.price.toLocaleString('tr-TR')}`;

        window.open(`https://wa.me/905526690303?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="container-custom py-12">
            <button
                onClick={() => router.back()}
                className="flex items-center text-sm font-medium text-text-secondary hover:text-text-primary mb-8"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> {t("product.backToCollection")}
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                {/* Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
                        <Image
                            src={product.images[selectedImage]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-primary" : "border-transparent"
                                    }`}
                            >
                                <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div className="flex flex-col">
                    <span className="text-primary text-sm font-bold uppercase tracking-wider mb-2">
                        {product.category}
                    </span>
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-4">{product.name}</h1>
                    <div className="flex items-center gap-4 mb-8">
                        {product.originalPrice && product.originalPrice > product.price ? (
                            <>
                                <p className="text-2xl font-bold text-red-500">₺{product.price.toLocaleString('tr-TR')}</p>
                                <p className="text-lg text-gray-400 line-through">₺{product.originalPrice.toLocaleString('tr-TR')}</p>
                                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">{t("product.sale")}</span>
                            </>
                        ) : (
                            <p className="text-2xl font-bold">₺{product.price.toLocaleString('tr-TR')}</p>
                        )}
                        {product.stock === 0 ? (
                            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded">TÜKENDİ</span>
                        ) : product.stock < 10 ? (
                            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded">Son {product.stock} adet</span>
                        ) : null}
                    </div>

                    <div className="prose prose-sm text-text-secondary mb-8">
                        <p>{product.description}</p>
                    </div>

                    {/* Color Selector */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="mb-8">
                            <span className="font-bold text-sm uppercase block mb-3">
                                {t("product.selectColor")}: <span className="text-primary">{product.colors[selectedColor]?.name}</span>
                            </span>
                            <div className="flex gap-3">
                                {product.colors.map((color, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedColor(idx);
                                            // If color has images, switch to first image of that color
                                            if (color.images && color.images.length > 0) {
                                                setSelectedImage(0);
                                            }
                                        }}
                                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === idx
                                            ? "border-primary scale-110 ring-2 ring-primary/30"
                                            : "border-gray-200 dark:border-gray-600"
                                            }`}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    >
                                        {selectedColor === idx && (
                                            <span className={`text-xs ${color.hex === "#FFFFFF" ? "text-black" : "text-white"}`}>
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size Selector */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-sm uppercase">{t("product.selectSize")}</span>
                            <button className="text-xs text-primary font-bold underline">{t("product.sizeGuide")}</button>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`h-12 border rounded-lg font-bold transition-all ${selectedSize === size
                                        ? "border-primary bg-primary text-white"
                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-text-primary"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4 mb-8">
                        <div className="flex gap-3">
                            <Button
                                size="lg"
                                className="flex-1 h-14 text-lg"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                {product.stock === 0
                                    ? 'Tükendi'
                                    : `${t("product.addToCart")} - ₺${product.price.toLocaleString('tr-TR')}`
                                }
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 px-5"
                                onClick={handleToggleWishlist}
                            >
                                <Heart
                                    size={24}
                                    className={`${inWishlist ? "fill-red-500 text-red-500" : ""}`}
                                />
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full h-14 text-lg border-primary/20 hover:border-primary hover:bg-primary/5 text-primary"
                            onClick={handleWhatsAppOrder}
                        >
                            <MessageCircle className="mr-2 h-5 w-5" />
                            {t("product.orderWhatsApp")}
                        </Button>
                    </div>

                    <p className="text-xs text-center text-success flex items-center justify-center gap-2 mb-8">
                        <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
                        Genellikle 5 dakika içinde yanıt verir
                    </p>

                    {/* Features */}
                    <div className="border-t border-gray-100 divide-y divide-gray-100">
                        <div className="py-4 flex items-center gap-4">
                            <Leaf className="w-5 h-5 text-text-secondary" />
                            <div>
                                <p className="font-bold text-xs uppercase">Sürdürülebilir</p>
                                <p className="text-xs text-text-secondary">Organik pamuk sertifikalı</p>
                            </div>
                        </div>
                        <div className="py-4 flex items-center gap-4">
                            <Truck className="w-5 h-5 text-text-secondary" />
                            <div>
                                <p className="font-bold text-xs uppercase">Hızlı Teslimat</p>
                                <p className="text-xs text-text-secondary">2-3 iş günü içinde kargo</p>
                            </div>
                        </div>
                        <div className="py-4 flex items-center gap-4">
                            <ShieldCheck className="w-5 h-5 text-text-secondary" />
                            <div>
                                <p className="font-bold text-xs uppercase">Güvenli Alışveriş</p>
                                <p className="text-xs text-text-secondary">%100 güvenli ödeme</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
