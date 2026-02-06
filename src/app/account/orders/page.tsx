"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/Button";
import { Package, ChevronDown, ChevronUp, ShoppingBag, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OrdersPage() {
    const { user } = useUser();
    const { t } = useLanguage();
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    if (!user || user.orders.length === 0) {
        return (
            <div className="container-custom py-24 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                        <Package size={40} className="text-gray-400" />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-4">
                        {t("account.noOrders")}
                    </h1>
                    <p className="text-text-secondary mb-8">
                        {t("account.noOrdersDesc")}
                    </p>
                    <Link href="/collection">
                        <Button size="lg" className="rounded-full px-8">
                            <ShoppingBag className="mr-2" size={20} />
                            {t("cart.startShopping")}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'processing': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'confirmed': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <div className="container-custom py-12">
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <Package size={32} className="text-primary" />
                    <h1 className="text-3xl font-black uppercase tracking-tight">
                        {t("orders.title")}
                    </h1>
                </div>
                <p className="text-text-secondary">
                    {t("orders.count", { count: user.orders.length })}
                </p>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {user.orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white dark:bg-surface border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden"
                    >
                        {/* Order Summary */}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-mono text-sm font-bold text-primary">
                                            {order.id}
                                        </h3>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                                            {t(`status.${order.status}`)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <span>
                                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-primary">
                                        ₺{order.total.toLocaleString('tr-TR')}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                {expandedOrder === order.id ? (
                                    <>
                                        <ChevronUp size={16} />
                                        {t("orders.hideDetails")}
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown size={16} />
                                        {t("orders.viewDetails")}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Expanded Details */}
                        {expandedOrder === order.id && (
                            <div className="border-t border-gray-100 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
                                {/* Items */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-text-secondary mb-4">
                                        {t("orders.items")}
                                    </h4>
                                    <div className="space-y-3">
                                        {order.items.map((item) => (
                                            <div
                                                key={item.cartId}
                                                className="flex gap-4 p-3 bg-white dark:bg-surface rounded-lg"
                                            >
                                                <div className="relative w-16 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                                                    <Image
                                                        src={item.images[0]}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="font-bold text-sm">{item.name}</h5>
                                                    <p className="text-xs text-text-secondary">
                                                        Size: {item.selectedSize} | Qty: {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">
                                                        ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                {order.deliveryAddress && (
                                    <div className="mb-6">
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
                                            <MapPin size={14} />
                                            {t("orders.deliveryAddress")}
                                        </h4>
                                        <div className="p-4 bg-white dark:bg-surface rounded-lg text-sm">
                                            <p>{order.deliveryAddress.street}</p>
                                            <p>
                                                {order.deliveryAddress.city}, {order.deliveryAddress.state}{' '}
                                                {order.deliveryAddress.zipCode}
                                            </p>
                                            <p>{order.deliveryAddress.country}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Tracking */}
                                {order.trackingNumber && (
                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-text-secondary mb-3">
                                            {t("orders.trackingNumber")}
                                        </h4>
                                        <div className="p-4 bg-white dark:bg-surface rounded-lg">
                                            <p className="font-mono text-sm font-bold">
                                                {order.trackingNumber}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Order Total */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">{t("cart.total")}</span>
                                        <span className="text-2xl font-black text-primary">
                                            ₺{order.total.toLocaleString('tr-TR')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
