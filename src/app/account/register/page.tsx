"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useUserAuth } from "@/context/UserAuthContext";
import { useToast } from "@/context/ToastContext";
import { Mail, Lock, User, Eye, EyeOff, Check } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const { register, isAuthenticated, isLoading: authLoading } = useUserAuth();
    const { toast } = useToast();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            router.push("/account");
        }
    }, [isAuthenticated, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast("Şifreler eşleşmiyor", "error");
            return;
        }

        if (password.length < 6) {
            toast("Şifre en az 6 karakter olmalı", "error");
            return;
        }

        setIsLoading(true);

        try {
            // Add timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('timeout')), 15000)
            );

            const result = await Promise.race([
                register(email, password, name),
                timeoutPromise
            ]) as { success: boolean; error?: string };

            if (result.success) {
                toast("Kayıt başarılı! Hoş geldiniz.", "success");
                router.push("/account");
            } else {
                toast(result.error || "Bu e-posta adresi zaten kullanılıyor", "error");
            }
        } catch (error) {
            console.error('Register error:', error);
            if (error instanceof Error && error.message === 'timeout') {
                toast("Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.", "error");
            } else {
                toast("Bir hata oluştu. Lütfen tekrar deneyin.", "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const passwordRequirements = [
        { text: "En az 6 karakter", met: password.length >= 6 },
        { text: "Şifreler eşleşiyor", met: password === confirmPassword && password.length > 0 }
    ];

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Kayıt Ol</h1>
                    <p className="text-gray-500">Yeni bir hesap oluşturun</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold mb-2">Ad Soyad</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Adınız Soyadınız"
                                className="w-full h-14 pl-12 pr-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold mb-2">E-posta</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ornek@email.com"
                                className="w-full h-14 pl-12 pr-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-bold mb-2">Şifre</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-14 pl-12 pr-12 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-bold mb-2">Şifre Tekrar</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-14 pl-12 pr-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="space-y-2">
                        {passwordRequirements.map((req, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-success text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                    {req.met && <Check size={12} />}
                                </div>
                                <span className={req.met ? 'text-success' : 'text-gray-500'}>{req.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full h-14 text-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                    </Button>
                </form>

                {/* Login Link */}
                <p className="text-center mt-8 text-gray-500">
                    Zaten hesabınız var mı?{" "}
                    <Link href="/account/login" className="text-primary font-bold hover:underline">
                        Giriş Yap
                    </Link>
                </p>
            </div>
        </div>
    );
}
