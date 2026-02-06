"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Filter, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { dataService } from "@/lib/data";
import { Customer } from "@/lib/types";

export default function CustomersPage() {
    const { toast } = useToast();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const data = await dataService.getCustomers();
                setCustomers(data);
            } catch (error) {
                console.error('Error loading customers:', error);
            } finally {
                setMounted(true);
            }
        };
        loadCustomers();
    }, []);

    // Filter customers based on search
    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
        name: "",
        email: "",
        orders: 0,
        totalSpent: "₺0",
        lastActive: "Şimdi"
    });

    const handleAddCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        const customer: Customer = {
            id: `CUST-${Math.floor(Math.random() * 10000)}`,
            name: newCustomer.name || "",
            email: newCustomer.email || "",
            orders: 0,
            totalSpent: "₺0",
            lastActive: "Şimdi"
        };

        await dataService.saveCustomer(customer);
        const updatedCustomers = await dataService.getCustomers();
        setCustomers(updatedCustomers);
        setIsAddModalOpen(false);
        setNewCustomer({ name: "", email: "" });
        toast("Müşteri başarıyla eklendi", "success");
    };

    if (!mounted) {
        return (
            <div className="animate-pulse space-y-8">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Müşteriler</h1>
                    <p className="text-gray-500">Müşteri tabanınızı yönetin.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-white" onClick={() => toast("Gelişmiş filtreler yakında", "success")}>
                        <Filter size={18} className="mr-2" />
                        Filtrele
                    </Button>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={18} className="mr-2" />
                        Müşteri Ekle
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Müşteri adı veya e-posta ile ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Müşteri</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Toplam Harcama</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Siparişler</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Son Aktif</th>
                            <th className="text-right p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {customer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">{customer.name}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Mail size={12} /> {customer.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm font-bold text-gray-900">₺{parseInt(customer.totalSpent).toLocaleString('tr-TR')}</td>
                                <td className="p-4 text-sm text-gray-500">{customer.orders} sipariş</td>
                                <td className="p-4 text-sm text-gray-500">{customer.lastActive}</td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => setViewingCustomer(customer)}
                                        className="text-primary hover:text-primary/80 text-sm font-medium"
                                    >
                                        Detay Gör
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredCustomers.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        {searchTerm ? `"${searchTerm}" ile eşleşen müşteri bulunamadı` : "Henüz müşteri bulunmuyor"}
                    </div>
                )}
            </div>

            {/* Add Customer Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Yeni Müşteri Ekle</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddCustomer} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Ad Soyad</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={newCustomer.name}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">E-posta Adresi</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={newCustomer.email}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>İptal</Button>
                                <Button type="submit">Müşteri Ekle</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Customer Details Modal */}
            {viewingCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Müşteri Detayı</h2>
                            <button onClick={() => setViewingCustomer(null)} className="text-gray-400 hover:text-gray-900">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                                    {viewingCustomer.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{viewingCustomer.name}</h3>
                                    <p className="text-gray-500">{viewingCustomer.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Toplam Harcama</p>
                                    <p className="text-lg font-bold text-primary">₺{parseInt(viewingCustomer.totalSpent).toLocaleString('tr-TR')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Toplam Sipariş</p>
                                    <p className="text-lg font-bold">{viewingCustomer.orders}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Son Aktif</p>
                                    <p className="text-sm font-medium">{viewingCustomer.lastActive}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Müşteri ID</p>
                                    <p className="text-sm font-mono text-gray-500">{viewingCustomer.id}</p>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button onClick={() => setViewingCustomer(null)}>Kapat</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
