"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* 404 Number */}
                <div className="relative mb-8">
                    <h1 className="text-[150px] font-black text-gray-100 dark:text-gray-800 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary/10 p-6 rounded-full">
                            <Search className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Sayfa Bulunamadı
                </h2>
                <p className="text-gray-500 mb-8">
                    Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                    Ana sayfaya dönerek alışverişe devam edebilirsiniz.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <Button size="lg" className="w-full sm:w-auto">
                            <Home className="mr-2 h-5 w-5" />
                            Ana Sayfaya Dön
                        </Button>
                    </Link>
                    <Link href="/collection">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Koleksiyona Git
                        </Button>
                    </Link>
                </div>

                {/* Help Text */}
                <p className="mt-8 text-sm text-gray-400">
                    Yardıma mı ihtiyacınız var?{" "}
                    <a
                        href="https://wa.me/905526690303"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                    >
                        WhatsApp ile iletişime geçin
                    </a>
                </p>
            </div>
        </div>
    );
}
