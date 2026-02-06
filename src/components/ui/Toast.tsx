"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type ToastType = "success" | "error";

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    onDismiss: (id: string) => void;
}

export function Toast({ id, message, type, onDismiss }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        requestAnimationFrame(() => setIsVisible(true));

        // Auto dismiss
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onDismiss(id), 300); // Wait for exit animation
        }, 3000);

        return () => clearTimeout(timer);
    }, [id, onDismiss]);

    return (
        <div
            className={twMerge(
                "pointer-events-auto flex items-center w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 ease-in-out transform",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
            role="alert"
        >
            <div className="p-4 w-full flex items-start gap-4">
                <div className="flex-shrink-0">
                    {type === "success" ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                    )}
                </div>
                <div className="flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">{message}</p>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                    <button
                        type="button"
                        className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(() => onDismiss(id), 300);
                        }}
                    >
                        <span className="sr-only">Close</span>
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
