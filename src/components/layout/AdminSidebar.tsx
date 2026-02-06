"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Package, Settings, LogOut, Users, BarChart3 } from "lucide-react";

export function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const links = [
        { href: "/admin", label: "Kontrol Paneli", icon: LayoutDashboard },
        { href: "/admin/products", label: "Ürünlerim", icon: Package },
        { href: "/admin/orders", label: "Satış Raporları", icon: BarChart3 },
        { href: "/admin/customers", label: "Müşteriler", icon: Users },
    ];

    return (
        <aside className="w-64 bg-[#1A1A2E] text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
            <div className="p-6 flex items-center gap-3 border-b border-gray-800">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Package className="text-white" size={18} />
                </div>
                <div>
                    <h1 className="font-bold text-sm tracking-wide">LUFIAN</h1>
                    <p className="text-xs text-gray-500">Yönetim Paneli</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? "bg-white/10 text-white font-medium border-l-4 border-primary"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <Icon size={20} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800 space-y-2">
                <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                >
                    <Settings size={20} />
                    Ayarlar
                </Link>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-danger hover:bg-danger/10 transition-all font-medium"
                >
                    <LogOut size={20} />
                    Çıkış Yap
                </button>
            </div>
        </aside>
    );
}
