"use client";

import { useEffect, useState } from "react";
import { dataService } from "@/lib/data";
import { AdminOrder } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus, Download, ShoppingBag, AlertTriangle, CheckCircle, TrendingUp, Package, Clock } from "lucide-react";

export default function AdminDashboard() {
    const [mounted, setMounted] = useState(false);
    const [totalValue, setTotalValue] = useState(0);
    const [lowStock, setLowStock] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const products = await dataService.getProducts();
                const orders = await dataService.getOrders();

                // Product statistics
                setTotalValue(products.reduce((acc, p) => acc + (p.price * p.stock), 0));
                setLowStock(products.filter(p => p.stock < 20).length);
                setTotalProducts(products.length);

                // Order statistics (exclude cancelled orders from revenue)
                const parseTotal = (total: string): number => {
                    return parseFloat(total.replace(/[^0-9.-]+/g, '')) || 0;
                };
                const activeOrders = orders.filter(order => order.status !== 'Cancelled');
                setTotalRevenue(activeOrders.reduce((sum, order) => sum + parseTotal(order.total), 0));
                setRecentOrders(orders.slice(0, 5));
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setMounted(true);
            }
        };

        loadData();
    }, []);

    const getStatusColor = (status: AdminOrder["status"]) => {
        switch (status) {
            case "Delivered": return "bg-green-100 text-green-700";
            case "Shipped": return "bg-blue-100 text-blue-700";
            case "Processing": return "bg-yellow-100 text-yellow-700";
            case "Cancelled": return "bg-red-100 text-red-700";
            case "Pending": return "bg-gray-100 text-gray-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusText = (status: AdminOrder["status"]) => {
        switch (status) {
            case "Delivered": return "Teslim Edildi";
            case "Shipped": return "Kargoda";
            case "Processing": return "Hazırlanıyor";
            case "Cancelled": return "İptal Edildi";
            case "Pending": return "Beklemede";
            default: return status;
        }
    };

    if (!mounted) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">Kontrol Paneli</h1>
                    <p className="text-gray-500">Mağaza performansınızı takip edin</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-white">
                        <Download size={18} className="mr-2" />
                        Dışa Aktar
                    </Button>
                    <Link href="/admin/products">
                        <Button>
                            <Plus size={18} className="mr-2" />
                            Yeni Ürün
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded">Canlı</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Toplam Gelir</p>
                    <h3 className="text-2xl font-black text-gray-900">₺{totalRevenue.toLocaleString('tr-TR')}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                            <ShoppingBag size={20} />
                        </div>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{totalProducts}</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Envanter Değeri</p>
                    <h3 className="text-2xl font-black text-gray-900">₺{totalValue.toLocaleString('tr-TR')}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                            <AlertTriangle size={20} />
                        </div>
                        <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded">{lowStock} ürün</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Düşük Stok</p>
                    <h3 className="text-2xl font-black text-gray-900">{lowStock > 0 ? "Aksiyon Gerekli" : "Stok Yeterli"}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                            <Package size={20} />
                        </div>
                        <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">Aktif</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Aktif Koleksiyonlar</p>
                    <h3 className="text-2xl font-black text-gray-900">3 Koleksiyon</h3>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Clock size={20} className="text-gray-400" />
                        <h2 className="font-bold text-lg">Son Siparişler</h2>
                    </div>
                    <Link href="/admin/orders" className="text-primary text-sm font-medium hover:underline">
                        Tümünü Gör →
                    </Link>
                </div>
                <div className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                        <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <span className="font-mono text-sm text-primary font-bold">{order.id}</span>
                                <div>
                                    <p className="font-medium text-gray-900">{order.customer}</p>
                                    <p className="text-xs text-gray-500">{order.date} • {order.items} ürün</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                                    {getStatusText(order.status)}
                                </span>
                                <span className="font-bold text-gray-900">₺{parseInt(order.total).toLocaleString('tr-TR')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
