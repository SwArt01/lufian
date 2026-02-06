"use client";

import { useState, useEffect } from "react";
import { dataService } from "@/lib/data";
import { AdminOrder } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { ArrowUpRight, TrendingUp, CreditCard, ShoppingBag, Search, Filter, X, Eye } from "lucide-react";

export default function OrdersPage() {
    const { toast } = useToast();
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | AdminOrder["status"]>("All");
    const [viewingOrder, setViewingOrder] = useState<AdminOrder | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await dataService.getOrders();
                setOrders(data);
            } catch (error) {
                console.error('Error loading orders:', error);
            } finally {
                setMounted(true);
            }
        };
        loadOrders();
    }, []);

    // Calculate dynamic statistics (exclude cancelled orders from revenue)
    const parseTotal = (total: string): number => {
        return parseFloat(total) || 0;
    };

    const activeOrders = orders.filter(order => order.status !== 'Cancelled');
    const totalRevenue = activeOrders.reduce((sum, order) => sum + parseTotal(order.total), 0);
    const avgOrderValue = activeOrders.length > 0 ? totalRevenue / activeOrders.length : 0;
    const totalOrders = orders.length;
    const cancelledOrders = orders.filter(order => order.status === 'Cancelled').length;

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "All" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleStatusChange = async (orderId: string, newStatus: AdminOrder["status"]) => {
        await dataService.updateOrderStatus(orderId, newStatus);
        const updatedOrders = await dataService.getOrders();
        setOrders(updatedOrders);
        toast(`Sipariş durumu "${getStatusText(newStatus)}" olarak güncellendi`, "success");
    };

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
            <div className="animate-pulse space-y-8">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
                </div>
                <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-2">Satış Raporları</h1>
                <p className="text-gray-500">Mağaza performansınızın genel görünümü.</p>
            </div>

            {/* Dynamic Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                            <TrendingUp size={20} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                            <ArrowUpRight size={14} className="mr-1" />
                            Canlı
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Toplam Gelir</p>
                    <h3 className="text-3xl font-black text-gray-900">₺{totalRevenue.toLocaleString('tr-TR')}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <CreditCard size={20} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            <ArrowUpRight size={14} className="mr-1" />
                            Ort.
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Ortalama Sipariş Değeri</p>
                    <h3 className="text-3xl font-black text-gray-900">₺{Math.round(avgOrderValue).toLocaleString('tr-TR')}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                            <ShoppingBag size={20} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                            {totalOrders}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Toplam Sipariş</p>
                    <h3 className="text-3xl font-black text-gray-900">{totalOrders}</h3>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-lg">Son İşlemler</h2>
                        <div className="flex gap-3">
                            <button
                                onClick={() => toast("Gelişmiş filtreler yakında", "success")}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Filter size={18} />
                                <span className="text-sm font-medium">Filtrele</span>
                            </button>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Sipariş numarası veya müşteri adıyla ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="h-10 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="All">Tüm Durumlar</option>
                            <option value="Processing">Hazırlanıyor</option>
                            <option value="Shipped">Kargoda</option>
                            <option value="Delivered">Teslim Edildi</option>
                            <option value="Cancelled">İptal Edildi</option>
                            <option value="Pending">Beklemede</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sipariş No</th>
                                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Müşteri</th>
                                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tarih</th>
                                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ürünler</th>
                                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                                <th className="text-right p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Toplam</th>
                                <th className="text-right p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-mono text-sm text-primary font-medium">{order.id}</td>
                                    <td className="p-4 text-sm font-bold text-gray-900">{order.customer}</td>
                                    <td className="p-4 text-sm text-gray-500">{order.date}</td>
                                    <td className="p-4 text-sm text-gray-500">{order.items} ürün</td>
                                    <td className="p-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value as AdminOrder["status"])}
                                            className={`text-xs font-bold px-2 py-1 rounded border-0 cursor-pointer ${getStatusColor(order.status)}`}
                                        >
                                            <option value="Pending">Beklemede</option>
                                            <option value="Processing">Hazırlanıyor</option>
                                            <option value="Shipped">Kargoda</option>
                                            <option value="Delivered">Teslim Edildi</option>
                                            <option value="Cancelled">İptal Edildi</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-right text-sm font-bold text-gray-900">₺{parseInt(order.total).toLocaleString('tr-TR')}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => setViewingOrder(order)}
                                            className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
                                        >
                                            <Eye size={16} />
                                            Detay
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            {searchTerm || statusFilter !== "All"
                                ? `Filtrelere uygun sipariş bulunamadı`
                                : "Henüz sipariş bulunmuyor"}
                        </div>
                    )}
                </div>
            </div>

            {/* View Order Details Modal */}
            {viewingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Sipariş Detayı</h2>
                            <button onClick={() => setViewingOrder(null)} className="text-gray-400 hover:text-gray-900">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Sipariş No</p>
                                    <p className="text-sm font-mono text-primary font-bold">{viewingOrder.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tarih</p>
                                    <p className="text-sm font-medium">{viewingOrder.date}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Müşteri</p>
                                <p className="text-lg font-bold">{viewingOrder.customer}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Ürün Sayısı</p>
                                    <p className="text-lg font-bold">{viewingOrder.items}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Toplam</p>
                                    <p className="text-lg font-bold text-primary">₺{parseInt(viewingOrder.total).toLocaleString('tr-TR')}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Durum</p>
                                <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded ${getStatusColor(viewingOrder.status)}`}>
                                    {getStatusText(viewingOrder.status)}
                                </span>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button onClick={() => setViewingOrder(null)}>Kapat</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
