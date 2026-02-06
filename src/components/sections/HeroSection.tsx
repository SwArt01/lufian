"use client";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
    const { t } = useLanguage();

    return (
        <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1920"
                    alt="Streetwear Hero"
                    fill
                    className="object-cover object-center brightness-75"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 container-custom text-center text-white space-y-6">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase italic tracking-tighter leading-none animate-in fade-in zoom-in duration-1000">
                    {t("home.heroTitle")}
                </h1>
                <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto opacity-90 animate-in slide-in-from-bottom-5 delay-300 duration-1000">
                    {t("home.heroSubtitle")}
                </p>
                <div className="pt-4 animate-in slide-in-from-bottom-8 delay-500 duration-1000">
                    <Link href="/collection">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 py-6 text-lg rounded-full">
                            {t("home.shopNow")}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
