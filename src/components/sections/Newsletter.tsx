"use client";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";

export function Newsletter() {
    const { toast } = useToast();
    const { t } = useLanguage();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast(t("home.subscribed"), "success");
        e.currentTarget.reset();
    };

    return (
        <section className="py-20 md:py-32 bg-white dark:bg-background flex justify-center">
            <div className="container-custom max-w-4xl bg-white dark:bg-surface rounded-3xl p-8 md:p-16 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight mb-4">
                    {t("home.joinMovement")}
                </h2>
                <p className="text-text-secondary text-lg mb-8 max-w-lg mx-auto">
                    {t("home.newsletterDesc")}
                </p>

                <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder={t("home.emailPlaceholder")}
                        className="flex-1 h-12 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-6 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        required
                    />
                    <Button type="submit" className="rounded-full px-8 bg-primary hover:bg-primary/90">
                        {t("home.subscribe")}
                    </Button>
                </form>
            </div>
        </section>
    );
}
