"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(password)) {
            setError("");
        } else {
            setError("Geçersiz şifre");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Lock className="text-primary" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold">Yönetici Girişi</h1>
                    <p className="text-text-secondary text-sm">Lütfen güvenli şifrenizi girin</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            placeholder="Şifre girin"
                            className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                        {error && <p className="text-danger text-sm mt-2 font-medium">{error}</p>}
                    </div>

                    <Button type="submit" className="w-full h-12 text-base">
                        Panele Giriş Yap
                    </Button>
                </form>
            </div>
        </div>
    );
}
