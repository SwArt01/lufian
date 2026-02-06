"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "tr";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "lufian_language";

// Translations
const translations = {
    en: {
        // Navbar
        "nav.collection": "COLLECTION",
        "nav.drops": "DROPS",
        "nav.lookbook": "LOOKBOOK",
        "nav.search": "Find your style...",
        "nav.wishlist": "Wishlist",
        "nav.account": "Account",

        // Home
        "home.hero.title": "URBAN ESSENTIALS",
        "home.hero.subtitle": "Premium comfort for the urban explorer. Engineered for the streets.",
        "home.hero.cta": "Shop Collection",

        // Cart
        "cart.title": "Shopping Cart",
        "cart.empty": "Your Cart is Empty",
        "cart.emptyDesc": "Looks like you haven't added any heat to your rotation yet.",
        "cart.startShopping": "Start Shopping",
        "cart.summary": "Order Summary",
        "cart.subtotal": "Subtotal",
        "cart.shipping": "Shipping",
        "cart.free": "Free",
        "cart.total": "Total",
        "cart.checkout": "Checkout via WhatsApp",
        "cart.checkoutNote": "* Verification will be processed manually via WhatsApp logic. Simply send the pre-filled message to confirm your order.",

        // Account
        "account.title": "My Account",
        "account.subtitle": "Manage your personal information and preferences",
        "account.editProfile": "Edit Profile",
        "account.memberSince": "Member since",
        "account.recentOrders": "Recent Orders",
        "account.viewAll": "View All",
        "account.noOrders": "No orders yet",
        "account.noOrdersDesc": "You haven't placed any orders yet. Start shopping and your orders will appear here!",

        // Wishlist
        "wishlist.title": "My Wishlist",
        "wishlist.empty": "Your Wishlist is Empty",
        "wishlist.emptyDesc": "Start adding items you love to your wishlist. We'll save them for you!",
        "wishlist.itemsSaved": "You have {count} {count, plural, one {item} other {items}} saved",

        // Orders
        "orders.title": "My Orders",
        "orders.count": "You have {count} {count, plural, one {order} other {orders}}",
        "orders.viewDetails": "View Details",
        "orders.hideDetails": "Hide Details",
        "orders.items": "Order Items",
        "orders.deliveryAddress": "Delivery Address",
        "orders.trackingNumber": "Tracking Number",

        // Product
        "product.selectSize": "Select Size",
        "product.sizeGuide": "Size Guide",
        "product.addToCart": "ADD TO CART",
        "product.orderWhatsApp": "Order via WhatsApp",
        "product.selectSizeError": "Please select a size to continue",
        "product.addedToCart": "Added to your cart!",
        "product.addedToWishlist": "Added to wishlist",
        "product.removedFromWishlist": "Removed from wishlist",
        "product.tagNew": "New",
        "product.tagHot": "Hot",
        "product.viewItem": "View Item",
        "product.backToCollection": "Back to Collection",
        "product.addToWishlistAria": "Add to wishlist",
        "product.removeFromWishlistAria": "Remove from wishlist",

        // Toast Messages
        "toast.orderPlaced": "Order placed! Check WhatsApp to confirm.",
        "toast.profileUpdated": "Profile updated successfully",
        "toast.comingSoon": "feature coming soon!",

        // Status
        "status.pending": "Pending",
        "status.confirmed": "Confirmed",
        "status.processing": "Processing",
        "status.shipped": "Shipped",
        "status.delivered": "Delivered",
        "status.cancelled": "Cancelled",

        // Common
        "common.loading": "Loading...",
        "common.notFound": "Not found",
        "common.cancel": "Cancel",
        "common.save": "Save Changes",
        "common.edit": "Edit",
        "common.delete": "Delete",
        "common.search": "Search",
        "common.filter": "Filter",

        // Collection
        "collection.title": "Collection",
        "collection.all": "All Products",
        "collection.hoodies": "Hoodies",
        "collection.sweatshirts": "Sweatshirts",
        "collection.crewnecks": "Crewnecks",
        "collection.itemsFound": "{count} items found",
        "collection.noProducts": "No products found",
        "collection.searchResults": "Search results for",

        // Filters
        "filters.title": "Filters",
        "filters.clearAll": "Clear All",
        "filters.priceRange": "Price Range",
        "filters.colors": "Colors",
        "filters.sizes": "Sizes",
        "filters.other": "Other Filters",
        "filters.onSale": "On Sale",
        "filters.inStock": "In Stock",
        "filters.apply": "Apply Filters",
        "filters.showFilters": "Show Filters",

        // Product extras
        "product.selectColor": "Select Color",
        "product.sale": "SALE",

        // Home
        "home.heroTitle": "New Season\nSweatshirts",
        "home.heroSubtitle": "Premium comfort for the urban explorer. Engineered for the streets.",
        "home.shopNow": "SHOP NOW",
        "home.newArrivals": "New Arrivals",
        "home.latestDrops": "Latest Drops",
        "home.joinMovement": "Join The Movement",
        "home.newsletterDesc": "Sign up for exclusive drops, early access, and urban updates. We don't spam, we just deliver heat.",
        "home.emailPlaceholder": "Email Address",
        "home.subscribe": "SUBSCRIBE",
        "home.subscribed": "Welcome to the movement! You're subscribed.",

        // Footer
        "footer.brandDesc": "Crafting premium urban apparel since 2024. Quality first, always. Engineered for those who move.",
        "footer.shop": "Shop",
        "footer.allCollection": "All Collection",
        "footer.limitedDrops": "Limited Drops",
        "footer.support": "Support",
        "footer.shippingInfo": "Shipping Info",
        "footer.returns": "Returns",
        "footer.social": "Social",
        "footer.copyright": "© 2024 Streetwear Storefront. All rights reserved.",
        "footer.privacy": "Privacy Policy",
        "footer.terms": "Terms of Service",
    },
    tr: {
        // Navbar
        "nav.collection": "KOLEKSİYON",
        "nav.drops": "YENİ ÇIKANLAR",
        "nav.lookbook": "LOOKBOOK",
        "nav.search": "Stilini bul...",
        "nav.wishlist": "Favoriler",
        "nav.account": "Hesabım",

        // Home
        "home.hero.title": "ŞEHIR STİLİ",
        "home.hero.subtitle": "Şehirli kaşifler için premium konfor. Sokaklar için tasarlandı.",
        "home.hero.cta": "Alışverişe Başla",

        // Cart
        "cart.title": "Sepetim",
        "cart.empty": "Sepetiniz Boş",
        "cart.emptyDesc": "Henüz sepetinize ürün eklemediniz.",
        "cart.startShopping": "Alışverişe Başla",
        "cart.summary": "Sipariş Özeti",
        "cart.subtotal": "Ara Toplam",
        "cart.shipping": "Kargo",
        "cart.free": "Ücretsiz",
        "cart.total": "Toplam",
        "cart.checkout": "WhatsApp ile Sipariş Ver",
        "cart.checkoutNote": "* Siparişiniz WhatsApp üzerinden manuel olarak onaylanacaktır. Mesajı göndererek siparişinizi tamamlayın.",

        // Account
        "account.title": "Hesabım",
        "account.subtitle": "Kişisel bilgilerinizi ve tercihlerinizi yönetin",
        "account.editProfile": "Profili Düzenle",
        "account.memberSince": "Üyelik tarihi",
        "account.recentOrders": "Son Siparişler",
        "account.viewAll": "Tümünü Gör",
        "account.noOrders": "Henüz sipariş yok",
        "account.noOrdersDesc": "Henüz sipariş vermediniz. Alışverişe başlayın ve siparişleriniz burada görünsün!",

        // Wishlist
        "wishlist.title": "Favorilerim",
        "wishlist.empty": "Favori Listeniz Boş",
        "wishlist.emptyDesc": "Sevdiğiniz ürünleri favorilere ekleyin. Sizin için saklayalım!",
        "wishlist.itemsSaved": "{count} ürününüz kaydedildi",

        // Orders
        "orders.title": "Siparişlerim",
        "orders.count": "{count} siparişiniz var",
        "orders.viewDetails": "Detayları Gör",
        "orders.hideDetails": "Detayları Gizle",
        "orders.items": "Sipariş Ürünleri",
        "orders.deliveryAddress": "Teslimat Adresi",
        "orders.trackingNumber": "Takip Numarası",

        // Product
        "product.selectSize": "Beden Seçin",
        "product.sizeGuide": "Beden Rehberi",
        "product.addToCart": "SEPETE EKLE",
        "product.orderWhatsApp": "WhatsApp ile Sipariş Ver",
        "product.selectSizeError": "Devam etmek için lütfen beden seçin",
        "product.addedToCart": "Sepete eklendi!",
        "product.addedToWishlist": "Favorilere eklendi",
        "product.removedFromWishlist": "Favorilerden çıkarıldı",
        "product.tagNew": "Yeni",
        "product.tagHot": "Popüler",
        "product.viewItem": "Ürünü İncele",
        "product.backToCollection": "Koleksiyona Dön",
        "product.addToWishlistAria": "Favorilere ekle",
        "product.removeFromWishlistAria": "Favorilerden çıkar",

        // Toast Messages
        "toast.orderPlaced": "Sipariş verildi! WhatsApp'tan onaylayın.",
        "toast.profileUpdated": "Profil başarıyla güncellendi",
        "toast.comingSoon": "özelliği yakında geliyor!",

        // Status
        "status.pending": "Beklemede",
        "status.confirmed": "Onaylandı",
        "status.processing": "İşleniyor",
        "status.shipped": "Kargoya Verildi",
        "status.delivered": "Teslim Edildi",
        "status.cancelled": "İptal Edildi",

        // Common
        "common.loading": "Yükleniyor...",
        "common.notFound": "Bulunamadı",
        "common.cancel": "İptal",
        "common.save": "Değişiklikleri Kaydet",
        "common.edit": "Düzenle",
        "common.delete": "Sil",
        "common.search": "Ara",
        "common.filter": "Filtrele",

        // Collection
        "collection.title": "Koleksiyon",
        "collection.all": "Tüm Ürünler",
        "collection.hoodies": "Kapüşonlular",
        "collection.sweatshirts": "Sweatshirtler",
        "collection.crewnecks": "Bisiklet Yaka",
        "collection.itemsFound": "{count} ürün bulundu",
        "collection.noProducts": "Ürün bulunamadı",
        "collection.searchResults": "Arama sonuçları:",

        // Filters
        "filters.title": "Filtreler",
        "filters.clearAll": "Temizle",
        "filters.priceRange": "Fiyat Aralığı",
        "filters.colors": "Renkler",
        "filters.sizes": "Bedenler",
        "filters.other": "Diğer Filtreler",
        "filters.onSale": "İndirimli",
        "filters.inStock": "Stokta Var",
        "filters.apply": "Filtreleri Uygula",
        "filters.showFilters": "Filtreleri Göster",

        // Product extras
        "product.selectColor": "Renk Seçin",
        "product.sale": "İNDİRİM",

        // Home
        "home.heroTitle": "Yeni Sezon\nSweatshirtler",
        "home.heroSubtitle": "Şehir kaşifleri için premium konfor. Sokaklar için tasarlandı.",
        "home.shopNow": "ALIŞVERİŞE BAŞLA",
        "home.newArrivals": "Yeni Gelenler",
        "home.latestDrops": "Son Çıkanlar",
        "home.joinMovement": "Harekete Katıl",
        "home.newsletterDesc": "Özel çıkışlar, erken erişim ve şehir güncellemeleri için kaydol. Spam göndermeyiz, sadece en iyiyi sunuz.",
        "home.emailPlaceholder": "E-posta Adresi",
        "home.subscribe": "ABONE OL",
        "home.subscribed": "Harekete hoş geldin! Abone oldun.",

        // Footer
        "footer.brandDesc": "2024'ten beri premium şehir kıyafetleri üretiyoruz. Kalite her zaman önce. Hareket edenler için tasarlandı.",
        "footer.shop": "Alışveriş",
        "footer.allCollection": "Tüm Koleksiyon",
        "footer.limitedDrops": "Sınırlı Çıkışlar",
        "footer.support": "Destek",
        "footer.shippingInfo": "Kargo Bilgisi",
        "footer.returns": "İadeler",
        "footer.social": "Sosyal Medya",
        "footer.copyright": "© 2024 Streetwear Storefront. Tüm hakları saklıdır.",
        "footer.privacy": "Gizlilik Politikası",
        "footer.terms": "Hizmet Şartları",
    }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    // Always start with default "en" to match server
    const [language, setLanguageState] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);

    // Read from localStorage after mount to avoid hydration mismatch
    useEffect(() => {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
        if (stored && (stored === "en" || stored === "tr")) {
            setLanguageState(stored);
        }
        setMounted(true);
    }, []);

    // Save to localStorage when language changes (only after mounted)
    useEffect(() => {
        if (mounted) {
            localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        }
    }, [language, mounted]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = (key: string, params?: Record<string, any>): string => {
        let translation = translations[language][key as keyof typeof translations.en] || key;

        // Simple parameter replacement
        if (params) {
            Object.entries(params).forEach(([paramKey, value]) => {
                translation = translation.replace(`{${paramKey}}`, String(value));
            });
        }

        return translation;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
