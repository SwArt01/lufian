"use client";

import { Button } from "@/components/ui/Button";
import { Save } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function SettingsPage() {
    const { toast } = useToast();

    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Ayarlar</h1>
                    <p className="text-gray-500">Mağaza tercihlerinizi yapılandırın.</p>
                </div>
                <Button onClick={() => toast("Ayarlar başarıyla kaydedildi", "success")}>
                    <Save size={18} className="mr-2" />
                    Değişiklikleri Kaydet
                </Button>
            </div>

            <div className="space-y-6">
                {/* General Settings */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 pb-4 border-b border-gray-100">Genel Bilgiler</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">Mağaza Adı</label>
                            <input
                                type="text"
                                defaultValue="Lufian"
                                className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">İletişim E-postası</label>
                            <input
                                type="email"
                                defaultValue="iletisim@lufian.com"
                                className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">WhatsApp Numarası</label>
                            <input
                                type="text"
                                defaultValue="905526690303"
                                className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Para Birimi</label>
                            <select
                                defaultValue="TRY (₺)"
                                className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                            >
                                <option>TRY (₺)</option>
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 pb-4 border-b border-gray-100">Güvenlik</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">Yeni Yönetici Şifresi</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Şifre Onayı</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button
                            variant="outline"
                            className="text-danger border-danger/20 hover:bg-danger/5 hover:border-danger"
                            onClick={() => toast("Şifre güncelleme simüle edildi", "success")}
                        >
                            Şifreyi Güncelle
                        </Button>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 pb-4 border-b border-gray-100">Sosyal Medya Bağlantıları</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-2">Instagram URL</label>
                            <input
                                type="url"
                                placeholder="https://instagram.com/..."
                                className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Twitter URL</label>
                            <input
                                type="url"
                                placeholder="https://twitter.com/..."
                                className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
