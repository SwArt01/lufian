"use client";

import { useState, useEffect, useRef } from "react";
import { dataService } from "@/lib/data";
import { uploadImage } from "@/lib/supabase";
import { Product, ProductColor } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Edit2, X, Search, Filter, Upload, Loader2 } from "lucide-react";
import Image from "next/image";

// Predefined colors for quick selection
const PRESET_COLORS = [
    { name: "Siyah", hex: "#000000" },
    { name: "Beyaz", hex: "#FFFFFF" },
    { name: "Gri", hex: "#6B7280" },
    { name: "Lacivert", hex: "#1E3A5F" },
    { name: "Kahverengi", hex: "#8B4513" },
    { name: "Yeşil", hex: "#22C55E" },
    { name: "Kırmızı", hex: "#EF4444" },
    { name: "Mavi", hex: "#3B82F6" },
];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<"all" | Product["category"]>("all");
    const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        name: "",
        category: "hoodie",
        price: 0,
        originalPrice: undefined,
        sku: "",
        stock: 0,
        description: "",
        images: [],
        colors: [],
        sizes: ["S", "M", "L", "XL"],
        tags: []
    });

    // Color form state
    const [newColor, setNewColor] = useState<ProductColor>({ name: "", hex: "#000000" });

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await dataService.getProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setMounted(true);
            }
        };
        loadProducts();
    }, []);

    useEffect(() => {
        let result = products;

        // Apply search filter
        if (searchTerm) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (categoryFilter !== "all") {
            result = result.filter(p => p.category === categoryFilter);
        }

        // Apply stock filter
        if (stockFilter === "low") {
            result = result.filter(p => p.stock > 0 && p.stock < 20);
        } else if (stockFilter === "out") {
            result = result.filter(p => p.stock === 0);
        }

        setFilteredProducts(result);
    }, [products, searchTerm, categoryFilter, stockFilter]);

    const resetForm = () => {
        setFormData({
            name: "",
            category: "hoodie",
            price: 0,
            originalPrice: undefined,
            sku: "",
            stock: 0,
            description: "",
            images: [],
            colors: [],
            sizes: ["S", "M", "L", "XL"],
            tags: []
        });
        setNewColor({ name: "", hex: "#000000" });
        setEditingId(null);
    };

    const handleEdit = (product: Product) => {
        setFormData(product);
        setEditingId(product.id);
        setIsModalOpen(true);
    };

    const confirmDelete = (id: string) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (productToDelete) {
            await dataService.deleteProduct(productToDelete);
            const updatedProducts = await dataService.getProducts();
            setProducts(updatedProducts);
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const newProduct: Product = {
            ...formData as Product,
            id: editingId || crypto.randomUUID(),
            createdAt: editingId ? (formData.createdAt || new Date().toISOString()) : new Date().toISOString()
        };

        await dataService.saveProduct(newProduct);
        const updatedProducts = await dataService.getProducts();
        setProducts(updatedProducts);
        setIsModalOpen(false);
        resetForm();
    };

    const openAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    // Image upload handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const uploadedUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const url = await uploadImage(files[i]);
            if (url) {
                uploadedUrls.push(url);
            }
        }

        setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), ...uploadedUrls]
        }));
        setIsUploading(false);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index) || []
        }));
    };

    // Color handlers
    const addColor = () => {
        if (newColor.name && newColor.hex) {
            setFormData(prev => ({
                ...prev,
                colors: [...(prev.colors || []), { ...newColor }]
            }));
            setNewColor({ name: "", hex: "#000000" });
        }
    };

    const removeColor = (index: number) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors?.filter((_, i) => i !== index) || []
        }));
    };

    const selectPresetColor = (preset: typeof PRESET_COLORS[0]) => {
        setNewColor({ name: preset.name, hex: preset.hex });
    };

    // Tag toggle
    const toggleTag = (tag: 'NEW' | 'HOT' | 'LIMITED' | 'SALE') => {
        setFormData(prev => {
            const currentTags = prev.tags || [];
            if (currentTags.includes(tag)) {
                return { ...prev, tags: currentTags.filter(t => t !== tag) };
            } else {
                return { ...prev, tags: [...currentTags, tag] };
            }
        });
    };

    if (!mounted) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="bg-gray-200 rounded-xl h-96"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Ürün Envanteri</h1>
                <Button onClick={openAddModal}>
                    <Plus size={18} className="mr-2" />
                    Yeni Ürün Ekle
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Ürün adı veya SKU ile ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as typeof categoryFilter)}
                        className="h-10 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="all">Tüm Kategoriler</option>
                        <option value="hoodie">Kapüşonlu</option>
                        <option value="crewneck">Bisiklet Yaka</option>
                        <option value="sweatshirt">Sweatshirt</option>
                    </select>
                    <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value as typeof stockFilter)}
                        className="h-10 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="all">Tüm Stok</option>
                        <option value="low">Düşük Stok (&lt;20)</option>
                        <option value="out">Stokta Yok</option>
                    </select>
                </div>
                {(searchTerm || categoryFilter !== "all" || stockFilter !== "all") && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                        <Filter size={14} />
                        <span>{filteredProducts.length} ürün bulundu</span>
                        <button
                            onClick={() => { setSearchTerm(""); setCategoryFilter("all"); setStockFilter("all"); }}
                            className="text-primary hover:underline ml-2"
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Görsel</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ürün Adı</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fiyat</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stok</th>
                            <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Renkler</th>
                            <th className="text-right p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 relative overflow-hidden">
                                        {product.images[0] && (
                                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="font-bold text-sm text-gray-900">{product.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                                </td>
                                <td className="p-4 text-sm text-gray-500 font-mono">{product.sku}</td>
                                <td className="p-4">
                                    <p className="text-sm font-bold text-gray-900">₺{product.price.toLocaleString('tr-TR')}</p>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <p className="text-xs text-gray-400 line-through">₺{product.originalPrice.toLocaleString('tr-TR')}</p>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${product.stock > 10 ? "bg-green-100 text-green-700" : product.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                                        }`}>
                                        {product.stock > 0 ? `${product.stock} Adet` : "Stokta Yok"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-1">
                                        {product.colors?.slice(0, 4).map((color, idx) => (
                                            <div
                                                key={idx}
                                                className="w-5 h-5 rounded-full border border-gray-200"
                                                style={{ backgroundColor: color.hex }}
                                                title={color.name}
                                            />
                                        ))}
                                        {(product.colors?.length || 0) > 4 && (
                                            <span className="text-xs text-gray-400">+{(product.colors?.length || 0) - 4}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2 text-gray-400 hover:text-primary transition-colors"
                                            title="Düzenle"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(product.id)}
                                            className="p-2 text-gray-400 hover:text-danger transition-colors"
                                            title="Sil"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        {searchTerm || categoryFilter !== "all" || stockFilter !== "all"
                            ? "Filtrelere uygun ürün bulunamadı"
                            : "Henüz ürün eklenmemiş"}
                    </div>
                )}
            </div>

            {/* Add/Edit Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Ürün Adı</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">SKU</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Price, Original Price, Stock, Category */}
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Fiyat (₺)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Eski Fiyat (₺)</label>
                                    <input
                                        type="number"
                                        placeholder="Opsiyonel"
                                        className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.originalPrice || ""}
                                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Stok Adedi</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Kategori</label>
                                    <select
                                        className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Product["category"] })}
                                    >
                                        <option value="hoodie">Kapüşonlu</option>
                                        <option value="crewneck">Bisiklet Yaka</option>
                                        <option value="sweatshirt">Sweatshirt</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold mb-1">Açıklama</label>
                                <textarea
                                    required
                                    className="w-full h-24 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Etiketler</label>
                                <div className="flex gap-2">
                                    {(['NEW', 'HOT', 'LIMITED', 'SALE'] as const).map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${formData.tags?.includes(tag)
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Ürün Görselleri</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        {formData.images?.map((img, idx) => (
                                            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                                                <Image src={img} alt={`Product ${idx}`} fill className="object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                >
                                                    <Trash2 size={16} className="text-white" />
                                                </button>
                                            </div>
                                        ))}
                                        <label
                                            htmlFor="image-upload"
                                            className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                                        >
                                            {isUploading ? (
                                                <Loader2 className="animate-spin text-gray-400" size={24} />
                                            ) : (
                                                <Upload size={24} className="text-gray-400" />
                                            )}
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">Görselleri sürükleyip bırakın veya yüklemek için tıklayın</p>
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <label className="block text-sm font-bold mb-2">Renk Seçenekleri</label>

                                {/* Preset colors */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {PRESET_COLORS.map((preset) => (
                                        <button
                                            key={preset.hex}
                                            type="button"
                                            onClick={() => selectPresetColor(preset)}
                                            className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                                            style={{ backgroundColor: preset.hex }}
                                            title={preset.name}
                                        />
                                    ))}
                                </div>

                                {/* Add color form */}
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        placeholder="Renk adı"
                                        className="flex-1 h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={newColor.name}
                                        onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                                    />
                                    <input
                                        type="color"
                                        className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                                        value={newColor.hex}
                                        onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                                    />
                                    <Button type="button" variant="outline" onClick={addColor} disabled={!newColor.name}>
                                        <Plus size={16} />
                                    </Button>
                                </div>

                                {/* Added colors */}
                                <div className="flex flex-wrap gap-2">
                                    {formData.colors?.map((color, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5"
                                        >
                                            <div
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span className="text-xs font-medium">{color.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeColor(idx)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>İptal</Button>
                                <Button type="submit">{editingId ? 'Güncelle' : 'Kaydet'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="text-danger" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Ürün Silinsin mi?</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </p>
                            <div className="flex gap-3">
                                <Button className="flex-1" variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
                                    İptal
                                </Button>
                                <Button className="flex-1" variant="danger" onClick={handleDelete}>
                                    Sil
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
