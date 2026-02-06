"use client";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

// Available colors for filtering
const AVAILABLE_COLORS = [
    { name: "Siyah", hex: "#000000" },
    { name: "Beyaz", hex: "#FFFFFF" },
    { name: "Gri", hex: "#6B7280" },
    { name: "Lacivert", hex: "#1E3A5F" },
    { name: "Kahverengi", hex: "#8B4513" },
    { name: "Yeşil", hex: "#22C55E" },
    { name: "Kırmızı", hex: "#EF4444" },
    { name: "Mavi", hex: "#3B82F6" },
];

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export interface FilterState {
    priceRange: [number, number];
    colors: string[];
    sizes: string[];
    onSale: boolean;
    inStock: boolean;
}

interface FilterSidebarProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    onClose?: () => void;
    minPrice?: number;
    maxPrice?: number;
    isMobile?: boolean;
}

export function FilterSidebar({
    filters,
    onFilterChange,
    onClose,
    minPrice = 0,
    maxPrice = 2000,
    isMobile = false,
}: FilterSidebarProps) {
    const { t } = useLanguage();
    const [expandedSections, setExpandedSections] = useState({
        price: true,
        colors: true,
        sizes: true,
        other: true,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const updateFilter = <K extends keyof FilterState>(
        key: K,
        value: FilterState[K]
    ) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const toggleArrayFilter = (
        key: "colors" | "sizes",
        value: string
    ) => {
        const current = filters[key];
        const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        updateFilter(key, updated);
    };

    const clearAllFilters = () => {
        onFilterChange({
            priceRange: [minPrice, maxPrice],
            colors: [],
            sizes: [],
            onSale: false,
            inStock: false,
        });
    };

    const hasActiveFilters =
        filters.colors.length > 0 ||
        filters.sizes.length > 0 ||
        filters.onSale ||
        filters.inStock ||
        filters.priceRange[0] > minPrice ||
        filters.priceRange[1] < maxPrice;

    return (
        <div className={`bg-white dark:bg-surface ${isMobile ? "p-4" : "p-6"} rounded-2xl border border-gray-100 dark:border-gray-700`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">{t("filters.title")}</h3>
                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-primary hover:underline"
                        >
                            {t("filters.clearAll")}
                        </button>
                    )}
                    {isMobile && onClose && (
                        <button onClick={onClose} className="p-1">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection("price")}
                    className="flex items-center justify-between w-full mb-3"
                >
                    <span className="font-semibold text-sm">{t("filters.priceRange")}</span>
                    {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.price && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block">Min</label>
                                <input
                                    type="number"
                                    min={minPrice}
                                    max={filters.priceRange[1]}
                                    value={filters.priceRange[0]}
                                    onChange={(e) =>
                                        updateFilter("priceRange", [
                                            Number(e.target.value),
                                            filters.priceRange[1],
                                        ])
                                    }
                                    className="w-full h-10 px-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg text-sm"
                                />
                            </div>
                            <span className="text-gray-400 pt-5">-</span>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block">Max</label>
                                <input
                                    type="number"
                                    min={filters.priceRange[0]}
                                    max={maxPrice}
                                    value={filters.priceRange[1]}
                                    onChange={(e) =>
                                        updateFilter("priceRange", [
                                            filters.priceRange[0],
                                            Number(e.target.value),
                                        ])
                                    }
                                    className="w-full h-10 px-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg text-sm"
                                />
                            </div>
                        </div>
                        {/* Price Range Slider */}
                        <input
                            type="range"
                            min={minPrice}
                            max={maxPrice}
                            value={filters.priceRange[1]}
                            onChange={(e) =>
                                updateFilter("priceRange", [
                                    filters.priceRange[0],
                                    Number(e.target.value),
                                ])
                            }
                            className="w-full accent-primary"
                        />
                    </div>
                )}
            </div>

            {/* Colors */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection("colors")}
                    className="flex items-center justify-between w-full mb-3"
                >
                    <span className="font-semibold text-sm">{t("filters.colors")}</span>
                    {expandedSections.colors ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.colors && (
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_COLORS.map((color) => (
                            <button
                                key={color.hex}
                                onClick={() => toggleArrayFilter("colors", color.hex)}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${filters.colors.includes(color.hex)
                                        ? "border-primary scale-110 ring-2 ring-primary/30"
                                        : "border-gray-200 dark:border-gray-600"
                                    }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            >
                                {filters.colors.includes(color.hex) && (
                                    <span className={`text-xs ${color.hex === "#FFFFFF" ? "text-black" : "text-white"}`}>
                                        ✓
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Sizes */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection("sizes")}
                    className="flex items-center justify-between w-full mb-3"
                >
                    <span className="font-semibold text-sm">{t("filters.sizes")}</span>
                    {expandedSections.sizes ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.sizes && (
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_SIZES.map((size) => (
                            <button
                                key={size}
                                onClick={() => toggleArrayFilter("sizes", size)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${filters.sizes.includes(size)
                                        ? "bg-primary text-white border-primary"
                                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Other Filters */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection("other")}
                    className="flex items-center justify-between w-full mb-3"
                >
                    <span className="font-semibold text-sm">{t("filters.other")}</span>
                    {expandedSections.other ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections.other && (
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.onSale}
                                onChange={(e) => updateFilter("onSale", e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm">{t("filters.onSale")}</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.inStock}
                                onChange={(e) => updateFilter("inStock", e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm">{t("filters.inStock")}</span>
                        </label>
                    </div>
                )}
            </div>

            {/* Apply Button (Mobile) */}
            {isMobile && (
                <Button onClick={onClose} className="w-full">
                    {t("filters.apply")}
                </Button>
            )}
        </div>
    );
}
