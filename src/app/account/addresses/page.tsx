"use client";

import { useState } from "react";
import { useUserAuth, Address } from "@/context/UserAuthContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Plus, MapPin, Pencil, Trash2, X, Star } from "lucide-react";
import Link from "next/link";

export default function AddressesPage() {
    const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, isAuthenticated } = useUserAuth();
    const { toast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        fullName: "",
        phone: "",
        city: "",
        district: "",
        address: "",
        isDefault: false
    });

    if (!isAuthenticated) {
        return (
            <div className="container-custom py-12">
                <div className="text-center py-16">
                    <MapPin className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h2 className="text-xl font-bold mb-2">Giriş Yapmanız Gerekiyor</h2>
                    <p className="text-gray-500 mb-6">Adreslerinizi görüntülemek için giriş yapın</p>
                    <Link href="/account/login">
                        <Button>Giriş Yap</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const resetForm = () => {
        setFormData({
            title: "",
            fullName: "",
            phone: "",
            city: "",
            district: "",
            address: "",
            isDefault: false
        });
        setEditingAddress(null);
    };

    const openAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (addr: Address) => {
        setEditingAddress(addr);
        setFormData({
            title: addr.title,
            fullName: addr.fullName,
            phone: addr.phone,
            city: addr.city,
            district: addr.district,
            address: addr.address,
            isDefault: addr.isDefault
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingAddress) {
            updateAddress(editingAddress.id, formData);
            toast("Adres güncellendi", "success");
        } else {
            addAddress(formData);
            toast("Adres eklendi", "success");
        }

        setIsModalOpen(false);
        resetForm();
    };

    const handleDelete = (id: string) => {
        deleteAddress(id);
        setDeleteConfirm(null);
        toast("Adres silindi", "success");
    };

    return (
        <div className="container-custom py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Adreslerim</h1>
                    <p className="text-gray-500">Teslimat adreslerinizi yönetin</p>
                </div>
                <Button onClick={openAddModal}>
                    <Plus size={18} className="mr-2" />
                    Yeni Adres Ekle
                </Button>
            </div>

            {/* Address List */}
            {addresses.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <MapPin className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h2 className="text-xl font-bold mb-2">Henüz adres eklenmemiş</h2>
                    <p className="text-gray-500 mb-6">İlk adresinizi ekleyerek başlayın</p>
                    <Button onClick={openAddModal}>
                        <Plus size={18} className="mr-2" />
                        Adres Ekle
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className={`p-6 rounded-2xl border-2 transition-all ${addr.isDefault
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg">{addr.title}</h3>
                                    {addr.isDefault && (
                                        <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">
                                            Varsayılan
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(addr)}
                                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(addr.id)}
                                        className="p-2 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <p className="font-medium text-gray-900 dark:text-white">{addr.fullName}</p>
                                <p>{addr.phone}</p>
                                <p>{addr.address}</p>
                                <p>{addr.district}, {addr.city}</p>
                            </div>

                            {!addr.isDefault && (
                                <button
                                    onClick={() => {
                                        setDefaultAddress(addr.id);
                                        toast("Varsayılan adres güncellendi", "success");
                                    }}
                                    className="mt-4 text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                                >
                                    <Star size={14} />
                                    Varsayılan Yap
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">
                                {editingAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}
                            </h2>
                            <button
                                onClick={() => { setIsModalOpen(false); resetForm(); }}
                                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Adres Başlığı</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ev, İş, vb."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full h-12 px-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Ad Soyad</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full h-12 px-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Telefon</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="05XX XXX XX XX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full h-12 px-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">İl</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="İstanbul"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full h-12 px-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">İlçe</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Kadıköy"
                                        value={formData.district}
                                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                        className="w-full h-12 px-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">Açık Adres</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Mahalle, sokak, bina no, daire no..."
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                />
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm font-medium">Varsayılan adres olarak ayarla</span>
                            </label>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => { setIsModalOpen(false); resetForm(); }}
                                >
                                    İptal
                                </Button>
                                <Button type="submit" className="flex-1">
                                    {editingAddress ? "Güncelle" : "Kaydet"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
                        <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="text-danger" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Adresi Sil</h3>
                        <p className="text-gray-500 mb-6">Bu adresi silmek istediğinizden emin misiniz?</p>
                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                className="flex-1"
                                onClick={() => setDeleteConfirm(null)}
                            >
                                İptal
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 border-danger text-danger hover:bg-danger hover:text-white"
                                onClick={() => handleDelete(deleteConfirm)}
                            >
                                Sil
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
