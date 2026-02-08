"use client";

import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, MessageCircle } from "lucide-react";

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCart();
    const { addOrder } = useUser();
    const { t } = useLanguage();
    const { toast } = useToast();

    const handleCheckout = () => {
        if (items.length === 0) return;

        // Create order object
        const order = {
            id: `ORD-${Date.now()}`,
            items: [...items],
            total: total,
            status: 'pending' as const,
            createdAt: new Date().toISOString(),
        };

        // Save to user orders
        addOrder(order);

        const itemsList = items
            .map(
                (item) =>
                    `- ${item.name} (${item.selectedSize}) x${item.quantity} - ₺${(item.price * item.quantity).toLocaleString('tr-TR')}`
            )
            .join("\n");

        const message = `Merhaba! Sipariş vermek istiyorum:

${itemsList}

Toplam Tutar: ₺${total.toLocaleString('tr-TR')}`;

        window.open(
            `https://wa.me/905526690303?text=${encodeURIComponent(message)}`,
            "_blank"
        );

        // Show success message
        toast(t("toast.orderPlaced"), "success");

        // Optional: Clear cart after checkout
        // clearCart();
    };

    if (items.length === 0) {
        return (
            <div className="container-custom py-24 text-center">
                <h1 className="text-4xl font-black uppercase tracking-tight mb-6">
                    {t("cart.empty")}
                </h1>
                <p className="text-text-secondary mb-8">
                    {t("cart.emptyDesc")}
                </p>
                <Link href="/collection">
                    <Button size="lg" className="rounded-full px-8">
                        {t("cart.startShopping")}
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container-custom py-12">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-8 md:mb-12">{t("cart.title")}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4 md:space-y-8">
                    {items.map((item) => (
                        <div
                            key={item.cartId}
                            className="flex flex-col sm:flex-row gap-4 md:gap-6 p-4 md:p-6 bg-white dark:bg-surface border border-gray-100 dark:border-gray-700 rounded-xl md:rounded-2xl shadow-sm"
                        >
                            <div className="relative w-full sm:w-24 h-40 sm:h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                <Image
                                    src={item.images[0]}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                        <button
                                            onClick={() => removeItem(item.cartId)}
                                            className="text-text-secondary hover:text-danger transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <p className="text-sm text-text-secondary">
                                        Size: {item.selectedSize}
                                    </p>
                                    <p className="text-sm text-text-secondary capitalize">
                                        {item.category}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
                                        <button
                                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="font-bold w-4 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <p className="font-bold text-lg">
                                        ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 dark:bg-surface rounded-xl md:rounded-2xl p-6 md:p-8 lg:sticky lg:top-24">
                        <h3 className="font-bold text-xl uppercase tracking-tight mb-8">
                            {t("cart.summary")}
                        </h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">{t("cart.subtotal")}</span>
                                <span className="font-bold">₺{total.toLocaleString('tr-TR')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">{t("cart.shipping")}</span>
                                <span className="text-success font-medium">{t("cart.free")}</span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center">
                                <span className="font-bold text-lg">{t("cart.total")}</span>
                                <span className="font-black text-2xl text-primary">
                                    ₺{total.toLocaleString('tr-TR')}
                                </span>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full h-14 text-lg mb-4"
                            onClick={handleCheckout}
                        >
                            <MessageCircle className="mr-2 h-5 w-5" />
                            {t("cart.checkout")}
                        </Button>

                        <p className="text-xs text-center text-text-secondary leading-relaxed">
                            {t("cart.checkoutNote")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
