"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { dataService } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterSidebar, FilterState } from "@/components/product/FilterSidebar";
import { Button } from "@/components/ui/Button";
import { Filter, X, Loader2, SlidersHorizontal } from "lucide-react";
import { Product } from "@/lib/types";

function CollectionContent() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") || "";

    const [categoryFilter, setCategoryFilter] = useState("all");
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { t } = useLanguage();

    // Calculate min/max prices from products
    const prices = products.map(p => p.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 2000;

    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 2000],
        colors: [],
        sizes: [],
        onSale: false,
        inStock: false,
    });

    // Update price range when products load
    useEffect(() => {
        if (products.length > 0) {
            setFilters(prev => ({
                ...prev,
                priceRange: [minPrice, maxPrice]
            }));
        }
    }, [minPrice, maxPrice, products.length]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await dataService.getProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProducts();
    }, []);

    const applyFilters = useCallback((product: Product): boolean => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.sku.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query);
            if (!matchesSearch) return false;
        }

        // Category filter
        if (categoryFilter !== "all" && product.category !== categoryFilter) {
            return false;
        }

        // Price range filter
        if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
            return false;
        }

        // Color filter
        if (filters.colors.length > 0) {
            const productColors = product.colors?.map(c => c.hex) || [];
            const hasMatchingColor = filters.colors.some(c => productColors.includes(c));
            if (!hasMatchingColor && productColors.length > 0) {
                // Only filter if product has colors defined
            } else if (productColors.length === 0 && filters.colors.length > 0) {
                // If product has no colors but filter is active, don't exclude
                // This allows products without color data to still show
            }
        }

        // Size filter
        if (filters.sizes.length > 0) {
            const hasMatchingSize = filters.sizes.some(s => product.sizes.includes(s));
            if (!hasMatchingSize) return false;
        }

        // On sale filter
        if (filters.onSale) {
            const isOnSale = product.originalPrice && product.originalPrice > product.price;
            if (!isOnSale) return false;
        }

        // In stock filter
        if (filters.inStock && product.stock <= 0) {
            return false;
        }

        return true;
    }, [searchQuery, categoryFilter, filters]);

    const filteredProducts = products.filter(applyFilters);

    const categories = [
        { id: "all", label: t("collection.all") },
        { id: "hoodie", label: t("collection.hoodies") },
        { id: "sweatshirt", label: t("collection.sweatshirts") },
        { id: "crewneck", label: t("collection.crewnecks") },
    ];

    const hasActiveFilters =
        filters.colors.length > 0 ||
        filters.sizes.length > 0 ||
        filters.onSale ||
        filters.inStock ||
        filters.priceRange[0] > minPrice ||
        filters.priceRange[1] < maxPrice;

    if (isLoading) {
        return (
            <div className="container-custom py-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container-custom py-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight mb-2">{t("collection.title")}</h1>
                    {searchQuery && (
                        <p className="text-text-secondary">
                            {t("collection.searchResults")} &quot;{searchQuery}&quot;
                        </p>
                    )}
                    <p className="text-text-secondary">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                    </p>
                </div>

                {/* Mobile Filter Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2"
                >
                    <SlidersHorizontal size={18} />
                    {t("filters.showFilters")}
                    {hasActiveFilters && (
                        <span className="w-2 h-2 bg-primary rounded-full" />
                    )}
                </Button>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 items-center mb-8">
                <Filter className="w-5 h-5 text-text-secondary mr-2" />
                {categories.map((cat) => (
                    <Button
                        key={cat.id}
                        variant={categoryFilter === cat.id ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setCategoryFilter(cat.id)}
                        className="rounded-full"
                    >
                        {cat.label}
                    </Button>
                ))}
            </div>

            <div className="flex gap-8">
                {/* Desktop Filter Sidebar */}
                <div className="hidden lg:block w-72 flex-shrink-0">
                    <div className="sticky top-24">
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={setFilters}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-24 bg-gray-50 dark:bg-surface rounded-2xl">
                            <p className="text-text-secondary text-lg mb-4">
                                {t("collection.noProducts")}
                            </p>
                            {(hasActiveFilters || searchQuery) && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setFilters({
                                            priceRange: [minPrice, maxPrice],
                                            colors: [],
                                            sizes: [],
                                            onSale: false,
                                            inStock: false,
                                        });
                                        setCategoryFilter("all");
                                    }}
                                >
                                    {t("filters.clearAll")}
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsFilterOpen(false)}
                    />
                    <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-background overflow-y-auto animate-in slide-in-from-right">
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-lg">{t("filters.title")}</h2>
                                <button onClick={() => setIsFilterOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>
                            <FilterSidebar
                                filters={filters}
                                onFilterChange={setFilters}
                                onClose={() => setIsFilterOpen(false)}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                isMobile
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CollectionPage() {
    return (
        <Suspense fallback={
            <div className="container-custom py-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <CollectionContent />
        </Suspense>
    );
}
